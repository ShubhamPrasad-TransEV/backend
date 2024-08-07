import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailerService } from '@nestjs-modules/mailer';
import { randomInt } from 'crypto'; // For generating a random number
import * as bcrypt from 'bcrypt';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class ForgotPasswordService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  async resetPassword(email: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
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
      text: `We received a request to reset your password. Your OTP is: ${otp}. This OTP is valid for 1 hour.` // Define a template for the email
    });
  }

  async verifyOtpAndResetPassword( resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { otp, newPassword } = resetPasswordDto;
    // Find the reset request by OTP and check if it is still valid
    const resetRequest = await this.prisma.passwordReset.findFirst({
      where: {
        otp,
        expiresAt: { gte: new Date() },
      },
    });

    if (!resetRequest) {
      throw new Error('Invalid or expired OTP');
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
  }
}
