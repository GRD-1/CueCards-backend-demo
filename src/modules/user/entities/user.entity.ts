import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcryptjs';
// eslint-disable-next-line import/no-cycle
import { CardEntity } from '../../card/entities/card.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ description: 'user id', nullable: false })
  @PrimaryGeneratedColumn()
    id: number;

  @ApiProperty({ description: 'login', nullable: false })
  @Column({ unique: true })
    login: string;

  @ApiProperty({ description: 'email', nullable: false })
  @Column({ unique: true })
    email: string;

  @ApiProperty({ description: 'avatar', nullable: true })
  @Column({ nullable: true })
    avatar: string;

  @ApiProperty({ description: 'password hash', nullable: false })
  @Column({ select: false })
    password: string;

  @ApiProperty({ description: 'creation date', nullable: false })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

  @ApiProperty({ description: 'update date', nullable: false })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updateAt: Date;

  @ApiProperty({ description: 'has the record been marked for deletion', nullable: false })
  @Column({ default: false })
    deleteMark: boolean;

  @OneToMany(() => CardEntity, (card) => card.author)
    cards: CardEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }

  @BeforeUpdate()
  updateTimestamp(): void {
    this.updateAt = new Date();
  }
}
