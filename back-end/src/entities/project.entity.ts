import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
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
  thumbnail: string; // Đường dẫn đến ảnh thumbnail

  @Column({ nullable: true })
  githubLink: string; // Liên kết GitHub

  @Column({ type: 'text', nullable: true })
  documentation: string; // Tài liệu dự án

  @ManyToOne(() => User, (user) => user.projects)
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}