// src/common/dto/check-pincode.dto.ts
import { IsString, Matches } from 'class-validator';

export class CheckPincodeDto {
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Pincode must be a 6-digit number' }) // Pincode must be a 6-digit number
  readonly pincode: string;
}


//ok, so, for my e-commerce website i want  when a seller upload a product in seller side, it should appear in User dashboard as a new collection and Category wise so, api need For all new collection GET, sellecr new collection POST, category Wise GET so, and if prisma and schema change give me that code also, in nest.js and give me file structure too