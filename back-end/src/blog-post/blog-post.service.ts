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
}