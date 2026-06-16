import { Pool, QueryResult, QueryResultRow } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function initDB(): Promise<void> {
  await query(`
    CREATE TABLE IF NOT EXISTS authors (
      id   SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      bio  TEXT
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS books (
      id        SERIAL PRIMARY KEY,
      title     VARCHAR(255) NOT NULL,
      year      INTEGER,
      author_id INTEGER REFERENCES authors(id) ON DELETE CASCADE
    )
  `);

  console.log('Database tables initialised.');
}
