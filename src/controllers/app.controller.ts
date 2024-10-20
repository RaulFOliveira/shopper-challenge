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

@Controller('/')
@UseFilters(GlobalExceptionFilter)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  async upload(@Body() data: CreateMeasureData) {
    return await this.appService.upload(data);
  }

  @Patch('confirm')
  async confirm(@Body() data: UpdateMeasureData) {
    return await this.appService.confirm(data);
  }

  @Get(':customerCode/list')
  async list(
    @Param('customerCode') customerCode: string,
    @Query('measureType') measureType?: MeasureType,
  ): Promise<any> {
    return await this.appService.list({ customerCode, measureType });
  }
}
