import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the path as necessary
import { MostlySearchedService, MostlyViewedService } from './popularanalytics.services'; // Adjust the path as necessary
import { MostlySearchedController, MostlyViewedController } from './popularanalytics.controller'; // Adjust the path as necessary

@Module({
  imports: [],
  controllers: [MostlySearchedController, MostlyViewedController],
  providers: [MostlySearchedService, MostlyViewedService, PrismaService],
  exports: [MostlySearchedService, MostlyViewedService], // Exporting the service if needed in other modules
})
export class PopularAnalyticsModule {}
