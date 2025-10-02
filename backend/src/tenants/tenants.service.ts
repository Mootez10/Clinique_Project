import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  create(name: string) {
    return this.prisma.tenant.create({ data: { name } });
  }

  findAll() {
    return this.prisma.tenant.findMany();
  }
}
