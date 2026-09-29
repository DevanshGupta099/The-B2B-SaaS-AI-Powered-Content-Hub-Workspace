import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

/**
 * Neon PostgreSQL Serverless SQL Client
 * Automatically connects to the provisioned Neon project database when DATABASE_URL is configured.
 */
export const sql = databaseUrl ? neon(databaseUrl) : null;

export function isDatabaseConfigured(): boolean {
  return Boolean(databaseUrl && databaseUrl.startsWith("postgres"));
}

/**
 * Health check ping for the Neon database
 */
export async function testDatabaseConnection(): Promise<{ connected: boolean; version?: string; error?: string }> {
  if (!sql) {
    return { connected: false, error: "DATABASE_URL is not set" };
  }
  try {
    const result = await sql`SELECT version() as pg_version, current_database() as db_name`;
    const firstRow = result[0] as { pg_version: string; db_name: string } | undefined;
    return {
      connected: true,
      version: firstRow?.pg_version
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return { connected: false, error: message };
  }
}
