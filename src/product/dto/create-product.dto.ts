  // src/product/dto/create-product.dto.ts
  import {
    IsString,
    IsNotEmpty,
    IsNumber,
    Min,
    Max,
    IsOptional,
    IsArray,
    ValidateNested,
    IsMongoId,
    IsObject
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { ProductVariantDto } from './product-variant.dto';

  export class CreateProductDto { 
    @IsString()
    @IsNotEmpty({ message: 'Mahsulot nomi bo\'sh bo\'lmasligi kerak.' })
    name: string;

    @IsString()
    @IsNotEmpty({ message: 'Kompaniya nomi bo\'sh bo\'lmasligi kerak.' })
    company: string;

    @IsString()
    @IsNotEmpty({ message: 'Model nomi bo\'sh bo\'lmasligi kerak.' })
    productModel: string;

    @IsNumber()
    @Min(1900, { message: 'Ishlab chiqarilgan yil 1900 yildan kichik bo\'lmasligi kerak.' })
    @Max(new Date().getFullYear(), { message: 'Ishlab chiqarilgan yil kelajakdagi yil bo\'lmasligi kerak.' })
    year: number;

    @IsNumber()
    @Min(0, { message: 'Asosiy narx manfiy bo\'lmasligi kerak.' })
    basePrice: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsMongoId({ message: 'Kategoriya IDsi noto\'g\'ri formatda.' })
    @IsNotEmpty({ message: 'Kategoriya IDsi bo\'sh bo\'lmasligi kerak.' })
    category: string;

    @IsArray()
    @IsString({ each: true, message: 'Har bir rasm URLi matn bo\'lishi kerak.' })
    @IsOptional()
    images?: string[];

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductVariantDto)
    variants: ProductVariantDto[];

    @IsObject({ message: 'Texnik xususiyatlar obyekt shaklida bo\'lishi kerak.' })
    @IsOptional()
    @Type(() => Object)
    technical_specs?: Record<string, string>;
  }