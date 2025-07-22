import { Controller, Post, UseInterceptors, UploadedFile, Res, Get, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { of } from 'rxjs';
import { createReadStream } from 'fs';

@Controller('upload')
export class UploadController {

  private readonly UPLOAD_DIR = './uploads';

  @Post('image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
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
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return { filename: file.filename, originalname: file.originalname, path: `${this.UPLOAD_DIR}/${file.filename}` };
  }

  @Get('image/:imagename')
  findImage(@Param('imagename') imagename, @Res() res) {
    const imagePath = join(process.cwd(), this.UPLOAD_DIR, imagename);
    const fileStream = createReadStream(imagePath);
    fileStream.pipe(res);
  }
}