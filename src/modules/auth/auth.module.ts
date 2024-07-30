import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { AuthService } from './auth.service';

@Module({
  imports: [LoginModule, RegisterModule],
  providers: [AuthService]
})
export class AuthModule {}
