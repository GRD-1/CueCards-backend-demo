import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcryptjs';

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

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }
}
