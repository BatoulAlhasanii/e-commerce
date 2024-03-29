import { IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveItemParamDto {
  @IsUUID()
  @IsNotEmpty()
  productId: string;
}
