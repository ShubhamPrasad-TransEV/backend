import {Controller, Post, Get, Patch, Delete, Body, Param, ParseIntPipe, Query, } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { UpdateReviewsDto } from './dto/update-reviews.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  @ApiBody({
    description: 'Data required to create a new review',
    type: CreateReviewsDto,
    examples: {
      example1: {
        value: {
          userId: 1,
          productId: 'prod-123',
          review: 'Great product!',
          ratings: 4.5,
        },
      },
    },
  })
  async createReview(@Body() createReviewsDto: CreateReviewsDto) {
    return this.reviewsService.createReview(createReviewsDto);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all reviews by a specific user' })
  @ApiParam({ name: 'userId', description: 'ID of the user', example: 1 })
  async getReviewsByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.reviewsService.getReviewsByUser(userId);
  }

  @Get('user/:userId/product/:productId')
  @ApiOperation({ summary: 'Get a review by user and product' })
  @ApiParam({ name: 'userId', description: 'ID of the user', example: 1 })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product',
    example: 'prod-123',
  })
  async getReviewByUserAndProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.getReviewByUserAndProduct(userId, productId);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get all reviews by product ID' })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product',
    example: 'prod-123',
  })
  async getReviewsByProduct(@Param('productId') productId: string) {
    return this.reviewsService.getReviewsByProduct(productId);
  }

  @Get('product/:productId/overall-rating')
  @ApiOperation({ summary: 'Get overall rating by product ID' })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product',
    example: 'prod-123',
  })
  async getOverallRatingByProduct(@Param('productId') productId: string) {
    return this.reviewsService.getOverallRatingByProduct(productId);
  }

  @Patch('user/:userId/product/:productId')
  @ApiOperation({ summary: 'Update a review by user and product' })
  @ApiParam({ name: 'userId', description: 'ID of the user', example: 1 })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product',
    example: 'prod-123',
  })
  @ApiBody({
    description: 'Data to update the review',
    type: UpdateReviewsDto,
    examples: {
      example1: {
        value: {
          review: 'Updated review text',
          ratings: 4.0,
        },
      },
    },
  })
  async updateReviewByUserAndProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId') productId: string,
    @Body() updateReviewsDto: UpdateReviewsDto,
  ) {
    return this.reviewsService.updateReviewByUserAndProduct(
      userId,
      productId,
      updateReviewsDto,
    );
  }

  @Delete('user/:userId/product/:productId')
  @ApiOperation({ summary: 'Delete a review by user and product' })
  @ApiParam({ name: 'userId', description: 'ID of the user', example: 1 })
  @ApiParam({
    name: 'productId',
    description: 'ID of the product',
    example: 'prod-123',
  })
  async deleteReviewByUserAndProduct(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('productId') productId: string,
  ) {
    return this.reviewsService.deleteReviewByUserAndProduct(userId, productId);
  }

  @Get('products-above-rating')
  @ApiOperation({
    summary: 'Get products with an average rating above a threshold',
  })
  @ApiQuery({
    name: 'ratingThreshold',
    type: Number,
    required: true,
    example: 4.0,
  })
  @ApiQuery({ name: 'rangeStart', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'rangeEnd', type: Number, required: true, example: 10 })
  async getProductsAboveRating(
    @Query('ratingThreshold', ParseIntPipe) ratingThreshold: number,
    @Query('rangeStart', ParseIntPipe) rangeStart: number,
    @Query('rangeEnd', ParseIntPipe) rangeEnd: number,
  ) {
    return this.reviewsService.getProductsAboveRating(
      ratingThreshold,
      rangeStart,
      rangeEnd,
    );
  }

  @Get('products-below-rating')
  @ApiOperation({
    summary: 'Get products with an average rating below a threshold',
  })
  @ApiQuery({
    name: 'ratingThreshold',
    type: Number,
    required: true,
    example: 2.0,
  })
  @ApiQuery({ name: 'rangeStart', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'rangeEnd', type: Number, required: true, example: 10 })
  async getProductsBelowRating(
    @Query('ratingThreshold', ParseIntPipe) ratingThreshold: number,
    @Query('rangeStart', ParseIntPipe) rangeStart: number,
    @Query('rangeEnd', ParseIntPipe) rangeEnd: number,
  ) {
    return this.reviewsService.getProductsBelowRating(
      ratingThreshold,
      rangeStart,
      rangeEnd,
    );
  }

  @Get('unrated-products')
  @ApiOperation({ summary: 'Get unrated products in alphabetical order' })
  @ApiQuery({ name: 'rangeStart', type: Number, required: true, example: 1 })
  @ApiQuery({ name: 'rangeEnd', type: Number, required: true, example: 10 })
  async getUnratedProducts(
    @Query('rangeStart', ParseIntPipe) rangeStart: number,
    @Query('rangeEnd', ParseIntPipe) rangeEnd: number,
  ) {
    return this.reviewsService.getUnratedProducts(rangeStart, rangeEnd);
  }
}
