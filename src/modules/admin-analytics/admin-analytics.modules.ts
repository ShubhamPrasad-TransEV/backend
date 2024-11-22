// analytics.module.ts

import { Module } from '@nestjs/common';
import { AnalyticsService } from './admin-analytics.service';
import { AdminAnalyticsController } from './admin-analytics.controller';
import { PrismaService } from '../../prisma/prisma.service'; // Assuming PrismaService is already set up

@Module({
  imports: [],
  controllers: [AdminAnalyticsController],
  providers: [AnalyticsService, PrismaService],
})
export class AdminAnalyticsModule {}
