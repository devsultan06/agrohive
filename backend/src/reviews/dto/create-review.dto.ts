import { IsString, IsNotEmpty, IsInt, Min, Max, IsUUID } from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
