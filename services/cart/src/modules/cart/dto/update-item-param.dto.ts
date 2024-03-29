import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateItemParamDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
