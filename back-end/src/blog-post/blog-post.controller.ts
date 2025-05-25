import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from '../entities/blogpost.entity';

@Controller('blog-posts')
export class BlogPostController {
    constructor(private readonly blogPostService: BlogPostService) {}

    @Get()
    finAll() : Promise<BlogPost[]> {
        return this.blogPostService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string): Promise<BlogPost> {
        return this.blogPostService.findOne(+id);
    }
    @Post()
    create(@Body() blogPost: BlogPost): Promise<BlogPost> {
        return this.blogPostService.create(blogPost);
    }
    @Put(':id')
    update(@Param('id') id: string, @Body() blogPost: Partial<BlogPost>): Promise<BlogPost> {
        return this.blogPostService.update(+id, blogPost);
    }
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.blogPostService.remove(+id);
    }
}