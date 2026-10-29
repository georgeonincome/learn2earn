import { Plus_Jakarta_Sans, Bricolage_Grotesque } from 'next/font/google'
import './globals.css'
import LayoutShell from '@/components/layouts/LayoutShell'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-head',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Learn2Earn | Digital Skills Courses in Zambia',
  },
  description: 'Learn AI, Meta ads, social media, web design and video editing. Practical courses from ZMW 432 for 4 months. Pay with MTN/Airtel mobile money or card. Taught by George J Kasonso.',
  keywords: ['digital skills', 'online courses', 'Zambia', 'AI training', 'social media', 'web design', 'freelancing', 'Lusaka'],
  authors: [{ name: 'George J Kasonso' }],
  creator: 'George J Kasonso',
  metadataBase: new URL('https://learn2earn.co.zm'),
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Learn2Earn | Digital Skills Courses in Zambia',
    description: 'Learn AI, Meta ads, social media, web design and video editing. Practical courses from ZMW 432 for 4 months.',
    url: 'https://learn2earn.co.zm',
    siteName: 'Learn2Earn',
    locale: 'en_ZM',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Learn2Earn | Digital Skills Courses in Zambia',
    description: 'Learn AI, Meta ads, social media, web design and video editing. Practical courses from ZMW 432 for 4 months.',
    creator: '@george_kasonso',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${bricolage.variable}`}>
      <body className="font-sans antialiased">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  )
}
