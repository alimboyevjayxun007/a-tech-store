// src/product/dto/update-product.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsOptional, ValidateNested, IsArray, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductVariantDto } from './product-variant.dto';

// Mana bu qatorni to'g'irlash kerak!
export class UpdateProductDto extends PartialType(CreateProductDto) { // <-- "CreateProductDto" o'rniga "UpdateProductDto" bo'lishi kerak edi
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantDto)
  @IsOptional()
  variants?: ProductVariantDto[];

  @IsObject({ message: 'Texnik xususiyatlar obyekt shaklida bo\'lishi kerak.' })
  @IsOptional()
  @Type(() => Object)
  technical_specs?: Record<string, string>;
}