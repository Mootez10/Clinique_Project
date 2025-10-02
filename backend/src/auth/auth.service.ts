import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string, tenantId: string, role: string) {
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.create({
      email,
      password: hashed,
      role,
      tenantId,
    });
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: payload,
    };
  }
}
