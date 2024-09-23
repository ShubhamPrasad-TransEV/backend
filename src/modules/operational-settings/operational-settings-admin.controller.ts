import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Param,
  ParseIntPipe, 
} from '@nestjs/common';
import { OperationalSettingsDto } from './dto/operational-settings.dto';
import { OperationalSettingsService } from './operational-settings.service';

@Controller('admin/operational-settings')
export class OperationalSettingsAdminController {
  constructor(private readonly operationalSettingsService: OperationalSettingsService) {}



@Get(':id')
async getOperationalSettings(@Param('id', ParseIntPipe) id: number) {
  return this.operationalSettingsService.findSettingsById(id);
}



  @Post()
  async createOperationalSettings(@Body() operationalSettingsDto: OperationalSettingsDto) {
    return this.operationalSettingsService.createSettings(operationalSettingsDto);
  }


  @Patch(':id')
  async updateOperationalSettings(
    @Param('id') id: number, 
    @Body() operationalSettingsDto: OperationalSettingsDto,
  ) {
    return this.operationalSettingsService.updateSettings(id, operationalSettingsDto);
  }
}
