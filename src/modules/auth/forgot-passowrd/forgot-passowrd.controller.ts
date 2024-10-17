import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ForgotPasswordService } from './forgot-passowrd.service';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('')
export class ForgotPasswordController {
  constructor(private readonly forgotPasswordService: ForgotPasswordService) {}

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request a password reset' })
  @ApiResponse({
    status: 200,
    description: 'Password reset request created',
    schema: {
      example: { message: 'OTP sent successfully' },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async forgotPassword(
    @Body() requestPasswordResetDto: RequestPasswordResetDto,
  ): Promise<void> {
    await this.forgotPasswordService.resetPassword(
      requestPasswordResetDto.email,
    );
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset the password using an OTP' })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired OTP' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.forgotPasswordService.verifyOtpAndResetPassword(
      resetPasswordDto,
    );
  }
}
