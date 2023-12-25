import { ApiProperty } from '@nestjs/swagger';
import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcryptjs';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ description: 'user id', nullable: false })
  @PrimaryGeneratedColumn()
    id: number;

  @ApiProperty({ description: 'login', nullable: false })
  @Column()
    login: string;

  @ApiProperty({ description: 'email', nullable: false })
  @Column()
    email: string;

  @ApiProperty({ description: 'avatar', nullable: true })
  @Column({ nullable: true })
    avatar: string;

  @ApiProperty({ description: 'password hash', nullable: false })
  @Column()
    password: string;

  @ApiProperty({ type: 'text', description: 'refresh token', nullable: true })
  @Column({ nullable: true })
    refreshToken: string;

  @ApiProperty({ type: 'text', description: 'salt', nullable: true })
  @Column({ nullable: true })
    salt: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    this.password = await hash(this.password, 10);
  }
}
