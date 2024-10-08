import { Body, Controller, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CCBK_ERR_TO_HTTP } from '@/filters/errors/cuecards-error.registry';
import { CardStatisticsService } from '@/modules/card-statistics/card-statistics.service';
import { UpdateStatsDto } from '@/modules/card-statistics/card-statistics.dto';
import { UserId } from '@/decorators/user-id.decorator';
import { AuthGuard } from '@/guards/auth.guard';

@ApiTags('card-statistics')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('card-statistics')
export class CardStatsController {
  constructor(private readonly cardStatsService: CardStatisticsService) {}

  @Patch(':cardId/update')
  @ApiOperation({ summary: 'Update a specific card statistics' })
  @ApiParam({ name: 'cardId', required: true, description: 'Card id' })
  @ApiBody({ type: UpdateStatsDto })
  @ApiOkResponse({ description: 'The card statistics has been updated', schema: { example: 123 } })
  @ApiBadRequestResponse({ description: 'Invalid data', schema: { example: CCBK_ERR_TO_HTTP.CCBK07 } })
  @ApiNotFoundResponse({ description: 'The record was not found', schema: { example: CCBK_ERR_TO_HTTP.CCBK05 } })
  @ApiUnauthorizedResponse({ description: 'Authorization is required', schema: { example: CCBK_ERR_TO_HTTP.CCBK02 } })
  async updateCardStatistics(
    @Param('cardId', ParseIntPipe) cardId: number,
    @Body() payload: UpdateStatsDto,
    @UserId() userId: string,
  ): Promise<void> {
    return this.cardStatsService.updateCardStatistics(cardId, userId, payload);
  }
}
