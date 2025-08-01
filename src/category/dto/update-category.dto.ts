// src/category/dto/update-category.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}