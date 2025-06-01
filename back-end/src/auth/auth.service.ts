import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as nodemailer from 'nodemailer';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {
    // Cấu hình nodemailer để gửi email
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Hoặc dịch vụ email khác
      auth: {
        user: process.env.EMAIL_USER || 'your_email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your_email_password',
      },
    });
  }

  async register(name: string, email: string, password: string): Promise<{ message: string }> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({ name, email, password: hashedPassword });
    await this.userRepository.save(user);

    // Gửi email xác thực
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    await this.userRepository.update(user.id, { verificationCode }); // Giả sử có cột verificationCode trong User
    await this.transporter.sendMail({
      to: email,
      subject: 'Verify Your Email',
      text: `Your verification code is: ${verificationCode}`,
    });

    return { message: 'User registered successfully. Please verify your email.' };
  }

  // Trong auth.service.ts
  async login(email: string, password: string): Promise<{ access_token: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async verifyEmail(email: string, code: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || user.verificationCode !== code) {
      throw new BadRequestException('Invalid verification code');
    }

    await this.userRepository.update(user.id, { isVerified: true, verificationCode: undefined });
    return { message: 'Email verified successfully' };
  }
}