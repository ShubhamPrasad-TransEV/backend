// src/common/dto/check-pincode.dto.ts
import { IsString, Matches } from 'class-validator';

export class CheckPincodeDto {
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Pincode must be a 6-digit number' }) // Pincode must be a 6-digit number
  readonly pincode: string;
}
