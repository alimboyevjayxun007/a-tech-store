// src/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './schemas/product.schema';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role-enum';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Create a new product (Admin/SuperAdmin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully.', type: Product })
  @ApiResponse({ status: 400, description: 'Invalid request data or category/user not found.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient roles.' })
  @ApiBearerAuth('accessToken')
  async create(@Body() createProductDto: CreateProductDto, @Req() req): Promise<Product> {
    const userId = req.user._id; 
    
    
    return this.productService.create(createProductDto, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all products with optional filters and search' })
  @ApiResponse({ status: 200, description: 'List of all products.', type: [Product] })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by product name, company, or model' })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category ID' })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, description: 'Filter by minimum base price' })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, description: 'Filter by maximum base price' })
  async findAll(
    @Query('search') search?: string,
    @Query('categoryId') categoryId?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
  ): Promise<Product[]> {
    return this.productService.findAll(search, categoryId, minPrice, maxPrice);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a product by ID' })
  @ApiResponse({ status: 200, description: 'Product details.', type: Product })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Update a product by ID (Admin/SuperAdmin only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.', type: Product })
  @ApiResponse({ status: 400, description: 'Invalid request data or ID format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient roles.' })
  @ApiResponse({ status: 404, description: 'Product or category not found.' })
  @ApiBearerAuth('accessToken')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({ summary: 'Delete a product by ID (Admin/SuperAdmin only)' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Insufficient roles.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiBearerAuth('accessToken')
  async remove(@Param('id') id: string): Promise<void> {
    await this.productService.remove(id);
  }
}