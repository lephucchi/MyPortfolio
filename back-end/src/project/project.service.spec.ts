import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(projectData: Partial<Project>, thumbnailFile?: Express.Multer.File): Promise<Project> {
    if (thumbnailFile) {
      projectData.thumbnail = `/uploads/thumbnails/${thumbnailFile.filename}`;
    }
    const project = this.projectRepository.create(projectData);
    return this.projectRepository.save(project);
  }
}