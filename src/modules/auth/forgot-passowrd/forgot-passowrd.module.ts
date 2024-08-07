import { Module } from '@nestjs/common';
import { MailerModule as NestMailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ForgotPasswordService } from './forgot-passowrd.service';
import { ForgotPasswordController } from './forgot-passowrd.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables from .env file
    NestMailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: parseInt(configService.get('SMTP_PORT'), 10),
          secure: configService.get('SMTP_SECURE') === 'true',
          auth: {
            user: configService.get('SMTP_USER'),
            pass: configService.get('SMTP_PASS'),
          },
        },
      }),
    }),
  ],
  providers: [ForgotPasswordService , PrismaService],
  controllers: [ForgotPasswordController],
  exports: [NestMailerModule],
})
export class ForgotPassowrdModule {}
