import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Project } from './project.entity';
import { BlogPost } from './blogpost.entity';
import { Comment } from './comment.entity';
import { Hobby } from './hobby.entity';
import { Study } from './study.entity';
import { Reaction } from '../reacts/entities/react.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationCode: string;

  @Column({ default: 'user' })
  role: string; // 'user' hoặc 'admin'

  @Column({ nullable: true, unique: true })
  githubId: string; // ID GitHub

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => BlogPost, (blogPost) => blogPost.author)
  blogPosts: BlogPost[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Hobby, (hobby) => hobby.user)
  hobbies: Hobby[];

  @OneToMany(() => Study, (study) => study.author)
  studies: Study[];

  @OneToMany(() => Reaction, (reaction) => reaction.user)
  reactions: Reaction[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}