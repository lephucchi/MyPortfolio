import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { BlogPost } from '../../entities/blogpost.entity';
import { Hobby } from '../../entities/hobby.entity';
import { Study } from '../../entities/study.entity';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SampleSeed {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(BlogPost)
    private blogPostRepository: Repository<BlogPost>,
    @InjectRepository(Hobby)
    private hobbyRepository: Repository<Hobby>,
    @InjectRepository(Study)
    private studyRepository: Repository<Study>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async seed() {
    // Trong sample.seed.ts
    let adminUser = await this.userRepository.findOne({ where: { email: 'admin@example.com' } });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('12112004', 10);
      adminUser = this.userRepository.create({
        name: 'LePhucChi',
        email: 'phucchile25@gmail.com',
        password: hashedPassword,
        role: 'admin',
      });
      await this.userRepository.save(adminUser);
      console.log('Đã tạo tài khoản admin');
    }
    // Tạo hoặc lấy user mẫu
    let user = await this.userRepository.findOne({ where: { email: 'sample@example.com' } });
    if (!user) {
      user = this.userRepository.create({
        name: 'Sample User',
        email: 'sample@example.com',
        password: 'hashed_password', // Thay bằng password băm trong thực tế
        isVerified: true,
      });
      await this.userRepository.save(user);
    }

    // Seed Projects
    let projectCount = await this.projectRepository.count();
    if (projectCount === 0) {
      const sampleProjects: Partial<Project>[] = [
        {
          title: 'E-commerce Platform',
          githubLink: 'https://github.com/sample/ecommerce',
          documentation: 'A full-stack e-commerce platform with payment integration and user authentication.',
          thumbnail: '/uploads/thumbnails/ecommerce.jpg',
          technologies: 'React, Node.js, PostgreSQL, Stripe',
          user,
          createdAt: new Date(),
        },
        {
          title: 'Task Management App',
          githubLink: 'https://github.com/sample/task-manager',
          documentation: 'A task management app with real-time collaboration features.',
          thumbnail: '/uploads/thumbnails/task-manager.jpg',
          technologies: 'Vue.js, NestJS, MongoDB, Socket.io',
          user,
          createdAt: new Date(),
        },
        {
          title: 'Personal Portfolio',
          githubLink: 'https://github.com/sample/portfolio',
          documentation: 'A personal portfolio website showcasing projects and skills.',
          thumbnail: '/uploads/thumbnails/portfolio.jpg',
          technologies: 'React, Tailwind CSS, Vite',
          user,
          createdAt: new Date(),
        },
      ];

      for (const projectData of sampleProjects) {
        const project = this.projectRepository.create(projectData);
        await this.projectRepository.save(project);
      }
      console.log('Seeded 3 sample projects');
    }

    // Seed BlogPosts
    let blogPostCount = await this.blogPostRepository.count();
    if (blogPostCount === 0) {
      const sampleBlogPosts: Partial<BlogPost>[] = [
        {
          title: 'Getting Started with NestJS',
          content: 'This blog post explores the basics of NestJS, a progressive Node.js framework for building efficient server-side applications.',
          author: user,
          createdAt: new Date(),
        },
        {
          title: 'Why React Hooks Are Awesome',
          content: 'React Hooks have revolutionized how we write functional components. Learn about useState, useEffect, and more.',
          author: user,
          createdAt: new Date(),
        },
      ];

      for (const blogPostData of sampleBlogPosts) {
        const blogPost = this.blogPostRepository.create(blogPostData);
        await this.blogPostRepository.save(blogPost);
      }
      console.log('Seeded 2 sample blog posts');
    }

    // Seed Hobbies
    let hobbyCount = await this.hobbyRepository.count();
    if (hobbyCount === 0) {
      const sampleHobbies: Partial<Hobby>[] = [
        {
          name: 'Photography',
          description: 'Capturing moments with a DSLR camera, focusing on nature and urban landscapes.',
          user,
          createdAt: new Date(),
        },
        {
          name: 'Hiking',
          description: 'Exploring mountain trails and enjoying the outdoors.',
          user,
          createdAt: new Date(),
        },
      ];

      for (const hobbyData of sampleHobbies) {
        const hobby = this.hobbyRepository.create(hobbyData);
        await this.hobbyRepository.save(hobby);
      }
      console.log('Seeded 2 sample hobbies');
    }
    // Seed Comments
    let commentCount = await this.commentRepository.count();
    if (commentCount === 0 && BlogPost.length > 0) {
      const sampleComments: Partial<Comment>[] = [
        {
          content: 'Great introduction to NestJS! Very helpful.',
          user,
          post: BlogPost[0],
          createdAt: new Date(),
        },
        {
          content: 'I love using React Hooks. Thanks for the insights!',
          user,
          post: BlogPost[1],
          createdAt: new Date(),
        },
      ];

      for (const commentData of sampleComments) {
        const comment = this.commentRepository.create(commentData);
        await this.commentRepository.save(comment);
      }
      console.log('Seeded 2 sample comments');
    }

    // Seed Studies
    let studyCount = await this.studyRepository.count();
    if (studyCount === 0) {
      const sampleStudies: Partial<Study>[] = [
        {
          title: 'Computer Science Degree',
          content: 'Completed a Bachelor’s degree in Computer Science, focusing on algorithms and software engineering.',
          author: user,
          createdAt: new Date(),
        },
        {
          title: 'Online Machine Learning Course',
          content: 'Studied machine learning concepts including neural networks and data preprocessing.',
          author: user,
          createdAt: new Date(),
        },
      ];

      for (const studyData of sampleStudies) {
        const study = this.studyRepository.create(studyData);
        await this.studyRepository.save(study);
      }
      console.log('Seeded 2 sample studies');
    }
  }
}