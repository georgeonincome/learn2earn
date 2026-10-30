'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Smartphone, MessageCircle } from 'lucide-react'
import { BOOKS } from '@/lib/books-data'
import { SITE_CONFIG } from '@/lib/data'

export default async function BookCheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const book = BOOKS.find((b) => b.slug === slug)

  if (!book) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-[#10201A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#111111] mb-2">Book Not Found</h1>
          <Link href="/books" className="text-[#1DB96B] font-medium hover:text-[#17A05D]">
            Browse Books <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    )
  }

  const [status, setStatus] = useState<'form' | 'done'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (label: string, value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {})
    setCopied(label)
    setTimeout(() => setCopied(null), 1800)
  }

  const emailRegex = new RegExp(/^\S+@\S+\.\S+$/)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Enter your full name.'
    if (!emailRegex.test(email)) errs.email = 'Enter a valid email address.'
    if (phone.trim().length < 9) errs.phone = 'Enter your mobile money number.'
    if (errs.name || errs.email || errs.phone) return
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] text-[#10201A] flex items-center justify-center px-5">
        <div className="flex max-w-[460px] flex-col items-center gap-5 rounded-3xl bg-white p-10 text-center shadow-xl">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F6EF] text-[#0F7A42]">
            <Check className="h-7 w-7" />
          </span>
          <h2 className="text-2xl font-extrabold text-[#111111]">Order Received</h2>
          <p className="text-sm text-[#737373] mb-6">
            We&apos;ve sent the download instructions for <strong>{book.title}</strong> to{' '}
            <strong>{email}</strong>. Complete the payment on your phone — access opens the
            moment it clears.
          </p>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#111111]">Book:</span>
              <span className="font-semibold">{book.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#111111]">Price:</span>
              <span className="font-bold text-[#1DB96B]">ZMW {book.price.toLocaleString('en-ZM')}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#111111]">Email:</span>
              <span className="text-sm font-medium">{email}</span>
            </div>
          </div>
          <Link href="/books" className="text-xs font-bold text-[#1DB96B] hover:text-[#17A05D] mt-4">
            Back to books
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#10201A]">
      <div className="mx-auto max-w-[480px] px-5 py-20">
        <div className="rounded-2xl border border-[#E5E5E5] bg-white p-8">
          <h1 className="text-2xl font-bold text-[#111111] mb-2">Complete Your Order</h1>
          <p className="text-sm text-[#737373] mb-8">
            Pay with MTN/Airtel mobile money or card. Get instant access to <strong>{book.title}</strong>.
          </p>

          {/* Book info */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-lg bg-[#EEF1EE] flex items-center justify-center">
                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#111111]">{book.title}</p>
                <p className="text-xs text-[#737373]">{book.category}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#111111]">Price</span>
              <span className="text-lg font-bold text-[#1DB96B]">
                ZMW {book.price.toLocaleString('en-ZM')}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="space-y-4">
            <label htmlFor="ck-name" className="text-[13px] font-bold text-[#111111] block mb-1">
              Full name
            </label>
            <input
              id="ck-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="h-[50px] w-full rounded-xl border border-[#E5E5E5] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]/20"
            />

            <label htmlFor="ck-email" className="text-[13px] font-bold text-[#111111] block mt-4 mb-1">
              Email address
            </label>
            <input
              id="ck-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-[50px] w-full rounded-xl border border-[#E5E5E5] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]/20"
            />

            <label htmlFor="ck-phone" className="text-[13px] font-bold text-[#111111] block mt-4 mb-1">
              Mobile money number
            </label>
            <input
              id="ck-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="097 / 096 / 095 ..."
              className="h-[50px] w-full rounded-xl border border-[#E5E5E5] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]/20"
            />

            <div className="mt-6 border-t border-[#E5E5E5] pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-[#111111]">{book.title}</p>
                  <p className="text-[11px] text-[#737373]">E-book · Instant download</p>
                </div>
                <div className="text-right">
                  <strong className="block text-[23px] text-[#1DB96B] font-bold">
                    ZMW {book.price.toLocaleString('en-ZM')}
                  </strong>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-6 flex min-h-[58px] w-full items-center justify-center gap-2 rounded-xl text-base font-bold text-white bg-[#1DB96B] hover:bg-[#17A05D] font-bold transition-colors"
            >
              <Smartphone className="h-5 w-5" /> Pay ZMW {book.price.toLocaleString('en-ZM')}
            </button>
            <p className="text-center text-xs text-[#737373] mt-4">
              By paying you agree to our Terms and Refund policy. Secured by Flutterwave.
            </p>
          </form>

          {/* Manual payment */}
          <div id="manual" className="flex flex-col gap-4 rounded-2xl border border-[#E5E5E5] bg-white p-6 mt-8">
            <h2 className="text-[19px] font-bold text-[#111111]">Prefer to pay directly?</h2>
            <p className="text-xs text-[#737373] mb-4">
              Send the amount to the mobile money number below, then WhatsApp George the
              confirmation message. Access is activated by hand — usually within minutes.
            </p>
            {[
              ['MTN Mobile Money', SITE_CONFIG.founder.phone],
              ['Airtel Money', SITE_CONFIG.founder.phone],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-2 rounded-[10px] border border-[#E5E5E5] p-3.5">
                <div>
                  <small className="block text-[11px] font-bold text-[#737373]">{label}</small>
                  <strong className="my-1 block text-[19px] text-[#111111]">{value}</strong>
                  <span className="block text-[11px] text-[#737373]">{SITE_CONFIG.founder.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => copy(label, value)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-bold text-[#1DB96B] border border-[#E5E5E5]"
                >
                  <span className="w-3 h-3" /> {copied === label ? 'Copied' : 'Copy'}
                </button>
              </div>
            ))}
            <a
              href={`https://wa.me/${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(`Hi George, I have paid for ${book.title} (ZMW ${book.price.toLocaleString('en-ZM')}) on Learn2Earn. Here is the confirmation message:`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-9 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold bg-[#1DB96B] text-[#111111]"
            >
              <Smartphone className="h-4 w-4" /> Send confirmation on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}