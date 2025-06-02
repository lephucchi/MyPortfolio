import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { BlogPostModule } from '../blog-post/blog-post.module'; // Import BlogPostModule to access BlogPostRepository


@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    BlogPostModule, // Import to access BlogPostRepository
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}