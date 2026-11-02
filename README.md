# Learn2Earn

A creator-led digital skills learning platform for Zambia, built with Next.js 15, Turso database, and Flutterwave payments.

## Features

- **Digital Skills Courses**: AI, social media, web design, video editing, and more
- **Live Cohorts**: Interactive group learning with live sessions
- **Flutterwave Payments**: Secure mobile money and card payments
- **Turso Database**: Edge-ready SQLite for fast responses
- **SEO Optimized**: Full meta tags, Open Graph, Twitter Cards
- **Responsive Design**: Mobile-first, works on all devices
- **Dark Mode Ready**: Built with Tailwind CSS dark mode support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Database**: Turso (libSQL)
- **ORM**: Drizzle ORM
- **Payments**: Flutterwave
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Turso account (optional for local dev)
- Flutterwave account (for payments)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```env
   TURSO_DATABASE_URL=libsql://your-db-name.turso.io
   TURSO_AUTH_TOKEN=your-auth-token
   FLW_SECRET_KEY=FLWSECK_TEST-your-secret-key
   FLW_PUBLIC_KEY=FLWPUBK_TEST-your-public-key
   ```

5. Run database migrations:
   ```bash
   npx drizzle-kit push
   ```

6. Seed the database:
   ```bash
   npx tsx scripts/seed.ts
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
learn2earn/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (payments, auth, subscriptions)
│   ├── dashboard/         # Student dashboard
│   ├── courses/           # Course catalog and detail pages
│   ├── cohorts/           # Live training programs
│   ├── blog/              # Blog articles
│   ├── about/             # About page
│   ├── faq/               # FAQs
│   ├── contact/           # Contact page
│   ├── checkout/          # Payment checkout
│   ├── auth/              # Authentication
│   └── ...                # Legal pages, etc.
├── components/
│   ├── layouts/           # Navbar, Footer
│   ├── sections/          # Page sections (Hero, Features, etc.)
│   └── ui/                # Reusable UI components
├── lib/
│   ├── db/                # Database schema and client
│   ├── data.ts            # All content data
│   └── utils.ts           # Utility functions
├── public/                # Static assets
├── scripts/               # Database seeding
├── tailwind.config.ts     # Tailwind configuration
└── next.config.js         # Next.js configuration
```

## Customization

### Changing Content

Edit `lib/data.ts` to customize:
- Course information and pricing
- Membership plans
- FAQ content
- Social links and contact info
- Blog posts

### Changing Colors

Edit `tailwind.config.ts` to modify:
- Primary, secondary, and accent colors
- Custom fonts
- Spacing and border radius

### Adding Courses

Add new courses to the `COURSES` array in `lib/data.ts`:

```typescript
{
  id: 13,
  slug: 'your-new-course',
  title: 'Your New Course',
  category: 'Category',
  price: toZMW(1000), // Convert from KES
  description: 'Course description',
  featured: true,
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Build the project:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_DATABASE_URL` | Turso database URL | Yes |
| `TURSO_AUTH_TOKEN` | Turso auth token | Yes |
| `FLW_SECRET_KEY` | Flutterwave secret key | For payments |
| `FLW_PUBLIC_KEY` | Flutterwave public key | For payments |
| `NEXT_PUBLIC_APP_URL` | App URL | Yes |
| `NEXT_PUBLIC_OWNER_NAME` | Owner name | Yes |
| `NEXT_PUBLIC_OWNER_EMAIL` | Owner email | Yes |
| `NEXT_PUBLIC_OWNER_PHONE` | Owner phone | Yes |

## License

MIT License - Built for George J Kasonso

## Support

For questions or support, contact George directly via WhatsApp.
# georgejacksonkasonso
# learn2earn
