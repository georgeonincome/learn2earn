#!/usr/bin/env node
// Phase 3 DB setup: adds books + book_enrollments tables and seeds with
// the books from lib/books-data.ts (converted to ZMW prices already in source).
//
// Usage:  node --env-file=.env.local scripts/db-phase3.mjs

import { createClient } from '@libsql/client/node'
const url = process.env.TURSO_DATABASE_URL
const token = process.env.TURSO_AUTH_TOKEN
if (!url) { console.error('TURSO_DATABASE_URL missing'); process.exit(1) }
const client = createClient({ url, authToken: token || undefined })

async function run(sql, args = []) {
  await client.execute({ sql, args })
}

async function main() {
  // --- Add book_id to transactions table if missing (Phase 3) ---
  const haveTx = (await client.execute('PRAGMA table_info(transactions)')).rows.map(r => r.name)
  if (!haveTx.includes('book_id')) {
    try { await client.execute('ALTER TABLE transactions ADD COLUMN book_id TEXT'); console.log('Added transactions.book_id'); } catch {}
  }

  // --- Create books table ---
  await run(`
    CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      author TEXT NOT NULL,
      description TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      price REAL NOT NULL,
      original_price REAL,
      category TEXT NOT NULL,
      tags TEXT,
      image TEXT NOT NULL,
      pdf_url TEXT,
      pages INTEGER,
      language TEXT DEFAULT 'English',
      published_date TEXT,
      featured INTEGER DEFAULT 1,
      in_plan INTEGER DEFAULT 0,
      learning_outcomes TEXT,
      faqs TEXT,
      is_published INTEGER DEFAULT 1,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );
  `)
  await run(`CREATE UNIQUE INDEX IF NOT EXISTS books_slug_uq ON books(slug);`)
  await run(`CREATE INDEX IF NOT EXISTS books_category_idx ON books(category);`)

  // --- Create book_enrollments table ---
  await run(`
    CREATE TABLE IF NOT EXISTS book_enrollments (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      book_id TEXT NOT NULL,
      purchased_at TEXT,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'ZMW',
      download_count INTEGER DEFAULT 0,
      last_accessed_at TEXT,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `)
  await run(`CREATE UNIQUE INDEX IF NOT EXISTS book_enrollments_student_book_uq ON book_enrollments(student_id, book_id);`)
  await run(`CREATE INDEX IF NOT EXISTS book_enrollments_book_idx ON book_enrollments(book_id);`)

  console.log('tables created')

  // --- Seed books from lib/books-data.ts ---
  const BOOKS = [
    {
      id: '1', slug: 'ai-productivity-handbook', title: 'AI Productivity Handbook',
      author: 'George J Kasonso',
      description: 'The complete guide to using AI tools for productivity. Learn Claude, ChatGPT, Gemini, and Lovable to 10x your output. Practical workflows for Zambian professionals.',
      excerpt: 'Master AI productivity with Claude, ChatGPT, Gemini, and Lovable. Step-by-step workflows for Zambian professionals.',
      price: 2500, originalPrice: 3500, category: 'AI Productivity',
      tags: ['AI', 'Productivity', 'Claude', 'ChatGPT', 'Gemini', 'Lovable'],
      image: '/images/courses/claude-ai.jpg', pdfUrl: '/pdfs/ai-productivity-handbook.pdf', pages: 120,
      language: 'English', publishedDate: '2026-10-01', featured: 1, inPlan: 0,
      learningOutcomes: JSON.stringify(['Write effective AI prompts', 'Automate daily tasks with AI', 'Create content at scale with AI', 'Build AI workflows for business']),
      faqs: JSON.stringify([{ question: 'Do I need prior AI experience?', answer: 'No. This book starts from basics and builds up to advanced techniques.' }, { question: 'What tools do I need?', answer: 'Free accounts for Claude, ChatGPT, and Gemini are sufficient to start.' }, { question: 'Is this for Zambian context?', answer: 'Yes. Examples and case studies are Zambia-specific.' }]),
    },
    {
      id: '2', slug: 'social-media-business-guide', title: 'Social Media Business Guide',
      author: 'George J Kasonso',
      description: 'Build a profitable social media management business. Client acquisition, content creation, Meta Ads, and pricing strategies for Zambian freelancers.',
      excerpt: 'Build a profitable social media management business. Client acquisition, content creation, Meta Ads, and pricing.',
      price: 3000, originalPrice: 5000, category: 'Social Media',
      tags: ['Social Media', 'Meta Ads', 'Freelancing', 'Client Acquisition', 'Content Creation'],
      image: '/images/gallery-1.jpg', pdfUrl: '/pdfs/social-media-business-guide.pdf', pages: 150,
      language: 'English', publishedDate: '2026-09-15', featured: 1, inPlan: 0,
      learningOutcomes: JSON.stringify(['Acquire social media clients', 'Create content calendars', 'Run Meta Ads campaigns', 'Price and package services']),
      faqs: JSON.stringify([{ question: 'Do I need experience?', answer: 'No. This guide takes you from beginner to paid freelancer.' }, { question: 'What tools do I need?', answer: 'Canva (free), Meta Ads account, and a smartphone or laptop.' }]),
    },
    {
      id: '3', slug: 'virtual-assistant-career-guide', title: 'Virtual Assistant Career Guide',
      author: 'George J Kasonso',
      description: 'Complete roadmap to becoming a paid Virtual Assistant. Tools, clients, pricing, and delivery systems for African VAs.',
      excerpt: 'Complete roadmap to becoming a paid Virtual Assistant. Tools, clients, pricing, and delivery systems for African VAs.',
      price: 2800, originalPrice: 4500, category: 'Freelancing',
      tags: ['Virtual Assistant', 'Freelancing', 'Remote Work', 'Client Acquisition'],
      image: '/images/courses/virtual-assistant.jpg', pdfUrl: '/pdfs/virtual-assistant-career-guide.pdf', pages: 135,
      language: 'English', publishedDate: '2026-09-20', featured: 1, inPlan: 0,
      learningOutcomes: JSON.stringify(['Set up VA profiles on Upwork and Fiverr', 'Find and pitch clients', 'Set prices and packages', 'Deliver work professionally']),
      faqs: JSON.stringify([{ question: 'Can I work from Zambia?', answer: 'Yes. All training is for remote work serving international clients.' }, { question: 'What tools do I need?', answer: 'Google Workspace, Canva, and a reliable internet connection.' }]),
    },
    {
      id: '4', slug: 'meta-ads-playbook', title: 'Meta Ads Playbook',
      author: 'George J Kasonso',
      description: 'Run profitable Facebook and Instagram ads for Zambian businesses. Campaign setup, targeting, creative, and scaling.',
      excerpt: 'Run profitable Facebook and Instagram ads for Zambian businesses. Campaign setup, targeting, creative, and scaling.',
      price: 3500, originalPrice: 6000, category: 'Business',
      tags: ['Meta Ads', 'Facebook Ads', 'Instagram Ads', 'Digital Marketing'],
      image: '/images/courses/meta-ads.jpg', pdfUrl: '/pdfs/meta-ads-playbook.pdf', pages: 180,
      language: 'English', publishedDate: '2026-09-25', featured: 1, inPlan: 0,
      learningOutcomes: JSON.stringify(['Set up Meta Business Manager', 'Create converting ad campaigns', 'Target Zambian audiences', 'Measure and scale ROI']),
      faqs: JSON.stringify([{ question: 'Do I need ad budget?', answer: 'You can start with ZMW 500/day and scale from there.' }, { question: 'Do I need a business page?', answer: 'Yes, a Facebook Page is required to run Meta Ads.' }]),
    },
    {
      id: '5', slug: 'canva-design-business', title: 'Canva Design Business',
      author: 'George J Kasonso',
      description: 'Start a design business with Canva. Social media graphics, flyers, logos, and brand kits for paying clients.',
      excerpt: 'Start a design business with Canva. Social media graphics, flyers, logos, and brand kits for paying clients.',
      price: 2200, originalPrice: 3500, category: 'Design',
      tags: ['Canva', 'Graphic Design', 'Branding', 'Freelancing'],
      image: '/images/courses/web-design.jpg', pdfUrl: '/pdfs/canva-design-business.pdf', pages: 110,
      language: 'English', publishedDate: '2026-09-18', featured: 0, inPlan: 0,
      learningOutcomes: JSON.stringify(['Design social media graphics', 'Create brand kits', 'Design print materials', 'Sell design services']),
      faqs: JSON.stringify([{ question: 'Do I need Canva Pro?', answer: 'No. Canva Free works for most designs. Pro is optional.' }, { question: 'Can I sell designs?', answer: 'Yes. You own the commercial rights to designs you create.' }]),
    },
    {
      id: '6', slug: 'video-editing-capcut-guide', title: 'Video Editing with CapCut Guide',
      author: 'George J Kasonso',
      description: 'Master CapCut for TikTok, YouTube, and Instagram. Cuts, transitions, color grading, audio, captions, and social media exports.',
      excerpt: 'Master CapCut for TikTok, YouTube, and Instagram. Cuts, transitions, color grading, audio, captions, and social media exports.',
      price: 2400, originalPrice: 4000, category: 'Video Editing',
      tags: ['Video Editing', 'CapCut', 'TikTok', 'YouTube', 'Content Creation'],
      image: '/images/gallery-3.jpg', pdfUrl: '/pdfs/video-editing-capcut-guide.pdf', pages: 140,
      language: 'English', publishedDate: '2026-09-22', featured: 0, inPlan: 0,
      learningOutcomes: JSON.stringify(['Edit videos with CapCut', 'Add transitions and effects', 'Create TikTok and Reels content', 'Export for different platforms']),
      faqs: JSON.stringify([{ question: 'Do I need a powerful phone?', answer: 'CapCut works on most modern smartphones.' }, { question: 'Can I edit YouTube videos?', answer: 'Yes. CapCut exports in YouTube-compatible formats.' }]),
    },
    {
      id: '7', slug: 'computer-skills-beginners', title: 'Computer Skills for Beginners',
      author: 'George J Kasonso',
      description: 'From zero to confident computer user. Google Workspace, email, internet, file management, and online safety.',
      excerpt: 'From zero to confident computer user. Google Workspace, email, internet, file management, and online safety.',
      price: 1800, originalPrice: 2800, category: 'Computer Skills',
      tags: ['Computer Skills', 'Beginners', 'Google Workspace', 'Digital Literacy'],
      image: '/images/courses/computer-skills.jpg', pdfUrl: '/pdfs/computer-skills-beginners.pdf', pages: 100,
      language: 'English', publishedDate: '2026-09-10', featured: 0, inPlan: 0,
      learningOutcomes: JSON.stringify(['Use Google Docs, Sheets, Slides', 'Manage files and folders', 'Browse internet safely', 'Create professional emails']),
      faqs: JSON.stringify([{ question: 'Do I need a laptop?', answer: 'A laptop helps but many skills work on smartphones too.' }, { question: 'Is this for absolute beginners?', answer: 'Yes. No prior computer experience needed.' }]),
    },
    {
      id: '8', slug: 'freelance-business-guide-zambia', title: 'Freelance Business Guide Zambia',
      author: 'George J Kasonso',
      description: 'Start and grow a freelance business in Zambia. Client acquisition, pricing, contracts, payments, and tax basics.',
      excerpt: 'Start and grow a freelance business in Zambia. Client acquisition, pricing, contracts, payments, and tax basics.',
      price: 3200, originalPrice: 5500, category: 'Freelancing',
      tags: ['Freelancing', 'Business', 'Client Acquisition', 'Zambia'],
      image: '/images/office.jpg', pdfUrl: '/pdfs/freelance-business-guide.pdf', pages: 160,
      language: 'English', publishedDate: '2026-09-15', featured: 1, inPlan: 0,
      learningOutcomes: JSON.stringify(['Find and pitch clients', 'Set prices and packages', 'Write contracts and invoices', 'Manage taxes and payments']),
      faqs: JSON.stringify([{ question: 'Do I need to register a business?', answer: 'Not immediately. You can start as a sole proprietor.' }, { question: 'How do I get paid?', answer: 'Via mobile money, bank transfer, or PayPal from international clients.' }]),
    },
  ]

  const stmts = []
  for (const b of BOOKS) {
    stmts.push({
      sql: `INSERT INTO books (id, slug, title, author, description, excerpt, price, original_price, category, tags, image, pdf_url, pages, language, published_date, featured, in_plan, learning_outcomes, faqs, is_published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, unixepoch(), unixepoch())
       ON CONFLICT(slug) DO UPDATE SET
         title=excluded.title, author=excluded.author, description=excluded.description, excerpt=excluded.excerpt,
         price=excluded.price, original_price=excluded.original_price, category=excluded.category,
         tags=excluded.tags, image=excluded.image, pdf_url=excluded.pdf_url, pages=excluded.pages,
         language=excluded.language, published_date=excluded.published_date, featured=excluded.featured,
         in_plan=excluded.in_plan, learning_outcomes=excluded.learning_outcomes, faqs=excluded.faqs,
         updated_at=unixepoch()`,
      args: [b.id, b.slug, b.title, b.author, b.description, b.excerpt, b.price, b.originalPrice,
        b.category, JSON.stringify(b.tags), b.image, b.pdfUrl, b.pages, b.language, b.publishedDate,
        b.featured, b.inPlan, b.learningOutcomes, b.faqs],
    })
  }

  await client.batch(stmts.map(s => ({ sql: s.sql, args: s.args })), 'write')
  console.log(`seed applied: ${stmts.length} books`)

  const count = (await client.execute('SELECT COUNT(*) AS n FROM books WHERE is_published = 1')).rows[0].n
  console.log(`seed: ${count} published books`)
}

main().catch(e => { console.error(e); process.exit(1) })
