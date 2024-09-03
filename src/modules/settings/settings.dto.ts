import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class SettingsDto {
  @ApiProperty({ description: 'the application default language', nullable: false, example: 'ru' })
  @IsString()
  readonly appLanguage: string;

  @ApiProperty({ description: 'training default language', nullable: false, example: 'en' })
  @IsString()
  readonly trainingLanguage: string;

  @ApiProperty({ description: 'enable notifications', example: 'true' })
  @IsBoolean()
  readonly notifications: boolean;

  @ApiProperty({ description: 'enable hints', example: 'true' })
  @IsBoolean()
  readonly hints: boolean;

  @ApiProperty({ description: 'enable translation voicing', example: 'true' })
  @IsBoolean()
  readonly voicing: boolean;

  @ApiProperty({ description: 'enable the dark mode', example: 'true' })
  @IsBoolean()
  readonly darkMode: boolean;
}

export class SettingsRespDto extends SettingsDto {
  @ApiProperty({ description: 'user id', nullable: true, example: '00000000-0000-0000-0000-000000000000' })
  readonly userId: string;
}

export class UpdateSettingsDto extends PartialType(SettingsDto) {}
