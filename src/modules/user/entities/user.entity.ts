import { ApiProperty } from '@nestjs/swagger';
import { hash } from 'bcryptjs';
import { CardEntity } from '../../card/entities/card.entity';

export class UserEntity {
  @ApiProperty({ description: 'user id', nullable: false })
  id: number;

  @ApiProperty({ description: 'login', nullable: true })
  nickname: string;

  @ApiProperty({ description: 'email', nullable: false })
  email: string;

  @ApiProperty({ description: 'avatar', nullable: true })
  avatar: string;

  @ApiProperty({ description: 'password hash', nullable: false })
  password: string;

  @ApiProperty({ description: 'creation date', nullable: false })
  createdAt: Date;

  @ApiProperty({ description: 'update date', nullable: false })
  updateAt: Date;

  @ApiProperty({ description: 'has the record been marked for deletion', nullable: false })
  deleteMark: boolean;

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword(): Promise<void> {
  //   this.password = await hash(this.password, 10);
  // }
  //
  // @BeforeUpdate()
  // updateTimestamp(): void {
  //   this.updateAt = new Date();
  // }
}
