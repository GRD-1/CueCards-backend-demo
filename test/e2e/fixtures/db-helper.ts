import { Client } from 'pg';
import { execSync } from 'child_process';

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

  async prepare(): Promise<void> {
    const connection = await this.connect();
    await connection.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await connection.query('CREATE SCHEMA public;');
    await this.disconnect();

    execSync(`POSTGRES_URL=${process.env.POSTGRES_URL} npx prisma db push --accept-data-loss`, { stdio: 'inherit' });
    execSync(`POSTGRES_URL=${process.env.POSTGRES_URL} npx @snaplet/seed sync`, { stdio: 'inherit' });
    execSync(`POSTGRES_URL=${process.env.POSTGRES_URL} npx prisma db seed`, { stdio: 'inherit' });
  }
}
export default DbHelper.getInstance();
