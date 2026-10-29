# Learn2Earn - Complete Installation Guide

## Pre-Flight Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm, yarn, or pnpm installed
- [ ] Git (optional but recommended)
- [ ] Flutterwave account (for payments)
- [ ] Turso account (for database) - optional for local dev

---

## Step 1: Project Location

The complete project is at:
```
~/Projects/web/clone/learn2earn/
```

All source code, configuration, and assets are ready.

---

## Step 2: Install Dependencies

Navigate to the project directory and install:

```bash
cd ~/Projects/web/clone/learn2earn
```

### Option A: npm (Recommended First Try)
```bash
npm install
```

### Option B: If npm fails (WSL/Windows issues)
```bash
# Try with yarn
yarn install

# Or with pnpm
pnpm install

# Or with different flags
npm install --legacy-peer-deps
npm install --force
```

### If All Package Managers Fail
You can manually install each critical dependency:

```bash
# Core framework
npm install next@15.1.7 react@19.0.0 react-dom@19.0.0

# Database
npm install @libsql/client@^0.14.0 drizzle-orm@^0.36.4

# UI & Utilities
npm install lucide-react@^0.468.0 clsx@^2.1.1 tailwind-merge@^2.6.0

# Dev dependencies
npm install -D typescript@^5.7.2 \
  @types/node@^22.10.1 \
  @types/react@^19.0.1 \
  @types/react-dom@^19.0.2 \
  tailwindcss@^3.4.17 \
  postcss@^8.5.5 \
  autoprefixer@^10.4.21 \
  eslint@^9.21.0 \
  eslint-config-next@15.1.7
```

### Important Note on Tailwind CSS

If you see Tailwind v4 warnings during build, this project uses **Tailwind v3**.

The CSS file uses v3 directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

If your system has Tailwind v4 installed globally, you may need to:
```bash
# Ensure local v3 is used
npx tailwindcss -v  # Should show 3.x.x
```

---

## Step 3: Environment Variables

Create your `.env` file:

```bash
cp .env.example .env
```

Then edit `.env` and fill in your actual values:

```env
# === REQUIRED ===

# Turso Database (get from https://turso.tech)
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Learn2Earn

# Owner info
NEXT_PUBLIC_OWNER_NAME=George J Kasonso
NEXT_PUBLIC_OWNER_EMAIL=hello@learn2earn.co.zm
NEXT_PUBLIC_OWNER_PHONE=+260 97 123 4567
NEXT_PUBLIC_CURRENCY=ZMW
NEXT_PUBLIC_SYMBOL=ZMW

# === FLUTTERWAVE PAYMENTS (Required for checkout to work) ===
# Get keys from https://flutterwave.com/dashboard/
FLW_PUBLIC_KEY=FLWPUBK_TEST-your-public-key-here
FLW_SECRET_KEY=FLWSECK_TEST-your-secret-key-here
FLW_ENCRYPTION_KEY=FLWSECK_TEST-your-encryption-key

# === OPTIONAL ===
NEXTAUTH_SECRET=any-random-string-here
NEXTAUTH_URL=http://localhost:3000
```

### Testing Mode
For testing without real Flutterwave keys, leave them empty or set to dummy values. The payment API will run in demo mode and accept test transactions.

---

## Step 4: Database Setup

### Local Development (without Turso)
```bash
# Install drizzle kit globally or locally
npm install -g drizzle-kit

# Push schema (creates local.db file)
npx drizzle-kit push

# Seed with initial data
npx tsx scripts/seed.ts
```

### With Turso (Production)
```bash
# Ensure your .env has real Turso credentials
npx drizzle-kit push
npx tsx scripts/seed.ts
```

---

## Step 5: Start Development Server

```bash
npm run dev
```

Open your browser to:
```
http://localhost:3000
```

---

## Step 6: Build for Production

```bash
npm run build
npm start
```

---

## Troubleshooting

### "Cannot find module"
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### "PostCSS not found"
```bash
npm install -D postcss@^8.5.5 autoprefixer@^10.4.21
```

### "Tailwind CSS not found"
```bash
npm install -D tailwindcss@^3.4.17
npx tailwindcss init -p
```

### Type errors
```bash
# Regenerate types
npx tsc --noEmit
```

### Build fails
```bash
# Check for missing dependencies
npm ls

# Force reinstall all
rm -rf node_modules package-lock.json
npm install --force
```

---

## Project Structure Reference

```
learn2earn/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage (15+ sections)
│   ├── layout.tsx                # Root layout (SEO meta tags)
│   ├── globals.css               # Tailwind + custom styles
│   ├── not-found.tsx             # 404 page
│   ├── courses/
│   │   ├── page.tsx              # Course catalog
│   │   └── [slug]/page.tsx       # Course detail
│   ├── cohorts/
│   │   ├── page.tsx              # Cohorts listing
│   │   └── [slug]/page.tsx       # Cohort detail
│   ├── blog/
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Blog post detail
│   ├── about/page.tsx            # About George
│   ├── faq/page.tsx              # FAQ (accordion + filtering)
│   ├── contact/page.tsx          # Contact page
│   ├── reviews/page.tsx          # Reviews + stats
│   ├── checkout/page.tsx         # Flutterwave checkout
│   ├── auth/page.tsx             # Sign in with email
│   ├── dashboard/page.tsx        # Student dashboard
│   ├── privacy-policy/page.tsx   # Privacy policy
│   ├── refund-policy/page.tsx    # Refund policy
│   ├── terms/page.tsx            # Terms of use
│   ├── api/
│   │   ├── courses/route.ts      # Courses CRUD API
│   │   ├── payments/
│   │   │   ├── initiate/route.ts # Start Flutterwave payment
│   │   │   └── verify/route.ts   # Verify payment callback
│   │   └── subscribe/route.ts    # Newsletter subscription
│   ├── manifest.ts               # PWA manifest
│   ├── robots.ts                 # robots.txt
│   └── sitemap.ts                # sitemap.xml
│
├── components/
│   ├── layouts/
│   │   ├── Navbar.tsx            # Fixed header + mobile menu
│   │   └── Footer.tsx            # Footer + newsletter + mobile CTA
│   └── sections/
│       ├── HeroSection.tsx       # Homepage hero
│       ├── LiveClassBanner.tsx   # Cohort announcement
│       ├── FeaturesSection.tsx   # Stats + features grid
│       ├── CoursesPreviewSection.tsx
│       ├── FeaturedBundleSection.tsx
│       ├── CohortsSection.tsx
│       ├── ClassroomExperienceSection.tsx
│       ├── AboutInstructorSection.tsx
│       ├── SocialProofSection.tsx
│       ├── ReviewsSection.tsx
│       ├── PricingSection.tsx
│       ├── FAQPreviewSection.tsx
│       └── CTASection.tsx
│
├── lib/
│   ├── db/
│   │   ├── schema.ts             # 10 tables (users, courses, etc.)
│   │   └── client.ts             # Turso DB connection
│   ├── data.ts                   # ALL content (courses, prices, FAQs, etc.)
│   └── utils.ts                  # Utility functions (formatPrice, etc.)
│
├── public/                       # Static assets (images, fonts)
├── scripts/
│   └── seed.ts                   # Database seeding
├── .env.example                  # Environment template
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind (colors: primary=#0B6B3D)
├── postcss.config.js             # PostCSS
├── tsconfig.json                 # TypeScript
├── drizzle.config.ts             # Drizzle ORM config
├── middleware.ts                 # Route protection
└── package.json                  # Dependencies

```

---

## Quick Customization Guide

### Change Your Phone Number
Edit `lib/data.ts`:
```typescript
whatsapp: '+260971234567',  // Change this
```

### Change Course Prices
Edit `COURSES` array in `lib/data.ts`:
```typescript
price: toZMW(2690),  // KES amount (auto converts to ZMW)
```

### Add a New Course
Add to `COURSES` array in `lib/data.ts`:
```typescript
{
  id: 13,
  slug: 'new-course-name',
  title: 'My New Course',
  category: 'Business',
  price: toZMW(3000),
  description: 'Course description here',
  featured: true,
}
```

### Change the Main Brand Color
Edit `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#0B6B3D', // Change this hex
    // ...keep rest
  }
}
```

### Add New FAQ
Add to `FAQS` array in `lib/data.ts`:
```typescript
{
  category: 'Getting started',
  question: 'Your question?',
  answer: 'Your answer.',
}
```

---

## Production Deployment Checklist

Before going live:

- [ ] Install all dependencies: `npm install`
- [ ] Set all environment variables in `.env`
- [ ] Add real Flutterwave keys (not test keys)
- [ ] Add real Turso database credentials
- [ ] Upload real course images to `/public/images/courses/`
- [ ] Upload founder photo to `/public/images/about/`
- [ ] Update sitemap base URL in `app/sitemap.ts`
- [ ] Add Google Analytics or Plausible analytics
- [ ] Test payment flow end-to-end
- [ ] Run `npm run build` successfully
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (target: 90+ score)
- [ ] Add cookie consent banner (if needed for GDPR)
- [ ] Verify SSL certificate is active
- [ ] Test all contact/WhatsApp links work

---

## Support

For technical issues during installation:
1. Check `.env` variables are correct
2. Run `npm ls` to verify all packages installed
3. Check `npm run dev` output for specific errors
4. Ensure Node.js version is 18+

---

## What's Already Built (Ready to Use)

✅ 18 complete pages with full content  
✅ 14+ interactive section components  
✅ 4 API routes (payments, courses, newsletters)  
✅ Responsive design (mobile/tablet/desktop)  
✅ SEO optimization (meta tags, Open Graph, Twitter Cards, sitemap)  
✅ Payment integration (Flutterwave)  
✅ Database schema (10 tables)  
✅ All content customized for Zambia (ZMW currency, Zambian context)  
✅ Exact Click2Skill layout and design replication  
✅ WhatsApp integration throughout  
✅ Newsletter subscription  
✅ Student dashboard  

---

**Project is READY. Just run `npm install` and start building!**
