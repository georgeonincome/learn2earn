#!/usr/bin/env tsx

/**
 * Seed user accounts for testing
 * Run with: TURSO_DATABASE_URL=file:local.db npx tsx scripts/seed-users.ts
 *
 * Creates:
 *   Admin:    admin@learn2earn.co.zm / admin123 (role: super_admin)
 *   Student:  student@learn2earn.co.zm / student123 (role: student)
 */

import { createClient } from '@libsql/client'
import { scryptSync, randomBytes } from 'node:crypto'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

const uuid = () =>
  crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

const now = Math.floor(Date.now() / 1000)

const users = [
  {
    id: uuid(),
    email: 'admin@learn2earn.co.zm',
    password: 'admin123',
    fullName: 'George Admin',
    role: 'super_admin',
  },
  {
    id: uuid(),
    email: 'student@learn2earn.co.zm',
    password: 'student123',
    fullName: 'Student Test',
    role: 'student',
  },
]

async function seed() {
  console.log('🌱 Seeding user accounts...')

  // Ensure tables exist
  await client.execute(`
    CREATE TABLE IF NOT EXISTS auth_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      email TEXT NOT NULL,
      full_name TEXT,
      avatar_url TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `)

  for (const u of users) {
    // Check if already exists
    const existing = await client.execute({
      sql: 'SELECT id FROM auth_users WHERE email = ?',
      args: [u.email],
    })
    if (existing.rows.length > 0) {
      console.log(`⏭️  ${u.email} already exists, skipping`)
      continue
    }

    const passwordHash = hashPassword(u.password)

    // Insert auth user
    await client.execute({
      sql: `INSERT INTO auth_users (id, email, password_hash, created_at) VALUES (?, ?, ?, ?)`,
      args: [u.id, u.email, passwordHash, now],
    })

    // Insert student profile
    await client.execute({
      sql: `INSERT INTO students (id, user_id, email, full_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [u.id, u.id, u.email, u.fullName, now, now],
    })

    console.log(`✅ Created ${u.role}: ${u.email} / ${u.password}`)
  }

  console.log('\n📋 Test accounts:')
  console.log('   Admin:    admin@learn2earn.co.zm / admin123')
  console.log('   Student:  student@learn2earn.co.zm / student123')
  console.log('\n   Admin dashboard:   /admin')
  console.log('   Student dashboard: /dashboard')
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e)
  process.exit(1)
})