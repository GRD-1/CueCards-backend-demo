import { Client } from 'pg';
import { ObjectType } from '@/_types/types';

class DbHelper {
  private db: Client;
  private static instance: DbHelper;

  private constructor() {
    console.log('DbHelper instance created!');
  }

  static getInstance(): DbHelper {
    if (!DbHelper.instance) {
      DbHelper.instance = new DbHelper();
    }

    return DbHelper.instance;
  }

  async connect(): Promise<Client> {
    this.db = new Client(process.env.POSTGRES_URL);
    await this.db
      .connect()
      .then(() => console.log('Connected to PostgreSQL database successfully'))
      .catch((err) => {
        console.error('Error connecting to the database:', err);
        throw err;
      });

    return this.db;
  }

  async disconnect(): Promise<void> {
    await this.db.end();
  }

  async seed<T extends ObjectType>(tableName: string, data: T[]): Promise<ObjectType[]> {
    return await Promise.all(
      data.map(async (item) => {
        const keys = [...Object.keys(item)];
        const values = [...Object.values(item)];
        const keyPlaceholder = keys.map((key) => `"${key}"`).join(', ');
        const valPlaceholder = values.map((_, index) => `$${index + 1}`).join(', ');
        const q = `INSERT INTO ${tableName} (${keyPlaceholder}) VALUES (${valPlaceholder}) RETURNING *;`;

        const newCard = await this.db.query(q, values);

        return newCard.rows[0];
      }),
    );
  }

  async deleteRecords(tableName: string, idArray: number[]): Promise<void> {
    await this.db.query(`DELETE FROM "${tableName}" WHERE id = ANY($1)`, [idArray]);
    await this.db.query(`REINDEX TABLE "${tableName}"`);
    const query = `DO $$
                DECLARE 
                    max_id INT;
                BEGIN
                    -- Fetch the maximum ID from the table
                    SELECT MAX(id) + 1 INTO max_id FROM cards;
                    
                    -- Restart the sequence with the new value
                    EXECUTE format('ALTER SEQUENCE cards_id_seq RESTART WITH %s', max_id);
                END $$;`;
    await this.db.query(query);
  }
}
export default DbHelper.getInstance();
