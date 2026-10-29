#!/usr/bin/env tsx

/**
 * Database seed script for Learn2Earn
 * Run with: npx tsx scripts/seed.ts
 */

import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import * as schema from '../lib/db/schema'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const db = drizzle(client, { schema })

async function seed() {
  console.log('🌱 Seeding database...')

  // Create tables
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      avatar TEXT,
      role TEXT DEFAULT 'student' NOT NULL,
      status TEXT DEFAULT 'active' NOT NULL,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      excerpt TEXT,
      category TEXT NOT NULL,
      tags TEXT,
      price REAL NOT NULL,
      original_price REAL,
      currency TEXT DEFAULT 'ZMW' NOT NULL,
      duration TEXT,
      lessons_count INTEGER DEFAULT 0,
      level TEXT DEFAULT 'beginner' NOT NULL,
      status TEXT DEFAULT 'draft' NOT NULL,
      featured INTEGER DEFAULT 0,
      image TEXT,
      instructor_id INTEGER,
      curriculum TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      image TEXT,
      read_time TEXT,
      published INTEGER DEFAULT 0,
      featured INTEGER DEFAULT 0,
      author_id INTEGER,
      created_at INTEGER DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      course_id INTEGER,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      rating INTEGER DEFAULT 5,
      verified INTEGER DEFAULT 0,
      cohort_name TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS memberships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'pending' NOT NULL,
      start_date INTEGER NOT NULL,
      end_date INTEGER,
      amount_paid REAL NOT NULL,
      currency TEXT DEFAULT 'ZMW' NOT NULL,
      flutterwave_ref TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `)

  await client.execute(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'ZMW' NOT NULL,
      status TEXT DEFAULT 'pending' NOT NULL,
      flutterwave_ref TEXT,
      flutterwave_tx_id TEXT,
      created_at INTEGER DEFAULT (strftime('%s', 'now'))
    )
  `)

  console.log('✅ Tables created successfully')

  // Seed admin user
  const adminExists = await client.execute({
    sql: 'SELECT id FROM users WHERE email = ?',
    args: ['hello@learn2earn.co.zm'],
  })

  if (adminExists.rows.length === 0) {
    await client.execute({
      sql: `INSERT INTO users (name, email, role, status) VALUES (?, ?, ?, ?)`,
      args: ['George J Kasonso', 'hello@learn2earn.co.zm', 'admin', 'active'],
    })
    console.log('✅ Admin user created')
  }

  console.log('🎉 Database seeding complete!')
}

seed().catch(console.error)
