import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { OrderModule } from './order/order.module';
import { SliderModule } from './slider/slider.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
    }),
    AuthModule,
    UserModule,
    MailModule,
    CategoryModule,
    ProductModule,
    LikeModule,
    CommentModule,
    OrderModule,
    SliderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}