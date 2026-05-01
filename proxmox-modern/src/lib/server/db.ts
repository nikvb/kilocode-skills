import pg from 'pg';

let _pool: pg.Pool | null = null;
let _ensured = false;

export function getPool(): pg.Pool | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (_pool) return _pool;
  _pool = new pg.Pool({ connectionString: url, max: 5 });
  return _pool;
}

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = []
): Promise<pg.QueryResult<T> | null> {
  const pool = getPool();
  if (!pool) return null;
  return pool.query<T>(text, params as never[]);
}

export async function ensureLeadsTable(): Promise<void> {
  if (_ensured) return;
  const pool = getPool();
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id text primary key,
      created_at timestamptz default now(),
      name text,
      email text,
      company text,
      cpus int,
      inquiry text,
      message text
    )
  `);
  _ensured = true;
}
