import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  ParseIntPipe, // Import Param to access route parameters
} from '@nestjs/common';
import { OperationalSettingsDto } from './dto/operational-settings.dto';
import { OperationalSettingsService } from './operational-settings.service';

@Controller('admin/operational-settings')
export class OperationalSettingsAdminController {
  constructor(private readonly operationalSettingsService: OperationalSettingsService) {}

  // Get operational settings by ID

// Get operational settings by ID
@Get(':id')
async getOperationalSettings(@Param('id', ParseIntPipe) id: number) {
  return this.operationalSettingsService.findSettingsById(id);
}


  // Create operational settings
  @Post()
  async createOperationalSettings(@Body() operationalSettingsDto: OperationalSettingsDto) {
    return this.operationalSettingsService.createSettings(operationalSettingsDto);
  }

  // Update operational settings
  @Patch(':id')
  async updateOperationalSettings(
    @Param('id') id: number, // Use Param to get ID from route
    @Body() operationalSettingsDto: OperationalSettingsDto,
  ) {
    return this.operationalSettingsService.updateSettings(id, operationalSettingsDto);
  }
}
