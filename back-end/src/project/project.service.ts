import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from './dto/createProject.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['user'] });
  }

  async findById(id: number): Promise<Project>{
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return project;
  }

  async create(
    projectDto: CreateProjectDto,
  ): Promise<Project> {
    const project = this.projectRepository.create({
      ...projectDto,
    });

    return this.projectRepository.save(project);
  }

  async update(
    id: number,
    projectDto: Partial<CreateProjectDto>,
  ): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    await this.projectRepository.update(id, {
      ...projectDto,
      technologies: projectDto.technologies
        ? Array.isArray(projectDto.technologies)
          ? projectDto.technologies.join(',') // join array to string
          : projectDto.technologies
        : project.technologies,
    });
  }
  async remove(id: number): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    await this.projectRepository.delete(id);
  }
}