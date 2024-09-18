import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Directory where files will be stored
        filename: (req, file, cb) => {
          const filename: string = file.originalname.split('.')[0];
          const fileExtName: string = extname(file.originalname);
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${filename}-${uniqueSuffix}${fileExtName}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
          return cb(new Error('Only jpg/jpeg files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  ],
  controllers: [StoreController],
  providers: [StoreService, PrismaService],
})
export class StoreModule {}
