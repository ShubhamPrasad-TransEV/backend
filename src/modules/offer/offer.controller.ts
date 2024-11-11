import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  BadRequestException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferProductStockDto } from './dto/update-offer.dto';

@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @ApiOperation({
    summary: 'Create a new offer',
    description: 'Creates a new offer, optionally with an offerable product',
  })
  @ApiResponse({
    status: 201,
    description: 'The created offer',
  })
  @Post('create')
  async createOffer(@Body() createOfferDto: CreateOfferDto) {
    return await this.offersService.createOfferableProduct(createOfferDto);
  }

  @ApiOperation({
    summary: 'Update stock for an offerable product',
    description: 'Adds stock to an offerable product',
  })
  @ApiResponse({
    status: 200,
    description: 'Stock updated successfully',
  })
  @Post('update-stock')
  async updateOfferableProductStock(
    @Body() updateStockDto: UpdateOfferProductStockDto,
  ) {
    return await this.offersService.updateOfferableProductStock(updateStockDto);
  }

  @ApiOperation({
    summary: 'Get offer details by offer ID',
    description:
      'Retrieve the details of an offer, including stock availability, by its offer ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the offer details with stock availability',
  })
  @Get(':offerId')
  async getOfferById(@Param('offerId') offerId: string) {
    return await this.offersService.getOfferById(offerId);
  }

  @ApiOperation({
    summary: 'Get all offers by product ID',
    description:
      'Retrieve all offers associated with a specific product ID, including stock availability',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the list of offers associated with the product ID and stock availability',
  })
  @Get('product/:productId')
  async getOffersByProductId(@Param('productId') productId: string) {
    return await this.offersService.getOffersByProductId(productId);
  }

  @ApiOperation({
    summary: 'Get all offers by seller ID',
    description:
      'Retrieve all offers created by a specific seller, including stock availability',
  })
  @ApiResponse({
    status: 200,
    description:
      'Returns the list of offers created by the seller with stock availability',
  })
  @Get('seller/:sellerId')
  async getOffersBySellerId(@Param('sellerId', ParseIntPipe) sellerId: number) {
    return await this.offersService.getOffersBySellerId(sellerId);
  }
}
