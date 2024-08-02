import { Module } from '@nestjs/common';
import { ForgotPassowrdController } from './forgot-passowrd.controller';
import { ForgotPassowrdService } from './forgot-passowrd.service';

@Module({
  controllers: [ForgotPassowrdController],
  providers: [ForgotPassowrdService]
})
export class ForgotPassowrdModule {}
