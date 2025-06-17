import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './project.service';
import { Project } from '../entities/project.entity';
import { AuthGuard } from '../RoleBased/guards/auth.guard';
import { Role } from 'src/RoleBased/enum/roles.enum';
import { RoleGuard } from 'src/RoleBased/guards/role.guard';
import { CreateProjectDto } from './dto/createProject.dto';
import { Roles } from 'src/RoleBased/decorators/roles.decorators';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }
  @Get(':id')
  async findById(@Param('id') id: number): Promise<Project> {
    return this.projectService.findById(id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(AuthGuard, RoleGuard)
  async create(
    @Body() projectData: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.create(projectData);
  }

  @Post('update/:id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards( AuthGuard, RoleGuard)
  async update(
    @Param('id') id: number,
    @Body() projectData: Partial<CreateProjectDto>,
  ): Promise<void> {
    return this.projectService.update(id, projectData);
  }
  
  @Post('remove/:id')
  @Roles(Role.ADMIN, Role.MODERATOR)
  @UseGuards(AuthGuard, RoleGuard)
  async remove(@Param('id') id: number): Promise<void> {
    return this.projectService.remove(id);
  }
} 