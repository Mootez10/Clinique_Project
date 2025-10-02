import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service'



@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
      private prisma: PrismaService
  ) {}

  async register(fullName: string, email: string, password: string) {
  const hashed = await bcrypt.hash(password, 10)

  // For simplicity, assign patient to the first tenant
  let tenant = await this.prisma.tenant.findFirst()
  if (!tenant) {
    tenant = await this.prisma.tenant.create({ data: { name: "Patient Clinic" } })
  }

  return this.usersService.create({
    fullName,
    email,
    password: hashed,
    role: "PATIENT", // always patient
    tenantId: tenant.id,
  })
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
