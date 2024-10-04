// login.module.ts
import { Module, Logger } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        Logger.log(`JWT_SECRET: ${secret}`, 'LoginModule');
        return {
          secret,
          signOptions: { expiresIn: '60m' },
        };
      },
    }),
  ],
  providers: [LoginService, JwtStrategy],
  controllers: [LoginController],
  exports: [LoginService],
})
export class LoginModule {}
