import { ApiProperty } from '@nestjs/swagger';

export class LanguageEntity {
  @ApiProperty({ description: 'card identifier', nullable: true })
    id: number;

  @ApiProperty({ description: 'language', nullable: false })
    name: string;

  @ApiProperty({ description: 'language acronym', nullable: false })
    acronym: string;

  @ApiProperty({ description: 'creation date', nullable: false })
    createdAt: Date;

  @ApiProperty({ description: 'update date', nullable: false })
    updateAt: Date;

  @ApiProperty({ description: 'has the record been marked for deletion', nullable: false })
    deleteMark: boolean;
}
