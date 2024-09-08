import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";

export class UserDto {
  @ApiProperty({ description: 'user email', nullable: false })
  @IsEmail()
  @Length(5, 255)
  @Transform(({ value }) => value.toLowerCase())
  readonly email: string;

  @ApiProperty({ description: 'user nickname', nullable: false })
  @IsNotEmpty()
  @IsString()
  @Length(1, 150)
  readonly nickname: string;

  @ApiProperty({ description: 'path to avatar image', nullable: true, example: '~/path/to/avatar.png' })
  @IsString()
  @IsOptional()
  readonly avatar: string | null;
}

export class UserRespDto {
  @ApiProperty({ description: 'id', nullable: false })
  readonly id: string;

  @ApiProperty({ description: 'email', nullable: false })
  readonly email: string;

  @ApiProperty({ description: 'nickname', nullable: false })
  readonly nickname: string | null;

  @ApiProperty({ description: 'avatar', nullable: true })
  readonly avatar: string | null;

  @ApiProperty({ description: 'is the registration confirmed', nullable: false })
  readonly confirmed: boolean;
}

export class UpdateUserDto {
  @ApiProperty({ description: 'user nickname', nullable: false })
  @IsString()
  @Length(1, 150)
  @IsOptional()
  readonly nickname: string;

  @ApiProperty({ description: 'path to avatar image', nullable: true, example: '~/path/to/avatar.png' })
  @IsString()
  @IsOptional()
  readonly avatar: string | null;
}
