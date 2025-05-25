import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Study } from '../entities/study.entity';

@Injectable()
export class StudyService {
    constructor(
        @InjectRepository(Study)
        private studyRepository: Repository<Study>,
    ) {}

    findAll(): Promise<Study[]> {
        return this.studyRepository.find({ relations: ['user'] });
    }
    async findOne(id: number): Promise<Study> {
        const study = await this.studyRepository.findOne({ where: { id }, relations: ['user'] });
        if (!study) {
            throw new Error(`Study with id ${id} not found`);
        }
        return study;
    }

    async create(study: Study): Promise<Study> {
        return this.studyRepository.save(study);
    }
    async update(id: number, study: Partial<Study>): Promise<void> {
        await this.studyRepository.update(id, study);
    }
    async remove(id: number): Promise<void> {
        await this.studyRepository.delete(id);
    }
}