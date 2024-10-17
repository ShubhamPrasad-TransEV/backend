import { Module } from '@nestjs/common';
import { OperationalSettingsController } from './operational-settings.controller';
import { OperationalSettingsService } from './operational-settings.service';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the import according to your project structure

@Module({
  controllers: [OperationalSettingsController],
  providers: [OperationalSettingsService, PrismaService],
})
export class OperationalSettingsModule {}
