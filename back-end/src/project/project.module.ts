import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/thumbnails',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${file.originalname}`);
        },
      }),
    }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}