// src/product/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { CategoryDocument } from '../../category/schemas/category.schema';
import { UserDocument } from '../../user/schemas/user.schema';
import { LikeDocument } from '../../like/schemas/like.schema';
import { CommentDocument } from '../../comment/schemas/comment.schema';


@Schema()
export class ProductVariant {
  @Prop({ required: true })
  name: string; 
  
  @Prop({ required: true })
  color: string; 

  @Prop({ required: false })
  size?: string; 
  
  @Prop({ required: false })
  material?: string; 

  @Prop({ required: true, min: 0 })
  quantity: number; 

  @Prop({ required: true, default: 0 })
  priceAdjustment: number; 
}
export const ProductVariantSchema = SchemaFactory.createForClass(ProductVariant);


@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true })
  name: string; 

  @Prop({ required: true })
  company: string; 

  @Prop({ required: true })
  productModel: string; 

  @Prop({ required: true })
  year: number; 

  @Prop({ required: true })
  basePrice: number; 

  @Prop()
  description?: string; 

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: [String], default: [] }) 
  images: string[];

  @Prop({ type: [ProductVariantSchema], default: [] }) 
  variants: ProductVariant[];


  technical_specs: Map<string, string>; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  created_by: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
export type ProductDocument = Product & Document;

ProductSchema.virtual('totalQuantity').get(function (this: ProductDocument): number {
  return this.variants.reduce((total, variant) => total + variant.quantity, 0);
});

ProductSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'product',
  count: true
});

ProductSchema.virtual('commentsCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'product',
  count: true
});

ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });