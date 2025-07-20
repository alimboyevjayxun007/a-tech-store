// src/like/like.service.ts
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'; // Types ni to'g'ri import qiling
import { Like, LikeDocument } from './schemas/like.schema';
import { Product, ProductDocument } from '../product/schemas/product.schema';
import { User, UserDocument } from '../user/schemas/user.schema';

@Injectable()
export class LikeService {
  private readonly logger = new Logger(LikeService.name);

  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(userId: string, productId: string): Promise<Like> {
    this.logger.log(`[CreateLike] Attempting to create like. Input userId: ${userId}, productId: ${productId}`);

    // ID'larni Types.ObjectId ga to'g'ri aylantirish
    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(productId);
    this.logger.log(`[CreateLike] Converted ObjectIds: userObjectId=${userObjectId.toHexString()}, productObjectId=${productObjectId.toHexString()}`);

    // Mahsulot mavjudligini tekshirish
    const productExists = await this.productModel.findById(productObjectId);
    if (!productExists) {
      this.logger.warn(`[CreateLike] Product not found for ID: ${productObjectId.toHexString()}`);
      throw new NotFoundException('Mahsulot topilmadi.');
    }

    // Oldingi layk mavjudligini tekshirish (muammo shu yerda bo'lishi mumkin)
    const existingLike = await this.likeModel.findOne({ user: userObjectId, product: productObjectId }).exec(); // .exec() qo'shildi
    this.logger.log(`[CreateLike] Found existing like: ${JSON.stringify(existingLike)}`); // Natijani log qiling
    if (existingLike) {
      this.logger.warn(`[CreateLike] User ${userObjectId.toHexString()} already liked product ${productObjectId.toHexString()}`);
      throw new ConflictException('Bu foydalanuvchi ushbu mahsulotga allaqachon like bosgan.');
    }

    try {
      const newLike = new this.likeModel({ user: userObjectId, product: productObjectId });
      const savedLike = await newLike.save();
      this.logger.log(`[CreateLike] Like saved successfully: ${JSON.stringify(savedLike)}`);
      return savedLike;
    } catch (error) {
      this.logger.error(`[CreateLike] Error saving like: ${error.message}`, error.stack);
      if (error.code === 11000) { // Duplicate key error
        throw new ConflictException('Bu foydalanuvchi ushbu mahsulotga allaqachon like bosgan.');
      }
      throw new InternalServerErrorException('Like yaratishda xatolik yuz berdi.');
    }
  }

  async remove(userId: string, productId: string): Promise<void> {
    this.logger.log(`[RemoveLike] Attempting to remove like. Input userId: ${userId}, productId: ${productId}`);
    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(productId);
    this.logger.log(`[RemoveLike] Converted ObjectIds: userObjectId=${userObjectId.toHexString()}, productObjectId=${productObjectId.toHexString()}`);

    const result = await this.likeModel.deleteOne({ user: userObjectId, product: productObjectId }).exec(); // .exec() qo'shildi
    if (result.deletedCount === 0) {
      this.logger.warn(`[RemoveLike] Like not found for user ${userObjectId.toHexString()} and product ${productObjectId.toHexString()}`);
      throw new NotFoundException('Like topilmadi yoki o\'chirishga ruxsat yo\'q.');
    }
    this.logger.log(`[RemoveLike] Like successfully removed for userId: ${userId}, productId: ${productId}`);
  }

  async getLikesCountByProductId(productId: string): Promise<{ productId: string; count: number }> {
    this.logger.log(`[GetCount] Fetching like count for productId: ${productId}`);
    const productObjectId = new Types.ObjectId(productId);
    this.logger.log(`[GetCount] Converted productObjectId: ${productObjectId.toHexString()}`);

    const count = await this.likeModel.countDocuments({ product: productObjectId }).exec(); // .exec() qo'shildi
    this.logger.log(`[GetCount] Like count for ${productId}: ${count}`);
    return { productId, count };
  }

  async isProductLikedByUser(userId: string, productId: string): Promise<boolean> {
    this.logger.log(`[IsLiked] Checking if product ${productId} is liked by user ${userId}`);
    // userId va productId ning Types.ObjectId ga to'g'ri aylanganligini tekshirish
    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(productId)) {
        this.logger.error(`[IsLiked] Invalid ID format. userId: ${userId}, productId: ${productId}`);
        return false;
    }

    const userObjectId = new Types.ObjectId(userId);
    const productObjectId = new Types.ObjectId(productId);
    this.logger.log(`[IsLiked] Converted ObjectIds: userObjectId=${userObjectId.toHexString()}, productObjectId=${productObjectId.toHexString()}`);

    // Bazadan like qidiruvini amalga oshirish
    const like = await this.likeModel.findOne({ user: userObjectId, product: productObjectId }).exec(); // .exec() qo'shildi
    this.logger.log(`[IsLiked] Result of findOne: ${JSON.stringify(like)}`); // Topilgan likeni log qiling

    const isLiked = !!like; // Agar like topilsa true, aks holda false
    this.logger.log(`[IsLiked] Product ${productId} liked by user ${userId}: ${isLiked}`);
    return isLiked;
  }

  async getUserLikedProducts(userId: string): Promise<Product[]> {
    this.logger.log(`[GetUserLikes] Fetching liked products for userId: ${userId}`);
    // userId ning to'g'ri Types.ObjectId ekanligini tekshirish
    if (!Types.ObjectId.isValid(userId)) {
      this.logger.error(`[GetUserLikes] Invalid userId format: ${userId}`);
      return [];
    }

    const userObjectId = new Types.ObjectId(userId);
    this.logger.log(`[GetUserLikes] Converted userObjectId: ${userObjectId.toHexString()}`);

    // Qidiruvni amalga oshirish
    const likes = await this.likeModel.find({ user: userObjectId }).select('product').exec();
    this.logger.log(`[GetUserLikes] Found likes for user (raw): ${JSON.stringify(likes)}`);

    // productIds ni to'g'ri ekstraksiya qilish
    const productIds = likes.map(like => {
        // Har bir like hujjatini tekshirish
        if (!(like as any).product) {
            this.logger.warn(`[GetUserLikes] Like document found without 'product' field: ${JSON.stringify(like)}`);
            return null; // Yoki undefined, keyinchalik filter qilinadi
        }
        return (like as any).product;
    }).filter(id => id !== null); // null qiymatlarni filter qilish

    this.logger.log(`[GetUserLikes] Extracted productIds: ${JSON.stringify(productIds.map(id => id.toHexString()))}`); // ID'larni string sifatida ko'rsatish

    if (productIds.length === 0) {
      this.logger.warn(`[GetUserLikes] No productIds found for user ${userId}. Returning empty array.`);
      return [];
    }

    const likedProducts = await this.productModel.find({ _id: { $in: productIds } }).exec();
    this.logger.log(`[GetUserLikes] Fetched liked products details: ${JSON.stringify(likedProducts)}`);

    return likedProducts;
  }
}