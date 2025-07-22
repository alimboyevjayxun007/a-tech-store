import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  Get,
  Param,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { createReadStream } from 'fs';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role-enum';

@ApiTags('File Upload')
@Controller('upload')
export class UploadController {
  private readonly UPLOAD_DIR = './uploads';

  @Post('image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.SuperAdmin)
  @ApiOperation({
    summary: 'Upload an image (for admins/superadmins only)',
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Image successfully uploaded.',
    schema: {
      type: 'object',
      properties: {
        filename: { type: 'string', example: 'randomstring.jpg' },
        originalname: { type: 'string', example: 'my-image.jpg' },
        path: { type: 'string', example: './uploads/randomstring.jpg' },
      },
    },
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid file format or size.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden: Insufficient role.' })
  @ApiBearerAuth('accessToken')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          const fileExtension = file.originalname.split('.').pop();
          cb(null, `${randomName}.${fileExtension}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return {
      filename: file.filename,
      originalname: file.originalname,
      path: `${this.UPLOAD_DIR}/${file.filename}`,
    };
  }

  @Get('image/:imagename')
  @ApiOperation({ summary: 'Retrieve an uploaded image (public access)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Image successfully retrieved.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Image not found.' })
  findImage(@Param('imagename') imagename, @Res() res) {
    const imagePath = join(process.cwd(), this.UPLOAD_DIR, imagename);
    createReadStream(imagePath).pipe(res);
  }
}