// src/modules/popularanalytics/popularanalytics.controller.ts

import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  NotFoundException,
} from '@nestjs/common';
import {
  MostlySearchedService,
  MostlyViewedService,
} from './popularanalytics.services';
import {
  CreateMostlySearchedDto,
  CreateMostlyViewedDto,
} from './dto/popularanalytics.dto';
import { MostlySearched, MostlyViewed } from './popularanalytics.services'; // Ensure these are imported

@Controller('mostlysearch')
export class MostlySearchedController {
  constructor(private readonly mostlySearchedService: MostlySearchedService) {}

  @Post('track')
  async trackClick(
    @Body() body: CreateMostlySearchedDto,
  ): Promise<MostlySearched> {
    if (!body.productid) {
      throw new NotFoundException('Product ID must be provided');
    }
    return this.mostlySearchedService.trackProductClick(body.productid);
  }

  @Get('/getallmostlysearchproducts')
  async findAll(): Promise<MostlySearched[]> {
    return this.mostlySearchedService.getAllMostlySearched();
  }

  @Post('getSingleItem')
  async getSingleItem(@Body() body: { id: number }): Promise<MostlySearched> {
    return this.mostlySearchedService.getMostlySearchedById(body.id);
  }

  @Get('popularcb')
  async getPopularCategoriesAndBrands(): Promise<any> {
    return this.mostlySearchedService.getPopularCategoriesAndBrands();
  }
}

@Controller('mostly-viewed')
export class MostlyViewedController {
  constructor(private readonly mostlyViewedService: MostlyViewedService) {}

  @Post()
  async createOrIncrement(
    @Body() data: CreateMostlyViewedDto,
  ): Promise<MostlyViewed> {
    if (!data.productId) {
      throw new NotFoundException('Product ID must be provided');
    }
    return this.mostlyViewedService.incrementMostlyViewed(data);
  }

  @Get()
  async findAll(@Query('limit') limit?: number): Promise<MostlyViewed[]> {
    return this.mostlyViewedService.getAllMostlyViewed(limit);
  }
}
