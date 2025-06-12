import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../entities/project.entity';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/RoleBased/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    AuthModule, 
    SharedModule, 
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${file.originalname}`);
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}