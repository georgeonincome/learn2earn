import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { BLOG_POSTS, SITE_CONFIG } from '@/lib/data'
import { BLOG_CONTENT } from '@/lib/blog-content'
import type { BlogPost } from '@/lib/types'

/* Blog post detail — structure mirrored from BlogPost-BbEDsJvZ.js:
   max-w-3xl, back link, meta row (category chip / date / readTime),
   h1 3xl/4xl, description lg muted, author line linking to /about,
   article content, course-CTA aside (rounded-2xl border-primary/30 bg-primary/5),
   "Keep reading" list of other posts.
*/

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((x) => x.slug === slug)
  if (!post) return { title: 'Article not found' }
  return {
    title: post.title,
    description: post.description,
  }
}

/* Body sections: the reference ships article bodies as separate per-slug
   chunks (not archived); ours are written fresh for Zambia. Blocks split on
   \n\n; lines starting with '## ' become h2, '- ' become list items. */
function ArticleBody({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/).filter(Boolean)
  return (
    <article className="article-content">
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="text-xl font-bold mb-3 mt-8 text-foreground">
              {block.slice(3)}
            </h2>
          )
        }
        if (block.startsWith('- ')) {
          const items = block.split('\n').filter(Boolean)
          return (
            <ul key={i} className="space-y-2 mb-6 text-[15px] leading-7 text-muted-foreground list-disc pl-5">
              {items.map((item, j) => (
                <li key={j}>{item.replace(/^- /, '')}</li>
              ))}
            </ul>
          )
        }
        return (
          <p key={i} className="text-[15px] leading-7 text-muted-foreground mb-6">
            {block}
          </p>
        )
      })}
    </article>
  )
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = BLOG_POSTS.find((x) => x.slug === slug) as BlogPost | undefined

  if (!post) {
    notFound()
  }

  const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')
  const others = (BLOG_POSTS as BlogPost[]).filter(p => p.slug !== post.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            author: { '@type': 'Person', name: SITE_CONFIG.founder.name, url: 'https://learn2earn.co.zm/about' },
            publisher: { '@type': 'Organization', name: 'Learn2Earn', url: 'https://learn2earn.co.zm' },
            mainEntityOfPage: { '@type': 'WebPage', '@id': `https://learn2earn.co.zm/blog/${post.slug}` },
            inLanguage: 'en',
          }),
        }}
      />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to the blog
        </Link>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
          <span className="bg-primary/10 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
            {post.category}
          </span>
          <span>{post.date}</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{post.title}</h1>
        <p className="text-lg text-muted-foreground mb-4">{post.description}</p>
        <p className="text-sm text-muted-foreground mb-10">
          Written by{' '}
          <Link href="/about" className="text-primary hover:underline">
            {SITE_CONFIG.founder.name}
          </Link>
          , who teaches every class on Learn2Earn from {SITE_CONFIG.founder.location}.
        </p>

        <figure className="aspect-video overflow-hidden rounded-2xl mb-10 bg-[#EEF1EE]">
          <Image src="/images/teaching.jpg" alt={post.title} width={1200} height={675} priority className="w-full h-full object-cover" />
        </figure>

        {BLOG_CONTENT[post.slug] ? (
          <ArticleBody body={BLOG_CONTENT[post.slug]} />
        ) : (
          <article className="article-content">
            <p className="text-[15px] leading-7 text-muted-foreground mb-6">{post.excerpt}</p>
          </article>
        )}

        {post.ctaTitle && (
          <aside className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-6">
            <h2 className="text-xl font-semibold mb-2">{post.ctaTitle}</h2>
            <p className="text-muted-foreground mb-4">{post.ctaText}</p>
            <ul className="space-y-2">
              {(post.courses ?? []).map(c => (
                <li key={c.path}>
                  <Link href={c.path} className="text-primary font-medium hover:underline">
                    {c.label} →
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              One membership opens every course:{' '}
              <Link href="/subscribe" className="text-primary hover:underline">
                see pricing
              </Link>
              .
            </p>
          </aside>
        )}

        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Keep reading</h2>
          <ul className="space-y-2">
            {others.map(p => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="flex items-baseline justify-between gap-3 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <span>{p.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{p.readTime}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}
