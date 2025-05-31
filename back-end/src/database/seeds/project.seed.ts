import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class ProjectSeed {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seed() {
    // Kiểm tra xem đã có dữ liệu chưa
    const count = await this.projectRepository.count();
    if (count > 0) {
      console.log('Projects already seeded, skipping...');
      return;
    }

    // Tìm hoặc tạo user mẫu
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

    // Dữ liệu dự án mẫu
    const sampleProjects: Partial<Project>[] = [
      {
        title: 'Music Platform',
        githubLink: 'https://github.com/lephucchi/music_platform',
        documentation: 'A full-stack music platform take ideal from soundclound.',
        thumbnail: '/uploads/thumbnails/musicplatform.jpg',
        technologies: 'React, Rust, Tailwincss, PostgreSQL, Axum, Tokio, Authentication',
        user,
        createdAt: new Date(),
      },
      {
        title: 'Task Management App',
        githubLink: 'https://github.com/lephucchi/Blockchain-Dapp',
        documentation: 'A decentralized application (DApp) for a simple voting system built on the Ethereum blockchain. It includes a smart contract written in Solidity and a frontend built with React and ethers.js.',
        thumbnail: '/uploads/thumbnails/task-manager.jpg',
        technologies: 'Node.js, Solidity, Metamask, hardhat, React',
        user,
        createdAt: new Date(),
      },
      {
        title: 'Personal Portfolio',
        githubLink: 'https://github.com/sample/portfolio',
        documentation: 'A personal portfolio website showcasing projects and skills.',
        thumbnail: '/uploads/thumbnails/portfolio.jpg',
        technologies: 'React, Tailwind CSS, Vite, TypeScript, NestJs ,NodeJs',
        user,
        createdAt: new Date(),
      },
    ];

    // Chèn dữ liệu
    for (const projectData of sampleProjects) {
      const project = this.projectRepository.create(projectData);
      await this.projectRepository.save(project);
    }

    console.log('Seeded 3 sample projects');
  }
}