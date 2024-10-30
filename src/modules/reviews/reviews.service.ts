import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { UpdateReviewsDto } from './dto/update-reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new review
  async createReview(createReviewsDto: CreateReviewsDto) {
    return this.prisma.reviews.create({
      data: createReviewsDto,
    });
  }

  // Get all reviews by user ID
  async getReviewsByUser(userId: number) {
    return this.prisma.reviews.findMany({
      where: { userId },
    });
  }

  // Get all reviews by product ID
  async getReviewsByProduct(productId: string) {
    return this.prisma.reviews.findMany({
      where: { productId },
    });
  }

  // Get a review by user ID and product ID
  async getReviewByUserAndProduct(userId: number, productId: string) {
    const review = await this.prisma.reviews.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
    if (!review) {
      throw new NotFoundException(
        'Review not found for the given user and product',
      );
    }
    return review;
  }

  // Update a review by user ID and product ID
  async updateReviewByUserAndProduct(
    userId: number,
    productId: string,
    updateReviewsDto: UpdateReviewsDto,
  ) {
    const existingReview = await this.prisma.reviews.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
    if (!existingReview) {
      throw new NotFoundException(
        'Review not found for the given user and product',
      );
    }

    return this.prisma.reviews.update({
      where: {
        userId_productId: { userId, productId },
      },
      data: updateReviewsDto,
    });
  }

  // Delete a review by user ID and product ID
  async deleteReviewByUserAndProduct(userId: number, productId: string) {
    const existingReview = await this.prisma.reviews.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });
    if (!existingReview) {
      throw new NotFoundException(
        'Review not found for the given user and product',
      );
    }

    return this.prisma.reviews.delete({
      where: {
        userId_productId: { userId, productId },
      },
    });
  }

  // Get the overall rating by product ID
  async getOverallRatingByProduct(productId: string) {
    const reviews = await this.prisma.reviews.findMany({
      where: { productId },
      select: { ratings: true },
    });

    if (reviews.length === 0) {
      throw new NotFoundException('No reviews found for the given product');
    }

    const totalRatings = reviews.reduce(
      (acc, review) => acc + review.ratings,
      0,
    );
    const averageRating = totalRatings / reviews.length;
    return { productId, averageRating };
  }
}
