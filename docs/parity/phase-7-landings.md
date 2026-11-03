# Phase 7 — Dedicated Landing Pages (5AM, 50K, AI Web Design)

Status: **DONE** — implemented and smoke-tested 2026-11-03.

Ported from reference chunks:

- `FiveAMProductivityLanding-BnwX5Qtf.js` — The 5AM Productivity System
  (course id `b4ca2cb9-4f66-4734-8544-5d0d69594f14`, KES 1,980)
- `First50kLanding-B1y0MbS5.js` — How to Make Your First KES 50,000 Online
  (course id `439b767a-5cce-4aa5-b5eb-faf75862703b`)
- `AIWebDesignLanding-B2cwTuR4.js` — AI Web Design for Beginners
  (course id `e1766169-5561-445f-b135-b09976bb10cb`, price 2,860 /
  normal cost 12,600, "Save 77%")

These three funnels are hardcoded chunks in the reference (no `course_funnels`
rows), so like Phase 6 they bypass the DB map and render dedicated components.

## Rebranding applied

- Elvis → George (all mentions incl. WhatsApp deep-link text, instructor bios,
  signatures); KES → ZMW at rate 0.155 (1,980→307 / 12,600→1,953 / 2,860→443)
- M-Pesa/Paystack → MTN/Airtel money or card via Flutterwave
- wa.me/254… → +260979982819 (from `SITE_CONFIG.whatsapp`)
- Nairobi/Kenya → Lusaka/Zambia; stats rebranded to George's
  (`SITE_CONFIG.founder` numbers, e.g. 3,800+ students instead of 10,000+)

## Deliverables

- `components/landings/offers.tsx` — client `ExitIntentOffer`
  (mouseleave-once-per-session modal mirroring First50kLanding, tracks
  InitiateCheckout via `lib/marketing`) + `CountdownBadge`
  (24h "Launch price ends in" / "Early access price ends in" ticker)
- `components/landings/FiveAMLanding.tsx` — full section order from the
  reference: hero+badges → inside-course grid ×10 + "You will learn" ×9 →
  who-for ×6 + results chips → why-most-people-never → founder story +
  "This Course Is Different" control cards → course content (9 lessons with
  reference durations) → peek inside ×4 → return-100× pricing panel →
  how-the-course-works → promise → final CTA
- `components/landings/First50kLanding.tsx` — hero → stay-broke narrative →
  what-you'll-learn ×6 → IS/NOT-for-you list panels → opening-lesson preview +
  5 learn-in-this-lesson bullets → peek inside ×4 → instructor
  (George J. Kasonso, local photo) → 3 get-started steps → FAQ ×5 with full
  reference answers (KES→ZMW, Paystack→Flutterwave) → final CTA
- `components/landings/AIWebDesignLanding.tsx` — hero ("I Used to Take 7–14
  Days — Now I Can Do It in Days", normal-cost strikethrough, Save 77%) →
  who-for ×4 → learn ×5 + outcome chips ×4 → 2019 origin story + 4
  AI-shift chips + 7–14 days → 2–3 days → 5× panel → old/modern way panels →
  tools grid ×4 → real-websites-you'll-build ×3 → learning experience ×2 →
  "I Built This Course For You" + tools honesty note → duration ×3 →
  before/after ×5+5 + transformation chips ×4 → instructor stats →
  FAQ ×5 with full reference answers → final word + CTA → sticky bottom bar
  ("AI Web Design · GO TO COURSE · ENROLL NOW") + glowing WhatsApp float
- Wrapper pages rewired (dedicated component, no FUNNELS lookup):
  `app/5am/page.tsx`, `app/50k/page.tsx` (dropped the funnels
  `generateStaticParams` re-export — no dynamic segments), and
  `app/ai-web-design/page.tsx`; each with `generateMetadata`-style metadata
  exports
- Images: reference `/images/5am-*`, `/images/50k-*`,
  `/images/ai-web-design/*`, elvis-instructor photos are **not in this repo**
  → replaced with gradient placeholder panels and existing local photos
  (`/images/portrait.jpg` for the 50K instructor portrait)

## Decisions

- CTA hrefs match the already-approved checkout routes:
  `/checkout?course=the-5am-productivity-system` (5AM from reference;
  50K rebranded `how-to-make-your-first-kes-50000`, reference course id kept
  internally only), `/checkout?course=ai-web-design` (matches our course slug).
- 50K landing page no longer routes through `FunnelPageComponent`; DB row
  precedence is untouched for slugs that resolve (e.g. `virtual-assistant`),
  since the reference itself always renders these dedicated chunks.
- Reference offer mechanics preserved as-is: exit-intent modal + 24h launch
  countdown (sessionStorage-guarded, fires once per session, desktop only).

## Parity checklist (filled after smoke test 2026-11-03)

- [x] `/5am` renders dedicated 5AM landing (ZMW 307 ×12, all 9 lesson titles
      + durations, zero "Elvis" mentions)
- [x] `/50k` renders dedicated 50K landing (enroll CTA ×3, ZMW 50,000 hero,
      zero "Elvis" mentions)
- [x] `/ai-web-design` renders dedicated landing (ZMW 443 ×5, Photopea/ChatGPT
      tools, zero "Elvis" mentions)
- [x] Exit-intent modal: client-only (SSR renders nothing), fires on
      `mouseleave` once per session via sessionStorage, tracks
      InitiateCheckout
- [x] Countdown tickers render on mount only (`suppressHydrationWarning`
      not needed — null until timed)
- [x] Other funnels unaffected (`/virtual-assistant` DB funnel → 200,
      `/courses` → 200)
- [x] `npx tsc --noEmit` clean (removed leftover unused imports from
      First50kLanding)
