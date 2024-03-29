import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class AddItemDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  productPrice: number;

  @IsInt()
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}
