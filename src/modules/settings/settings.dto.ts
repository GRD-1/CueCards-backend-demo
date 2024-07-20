import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class SettingsDto {
  @ApiProperty({ description: 'the application default language', nullable: false, example: 'ru' })
  @IsString()
    appLanguage: string;

  @ApiProperty({ description: 'training default language', nullable: false, example: 'en' })
  @IsString()
    trainingLanguage: string;

  @ApiProperty({ description: 'enable notifications', example: 'true' })
  @IsBoolean()
    notifications: boolean;

  @ApiProperty({ description: 'enable hints', example: 'true' })
  @IsBoolean()
    hints: boolean;

  @ApiProperty({ description: 'enable translation voicing', example: 'true' })
  @IsBoolean()
    voicing: boolean;

  @ApiProperty({ description: 'enable the dark mode', example: 'true' })
  @IsBoolean()
    darkMode: boolean;
}

export class SettingsRespDto extends SettingsDto {
  @ApiProperty({ description: 'record id', nullable: true, example: 1 })
    id: number;

  @ApiProperty({ description: 'user id', nullable: true, example: 1 })
    userId: number;
}

export class UpdateSettingsDto extends PartialType(SettingsDto) {}
