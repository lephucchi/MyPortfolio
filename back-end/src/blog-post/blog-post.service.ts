import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogPost } from '../entities/blogpost.entity';

@Injectable()
export class BlogPostService {
    constructor(
        @InjectRepository(BlogPost)
        private readonly blogPostRepository: Repository<BlogPost>,
    ) {}

    findAll(): Promise<BlogPost[]> {
        return this.blogPostRepository.find();
    }
    async findOne(id: number): Promise<BlogPost> {
        const post = await this.blogPostRepository.findOne({ where: { id } });
        if (!post) {
            throw new Error(`Post with ID ${id} not found`);
        }
        return post;
    }
    async create(post: Partial<BlogPost>): Promise<BlogPost> {
        const newPost = this.blogPostRepository.create(post);
        return this.blogPostRepository.save(newPost);
    }
    async update(id: number, post: Partial<BlogPost>): Promise<BlogPost> {
        await this.blogPostRepository.update(id, post);
        return this.findOne(id);
    }
    async remove(id: number): Promise<void> {
        const result = await this.blogPostRepository.delete(id);
        if (result.affected === 0) {
            throw new Error(`Post with ID ${id} not found`);
        }
    }
}