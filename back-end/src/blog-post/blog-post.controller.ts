import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from '../entities/blogpost.entity';

@Controller('blog-posts')
export class BlogPostController {
  constructor(private readonly blogPostService: BlogPostService) {}

  @Get()
  async findAll(): Promise<BlogPost[]> {
    return this.blogPostService.findAll();
  }
  @Get(':id')
  async findById(@Param('id') id: number): Promise<BlogPost[]> {
    return this.blogPostService.findById(id);
  }

  @Post()
  async create(@Body() blogData: Partial<BlogPost>, @Request() req): Promise<BlogPost> {
    const user = req.user; // Assuming user is attached to the request by an authentication guard
    return this.blogPostService.create(blogData, user);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() blogData: Partial<BlogPost>): Promise<void> {
    return this.blogPostService.update(id, blogData);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.blogPostService.remove(id);
  }
}