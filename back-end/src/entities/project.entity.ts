import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Reaction } from '../reacts/entities/react.entity';


@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  technologies: string;

  @Column({ nullable: true })
  githubLink: string; // Liên kết GitHub

  @Column({ type: 'text', nullable: true })
  documentation: string; // Tài liệu dự án

  @ManyToOne(() => User, (user) => user.projects)
  user: User;
  
  @OneToMany(() => Reaction, (reaction) => reaction.blogPost)
  reactions: Reaction[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}