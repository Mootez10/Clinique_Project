import { 
  Controller, Get, Post, Body, Put, Param, Delete, 
  ParseIntPipe, HttpCode, HttpStatus, Query
} from '@nestjs/common';
import { UpdateMedicationDto } from './dto/update-medication.dto';
import { Medication } from './entities/medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { MedicationsService, MedicationStats } from './medications.service';

@Controller('medications')
export class MedicationsController {
  logger: any;
  constructor(private readonly medicationsService: MedicationsService) {}

  @Get()
  async findAll(
    @Query('search') search?: string,
    @Query('category') category?: string
  ): Promise<Medication[]> {
    return await this.medicationsService.findAll(search, category);
  }

  @Get('stats')
  async getStats(): Promise<MedicationStats> {
    return await this.medicationsService.getStats();
  }

  @Get('categories')
@HttpCode(HttpStatus.OK)
async getCategories(): Promise<string[]> {
  try {
    return await this.medicationsService.getCategories();
  } catch (error) {
    this.logger.warn('getCategories failed, returning empty array');
    return []; // ← Toujours 200 + []
  }
}

  @Get('low-stock')
  async findLowStock(): Promise<Medication[]> {
    return await this.medicationsService.getLowStock();
  }

  @Get('out-of-stock')
  async findOutOfStock(): Promise<Medication[]> {
    return await this.medicationsService.getOutOfStock();
  }

  @Get('expiring-soon')
  async findExpiringSoon(): Promise<Medication[]> {
    return await this.medicationsService.getExpiringSoon();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Medication> {
    return await this.medicationsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMedicationDto: CreateMedicationDto): Promise<Medication> {
    return await this.medicationsService.create(createMedicationDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMedicationDto: UpdateMedicationDto,
  ): Promise<Medication> {
    return await this.medicationsService.update(id, updateMedicationDto);
  }

  @Put(':id/stock')
  async updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { quantity: number },
  ): Promise<Medication> {
    return await this.medicationsService.updateStock(id, body.quantity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.medicationsService.remove(id);
  }
}