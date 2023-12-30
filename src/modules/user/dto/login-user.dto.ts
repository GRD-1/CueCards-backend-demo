import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'login', nullable: false })
  @IsNotEmpty()
  readonly login: string;

  @ApiProperty({ description: 'password', nullable: false })
  @IsNotEmpty()
  readonly password: string;
}
