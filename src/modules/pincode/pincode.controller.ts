// src/pincode/pincode.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PincodeService } from './pincode.service';
import { CheckPincodeDto } from './dto/check-pincode.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Pincode')  // Swagger tag for grouping the pincode-related endpoints
@Controller('api/pincode')
export class PincodeController {
  constructor(private readonly pincodeService: PincodeService) {}

  @Post('check')
  @ApiOperation({ summary: 'Check if pincode is available' })
  @ApiResponse({ status: 200, description: 'Pincode availability check successful.' })
  @ApiResponse({ status: 400, description: 'Invalid pincode format.' })
  async checkPincode(@Body() checkPincodeDto: CheckPincodeDto) {
    return this.pincodeService.checkPincodeAvailability(checkPincodeDto);
  }
}
