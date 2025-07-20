// src/like/like.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { Like, LikeSchema } from './schemas/like.schema';
import { Product, ProductSchema } from '../product/schemas/product.schema'; // Product schema import qilish
import { User, UserSchema } from '../user/schemas/user.schema'; // User schema import qilish

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Like.name, schema: LikeSchema },
      { name: Product.name, schema: ProductSchema }, // Product modelini LikeModule'ga qo'shish
      { name: User.name, schema: UserSchema }, // User modelini LikeModule'ga qo'shish
    ]),
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService], // Agar LikeService boshqa modullarda kerak bo'lsa
})
export class LikeModule {}