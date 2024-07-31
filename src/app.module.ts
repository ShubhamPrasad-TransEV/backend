import { Module } from '@nestjs/common';
import { RoleModule } from './modules/role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [PrismaModule , RoleModule , AdminModule, UserModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
