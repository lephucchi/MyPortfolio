import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hobby } from '../entities/hobby.entity';
import { HobbyController } from './hobby.controller';
import { HobbyService } from './hobby.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hobby])],
  controllers: [HobbyController],
  providers: [HobbyService],
})
export class HobbyModule {}