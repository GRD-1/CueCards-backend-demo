import { Module } from '@nestjs/common';
import { JwtService } from '@/modules/jwt/jwt.service';
import { TranslatorController } from './translator.controller';
import { TranslatorService } from './translator.service';

@Module({
  controllers: [TranslatorController],
  providers: [TranslatorService, JwtService],
})
export class TranslatorModule {}
