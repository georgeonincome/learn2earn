'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQS, SITE_CONFIG } from '@/lib/data'

/* FAQ page — structure mirrored 1:1 from FAQ-Bpjxr71G.js:
   pt-[122px], max-w-[800px] mx-auto px-6 pb-24,
   "Help" chip, h1, lead text, search input (absolute magnifier),
   category pills All + data categories (active bg-[#1DB96B]/text-white),
   accordion details groups h2 with border-l green,
   Still stuck card with WhatsApp/Email buttons.
   Palette: pageBg #FAFAFA, text #111111, muted #737373, border #E5E5E5,
   primary #1DB96B, badgeBg #E8F8F0.
*/

const PAGE = {
  pageBg: '#FAFAFA',
  surface: '#FFFFFF',
  border: '#E5E5E5',
  primary: '#1DB96B',
  badgeBg: '#E8F8F0',
  badgeText: '#0F7A42',
  text: '#111111',
  textSecondary: '#404040',
  textMuted: '#737373',
  inkAlt: '#A3A3A3',
  divider: '#D4D4D4',
}

const categories = [
  'All',
  ...Array.from(new Set(FAQS.map(f => f.category))),
]

export default function FAQPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

  const results = useMemo(() => {
    let list = [...FAQS]
    const q = search.trim().toLowerCase()
    if (q) list = list.filter(f => (f.question + ' ' + f.answer).toLowerCase().includes(q))
    if (activeCategory !== 'All') list = list.filter(f => f.category === activeCategory)
    return list
  }, [search, activeCategory])

  const byCategory = useMemo(() => {
    const map = new Map<string, { title: string; items: typeof results }>()
    for (const f of results) {
      if (!map.has(f.category)) map.set(f.category, { title: f.category, items: [] })
      map.get(f.category)!.items.push(f)
    }
    return Array.from(map.values())
  }, [results])

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: PAGE.pageBg, color: PAGE.text }}>
      <main className="pt-[122px]">
        <div className="max-w-[800px] mx-auto px-6 pb-24">
          <span className="inline-block text-[11px] font-bold tracking-[0.14em] uppercase text-[#1DB96B] bg-[#E8F8F0] px-3 py-[5px] rounded-full mb-4 block">
            Help
          </span>
          <h1 className="text-[31px] md:text-[40px] font-extrabold text-[#111] leading-[1.1] tracking-[-0.025em] mb-3">
            Frequently asked questions
          </h1>
          <p className="text-[17px] text-[#404040] mb-7 max-w-[640px] leading-[1.7]">
            Everything students ask most, answered plainly. If yours is not here, message us on WhatsApp
            and a real person will reply.
          </p>

          {/* Search */}
          <div className="relative mb-4">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A3A3A3]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21 -4.3-4.3" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search a question, for example refund, cohort or certificate"
              autoComplete="off"
              className="w-full h-[54px] border-[1.5px] border-[#D4D4D4] rounded-xl bg-white pl-12 pr-4 text-[16px] text-[#111] outline-none transition-all placeholder:text-[#A3A3A3]"
              style={{ borderColor: search ? PAGE.primary : PAGE.divider }}
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(cat => {
              const active = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="text-[13px] font-semibold px-[15px] py-2 rounded-full border transition-all cursor-pointer"
                  style={{
                    background: active ? PAGE.primary : PAGE.surface,
                    color: active ? '#fff' : PAGE.textSecondary,
                    borderColor: active ? PAGE.primary : PAGE.border,
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Results */}
          {results.length > 0 ? (
            byCategory.map(group => (
              <section key={group.title} className="mb-8">
                <h2 className="text-[20px] font-extrabold text-[#111] tracking-[-0.01em] mb-3 pl-3 border-l-[3px] border-[#1DB96B]">
                  {group.title}
                </h2>
                <div className="space-y-0">
                  {group.items.map((f, i) => (
                    <details
                      key={`${f.question}-${i}`}
                      className="group bg-white border border-[#E5E5E5] rounded-xl mb-[9px] overflow-hidden transition-colors open:border-[#C7EEDA]"
                    >
                      <summary
                        className="list-none cursor-pointer px-5 py-4 text-[15.5px] font-semibold text-[#111] flex justify-between items-start gap-[14px] [&::-webkit-details-marker]:hidden"
                        style={{ outline: 'none' }}
                      >
                        <span>{f.question}</span>
                        <ChevronDown className="w-4 h-4 text-[#A3A3A3] flex-shrink-0 mt-1 transition-transform group-open:rotate-180 group-open:text-[#1DB96B]" />
                      </summary>
                      <div className="px-5 pb-[18px] text-[15px] text-[#404040] leading-[1.7]">
                        {f.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <p className="text-center py-10 text-[#A3A3A3] text-[15px]">
              Nothing matched that. Try a different word, or message us on WhatsApp.
            </p>
          )}

          {/* Still stuck */}
          <div className="mt-4 bg-white border border-[#E5E5E5] rounded-2xl p-7 text-center">
            <h3 className="text-[19px] font-extrabold text-[#111] mb-1.5">Still stuck?</h3>
            <p className="text-[14.5px] text-[#737373] mb-4">
              Message {firstName} and {firstName} replies. No support desk, no ticket queue. Quickest on WhatsApp.
            </p>
            <div className="flex gap-2.5 justify-center flex-wrap">
              <a
                href={`https://wa.me/${SITE_CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1DB96B] text-white text-[14px] font-bold px-[22px] py-[13px] rounded-[10px] no-underline hover:opacity-90 transition-opacity"
              >
                WhatsApp {firstName}
              </a>
              <a
                href={`mailto:${SITE_CONFIG.founder.email}`}
                className="bg-white border-[1.5px] border-[#D4D4D4] text-[#111] text-[14px] font-semibold px-[22px] py-[13px] rounded-[10px] no-underline hover:border-[#A3A3A3] transition-colors"
              >
                Email {firstName}
              </a>
            </div>
            <p className="mt-3.5 text-[12.5px] text-[#A3A3A3]">
              Daily, 7am to 10pm CAT · {SITE_CONFIG.founder.location} · A physical campus is planned for 2027/28
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
