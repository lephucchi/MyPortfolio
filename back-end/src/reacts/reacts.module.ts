import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReactionService } from './reacts.service';
import { ReactionController } from './reacts.controller';
import { Reaction } from './entities/react.entity';
import { BlogPost } from '../entities/blogpost.entity';
import { Project } from '../entities/project.entity';
import { User } from '../entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { SharedModule } from '../RoleBased/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reaction, BlogPost, Project, User]),
    AuthModule, 
    SharedModule, 
  ],
  controllers: [ReactionController],
  providers: [ReactionService],
})
export class ReactionModule {}