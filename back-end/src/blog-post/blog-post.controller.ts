import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BlogPostService } from './blog-post.service';
import { BlogPost } from '../entities/blogpost.entity';
import { Roles } from '../RoleBased/decorators/roles.decorators';
import { Role } from '../RoleBased/enum/roles.enum';
import { AuthGuard } from '../RoleBased/guards/auth.guard';
import { RoleGuard } from '../RoleBased/guards/role.guard';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(AuthGuard, RoleGuard)
  async create(@Body() blogData: Partial<BlogPost>, @Request() req): Promise<BlogPost> {
    const user = req.user;
    return this.blogPostService.create(blogData, user);
  }

  @Post('upload')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file')) 
  async upload(@UploadedFile() file: Express.Multer.File){
    return this.blogPostService.handleUpLoad(file);
  }


  @Put(':id')
  @Roles(Role.ADMIN, Role.MODERATOR) // Only allow ADMIN and MODERATOR roles to create blog posts
  @UseGuards(AuthGuard, RoleGuard) // Assuming you have AuthGuard and RoleGuard set up
  async update(@Param('id') id: number, @Body() blogData: Partial<BlogPost>): Promise<void> {
    return this.blogPostService.update(id, blogData);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MODERATOR) // Only allow ADMIN and MODERATOR roles to create blog posts
  @UseGuards(AuthGuard, RoleGuard) // Assuming you have AuthGuard and RoleGuard set up
  async remove(@Param('id') id: number): Promise<void> {
    return this.blogPostService.remove(id);
  }
}