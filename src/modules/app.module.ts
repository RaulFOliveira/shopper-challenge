import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { PrismaModule } from './prisma.module';
import { IsBrazilianDateValidator } from 'src/validators/IsBrazilianDate.validator';

@Module({
  imports: [PrismaModule],
  controllers: [AppController],
  providers: [AppService, IsBrazilianDateValidator],
})
export class AppModule {}
