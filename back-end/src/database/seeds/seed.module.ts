import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleSeed } from './sample.seed';
import { Project } from '../../entities/project.entity';
import { BlogPost } from '../../entities/blogpost.entity';
import { Hobby } from '../../entities/hobby.entity';
import { Study } from '../../entities/study.entity';
import { User } from '../../entities/user.entity';
import { Comment } from '../../entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, BlogPost, Hobby, Study, User, Comment])],
  providers: [SampleSeed],
  exports: [SampleSeed],
})
export class SeedModule {}