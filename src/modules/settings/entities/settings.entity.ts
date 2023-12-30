import { ApiProperty } from '@nestjs/swagger';

export class SettingsEntity {
  constructor(
    userId: number,
    appLanguage: string,
    trainingLanguage: string,
    notifications: boolean,
    voicing: boolean
  ) {
    this.user_id = userId;
    this.app_language = appLanguage;
    this.training_language = trainingLanguage;
    this.notifications = notifications;
    this.voicing = voicing;
  }

  @ApiProperty({ description: 'user identifier', nullable: true })
    user_id?: number;

  @ApiProperty({ description: 'interface language', nullable: true })
    app_language: string;

  @ApiProperty({ description: 'training language', nullable: true })
    training_language: string;

  @ApiProperty({ description: 'turn on pop-up notifications', nullable: true })
    notifications: boolean;

  @ApiProperty({ description: 'voicing the translation', nullable: true })
    voicing: boolean;

  @ApiProperty({ description: 'switch to dark mode', nullable: true })
    dark_mode: boolean;
}
