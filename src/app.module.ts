import { Module } from '@nestjs/common';
import { RoleModule } from './modules/role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [PrismaModule , RoleModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
