import { Controller, Post } from '@nestjs/common';
import { AppService } from './services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/upload')
  async upload() {
    return await this.appService.upload();
  }
}
