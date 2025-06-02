import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { BlogPost } from '../../entities/blogpost.entity';
import { Hobby } from '../../entities/hobby.entity';
import { Study } from '../../entities/study.entity';
import { Comment } from '../../entities/comment.entity';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SampleSeed {
  constructor(
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(BlogPost) private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(Hobby) private hobbyRepository: Repository<Hobby>,
    @InjectRepository(Study) private studyRepository: Repository<Study>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async seed() {
    // Tạo tài khoản admin mặc định
    let adminUser = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('Admin123!', 10);
      adminUser = this.userRepository.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
      });
      await this.userRepository.save(adminUser);
      console.log('Created default admin account');
    }

    // Tạo tài khoản user mẫu
    let sampleUser = await this.userRepository.findOne({ where: { email: 'user@example.com' } });
    if (!sampleUser) {
      const hashedPassword = await bcrypt.hash('User123!', 10);
      sampleUser = this.userRepository.create({
        name: 'Sample User',
        email: 'user@example.com',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
      });
      await this.userRepository.save(sampleUser);
      console.log('Created sample user account');
    }

    // Seed Projects
    let projectCount = await this.projectRepository.count();
    if (projectCount === 0) {
      const sampleProjects: Partial<Project>[] = [
        {
          title: 'E-commerce Platform',
          githubLink: 'https://github.com/sample/ecommerce',
          documentation: 'A full-stack e-commerce platform with payment integration.',
          thumbnail: '/uploads/thumbnails/ecommerce.jpg',
          technologies: 'React, Node.js, PostgreSQL, Stripe',
          user: adminUser,
          createdAt: new Date(),
        },
      ];
      await this.projectRepository.save(sampleProjects);
      console.log('Seeded 1 sample project');
    }

    // Seed BlogPosts
    let blogPostCount = await this.blogPostRepository.count();
    if (blogPostCount === 0) {
      const sampleBlogPosts = [
        {
          title: 'Getting Started with NestJS',
          content: 'This blog post explores the basics of NestJS...',
          author: adminUser,
          createdAt: new Date(),
        },
      ];
      const blogPosts = await this.blogPostRepository.save(sampleBlogPosts);
      console.log('Seeded 1 sample blog post');

      // Seed Comments
      let commentCount = await this.commentRepository.count();
      if (commentCount === 0) {
        const sampleComments = [
          {
            content: 'Great post, thanks for sharing!',
            user: sampleUser,
            blogPost: blogPosts[0],
            createdAt: new Date(),
          },
        ];
        await this.commentRepository.save(sampleComments);
        console.log('Seeded 1 sample comment');
      }
    }

    // Seed Hobbies
    let hobbyCount = await this.hobbyRepository.count();
    if (hobbyCount === 0) {
      const sampleHobbies = [
        {
          name: 'Photography',
          description: 'Capturing moments with a DSLR camera.',
          user: adminUser,
          createdAt: new Date(),
        },
      ];
      await this.hobbyRepository.save(sampleHobbies);
      console.log('Seeded 1 sample hobby');
    }

    // Seed Studies
    let studyCount = await this.studyRepository.count();
    if (studyCount === 0) {
      const sampleStudies = [
        {
          title: 'Computer Science Degree',
          content: 'Completed a Bachelor’s degree in Computer Science.',
          author: adminUser,
          createdAt: new Date(),
        },
      ];
      await this.studyRepository.save(sampleStudies);
      console.log('Seeded 1 sample study');
    }
  }
}