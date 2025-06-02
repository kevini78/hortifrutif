import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result; // Return user object without password
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const payload = { email: user.email, sub: user.id, name: user.name }; // Include necessary user info in payload
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // Placeholder for password recovery logic
  async requestPasswordRecovery(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      // Don't reveal if user exists for security reasons
      console.log(`Password recovery requested for non-existent email: ${email}`);
    } else {
      // In a real app: generate a unique token, store it with expiration, send email
      console.log(`Password recovery requested for user: ${user.email}. Token generation/email sending would happen here.`);
    }
    // Always return a generic message
    return { message: 'Se um usuário com este email existir, um link de recuperação foi enviado.' };
  }

  // Placeholder for password reset logic
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    // In a real app: validate token, find user, update password, invalidate token
    console.log(`Password reset attempt with token: ${token}. Validation and update would happen here.`);
    // For now, just a placeholder response
    if (!token || !newPassword) { // Basic check
        throw new UnauthorizedException('Token ou nova senha inválidos.');
    }
    return { message: 'Senha redefinida com sucesso (simulação).' };
  }

}