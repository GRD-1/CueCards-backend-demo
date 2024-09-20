import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ description: 'interface language', nullable: true })
  @IsString()
    app_language: string;

  @ApiProperty({ description: 'training language', nullable: true })
  @IsString()
    training_language: string;

  @ApiProperty({ description: 'turn on pop-up notifications', nullable: true })
  @IsBoolean()
    notifications: boolean;

  @ApiProperty({ description: 'voicing the translation', nullable: true })
  @IsBoolean()
    voicing: boolean;

  @ApiProperty({ description: 'switch to dark mode', nullable: true })
  @IsBoolean()
    dark_mode: boolean;
}
