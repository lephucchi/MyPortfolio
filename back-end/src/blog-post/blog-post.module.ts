import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogPost } from '../entities/blogpost.entity';
import { BlogPostController } from './blog-post.controller';
import { BlogPostService } from './blog-post.service';
import { AuthModule } from '../auth/auth.module'; // Import AuthModule if needed for authentication
import { SharedModule } from 'src/RoleBased/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BlogPost]), 
    AuthModule,
    SharedModule,
  ], // Import TypeOrmModule with BlogPost entity and AuthModule for authentication
  controllers: [BlogPostController],
  providers: [BlogPostService],
  exports: [TypeOrmModule], // Export TypeOrmModule to make BlogPostRepository available
})
export class BlogPostModule {}