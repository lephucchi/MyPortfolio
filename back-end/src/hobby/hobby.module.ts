import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hobby } from '../entities/hobby.entity';
import { HobbyController } from './hobby.controller';
import { HobbyService } from './hobby.service';
import { AuthModule } from 'src/auth/auth.module'; // Import AuthModule for authentication
import { SharedModule } from 'src/RoleBased/shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hobby]),
    AuthModule, // Import AuthModule for authentication
    SharedModule,
  ],
  controllers: [HobbyController],
  providers: [HobbyService],
})
export class HobbyModule {}