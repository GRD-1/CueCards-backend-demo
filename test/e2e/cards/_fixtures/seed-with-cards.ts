import dbHelper from '@/e2e/_fixtures/db-helper';
import { CardInterface } from '@/modules/card/card.interface';

export default async (data: CardInterface[], authorId: string): Promise<CardInterface[]> => {
  const db = await dbHelper.connect();

  for (const item of data) {
    const cardKeys = [...Object.keys(item), 'authorId'];
    const cardValues = [...Object.values(item), authorId];
    const keysPlaceholder = cardKeys.map((key) => `"${key}"`).join(', ');
    const valuesPlaceholder = cardValues.map((_, index) => `$${index + 1}`).join(', ');

    await db.query(`INSERT INTO cards (${keysPlaceholder}) VALUES (${valuesPlaceholder});`, cardValues);
  }

  return data;
};
