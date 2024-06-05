import { CardEntity } from '../entities/card.entity';

export type CardResponseType = Omit<CardEntity, 'createdAt' | 'updateAt' | 'deleteMark'>
