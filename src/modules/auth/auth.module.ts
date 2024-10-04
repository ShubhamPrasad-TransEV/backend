import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ForgotPassowrdModule } from './forgot-passowrd/forgot-passowrd.module';

@Module({
  imports: [LoginModule, RegisterModule, ForgotPassowrdModule, PrismaModule],
  providers: [],
})
export class AuthModule {}
