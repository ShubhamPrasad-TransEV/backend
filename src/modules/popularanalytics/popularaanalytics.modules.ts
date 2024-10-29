import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust the path as necessary
import { MostlySearchedService } from './popularanalytics.services'; // Adjust the path as necessary
import { MostlySearchedController } from './popularanalytics.controller'; // Adjust the path as necessary

@Module({
  imports: [],
  controllers: [MostlySearchedController],
  providers: [MostlySearchedService, PrismaService],
  exports: [MostlySearchedService], // Exporting the service if needed in other modules
})
export class PopularAnalyticsModule {}
