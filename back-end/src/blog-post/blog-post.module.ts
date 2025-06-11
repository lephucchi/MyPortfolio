import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from '../entities/blogpost.entity';
import { BlogPostController } from './blog-post.controller';
import { BlogPostService } from './blog-post.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule if needed for authentication
import { SharedModule } from 'src/RoleBased/shared/shared.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register(
      {
        storage: {
          destination: './uploads', // Directory where files will be stored
          filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, `${file.fieldname}-${uniqueSuffix}${file.originalname}`);
          }
        },
        limits: {
          fileSize: 10 * 1024 * 1024, // Limit file size to 10 MB
        },
      }
    ),
    TypeOrmModule.forFeature([BlogPost]), 
    AuthModule,
    SharedModule,
  ], // Import TypeOrmModule with BlogPost entity and AuthModule for authentication
  controllers: [BlogPostController],
  providers: [BlogPostService],
  exports: [TypeOrmModule], // Export TypeOrmModule to make BlogPostRepository available
})
export class BlogPostModule {}