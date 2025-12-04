import { Pool, QueryResultRow, type PoolConfig, type QueryResult } from "pg"

const connectionString = process.env.DATABASE_URL

const poolConfig: PoolConfig = {
	connectionString,
}

const globalForPg = global as typeof globalThis & { pgPool?: Pool }

const pool = globalForPg.pgPool || new Pool(poolConfig)

if (process.env.NODE_ENV !== "production") {
	globalForPg.pgPool = pool
}

export const pgClient = pool

export async function query<T extends QueryResultRow = QueryResultRow>(
	text: string,
	params?: unknown[]
): Promise<QueryResult<T>> {
	if (!connectionString) {
		throw new Error(
			"DATABASE_URL environment variable is required for database queries"
		)
	}
	return pool.query<T>(text, params)
}
