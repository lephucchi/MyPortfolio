import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ relations: ['user', 'post'] });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ where: { id }, relations: ['user', 'post'] });
    if (!comment) {
      throw new Error(`Comment with id ${id} not found`);
    }
    return comment;
  }
  async create(comment: Comment): Promise<Comment> {
    return this.commentRepository.save(comment);
  }
  async update(id: number, comment: Partial<Comment>): Promise<void> {
    await this.commentRepository.update(id, comment);
  }
  async remove(id: number): Promise<void> {
    await this.commentRepository.delete(id);
  }
  async findByPostId(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { post: { id: postId } }, relations: ['user'] });
  }
  async findByUserId(userId: number): Promise<Comment[]> {
    return this.commentRepository.find({ where: { user: { id: userId } }, relations: ['post'] });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder('comment')
      .where('comment.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();
  }
}