import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { AppService } from '../services/app.service';
import { CreateMeasureData } from '../dtos/CreateMeasureData.dto';
import { GlobalExceptionFilter } from '../config/GlobalExceptionFilter';
import { MeasureType } from '@prisma/client';
import { UpdateMeasureData } from 'src/dtos/UpdateMeasureData.dto';
import ListLeitura from 'src/dtos/ListLeitura.dto';
import CreatedMeasure from 'src/dtos/CreatedMeasure.dto';

@Controller('/')
@UseFilters(GlobalExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  async upload(@Body() data: CreateMeasureData): Promise<CreatedMeasure> {
    return await this.appService.upload(data);
  }

  @Patch('confirm')
  async confirm(@Body() data: UpdateMeasureData) {
    await this.appService.confirm(data);
    return { success: true };
  }

  @Get(':customerCode/list')
  async list(
    @Param('customerCode') customerCode: string,
    @Query('measureType') measureType?: MeasureType,
  ): Promise<ListLeitura[]> {
    return await this.appService.list({ customerCode, measureType });
  }
}
