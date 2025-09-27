import { Pool } from "pg";

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = parseInt(process.env.DB_PORT || "5432", 10);
const dbName = process.env.DB_NAME || "document";
const dbUser = process.env.DB_USER || "postgres";
const dbPassword = process.env.DB_PASSWORD || "motdepasse";

export const pool = new Pool({
    host: dbHost,
    port: dbPort,
    database: dbName,
    user: dbUser,
    password: dbPassword,
});

export async function initDb(): Promise<void> {
  // Ensure table exists with correct schema. If an older schema exists (uuid type), migrate if empty.
  await pool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      uuid INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      code INTEGER NOT NULL,
      class_code_display_name TEXT NOT NULL,
      loinc INTEGER NOT NULL,
      type_code_display_name TEXT NOT NULL
    )
  `);

  // Detect legacy schema where uuid column is of type UUID
  const colInfo = await pool.query(
    `SELECT data_type, udt_name
     FROM information_schema.columns
     WHERE table_name = 'documents' AND column_name = 'uuid'`
  );

  if (colInfo.rows.length > 0) {
    const dataType: string = colInfo.rows[0].data_type;
    const udtName: string = colInfo.rows[0].udt_name;

    if (udtName === 'uuid' || dataType === 'uuid') {
      // If default is NULL, try to set an automatic default so inserts work without providing uuid
      const defaultInfo = await pool.query(
        `SELECT column_default FROM information_schema.columns WHERE table_name='documents' AND column_name='uuid'`
      );
      const currentDefault = defaultInfo.rows[0]?.column_default as string | null | undefined;
      if (!currentDefault) {
        try {
          await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);
          await pool.query(`ALTER TABLE documents ALTER COLUMN uuid SET DEFAULT gen_random_uuid()`);
          console.warn('[DB] Set default documents.uuid = gen_random_uuid() via pgcrypto.');
        } catch (e) {
          await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
          await pool.query(`ALTER TABLE documents ALTER COLUMN uuid SET DEFAULT uuid_generate_v4()`);
          console.warn('[DB] Set default documents.uuid = uuid_generate_v4() via uuid-ossp.');
        }
      }
    }
  }

  // Drop legacy readable_by column if present
  await pool.query(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'documents' AND column_name = 'readable_by'
      ) THEN
        EXECUTE 'ALTER TABLE documents DROP COLUMN readable_by';
      END IF;
    END$$;
  `);
}


