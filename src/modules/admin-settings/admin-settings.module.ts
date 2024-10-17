// admin-settings.module.ts
import { Module } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { AdminSettingsController } from './admin-settings.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [AdminSettingsController],
  providers: [AdminSettingsService, PrismaService],
})
export class AdminSettingsModule {}
