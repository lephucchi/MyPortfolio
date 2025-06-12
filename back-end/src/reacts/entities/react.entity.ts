import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../entities/user.entity';
import { BlogPost } from '../../entities/blogpost.entity';
import { Project } from '../../entities/project.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'] })
  type: string;

  @ManyToOne(() => User, (user) => user.reactions)
  user: User;

  @ManyToOne(() => BlogPost, (blogPost) => blogPost.reactions, { nullable: true })
  blogPost: BlogPost;

  @ManyToOne(() => Project, (project) => project.reactions, { nullable: true })
  project: Project;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}