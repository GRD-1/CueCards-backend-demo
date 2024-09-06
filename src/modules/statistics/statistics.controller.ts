import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import {
  GetLastResultsDto,
  GetManyStatsDto,
  GetManyStatsRespDto,
  StatisticsDto,
  StatisticsRespDto,
} from '@/modules/statistics/statistics.dto';
import { UserId } from '@/decorators/user-id.decorator';
import { AuthGuard } from '@/guards/auth.guard';
import { StatisticsService } from './statistics.service';

@ApiTags('statistics')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new statistics record' })
  @ApiBody({ type: StatisticsDto })
  @ApiCreatedResponse({ description: 'The new statistics record has been created. The id:', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Bad request', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  async create(@Body() payload: StatisticsDto, @UserId() userId: string): Promise<number> {
    return this.statisticsService.create({ ...payload, userId });
  }

  @Get()
  @ApiOperation({ summary: 'Get the statistics according to the conditions' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'page number' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'number of records per page' })
  @ApiQuery({ name: 'dictionaryId', required: false, type: Number, description: 'dictionary id' })
  @ApiQuery({ name: 'selectionStart', required: false, type: Date, description: 'start of selection' })
  @ApiQuery({ name: 'selectionEnd', required: false, type: Date, description: 'end of selection' })
  @ApiOkResponse({ description: 'Successful request', type: GetManyStatsRespDto })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async findMany(@Query() query: GetManyStatsDto, @UserId() userId: string): Promise<GetManyStatsRespDto> {
    return this.statisticsService.findMany({ ...query, userId });
  }

  @Get('last-results')
  @ApiOperation({ summary: 'Get the statistics according to the conditions' })
  @ApiQuery({ name: 'dictionaryId', required: false, type: Number, description: 'dictionary id' })
  @ApiOkResponse({ description: 'Successful request', type: [StatisticsRespDto] })
  @ApiBadRequestResponse({ description: 'Invalid request params', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  async getLastResults(@Query() query: GetLastResultsDto, @UserId() userId: string): Promise<StatisticsRespDto[]> {
    return this.statisticsService.getLastResults({ ...query, userId });
  }
}
