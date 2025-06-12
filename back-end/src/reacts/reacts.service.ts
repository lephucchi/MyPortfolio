import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from './entities/react.entity';
import { BlogPost } from '../entities/blogpost.entity';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class ReactionService {
  constructor(
    @InjectRepository(Reaction) private reactionRepository: Repository<Reaction>,
    @InjectRepository(BlogPost) private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {}

  async addReaction(
    type: string,
    user: User,
    blogPostId?: number,
    projectId?: number,
  ): Promise<Reaction> {
    let blogPost, project;
    if (blogPostId) {
      blogPost = await this.blogPostRepository.findOne({ where: { id: blogPostId } });
      if (!blogPost) throw new NotFoundException('Blog post not found');
    }
    if (projectId) {
      project = await this.projectRepository.findOne({ where: { id: projectId } });
      if (!project) throw new NotFoundException('Project not found');
    }

    // Kiểm tra xem user đã react chưa
    const existingReaction = await this.reactionRepository.findOne({
      where: { user: { id: user.id }, blogPost: blogPost ? { id: blogPostId } : undefined, project: project ? { id: projectId } : undefined },
    });

    if (existingReaction) {
      // Cập nhật type nếu khác
      if (existingReaction.type !== type) {
        existingReaction.type = type;
        return this.reactionRepository.save(existingReaction);
      }
      return existingReaction;
    }

    const reaction = this.reactionRepository.create({
      type,
      user,
      blogPost: blogPost || null,
      project: project || null,
    });
    return this.reactionRepository.save(reaction);
  }

  async removeReaction(user: User, blogPostId?: number, projectId?: number): Promise<void> {
    const reaction = await this.reactionRepository.findOne({
      where: { user: { id: user.id }, blogPost: blogPostId ? { id: blogPostId } : undefined, project: projectId ? { id: projectId } : undefined },
    });
    if (!reaction) throw new NotFoundException('Reaction not found');
    await this.reactionRepository.delete(reaction.id);
  }

  async getReactions(blogPostId?: number, projectId?: number): Promise<Reaction[]> {
    return this.reactionRepository.find({
      where: { blogPost: blogPostId ? { id: blogPostId } : undefined, project: projectId ? { id: projectId } : undefined },
      relations: ['user'],
    });
  }
}