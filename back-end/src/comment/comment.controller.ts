import { Controller, Get, Post, Body, UseGuards, Request, Param, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Comment } from '../entities/comment.entity';
import { Roles } from '../RoleBased/decorators/roles.decorators';
import { Role } from '../RoleBased/enum/roles.enum';
import { AuthGuard } from '../RoleBased/guards/auth.guard';
import { RoleGuard } from '../RoleBased/guards/role.guard';

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
  @Put(':id')
  @Roles(Role.ADMIN, Role.MODERATOR) // Only allow ADMIN and MODERATOR roles to create blog posts
  @UseGuards(AuthGuard, RoleGuard) // Assuming you have AuthGuard and RoleGuard set up
  async update(
    @Param('id') id: number,
    @Body() commentData: { content: string },
  ): Promise<void> {
    return this.commentService.update(id, commentData.content);
  }
  @Post(':id/delete')
  @Roles(Role.ADMIN, Role.MODERATOR) // Only allow ADMIN and MODERATOR roles to create blog posts
  @UseGuards(AuthGuard, RoleGuard) // Assuming you have AuthGuard and RoleGuard set up
  async remove(@Param('id') id: number): Promise<void> {
    return this.commentService.remove(id);
  }
}