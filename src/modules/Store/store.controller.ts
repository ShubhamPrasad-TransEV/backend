import { Controller, Post, Put, Body, Param, UseInterceptors, UploadedFile, NestInterceptor } from '@nestjs/common';
import { CreateStoreDto} from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreService } from './store.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  async createStore(
    @Body() createStoreDto: CreateStoreDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const storeData = { ...createStoreDto, logo: file ? file.filename : null };
    return this.storeService.create(storeData);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async updateStore(
    @Param('id') id: number,
    @Body() updateStoreDto: UpdateStoreDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const storeData = { ...updateStoreDto, logo: file ? file.filename : null };
    return this.storeService.update(id, storeData);
  }
}
