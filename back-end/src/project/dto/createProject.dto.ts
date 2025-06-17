import { IsArray, IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  technologies: string;

  @IsOptional()
  @IsUrl()
  githubLink?: string; // Liên kết GitHub

  @IsOptional()
  @IsString()
  documentation?: string; // Tài liệu dự án
}