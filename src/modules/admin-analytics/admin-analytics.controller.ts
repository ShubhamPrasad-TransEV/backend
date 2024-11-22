// analytics.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './admin-analytics.service';
import {
  GetSellerAnalyticsDto,
  SellerAnalyticsResponseDto,
} from './dto/admin-analytics.dto';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  async getSellerAnalytics(
    @Query() params: GetSellerAnalyticsDto,
  ): Promise<SellerAnalyticsResponseDto> {
    return this.analyticsService.getSellerAnalytics(params);
  }
}
