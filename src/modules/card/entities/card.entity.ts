import { ApiProperty } from '@nestjs/swagger';
import { BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { UserEntity } from '../../user/entities/user.entity';

@Entity({ name: 'cards' })
export class CardEntity {
  @ApiProperty({ description: 'card identifier', nullable: true })
  @PrimaryGeneratedColumn()
    id: number;

  @ApiProperty({ description: 'front side language', nullable: false })
  @Column()
    fsLanguage: number;

  @ApiProperty({ description: 'front side value', nullable: false })
  @Column()
    fsValue: string;

  @ApiProperty({ description: 'description for the front side value: proverb, swearing e.t.c', default: '' })
  @Column({ default: '' })
    fsDescription: string;

  @ApiProperty({ description: 'front side value translation variants', nullable: true })
  @Column('simple-array')
    fsMeaningVariants: string[];

  @ApiProperty({ description: 'front side wrong value meanings', nullable: true })
  @Column('simple-array')
    fsWrongMeanings: string[];

  @ApiProperty({ description: 'front side value transcription', nullable: false })
  @Column()
    fsTranscription: string;

  @ApiProperty({ description: 'front side value synonyms', nullable: true })
  @Column('simple-array')
    fsSynonyms: string[];

  @ApiProperty({ description: 'front side audio', nullable: true })
  @Column()
    fsAudio: string;

  @ApiProperty({ description: 'back side language', nullable: false })
  @Column()
    bsLanguage: number;

  @ApiProperty({ description: 'back side value', nullable: false })
  @Column()
    bsValue: string;

  @ApiProperty({ description: 'description for the back side value: proverb, swearing e.t.c', nullable: false })
  @Column({ default: '' })
    bsDescription: string;

  @ApiProperty({ description: 'back side value translation variants', nullable: true })
  @Column('simple-array')
    bsMeaningVariants: string[];

  @ApiProperty({ description: 'back side wrong value meanings', nullable: true })
  @Column('simple-array')
    bsWrongMeanings: string[];

  @ApiProperty({ description: 'back side value transcription', nullable: false })
  @Column()
    bsTranscription: string;

  @ApiProperty({ description: 'back side value synonyms', nullable: true })
  @Column('simple-array')
    bsSynonyms: string[];

  @ApiProperty({ description: 'back side audio', nullable: true })
  @Column()
    bsAudio: string;

  @ApiProperty({ description: 'tag list', nullable: true })
  @Column('simple-array')
    tags: string[];

  @ApiProperty({ description: 'author identifier', nullable: false })
  @ManyToOne(() => UserEntity, (user) => user.cards)
    author: UserEntity;

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
