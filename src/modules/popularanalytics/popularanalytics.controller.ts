import { Controller, Post, Body, Get, Param, Query, NotFoundException, ParseIntPipe } from '@nestjs/common';
import {
  CreateMostlySearchedDto,
  CreateMostlyViewedDto,
} from './dto/popularanalytics.dto'; // Adjust the path as necessary
import {
  MostlySearchedService,
  MostlyViewedService,
} from './popularanalytics.services'; // Adjust the path as necessary

@Controller('mostlysearch')
export class MostlySearchedController {
  constructor(private readonly mostlySearchedService: MostlySearchedService) {}

  // POST endpoint to track product clicks
  @Post('track')
  async trackClick(@Body() body: { productid: string }) {
    return this.mostlySearchedService.trackProductClick(body.productid);
  }

  // GET endpoint to retrieve all Mostly Searched entries
  @Get('/getallmostlysearchproducts')
  async findAll() {
    return this.mostlySearchedService.getAllMostlySearched();
  }

  // GET endpoint to retrieve a specific Mostly Searched entry by ID
  @Post('getSingleItem') // Renamed route
  async getSingleItem(@Body() body: { id: string }) {
    return this.mostlySearchedService.getMostlySearchedById(+body.id); // Convert string ID to number
  }
}

@Controller('mostly-viewed')
export class MostlyViewedController {
  constructor(private readonly mostlyViewedService: MostlyViewedService) {}

  // Endpoint to increment views or create a Mostly Viewed entry
  @Post()
  async createOrIncrement(@Body() data: CreateMostlyViewedDto) {
    if (!data.productId) {
      throw new NotFoundException('Product ID must be provided');
    }
    return this.mostlyViewedService.incrementMostlyViewed(data);
  }

  // Endpoint to get all Mostly Viewed entries, sorted by views in descending order
  @Get()
  async findAll(@Query('limit', ParseIntPipe) limit?: number) {
    return this.mostlyViewedService.getAllMostlyViewed(limit);
  }
}
