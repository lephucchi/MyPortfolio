import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { Hobby } from '../entities/hobby.entity';

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
  create(@Body() hobby: Hobby): Promise<Hobby> {
    return this.hobbyService.create(hobby);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() hobby: Partial<Hobby>): Promise<void> {
    return this.hobbyService.update(+id, hobby);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.hobbyService.remove(+id);
  }
}