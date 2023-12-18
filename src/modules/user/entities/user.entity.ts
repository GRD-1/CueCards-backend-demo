import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  constructor(
    userId: number,
    login: string,
    email: string,
    avatar?: string,
    passwordHash?: string,
    refreshToken?: string,
    salt?: string
  ) {
    this.user_id = userId;
    this.login = login;
    this.email = email;
    this.avatar = avatar;
    this.passwordHash = passwordHash;
    this.refreshToken = refreshToken;
    this.salt = salt;
  }
  @ApiProperty({ description: 'user id', nullable: true })
    user_id?: number;

  @ApiProperty({ description: 'login', nullable: true })
    login: string;

  @ApiProperty({ description: 'email', nullable: true })
    email: string;

  @ApiProperty({ description: 'avatar', nullable: true })
    avatar?: string;

  @ApiProperty({ description: 'password hash', nullable: true })
    passwordHash?: string;

  @ApiProperty({ description: 'refresh token', nullable: true })
    refreshToken?: string;

  @ApiProperty({ description: 'salt', nullable: true })
    salt?: string;
}
