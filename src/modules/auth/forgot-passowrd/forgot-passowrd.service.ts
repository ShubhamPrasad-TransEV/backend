import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt } from 'crypto'; // For generating a random number
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class ForgotPasswordService {
  private readonly logger = new Logger(ForgotPasswordService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async resetPassword(email: string): Promise<{ message: string }> {
    this.logger.log(`Reset password requested for email: ${email}`);

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      this.logger.warn(`User not found: ${email}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const otp = randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    await this.prisma.passwordReset.create({
      data: {
        otp,
        userId: user.id,
        expiresAt,
      },
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      text: `We received a request to reset your password. Your OTP is: ${otp}. This OTP is valid for 1 hour.`
    });

    this.logger.log(`OTP sent to email: ${email}`);
    return { message: 'OTP sent successfully' };
  }

  async verifyOtpAndResetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { otp, newPassword } = resetPasswordDto;
    this.logger.log(`Verifying OTP: ${otp}`);

    // Find the reset request by OTP and check if it is still valid
    const resetRequest = await this.prisma.passwordReset.findFirst({
      where: {
        otp,
        expiresAt: { gte: new Date() },
      },
    });

    if (!resetRequest) {
      this.logger.warn(`Invalid or expired OTP: ${otp}`);
      throw new HttpException('Invalid or expired OTP', HttpStatus.BAD_REQUEST);
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    await this.prisma.user.update({
      where: { id: resetRequest.userId },
      data: { password: hashedPassword },
    });

    // Delete all reset requests with the given OTP
    await this.prisma.passwordReset.deleteMany({
      where: { otp },
    });

    this.logger.log(`Password reset successfully for user ID: ${resetRequest.userId}`);
    return { message: 'Password reset successfully' };
  }
}
