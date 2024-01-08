import { ApiProperty } from '@nestjs/swagger';
import { BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CardEntity } from './card.entity';

@Entity({ name: 'languages' })
export class LanguageEntity {
  @ApiProperty({ description: 'card identifier', nullable: true })
  @PrimaryGeneratedColumn()
    id: number;

  @ApiProperty({ description: 'language', nullable: false })
  @Column()
    name: string;

  @ApiProperty({ description: 'language acronym', nullable: false })
  @Column()
    acronym: string;

  @OneToMany(() => CardEntity, (card) => card.author)
    cards: CardEntity[];

  @ApiProperty({ description: 'creation date', nullable: false })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

  @ApiProperty({ description: 'update date', nullable: false })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateAt: Date;

  @ApiProperty({ description: 'has the record been marked for deletion', nullable: false })
  @Column({ default: false })
    deleteMark: boolean;

  @BeforeUpdate()
  updateTimestamp(): void {
    this.updateAt = new Date();
  }
}
