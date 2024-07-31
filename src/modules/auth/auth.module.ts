import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { AuthService } from './auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [LoginModule, RegisterModule, PrismaModule],
  providers: [AuthService]
})
export class AuthModule {}
