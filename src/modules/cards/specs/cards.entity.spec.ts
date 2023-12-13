import { CardsEntity } from '../entities/cards.entity';

describe('CardsModel', () => {
  it('should be defined', () => {
    expect(new CardsEntity()).toBeDefined();
  });
});
