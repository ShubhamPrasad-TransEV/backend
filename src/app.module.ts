import { Module } from '@nestjs/common';
import { RoleModule } from './modules/role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UploadProductModule } from './modules/upload-product/upload-product.module';
import { EmailService } from './email/email.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule , 
    RoleModule , 
    AdminModule , 
    UploadProductModule ,
    AuthModule ],
  controllers: [AppController],
  providers: [AppService, EmailService],
})
export class AppModule {}
