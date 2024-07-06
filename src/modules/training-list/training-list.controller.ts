import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TrainingListEntity } from './entities/training-list.entity';
import { UpdateTrainingListDto } from './dto/update-training-list.dto';
import { TrainingListService } from './training-list.service';

@ApiTags('training/training-list')
@Controller('training/training-list')
export class TrainingListController {
  constructor(private readonly trainingListService: TrainingListService) {}

  @Get()
  @ApiOperation({ summary: 'Get all training lists' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TrainingListEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findAll(): Promise<string> {
    return this.trainingListService.findAll();
  }

  @Get(':listId')
  @ApiOperation({ summary: 'Get a specific training list' })
  @ApiParam({ name: 'listId', required: true, description: 'training list identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TrainingListEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async findOne(@Param('listId', new ParseIntPipe()) listId: number): Promise<string> {
    return this.trainingListService.findOne(listId);
  }

  @Patch(':listId')
  @ApiOperation({ summary: 'Update the specified training list' })
  @ApiParam({ name: 'listId', required: true, description: 'training list identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TrainingListEntity })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  async update(@Param('listId') listId: number, @Body() dto: UpdateTrainingListDto): Promise<string> {
    return this.trainingListService.update(listId, dto);
  }
}
