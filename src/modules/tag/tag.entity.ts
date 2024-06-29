import { ApiProperty } from '@nestjs/swagger';

export class TagEntity {
  @ApiProperty({ description: 'tag id', nullable: true })
    id?: number;

  @ApiProperty({ description: 'user id', nullable: true })
    authorId: number | null;

  @ApiProperty({ description: 'tag name', nullable: false })
    name: string;
}
