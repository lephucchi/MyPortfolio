import { Controller, Get, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './project.service';
import { Project } from '../entities/project.entity';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() projectData: Partial<Project>,
    @UploadedFile() thumbnailFile?: Express.Multer.File,
  ): Promise<Project> {
    return this.projectService.create(projectData, thumbnailFile);
  }
}