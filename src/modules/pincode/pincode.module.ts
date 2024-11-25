// src/pincode/pincode.module.ts
import { Module } from '@nestjs/common';
import { PincodeService } from './pincode.service';
import { PincodeController } from './pincode.controller';

@Module({
  controllers: [PincodeController],
  providers: [PincodeService],
})
export class PincodeModule {}
