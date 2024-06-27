import { ApiProperty } from '@nestjs/swagger';

export class TagEntity {
  @ApiProperty({ description: 'tag id', nullable: true })
    id?: number;

  @ApiProperty({ description: 'user id', nullable: true })
    authorId: number | null;

  @ApiProperty({ description: 'tag name', nullable: false })
    name: string;

  @ApiProperty({ description: 'creation date', nullable: false })
    createdAt: Date;

  @ApiProperty({ description: 'update date', nullable: false })
    updatedAt: Date;

  @ApiProperty({ description: 'has the record been marked for deletion', nullable: false })
    deleteMark: boolean;
}
