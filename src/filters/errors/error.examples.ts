import { ApiProperty } from '@nestjs/swagger';

export class BadRequestExample {
  @ApiProperty({ description: 'http response status', example: 400 })
    httpStatus: boolean;

  @ApiProperty({ description: 'internal error code', example: 400 })
    errorCode: number;

  @ApiProperty({ description: 'error message', example: 'error message ...' })
    errorMsg: string;
}
