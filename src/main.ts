import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'verbose', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('port');

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('NestJS Autentifikatsiya API')
    .setDescription('NestJS yordamida qurilgan to‘liq autentifikatsiya tizimi API hujjatlari.')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'JWT', description: 'Access Token', in: 'header' },
      'accessToken',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Refresh Token', description: 'Refresh Token', in: 'header' },
      'refreshToken',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  const appLogger = new Logger('NestApplication');
  const NEST_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  await app.listen(process.env.PORT || 3000, '0.0.0.0', () => { 
    appLogger.log(`Server is running at ${NEST_PORT || 3000}`);
  });

  // Keyingi log qatorlari ham to'g'ri bo'lishi uchun:
  appLogger.log(`Application is running on: http://0.0.0.0:${process.env.PORT || 3000}`);
  appLogger.log(`Swagger documentation available at: http://0.0.0.0:${process.env.PORT || 3000}/api`);

}
bootstrap();