import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { StudyService } from './study.service';
import { Study } from '../entities/study.entity';

@Controller('studies')
export class StudyController {
    constructor(private readonly studyService: StudyService) {}

    @Get()
    findAll(): Promise<Study[]> {
        return this.studyService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Study> {
        return this.studyService.findOne(+id);
    }

    @Post()
    create(@Body() study: Study): Promise<Study> {
        return this.studyService.create(study);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() study: Partial<Study>): Promise<void> {
        return this.studyService.update(+id, study);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.studyService.remove(+id);
    }
}