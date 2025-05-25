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

  findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id }, relations: ['user'] });
    if (!project) {
      throw new Error(`Project with id ${id} not found`);
    }
    return project;
  }

  async create(project: Project): Promise<Project> {
    return this.projectRepository.save(project);
  }

  async update(id: number, project: Partial<Project>): Promise<void> {
    await this.projectRepository.update(id, project);
  }

  async remove(id: number): Promise<void> {
    await this.projectRepository.delete(id);
  }
}