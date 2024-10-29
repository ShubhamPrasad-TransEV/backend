import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import {
  CreateMostlySearchedDto,
  CreateMostlyViewedDto,
} from './dto/popularanalytics.dto'; // Adjust the path as necessary
import {
  MostlySearchedService,
  MostlyViewedService,
} from './popularanalytics.services'; // Adjust the path as necessary

@Controller('mostly-searched')
export class MostlySearchedController {
  constructor(private readonly mostlySearchedService: MostlySearchedService) {}

  // POST endpoint to create a new Mostly Searched entry
  @Post()
  async create(@Body() createMostlySearchedDto: CreateMostlySearchedDto) {
    return this.mostlySearchedService.createMostlySearched(
      createMostlySearchedDto,
    );
  }

  // GET endpoint to retrieve all Mostly Searched entries
  @Get()
  async findAll() {
    return this.mostlySearchedService.getAllMostlySearched();
  }

  // GET endpoint to retrieve a specific Mostly Searched entry by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mostlySearchedService.getMostlySearchedById(+id); // Convert string ID to number
  }
}

@Controller('mostly-viewed')
export class MostlyViewedController {
  constructor(private readonly mostlyViewedService: MostlyViewedService) {}

  // POST endpoint to create a new Mostly Searched entry
  @Post()
  async create(@Body() CreateMostlyViewedDto: CreateMostlyViewedDto) {
    return this.mostlyViewedService.incrementMostlyViewed(
      CreateMostlyViewedDto,
    );
  }

  // GET endpoint to retrieve all Mostly Searched entries
  @Get()
  async findAll(@Query('limit') limit?: number) {
    return this.mostlyViewedService.getAllMostlyViewed(limit);
  }
}
