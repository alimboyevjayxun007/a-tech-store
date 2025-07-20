// src/comment/comment.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { User, UserSchema } from '../user/schemas/user.schema'; // **Bu qatorni qo'shing**

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema }, // **Bu qatorni qo'shing: User modelini ro'yxatdan o'tkazish**
    ]),
    ProductModule,
    UserModule,
  ],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}