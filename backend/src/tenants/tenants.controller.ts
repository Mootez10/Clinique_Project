import { Body, Controller, Get, Post } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private tenantsService: TenantsService) {}

  @Post()
  create(@Body() body: any) {
    return this.tenantsService.create(body.name);
  }

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }
}
