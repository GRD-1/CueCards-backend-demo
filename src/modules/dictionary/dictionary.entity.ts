import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class DictionaryEntity {
  @ApiProperty({ description: 'dictionary id', nullable: true })
    id?: number;

  @ApiProperty({ description: 'user id', nullable: true })
    authorId: number | null;

  @ApiProperty({ description: 'dictionary title', nullable: false })
  @IsString()
    title: string;

  @ApiProperty({ description: 'dictionary tags', nullable: true })
  @IsArray()
  @IsString({ each: true })
    tags: string[];
}
