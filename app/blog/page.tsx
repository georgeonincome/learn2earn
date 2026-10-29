import Link from 'next/link'
import Image from 'next/image'
import { BLOG_POSTS, SITE_CONFIG } from '@/lib/data'
import type { BlogPost } from '@/lib/types'

/* Blog index — structure mirrored from Blog-C9g0NBvI.js:
   bg-background, max-w-5xl, h1 text-3xl/4xl bold + p lg muted,
   grid gap-6 sm:grid-cols-2, cards rounded-xl border bg-card
   with aspect-video image, meta row (category chip/date/readTime),
   h2 base semibold line-clamp-2, description sm muted line-clamp-2.
*/

const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

export default function BlogPage() {
  const posts = BLOG_POSTS as BlogPost[]

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Learn2Earn Blog',
            url: 'https://learn2earn.co.zm/blog',
            description: 'Practical guides to building digital skills and earning online in Africa.',
            publisher: { '@type': 'Organization', name: 'Learn2Earn', url: 'https://learn2earn.co.zm' },
            blogPost: posts.map(p => ({
              '@type': 'BlogPosting',
              headline: p.title,
              description: p.description,
              url: `https://learn2earn.co.zm/blog/${p.slug}`,
              image: `https://learn2earn.co.zm${p.image ?? ''}`,
              author: { '@type': 'Person', name: SITE_CONFIG.founder.name },
            })),
          }),
        }}
      />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">Learn2Earn Blog</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Practical guides to building digital skills and earning online in Africa.
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map(p => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group block rounded-xl border border-border bg-card overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video overflow-hidden" style={{ backgroundColor: '#EEF1EE' }}>
                <Image
                  src="/images/elvis-teaching-phone.webp"
                  alt={p.title}
                  width={600}
                  height={338}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-2">
                  <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                    {p.category}
                  </span>
                  <span>{p.date}</span>
                  <span>{p.readTime}</span>
                </div>
                <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5 line-clamp-2">
                  {p.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
