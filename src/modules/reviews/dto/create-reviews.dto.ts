import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewsDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  review?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  ratings: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  deliveryRatings: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(5)
  dispatchRatings: number;
}

// // create-reviews.dto.ts
// import { IsInt, IsString, IsOptional, IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

// export class CreateReviewsDto {
//   @IsInt()
//   userId: number; // User submitting the review

//   @IsString()
//   productId: string; // Product being reviewed

//   @IsString()
//   @IsNotEmpty()
//   review: string; // Text of the review

//   @IsNumber()
//   @Min(0)
//   @Max(5)
//   ratings: number; // Overall rating (e.g., 4.5)

//   @IsNumber()
//   @Min(0)
//   @Max(5)
//   deliveryRatings: number; // Rating for delivery

//   @IsNumber()
//   @Min(0)
//   @Max(5)
//   qualityRatings: number; // Rating for quality

//   @IsNumber()
//   @Min(0)
//   @Max(5)
//   dispatchRatings: number; // Rating for dispatch time
// }
