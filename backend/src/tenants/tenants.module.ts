import { Module } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [TenantsService, PrismaService],
  controllers: [TenantsController],
})
export class TenantsModule {}
