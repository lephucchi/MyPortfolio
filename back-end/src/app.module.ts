import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ProjectModule } from './project/project.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { CommentModule } from './comment/comment.module';
import { HobbyModule } from './hobby/hobby.module';
import { StudyModule } from './study/study.module';
import { SeedModule } from './database/seeds/seed.module';
import { SampleSeed } from './database/seeds/sample.seed';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Chỉ dùng trong development
    }),
    UserModule,
    ProjectModule,
    BlogPostModule,
    CommentModule,
    HobbyModule,
    StudyModule,
    AuthModule,
    SeedModule,
  ],
})
export class AppModule {
  constructor(private readonly sampleSeed: SampleSeed) {}

  async onModuleInit() {
    if (process.env.NODE_ENV !== 'production') {
      await this.sampleSeed.seed();
    }
  }
}