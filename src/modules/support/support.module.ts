import { Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { PrismaModule } from '../../prisma/prisma.module'; // Assumes PrismaModule exists in your app

@Module({
  imports: [PrismaModule],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
