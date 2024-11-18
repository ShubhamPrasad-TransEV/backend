import { Controller, Get } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { CollectionResponseDto } from './dto/collection-response.dto';

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get('new') // Fetch all new collections (products)
  async getNewCollections(): Promise<ProductResponseDto[]> {
    return this.collectionsService.getNewCollections();
  }

  @Get('with-products') // Fetch collections along with the products in them
  async getCollectionsWithProducts(): Promise<CollectionResponseDto[]> {
    return this.collectionsService.getCollectionsWithProducts();
  }
}
