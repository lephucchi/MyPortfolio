import { Controller, Get , Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from '../entities/blogpost.entity';

@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get()
  async findAll(): Promise<BlogPost[]> {
    return this.blogPostService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() blogData: Partial<BlogPost>): Promise<BlogPost> {
    return this.blogPostService.create(blogData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: number, @Body() blogData: Partial<BlogPost>): Promise<BlogPost> {
    return this.blogPostService.update(id, blogData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: number): Promise<void> {
    return this.blogPostService.remove(id);
  }
}