import { Controller, Post, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './project.service';
import { Project } from '../entities/project.entity';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(
    @Body() projectData: Partial<Project>,
    @UploadedFile() thumbnailFile?: Express.Multer.File,
  ): Promise<Project> {
    const { id, ...restProjectData } = projectData;
    const newProjectData: Project = { 
      ...(restProjectData as Project), 
      thumbnail: thumbnailFile as any // Cast as needed or handle appropriately
    };
    return this.projectService.create(newProjectData);
  }
}