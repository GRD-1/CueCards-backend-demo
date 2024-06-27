import { ApiProperty } from '@nestjs/swagger';

export class BadRequestExample {
  @ApiProperty({ description: 'error happened', example: true })
    error: boolean;

  @ApiProperty({ description: 'http code', example: 400 })
    code: number;

  @ApiProperty({ description: 'error message', example: 'error message ...' })
    message: string;
}
