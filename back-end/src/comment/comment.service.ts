import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { BlogPost } from '../entities/blogpost.entity';
import { User } from '../entities/user.entity';


@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
  ) {}

  async findByPost(blogPostId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { blogPost: { id: blogPostId } },
      relations: ['user'],
    });
  }

  async create(content: string, blogPostId: number, user: User): Promise<Comment> {
    const blogPost = await this.blogPostRepository.findOne({ where: { id: blogPostId } });
    if (!blogPost) {
      throw new Error('Blog post not found');
    }
    const comment = this.commentRepository.create({ content, user, blogPost });
    return this.commentRepository.save(comment);
  }
}