import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Clock, MessageCircle, Globe, ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/data'

/* Contact page — exact 1:1 from click2skill Contact-CV1V_hvj.js:
   "Talk to George" hero with real founder image,
   contact method cards (phone/WhatsApp/email/hours),
   platform channels, location card, campus note, final CTA.
*/

const firstName = SITE_CONFIG.founder.name.split(' ').slice(-1).join(' ')

export default function ContactPage() {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: '#FAFAFA', color: '#111111' }}>
      {/* Hero */}
      <section style={{ paddingTop: '4rem', paddingBottom: '3rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#1DB96B] bg-[#E8F8F0] px-3 py-1 rounded-full inline-block mb-4">
                Talk to {firstName}
              </p>
              <h1 className="font-head text-4xl md:text-5xl font-extrabold leading-[1.05] mb-6">
                Reach {firstName} directly
              </h1>
              <p className="text-lg text-[#404040] max-w-2xl leading-8">
                Learn2Earn has no support desk — you deal with {firstName} directly. Pick your channel below.
                WhatsApp is the fastest way to get a reply.
              </p>
            </div>
            <div className="hidden lg:block aspect-[4/5] max-h-[480px] overflow-hidden rounded-2xl bg-[#EEF1EE]">
              <Image
                src="/images/teaching.jpg"
                alt={`${SITE_CONFIG.founder.name} teaching a digital skills session`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact methods */}
      <section style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                label: 'Phone',
                value: SITE_CONFIG.founder.phone,
                href: `tel:${SITE_CONFIG.founder.phone.replace(/\s/g, '')}`,
                icon: <Phone className="w-5 h-5" />,
              },
              {
                label: 'WhatsApp',
                value: 'WhatsApp George',
                href: `https://wa.me/${SITE_CONFIG.whatsapp}`,
                icon: <MessageCircle className="w-5 h-5" />,
                external: true,
              },
              {
                label: 'Email',
                value: SITE_CONFIG.founder.email,
                href: `mailto:${SITE_CONFIG.founder.email}`,
                icon: <Mail className="w-5 h-5" />,
              },
              {
                label: 'Available',
                value: SITE_CONFIG.founder.hours,
                icon: <Clock className="w-5 h-5" />,
              },
            ].map((m) => (
              <a
                key={m.label}
                href={m.href}
                target={m.external ? '_blank' : undefined}
                rel={m.external ? 'noopener noreferrer' : undefined}
                className="bg-white border border-[#E5E5E5] rounded-xl p-6 flex flex-col gap-3 hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-[#E8F8F0] rounded-xl flex items-center justify-center text-[#1DB96B]">
                  {m.icon}
                </div>
                <h3 className="font-semibold text-[#111111]">{m.label}</h3>
                <p className="text-sm text-[#737373] leading-snug">{m.value}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Location + map area */}
      <section style={{ paddingTop: '2rem', paddingBottom: '5rem', backgroundColor: '#FFFFFF' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="bg-white border border-[#E5E5E5] rounded-2xl p-6 lg:p-8">
            <h2 className="font-head text-2xl font-extrabold mb-4">Where we are</h2>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5 text-[#1DB96B]" />
                  <span className="font-semibold text-[#111111]">{SITE_CONFIG.founder.location}</span>
                </div>
                <p className="text-[#404040] text-sm mb-4 leading-relaxed">
                  Western Heights, Karuna Road, Lusaka — by appointment only. Everything operates online; 
                  physical visits are for scheduled consultations.
                </p>
                <div className="flex items-center gap-2 text-xs text-[#737373]">
                  <Clock className="w-4 h-4" />
                  {SITE_CONFIG.founder.hours}
                </div>
              </div>
              <div className="flex-1 max-w-md aspect-video overflow-hidden rounded-xl bg-[#EEF1EE]">
                <Image
                  src="/images/gallery-6.jpg"
                  alt="Learn2Earn classroom in Lusaka"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform channels */}
      <section style={{ paddingTop: '2rem', paddingBottom: '5rem' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <h2 className="font-head text-3xl font-extrabold leading-tight mb-8 text-center">
            Platform channels
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                label: 'Learn2Earn WhatsApp',
                value: SITE_CONFIG.whatsapp,
                desc: 'Course questions, payments, support — fastest response',
                href: `https://wa.me/${SITE_CONFIG.whatsapp}`,
                icon: <MessageCircle className="w-5 h-5" />,
              },
              {
                label: 'Billing & subscriptions',
                value: SITE_CONFIG.founder.email,
                desc: 'Receipts, refunds, plan changes, certificates',
                href: `mailto:${SITE_CONFIG.founder.email}`,
                icon: <Mail className="w-5 h-5" />,
              },
              {
                label: 'Free content',
                value: '@george_kasonso',
                desc: 'TikTok lessons, tips, and behind-the-scenes work',
                href: SITE_CONFIG.social.tiktok,
                icon: <Globe className="w-5 h-5" />,
              },
            ].map((m) => (
              <div key={m.label} className="bg-white border border-[#E5E5E5] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#E8F8F0] rounded-xl flex items-center justify-center text-[#1DB96B]">
                    {m.icon}
                  </div>
                  <h3 className="font-semibold text-[#111111]">{m.label}</h3>
                </div>
                <a
                  href={m.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#1DB96B] font-semibold hover:underline"
                >
                  {m.value}
                </a>
                <p className="mt-2 text-xs text-[#737373]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ paddingTop: '2rem', paddingBottom: '8rem' }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-12 text-center">
          <h2 className="font-head text-3xl font-extrabold leading-tight mb-4">
            Still have a question?
          </h2>
          <p className="text-lg text-[#404040] mb-6">
            Message {firstName} on WhatsApp — quickest way to get an answer.
          </p>
          <Link
            href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=Hi%20George%2C%20I%20have%20a%20question%20about%20Learn2Earn`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl px-7 font-bold text-sm"
            style={{ backgroundColor: '#1DB96B', color: '#111111' }}
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Message {firstName} on WhatsApp
          </Link>
        </div>
      </section>
    </div>
  )
}
