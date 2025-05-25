import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: User[]; count: number }> {
    const [data, count] = await this.userRepository.findAndCount({
      relations: ['projects'], // download only the relations needed
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, count };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id },
      relations: ['projects'], // Chọn relations cần thiết
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    // Hash password trước khi lưu
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async update(
    id: number,
    updateData: Partial<Omit<User, 'id' | 'password'>>,
  ): Promise<User> {
    const user = await this.findOne(id); // Reuse findOne để check tồn tại
    Object.assign(user, updateData);
    return this.userRepository.save(user); // Sử dụng save() thay vì update() để trigger hooks
  }

  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Thêm method đặc biệt
  async findByEmail(email: string): Promise<User | undefined> {
    const foundUser = await this.userRepository.findOne({ where: { email } });
    if (!foundUser) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return foundUser;
  }
}