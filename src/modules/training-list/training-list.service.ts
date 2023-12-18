import { Body, Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { UpdateTrainingListDto } from './dto/update-training-list.dto';

@Injectable()
export class TrainingListService {
  async findAll(): Promise<string> {
    return 'these is all available training lists';
  }

  async findOne(@Param('listId', new ParseIntPipe()) listId: number): Promise<string> {
    return `the training list with id = ${listId}`;
  }

  async update(@Param('listId') listId: number, @Body() dto: UpdateTrainingListDto): Promise<string> {
    return `the training list with id = ${listId} has been updated!`;
  }
}
