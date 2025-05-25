import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Hobby } from '../entities/hobby.entity';

@Injectable()
export class HobbyService {

    constructor(
        @InjectRepository(Hobby)
        private hobbyRepository: Repository<Hobby>,
    ) {}

    findAll(): Promise<Hobby[]> {
        return this.hobbyRepository.find({ relations: ['user'] });
    }
    async findOne(id: number): Promise<Hobby> {
        const hobby = await this.hobbyRepository.findOne({ where: { id }, relations: ['user'] });
        if (!hobby) {
            throw new Error(`Hobby with id ${id} not found`);
        }
        return hobby;
    }

    async create(hobby: Hobby): Promise<Hobby> {
        return this.hobbyRepository.save(hobby);
    }
    async update(id: number, hobby: Partial<Hobby>): Promise<void> {
        await this.hobbyRepository.update(id, hobby);
    }
    async remove(id: number): Promise<void> {
        await this.hobbyRepository.delete(id);
    }

}