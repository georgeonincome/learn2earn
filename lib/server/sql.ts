// Tiny SQL helpers over the raw libsql client (avoids raw rows marshalling in every module)
import { raw } from '@/lib/db/client'

export type Row = Record<string, unknown>

export async function all(sql: string, args: unknown[] = []): Promise<Row[]> {
  const res = await raw.execute({ sql, args: args as any })
  return res.rows as unknown as Row[]
}

export async function one<T extends Row = Row>(sql: string, args: unknown[] = []): Promise<T | null> {
  const rows = await all(sql, args)
  return (rows[0] ?? null) as T | null
}

export async function run(sql: string, args: unknown[] = []): Promise<void> {
  await raw.execute({ sql, args: args as any })
}

export async function batch(stmts: { sql: string; args?: unknown[] }[]): Promise<void> {
  if (stmts.length === 0) return
  await raw.batch(stmts.map((s) => ({ sql: s.sql, args: (s.args ?? []) as any })), 'write')
}
