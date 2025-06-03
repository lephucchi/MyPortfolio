import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { Hobby } from '../entities/hobby.entity';
import { Roles } from '../RoleBased/decorators/roles.decorators';
import { Role } from '../RoleBased/enum/roles.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../RoleBased/guards/auth.guard';
import { RoleGuard } from '../RoleBased/guards/role.guard';

@Controller('hobbies')
export class HobbyController {
  constructor(private readonly hobbyService: HobbyService) {}

  @Get()
  findAll(): Promise<Hobby[]> {
    return this.hobbyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Hobby> {
    return this.hobbyService.findOne(+id);
  }

  @Post()
  @Roles(Role.ADMIN, Role.MODERATOR) // Only allow ADMIN and MODERATOR roles to create blog posts
  @UseGuards(AuthGuard, RoleGuard) // Assuming you have AuthGuard and RoleGuard set up
  create(@Body() hobby: Hobby): Promise<Hobby> {
    return this.hobbyService.create(hobby);
  }

  @Put(':id')
  @Roles(Role.ADMIN, Role.MODERATOR) // Only allow ADMIN and MODERATOR roles to create blog posts
  @UseGuards(AuthGuard, RoleGuard) // Assuming you have AuthGuard and RoleGuard set up
  update(@Param('id') id: string, @Body() hobby: Partial<Hobby>): Promise<void> {
    return this.hobbyService.update(+id, hobby);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.MODERATOR) // Only allow ADMIN and MODERATOR roles to create blog posts
  @UseGuards(AuthGuard, RoleGuard) // Assuming you have AuthGuard and RoleGuard set up
  remove(@Param('id') id: string): Promise<void> {
    return this.hobbyService.remove(+id);
  }
}