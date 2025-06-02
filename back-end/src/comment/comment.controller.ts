import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentService } from './comment.service';
import { Comment } from '../entities/comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':blogPostId')
  async findByPost(@Param('blogPostId') blogPostId: number): Promise<Comment[]> {
    return this.commentService.findByPost(blogPostId);
  }

  @Post()
  async create(
    @Body() commentData: { content: string; blogPostId: number },
    @Request() req,
  ): Promise<Comment> {
    const user = req.user;
    return this.commentService.create(commentData.content, commentData.blogPostId, user);
  }
}