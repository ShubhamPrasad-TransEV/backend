// top-rated.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { TopRatedService } from './top-rated.service';
import { CreateTopRatedDto } from './dto/create-top-rated.dto';
import { TopRated } from '@prisma/client';

@Controller('top-rated')
export class TopRatedController {
  constructor(private readonly topRatedService: TopRatedService) {}

  @Post()
  async create(
    @Body() createTopRatedDto: CreateTopRatedDto,
  ): Promise<TopRated> {
    return this.topRatedService.create(createTopRatedDto);
  }

  @Get()
  async findAll(): Promise<TopRated[]> {
    return this.topRatedService.findAll();
  }
}
