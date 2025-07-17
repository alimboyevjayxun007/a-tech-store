// src/product/dto/product-variant.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min, IsOptional } from 'class-validator';

export class ProductVariantDto {
  @IsString()
  @IsNotEmpty({ message: 'Variant nomi bo\'sh bo\'lmasligi kerak.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Rang bo\'sh bo\'lmasligi kerak.' })
  color: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsString()
  @IsOptional()
  material?: string;

  @IsNumber()
  @Min(0, { message: 'Miqdor manfiy bo\'lmasligi kerak.' })
  quantity: number;

  @IsNumber()
  priceAdjustment: number;
}