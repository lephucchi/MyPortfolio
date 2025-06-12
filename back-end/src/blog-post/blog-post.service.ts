import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogPost } from '../entities/blogpost.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class BlogPostService {
  constructor(
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
  ) {}

  async findAll(): Promise<BlogPost[]> {
    return this.blogPostRepository.find({ relations: ['author', 'comments'] });
  }

  async findById(id: number): Promise<BlogPost[]> {
    const blogPost = await this.blogPostRepository.findOne({
      where: { id },
      relations: ['author', 'comments'],
    });
    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }
    return [blogPost];
  }

  async create(blogData: Partial<BlogPost>, user: User): Promise<BlogPost> {
    const blogPost = this.blogPostRepository.create({ ...blogData, author: user });
    return this.blogPostRepository.save(blogPost);
  }

  async update(id: number, blogData: Partial<BlogPost>): Promise<void> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id } });
    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }
    await this.blogPostRepository.update(id, blogData);
  }

  async remove(id: number): Promise<void> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id } });
    if (!blogPost) {
      throw new NotFoundException('Blog post not found');
    }
    await this.blogPostRepository.delete(id);
  }
  
  async handleUpLoad(file: Express.Multer.File) {
  if (!file) {
    throw new NotFoundException('File not provided');
  }
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new NotFoundException('Invalid file type');
  }

  const maxFileSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxFileSize) {
    throw new NotFoundException('File size exceeds the limit of 10 MB');
  }

  return {
    message: 'File uploaded successfully',
    filePath: file.path, // Assuming the file is stored in a path
  };
}
}