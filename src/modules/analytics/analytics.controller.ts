import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import {
  GetSellerAnalyticsDto,
  GetAdminAnalyticsDto,
} from './dto/analytics.dto';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('/seller')
  @ApiOperation({
    summary: 'Retrieve analytics for a specific seller',
    description: 'Returns analytics for a seller based on their sellerId.',
  })
  async getSellerAnalytics(@Query() params: GetSellerAnalyticsDto) {
    return this.analyticsService.getAnalytics(params);
  }

  @Get('/admin')
  @ApiOperation({
    summary: 'Retrieve admin-wide analytics',
    description: 'Returns aggregated analytics across all sellers.',
  })
  async getAdminAnalytics(@Query() params: GetAdminAnalyticsDto) {
    return this.analyticsService.getAnalytics(params);
  }
}
