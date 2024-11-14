// src/pincode/pincode.service.ts
import { Injectable } from '@nestjs/common';
import { CheckPincodeDto } from './dto/check-pincode.dto';

@Injectable()
export class PincodeService {
  // Example pincodes for West Bengal (you should replace this with the full list)
  private readonly westBengalPincodes = [
    '700001', '700002', '700003', '700004', '700005', // Add all West Bengal pincodes here
    '700027', '700029', '700030', '700032', '700033',
    '700035', '700038', '700039', '735101'
  ];

  // Method to check pincode availability
  async checkPincodeAvailability(checkPincodeDto: CheckPincodeDto): Promise<any> {
    const { pincode } = checkPincodeDto;

    // Check if the pincode exists in the West Bengal pincode list
    if (this.westBengalPincodes.includes(pincode)) {
      return { available: true, message: 'Pincode available for delivery' };
    } else {
      return { available: false, message: 'Pincode not available for delivery' };
    }
  }
}




