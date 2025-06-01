import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { BlogPost } from './blogpost.entity';
import { Project } from './project.entity';
import { Hobby } from './hobby.entity';
import { Study } from './study.entity';

@Entity()
export class Reaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // 'like', 'love', 'wow'

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => BlogPost, (blogPost) => blogPost.id, { nullable: true })
  blogPost: BlogPost;

  @ManyToOne(() => Project, (project) => project.id, { nullable: true })
  project: Project;

  @ManyToOne(() => Hobby, (hobby) => hobby.id, { nullable: true })
  hobby: Hobby;

  @ManyToOne(() => Study, (study) => study.id, { nullable: true })
  study: Study;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}