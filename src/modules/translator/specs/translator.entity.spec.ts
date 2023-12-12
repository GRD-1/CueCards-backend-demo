import { TranslatorEntity } from '../entities/translator.entity';

describe('TranslatorModel', () => {
  it('should be defined', () => {
    expect(new TranslatorEntity()).toBeDefined();
  });
});
