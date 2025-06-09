import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer'; 

@Module({

  imports:[
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // Directory where files will be stored
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${file.originalname}`);
        },
      }),
    }),
  ],

  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
