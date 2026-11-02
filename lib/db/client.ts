// Database client for Turso (libSQL).
//
// Remote Turso (libsql://...) uses the pure-HTTP entry (`@libsql/client/http`)
// so no native bindings are loaded in WSL; local `file:` URLs use the node
// entry, which is verified working on this machine.
// Configure with TURSO_DATABASE_URL (+ TURSO_AUTH_TOKEN) in .env / .env.local.

import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client/node'
import { createClient as createHttpClient } from '@libsql/client/http'
import type { Config } from '@libsql/client'

import * as schema from './schema'

const url = process.env.TURSO_DATABASE_URL || 'file:./local.db'
const authToken = process.env.TURSO_AUTH_TOKEN || undefined

function buildConfig(): Config {
  if (url.startsWith('libsql://') || url.startsWith('https://')) {
    return { url, authToken }
  }
  return { url }
}

function buildClient() {
  const cfg = buildConfig()
  if (cfg.url.startsWith('libsql://') || cfg.url.startsWith('https://')) {
    return createHttpClient(cfg as never)
  }
  return createClient(cfg)
}

const rawClient = buildClient()
const _db = drizzle(rawClient, { schema })

export const db = _db
export const raw = rawClient
export type DbClient = typeof db
export type Schema = typeof schema
export { buildConfig as _dbConfig }
