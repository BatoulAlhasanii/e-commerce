import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateItemDto {
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  quantity: number;
}
