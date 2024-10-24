// analytics.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { GetSellerAnalyticsDto, SellerAnalyticsResponseDto } from './dto/analytics.dto';

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
