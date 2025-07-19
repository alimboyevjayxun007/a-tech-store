// src/product/product.module.ts
import { Module, forwardRef } from '@nestjs/common'; 
import { MongooseModule } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductSchema } from './schemas/product.schema';
import { UserModule } from '../user/user.module'

import { CategoryModule } from '../category/category.module';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    CategoryModule, 
    forwardRef(() => AuthModule),
     forwardRef(() => UserModule), 
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService], 
})
export class ProductModule {}