// Lesson data for course player
import type { QuizAttempt, QuizQuestion } from '@/lib/types'

export const COURSE_LESSONS: Record<string, { id: string; courseId: string; title: string; description: string; videoUrl?: string; duration?: string; sortOrder: number; isFree: boolean; status: 'published' | 'draft'; isPreview?: boolean }[]> = {
  'ai-automation-bootcamp': [
    { id: 'ai-automation-bootcamp-1', courseId: 'ai-automation-bootcamp', title: 'Introduction to AI Automation', description: 'Understand what AI automation is and how it can transform your business.', videoUrl: 'https://player.vimeo.com/video/ai-automation-1', duration: '12:30', sortOrder: 1, isFree: true, status: 'published', isPreview: true },
    { id: 'ai-automation-bootcamp-2', courseId: 'ai-automation-bootcamp', title: 'Make.com from Scratch', description: 'Build your first automation scenario in Make.com.', videoUrl: 'https://player.vimeo.com/video/ai-automation-2', duration: '18:45', sortOrder: 2, isFree: false, status: 'published' },
    { id: 'ai-automation-bootcamp-3', courseId: 'ai-automation-bootcamp', title: 'Google Sheets as Automation Memory', description: 'Use Google Sheets to store and retrieve automation data.', videoUrl: 'https://player.vimeo.com/video/ai-automation-3', duration: '15:20', sortOrder: 3, isFree: false, status: 'published' },
    { id: 'ai-automation-bootcamp-4', courseId: 'ai-automation-bootcamp', title: 'AI Brain Integration', description: 'Connect AI to your automation flows via API keys.', videoUrl: 'https://player.vimeo.com/video/ai-automation-4', duration: '22:10', sortOrder: 4, isFree: false, status: 'published' },
    { id: 'ai-automation-bootcamp-5', courseId: 'ai-automation-bootcamp', title: 'Gmail Auto-Reply Bot', description: 'Build a bot that writes custom email replies automatically.', videoUrl: 'https://player.vimeo.com/video/ai-automation-5', duration: '20:00', sortOrder: 5, isFree: false, status: 'published' },
    { id: 'ai-automation-bootcamp-6', courseId: 'ai-automation-bootcamp', title: 'Facebook Comments to Content', description: 'Turn Facebook comments into content ideas automatically.', videoUrl: 'https://player.vimeo.com/video/ai-automation-6', duration: '16:30', sortOrder: 6, isFree: false, status: 'published' },
    { id: 'ai-automation-bootcamp-7', courseId: 'ai-automation-bootcamp', title: 'Make.com vs Zapier', description: 'Compare the two platforms and choose the right one.', videoUrl: 'https://player.vimeo.com/video/ai-automation-7', duration: '14:15', sortOrder: 7, isFree: false, status: 'published' },
    { id: 'ai-automation-bootcamp-8', courseId: 'ai-automation-bootcamp', title: 'Selling Automation Services', description: 'Package, price and sell automation to Zambian businesses.', videoUrl: 'https://player.vimeo.com/video/ai-automation-8', duration: '19:50', sortOrder: 8, isFree: false, status: 'published' },
  ],
  'ai-web-design': [
    { id: 'ai-web-design-1', courseId: 'ai-web-design', title: 'How Websites Work', description: 'Domains, hosting, and website structure explained.', videoUrl: 'https://player.vimeo.com/video/ai-web-design-1', duration: '10:00', sortOrder: 1, isFree: true, status: 'published', isPreview: true },
    { id: 'ai-web-design-2', courseId: 'ai-web-design', title: 'Planning with ChatGPT', description: 'Plan your complete website using AI prompts.', videoUrl: 'https://player.vimeo.com/video/ai-web-design-2', duration: '14:30', sortOrder: 2, isFree: false, status: 'published' },
    { id: 'ai-web-design-3', courseId: 'ai-web-design', title: 'Building with Lovable', description: 'Design your website visually using Lovable.', videoUrl: 'https://player.vimeo.com/video/ai-web-design-3', duration: '25:00', sortOrder: 3, isFree: false, status: 'published' },
    { id: 'ai-web-design-4', courseId: 'ai-web-design', title: 'Publishing Your Site', description: 'Go live with your AI-built website.', videoUrl: 'https://player.vimeo.com/video/ai-web-design-4', duration: '11:00', sortOrder: 4, isFree: false, status: 'published' },
  ],
  'meta-ads-mastery-from-setup-to-sales': [
    { id: 'meta-ads-mastery-1', courseId: 'meta-ads-mastery-from-setup-to-sales', title: 'Meta Ads Ecosystem', description: 'Understand Ads Manager, Business Suite, and Pixel.', videoUrl: 'https://player.vimeo.com/video/meta-mastery-1', duration: '15:00', sortOrder: 1, isFree: true, status: 'published', isPreview: true },
    { id: 'meta-ads-mastery-2', courseId: 'meta-ads-mastery-from-setup-to-sales', title: 'Campaign Structure', description: 'Campaign → Ad Set → Ad structure explained.', videoUrl: 'https://player.vimeo.com/video/meta-mastery-2', duration: '18:00', sortOrder: 2, isFree: false, status: 'published' },
    { id: 'meta-ads-mastery-3', courseId: 'meta-ads-mastery-from-setup-to-sales', title: 'Ad Objectives', description: 'The 5 main Meta Ads objectives and when to use each.', videoUrl: 'https://player.vimeo.com/video/meta-mastery-3', duration: '16:00', sortOrder: 3, isFree: false, status: 'published' },
    { id: 'meta-ads-mastery-4', courseId: 'meta-ads-mastery-from-setup-to-sales', title: 'Ad Copy with AI', description: 'Write high-converting copy using ChatGPT.', videoUrl: 'https://player.vimeo.com/video/meta-mastery-4', duration: '17:00', sortOrder: 4, isFree: false, status: 'published' },
    { id: 'meta-ads-mastery-5', courseId: 'meta-ads-mastery-from-setup-to-sales', title: 'Ad Creatives with Canva', description: 'Design effective ad creatives.', videoUrl: 'https://player.vimeo.com/video/meta-mastery-5', duration: '15:00', sortOrder: 5, isFree: false, status: 'published' },
  ],
  'social-media-management-with-ai-august-2026': [
    { id: 'smm-ai-aug-1', courseId: 'social-media-management-with-ai-august-2026', title: 'SMM Foundations', description: 'What social media management is and what clients pay for.', videoUrl: 'https://player.vimeo.com/video/smm-aug-1', duration: '14:00', sortOrder: 1, isFree: true, status: 'published', isPreview: true },
    { id: 'smm-ai-aug-2', courseId: 'social-media-management-with-ai-august-2026', title: 'Client Onboarding', description: 'Set expectations and boundaries with clients.', videoUrl: 'https://player.vimeo.com/video/smm-aug-2', duration: '16:00', sortOrder: 2, isFree: false, status: 'published' },
    { id: 'smm-ai-aug-3', courseId: 'social-media-management-with-ai-august-2026', title: 'AI Toolkit', description: 'Build your software and AI toolkit.', videoUrl: 'https://player.vimeo.com/video/smm-aug-3', duration: '18:00', sortOrder: 3, isFree: false, status: 'published' },
    { id: 'smm-ai-aug-4', courseId: 'social-media-management-with-ai-august-2026', title: 'Content Pillars', description: 'Create content pillars and a full month of content.', videoUrl: 'https://player.vimeo.com/video/smm-aug-4', duration: '20:00', sortOrder: 4, isFree: false, status: 'published' },
    { id: 'smm-ai-aug-5', courseId: 'social-media-management-with-ai-august-2026', title: 'AI Content Publishing', description: 'Go from brief to published post using AI.', videoUrl: 'https://player.vimeo.com/video/smm-aug-5', duration: '17:00', sortOrder: 5, isFree: false, status: 'published' },
  ],
  'the-5am-productivity-system': [
    { id: '5am-1', courseId: 'the-5am-productivity-system', title: 'Personal Systems', description: 'Build simple systems for daily structure.', videoUrl: 'https://player.vimeo.com/video/5am-1', duration: '12:00', sortOrder: 1, isFree: true, status: 'published', isPreview: true },
    { id: '5am-2', courseId: 'the-5am-productivity-system', title: 'Decision Fatigue', description: 'Reduce mental overload and plan your day.', videoUrl: 'https://player.vimeo.com/video/5am-2', duration: '14:00', sortOrder: 2, isFree: false, status: 'published' },
    { id: '5am-3', courseId: 'the-5am-productivity-system', title: 'Focused Blocks', description: 'Work in focused blocks and finish tasks.', videoUrl: 'https://player.vimeo.com/video/5am-3', duration: '16:00', sortOrder: 3, isFree: false, status: 'published' },
    { id: '5am-4', courseId: 'the-5am-productivity-system', title: 'Energy Management', description: 'Protect energy levels for better productivity.', videoUrl: 'https://player.vimeo.com/video/5am-4', duration: '13:00', sortOrder: 4, isFree: false, status: 'published' },
    { id: '5am-5', courseId: 'the-5am-productivity-system', title: 'Discipline Through Structure', description: 'Create work and rest boundaries.', videoUrl: 'https://player.vimeo.com/video/5am-5', duration: '15:00', sortOrder: 5, isFree: false, status: 'published' },
  ],
  'computer-digital-skills-masterclass': [
    { id: 'cdl-1', courseId: 'computer-digital-skills-masterclass', title: 'Computer Fundamentals', description: 'Understand what a computer really is.', videoUrl: 'https://player.vimeo.com/video/cdl-1', duration: '15:00', sortOrder: 1, isFree: true, status: 'published', isPreview: true },
    { id: 'cdl-2', courseId: 'computer-digital-skills-masterclass', title: 'File Management', description: 'Organize files, folders, and storage.', videoUrl: 'https://player.vimeo.com/video/cdl-2', duration: '18:00', sortOrder: 2, isFree: false, status: 'published' },
    { id: 'cdl-3', courseId: 'computer-digital-skills-masterclass', title: 'Google Workspace', description: 'Docs, Sheets, Slides, Gmail, and Calendar.', videoUrl: 'https://player.vimeo.com/video/cdl-3', duration: '25:00', sortOrder: 3, isFree: false, status: 'published' },
    { id: 'cdl-4', courseId: 'computer-digital-skills-masterclass', title: 'Internet Safety', description: 'Passwords, 2FA, phishing awareness.', videoUrl: 'https://player.vimeo.com/video/cdl-4', duration: '12:00', sortOrder: 4, isFree: false, status: 'published' },
    { id: 'cdl-5', courseId: 'computer-digital-skills-masterclass', title: 'Canva Basics', description: 'Design posters, logos, and business cards.', videoUrl: 'https://player.vimeo.com/video/cdl-5', duration: '20:00', sortOrder: 5, isFree: false, status: 'published' },
  ],
  'canva-masterclass-2025': [
    { id: 'canva-1', courseId: 'canva-masterclass-2025', title: 'Canva Fundamentals', description: 'Learn the Canva interface and basic tools.', videoUrl: 'https://player.vimeo.com/video/canva-1', duration: '15:00', sortOrder: 1, isFree: true, status: 'published', isPreview: true },
    { id: 'canva-2', courseId: 'canva-masterclass-2025', title: 'Social Media Graphics', description: 'Create posts, reels, and stories for all platforms.', videoUrl: 'https://player.vimeo.com/video/canva-2', duration: '16:00', sortOrder: 2, isFree: false, status: 'published' },
    { id: 'canva-3', courseId: 'canva-masterclass-2025', title: 'Brand Kit', description: 'Set up brand colors, fonts, and logos.', videoUrl: 'https://player.vimeo.com/video/canva-3', duration: '12:00', sortOrder: 3, isFree: false, status: 'published' },
    { id: 'canva-4', courseId: 'canva-masterclass-2025', title: 'Presentations', description: 'Create professional presentations.', videoUrl: 'https://player.vimeo.com/video/canva-4', duration: '20:00', sortOrder: 4, isFree: false, status: 'published' },
    { id: 'canva-5', courseId: 'canva-masterclass-2025', title: 'Print Design', description: 'Flyers, posters, and business cards.', videoUrl: 'https://player.vimeo.com/video/canva-5', duration: '20:00', sortOrder: 5, isFree: false, status: 'published' },
  ],
  'ai-productivity-digital-workflows': [
    { id: 'ai-productivity-1', courseId: 'ai-productivity-digital-workflows', title: 'AI Fundamentals', description: 'Understand AI and its applications.', videoUrl: 'https://player.vimeo.com/video/ai-productivity-1', duration: '15:00', sortOrder: 1, isFree: true, status: 'published', isPreview: true },
    { id: 'ai-productivity-2', courseId: 'ai-productivity-digital-workflows', title: 'Prompt Engineering', description: 'Writing effective AI prompts.', videoUrl: 'https://player.vimeo.com/video/ai-productivity-2', duration: '14:30', sortOrder: 2, isFree: false, status: 'published' },
    { id: 'ai-productivity-3', courseId: 'ai-productivity-digital-workflows', title: 'Content Creation with AI', description: 'Create social media posts, blogs, and emails.', videoUrl: 'https://player.vimeo.com/video/ai-productivity-3', duration: '18:00', sortOrder: 3, isFree: false, status: 'published' },
    { id: 'ai-productivity-4', courseId: 'ai-productivity-digital-workflows', title: 'Workflow Automation', description: 'Automate repetitive tasks with AI.', videoUrl: 'https://player.vimeo.com/video/ai-productivity-4', duration: '22:00', sortOrder: 4, isFree: false, status: 'published' },
    { id: 'ai-productivity-5', courseId: 'ai-productivity-digital-workflows', title: 'AI Tools Stack', description: 'Building your AI toolkit.', videoUrl: 'https://player.vimeo.com/video/ai-productivity-5', duration: '15:00', sortOrder: 5, isFree: false, status: 'published' },
  ],
};

// Skill check questions for each course
export const COURSE_SKILL_CHECKS: Record<string, { question: string; options: string[]; correct: number }[]> = {
  'ai-automation-bootcamp': [
    { question: 'What is AI automation?', options: ['Using AI to perform tasks automatically', 'Watching AI movies', 'Buying AI robots', 'Reading about AI'], correct: 0 },
    { question: 'Which tool is used for workflow automation?', options: ['Make.com', 'Microsoft Word', 'Adobe Photoshop', 'Spotify'], correct: 0 },
    { question: 'What does an AI agent do?', options: ['Executes tasks autonomously', 'Plays music', 'Takes photos', 'Sends emails only'], correct: 0 },
  ],
  'ai-web-design': [
    { question: 'What is AI web design?', options: ['Building websites using AI tools', 'Drawing website mockups', 'Writing HTML by hand', 'Using Photoshop'], correct: 0 },
    { question: 'Which AI tool can generate website layouts?', options: ['Lovable', 'Microsoft Excel', 'WhatsApp', 'Calculator'], correct: 0 },
    { question: 'What is responsive design?', options: ['Websites that work on all devices', 'Websites that load fast', 'Websites with animations', 'Websites with forms'], correct: 0 },
  ],
  'meta-ads-mastery-from-setup-to-sales': [
    { question: 'What is Meta Ads?', options: ['Facebook and Instagram advertising platform', 'Google search ads', 'TikTok ads', 'Email marketing'], correct: 0 },
    { question: 'What is a pixel?', options: ['Tracking code for ads', 'A type of image', 'A social media post', 'A video format'], correct: 0 },
    { question: 'What is CAC?', options: ['Customer Acquisition Cost', 'Cost Ad Campaign', 'Click Action Count', 'Campaign Audience Count'], correct: 0 },
  ],
  'social-media-management-with-ai-august-2026': [
    { question: 'What is social media management?', options: ['Managing social media accounts for clients', 'Posting personal photos', 'Watching videos', 'Playing games'], correct: 0 },
    { question: 'What is a content calendar?', options: ['Schedule of planned posts', 'Physical calendar', 'Spreadsheet of expenses', 'Email list'], correct: 0 },
    { question: 'Which platforms are covered?', options: ['Facebook, Instagram, TikTok, LinkedIn', 'Only Facebook', 'Only TikTok', 'Only LinkedIn'], correct: 0 },
  ],
  'the-5am-productivity-system': [
    { question: 'What is the 5AM productivity system?', options: ['Waking up at 5AM for focused work', 'Working until 5AM', 'Sleeping 5 hours', 'Working 5 days'], correct: 0 },
    { question: 'What is decision fatigue?', options: ['Making too many decisions tires you', 'Making no decisions', 'Making quick decisions', 'Making easy decisions'], correct: 0 },
    { question: 'What is time blocking?', options: ['Dedicating time blocks to tasks', 'Working all day', 'Working at night', 'Working weekends'], correct: 0 },
  ],
};

// Certificate data for verification
export const SAMPLE_CERTIFICATES: Record<string, any> = {
  'L2E-2026-001': { certificateId: 'L2E-2026-001', studentName: 'Mutale Chanda', courseTitle: 'AI Automation Bootcamp', courseSlug: 'ai-automation-bootcamp', issueDate: '2026-10-15', isVerified: true },
  'L2E-2026-002': { certificateId: 'L2E-2026-002', studentName: 'Lucy Banda', courseTitle: 'Social Media Management with AI', courseSlug: 'social-media-management-with-ai-august-2026', issueDate: '2026-10-10', isVerified: true },
  'L2E-2026-003': { certificateId: 'L2E-2026-003', studentName: 'Sarai Mwale', courseTitle: 'Claude AI Class', courseSlug: 'claude-ai-class', issueDate: '2026-10-05', isVerified: true },
  'L2E-2026-004': { certificateId: 'L2E-2026-004', studentName: 'Gideon Phiri', courseTitle: 'The 5AM Productivity System', courseSlug: 'the-5am-productivity-system', issueDate: '2026-10-01', isVerified: true },
  'L2E-2026-005': { certificateId: 'L2E-2026-005', studentName: 'Sandy Tembo', courseTitle: 'Canva Masterclass', courseSlug: 'canva-masterclass-2025', issueDate: '2026-09-25', isVerified: true },
};

// Funnel data for landing pages
export const FUNNELS: Record<string, any> = {
  '50k': { slug: '50k', title: 'How to Make Your First ZMW 50,000 Online', description: 'Turn your existing skills into real online income. Practical, step-by-step.', price: 3999, originalPrice: 7990, ctaText: 'Start Making Your First ZMW 50,000', ctaHref: '/checkout?course=how-to-make-your-first-kes-50000', features: ['Identify income-generating skills', 'Turn skills into sellable offers', 'Position yourself as a service provider', 'Start selling with confidence'], testimonials: [{ name: 'Sarah Mwangi', role: 'Freelancer', content: 'I made my first ZMW 50K within 3 weeks of applying these methods.', rating: 5 }, { name: 'James Otieno', role: 'Virtual Assistant', content: 'Practical and actionable. No fluff, just results.', rating: 5 }], faqs: [ { question: 'Do I need special skills?', answer: 'No. You will learn to monetize what you already know.' }, { question: 'How fast can I earn?', answer: 'Many students see results within 2-4 weeks of consistent action.' } ] },
  '5am-challenge': { slug: '5am-challenge', title: 'The 5AM Productivity Challenge', description: 'Build personal systems for focus, discipline, and consistent results. 21-day challenge.', price: 1940, originalPrice: 3500, ctaText: 'Join the 5AM Challenge', ctaHref: '/checkout?course=the-5am-productivity-system', features: ['21-day structured challenge', 'Daily accountability', 'Morning routine templates', 'Productivity tracking'], testimonials: [{ name: 'Grace Wanjiru', role: 'Student', content: 'The 5AM challenge transformed my mornings completely.', rating: 5 }, { name: 'David Ochieng', role: 'Entrepreneur', content: 'Best productivity investment I made this year.', rating: 5 }], faqs: [ { question: 'Do I need to wake up at 5AM?', answer: 'The challenge is designed around 5AM, but you can adapt it to your schedule.' }, { question: 'How long is the challenge?', answer: '21 days of structured daily activities.' } ] },
  'ai-class': { slug: 'ai-class', title: 'AI for Beginners Class', description: 'Five live evenings with George — what AI is, Claude, ChatGPT, Gemini, AI video and how to use AI to get more done.', price: 2500, originalPrice: 3790, ctaText: 'Reserve My Seat', ctaHref: '/checkout?cohort=ai-for-beginners-nov-2026', features: ['5 live evenings', 'Q&A with George every night', 'Recordings included', 'Certificate of completion'], testimonials: [{ name: 'Peter Kamau', role: 'Business Owner', content: 'The AI class opened my eyes to so many possibilities.', rating: 5 }, { name: 'Faith Njeri', role: 'Student', content: 'George makes AI simple and practical.', rating: 5 }], faqs: [ { question: 'Do I need coding experience?', answer: 'No. This is designed for complete beginners.' }, { question: 'Are sessions recorded?', answer: 'Yes, all sessions are recorded and shared.' } ] },
  'va-class': { slug: 'va-class', title: 'Virtual Assistant Classes', description: 'Learn the work, the tools and where to find clients. 10 live evenings built for complete beginners.', price: 5690, originalPrice: 7000, ctaText: 'Reserve My Seat', ctaHref: '/checkout?cohort=va-classes-october-2026', features: ['10 live evenings', 'Core VA tools and skills', 'Client acquisition strategies', 'Portfolio building'], testimonials: [{ name: 'Mercy Achieng', role: 'VA', content: 'I got my first client within 2 weeks of finishing the class.', rating: 5 }, { name: 'Brian Otieno', role: 'Freelancer', content: 'Practical, hands-on VA training.', rating: 5 }], faqs: [ { question: 'Do I need experience?', answer: 'No. Built for complete beginners.' }, { question: 'Can I work from home?', answer: 'Yes, all training is online and remote-work focused.' } ] },
  'ads-oct-2026': { slug: 'ads-oct-2026', title: 'Meta Ads Mastery: From Setup to Sales', description: 'Run profitable Meta Ads campaigns. From setup to sales in the Zambian market.', price: 2690, originalPrice: 5500, ctaText: 'Enroll in Meta Ads Mastery', ctaHref: '/checkout?course=meta-ads-mastery-from-setup-to-sales', features: ['12 lessons', 'Meta Ads ecosystem', 'Lead and Sales campaigns', 'Zambian market focus'], testimonials: [{ name: 'Kelvin Mwangi', role: 'Business Owner', content: 'My ads are finally profitable after this course.', rating: 5 }, { name: 'Esther Nkatha', role: 'Marketer', content: 'Practical, step-by-step Meta Ads training.', rating: 5 }], faqs: [ { question: 'Do I need ad budget?', answer: 'You will learn to start small and scale profitable campaigns.' }, { question: 'Is this for beginners?', answer: 'Yes, covers everything from setup to advanced campaigns.' } ] },
  'smm-meta-2027': { slug: 'smm-meta-2027', title: 'Social Media Management + Meta Ads Bundle', description: 'Two full courses, one payment. Manage social media AND run ads that convert.', price: 4690, originalPrice: 7000, ctaText: 'Get the Bundle', ctaHref: '/checkout?bundle=smm-meta-bundle', features: ['Two full courses', 'One payment', 'Certificate for each course', 'Save ZMW 2,310 compared to buying separately'], testimonials: [{ name: 'Diana Mutai', role: 'SMM Freelancer', content: 'This bundle gave me everything I need to serve clients.', rating: 5 }, { name: 'Robert Kibiwot', role: 'Agency Owner', content: 'Best value for money in digital skills training.', rating: 5 }], faqs: [ { question: 'Can I buy courses separately?', answer: 'Yes, but the bundle saves you money.' }, { question: 'Do I get certificates?', answer: 'Yes, one certificate for each course completed.' } ] },
  'vibe-coding': { slug: 'vibe-coding', title: 'Vibe Coding for Beginners', description: 'Build websites and digital products with Lovable, Claude, Supabase, and Paystack. No coding required.', price: 4673, originalPrice: 12980, ctaText: 'Start Vibe Coding', ctaHref: '/checkout?course=vibe-coding-for-beginners', features: ['No coding required', 'Build real websites', 'Integrate payments', 'Deploy to production'], testimonials: [{ name: 'Alice Muthoni', role: 'Entrepreneur', content: 'I built my business website without writing code.', rating: 5 }, { name: 'Michael Otieno', role: 'Creator', content: 'Vibe coding changed how I build products.', rating: 5 }], faqs: [ { question: 'Do I need coding skills?', answer: 'Absolutely none. This is designed for non-coders.' }, { question: 'What tools do I need?', answer: 'Lovable, Claude, Supabase, and Paystack accounts (free tiers work).' } ] },
  'video-editing': { slug: 'video-editing', title: 'CutPro: Video Editing with CapCut', description: 'Master CapCut for TikTok, YouTube, and Instagram. Cuts, transitions, color grading, audio, captions, and social media exports.', price: 2479, originalPrice: 9876, ctaText: 'Start Video Editing', ctaHref: '/checkout?course=cutpro-video-editing-capcut', features: ['CapCut from zero to professional', 'Cuts, trims, and transitions', 'Color grading and visual enhancement', 'Social media editing (Reels, TikTok, Shorts)'], testimonials: [{ name: 'Brian Otieno', role: 'Content Creator', content: 'My TikTok videos went from amateur to professional.', rating: 5 }, { name: 'Grace Wambui', role: 'YouTuber', content: 'CapCut editing made simple and practical.', rating: 5 }], faqs: [ { question: 'Do I need experience?', answer: 'No. Starts from absolute basics.' }, { question: 'What software?', answer: 'CapCut desktop (free version works).' } ] },
  'virtual-assistant': { slug: 'virtual-assistant', title: 'How to Become a Virtual Assistant', description: 'Complete guide to starting a VA career. Tools, skills, clients, and pricing for the African market.', price: 2567, originalPrice: 6549, ctaText: 'Start Your VA Career', ctaHref: '/checkout?course=how-to-become-a-virtual-assistant', features: ['Portfolio building', 'Client acquisition', 'Pricing and packages', 'Remote work skills'], testimonials: [{ name: 'Mercy Njeri', role: 'VA', content: 'I landed my first client within days of finishing.', rating: 5 }, { name: 'Samuel Kiprotich', role: 'Freelancer', content: 'Practical VA training that works.', rating: 5 }], faqs: [ { question: 'Can I work internationally?', answer: 'Yes. The skills apply globally.' }, { question: 'How soon can I earn?', answer: 'Many students get clients within 2-4 weeks.' } ] },
  'virtual-assistant-classes-in-kenya': { slug: 'virtual-assistant-classes-in-kenya', title: 'VA Classes October 2026', description: '10 live evenings — VA tools, client acquisition, pricing, and delivery for complete beginners.', price: 5690, originalPrice: 7000, ctaText: 'Reserve My Seat', ctaHref: '/checkout?cohort=va-classes-october-2026', features: ['10 live evenings', 'Google Workspace and tools', 'Client finding strategies', 'Pricing and delivery'], testimonials: [{ name: 'Esther Akoth', role: 'VA Student', content: 'The live format made all the difference.', rating: 5 }, { name: 'John Mwangi', role: 'Aspiring VA', content: 'George teaches exactly what clients need.', rating: 5 }], faqs: [ { question: 'Are sessions recorded?', answer: 'Yes, all sessions are recorded.' }, { question: 'Do I get a certificate?', answer: 'Yes, upon completion of the program.' } ] },
  'cdl': { slug: 'cdl', title: 'Computer & Digital Skills Masterclass', description: 'Go from computer beginner to confident digital worker. Google Workspace, email, internet, file management, and online safety.', price: 2890, originalPrice: 7690, ctaText: 'Start Computer Skills', ctaHref: '/checkout?course=computer-digital-skills-masterclass', features: ['Computer fundamentals', 'Google Workspace mastery', 'Internet safety', 'Canva design basics'], testimonials: [{ name: 'Peter Kamau', role: 'Beginner', content: 'I went from zero to confident in 2 weeks.', rating: 5 }, { name: 'Mary Achieng', role: 'Office Worker', content: 'Perfect for complete beginners.', rating: 5 }], faqs: [ { question: 'Do I need a laptop?', answer: 'A laptop helps but many skills work on smartphones too.' }, { question: 'Is this for absolute beginners?', answer: 'Yes. No prior computer knowledge needed.' } ] },
  'meta-ads': { slug: 'meta-ads', title: 'Meta Ads Mastery: From Setup to Sales', description: 'Run profitable Meta Ads campaigns in the Zambian market.', price: 2690, originalPrice: 5500, ctaText: 'Enroll Now', ctaHref: '/checkout?course=meta-ads-mastery-from-setup-to-sales', features: ['Meta Ads ecosystem', 'Campaign structure', 'Lead and Sales campaigns', 'WhatsApp lead generation'], testimonials: [{ name: 'Kelvin Mwangi', role: 'Business Owner', content: 'My ads are finally profitable.', rating: 5 }, { name: 'Esther Nkatha', role: 'Marketer', content: 'Practical, step-by-step Meta Ads training.', rating: 5 }], faqs: [ { question: 'Do I need ad budget?', answer: 'Start small and scale what works.' }, { question: 'Is this for beginners?', answer: 'Yes, from setup to advanced campaigns.' } ] },
};
/**
 * Quiz attempt store — in-memory for now. In production, this is a Supabase table.
 * Key: lessonId -> array of attempts for that lesson (most recent first).
 */
export const QUIZ_ATTEMPTS: Record<string, QuizAttempt[]> = {};

/**
 * Helper to record a quiz attempt.
 */
export function recordQuizAttempt(attempt: QuizAttempt) {
  const attempts = QUIZ_ATTEMPTS[attempt.lessonId] ?? [];
  attempts.unshift(attempt);
  QUIZ_ATTEMPTS[attempt.lessonId] = attempts;
}

/**
 * Get all attempts for a lesson (most recent first).
 */
export function getQuizAttempts(lessonId: string): QuizAttempt[] {
  return QUIZ_ATTEMPTS[lessonId] ?? [];
}

/**
 * Get the best (highest score) attempt for a lesson.
 */
export function getBestQuizAttempt(lessonId: string): QuizAttempt | null {
  const attempts = QUIZ_ATTEMPTS[lessonId] ?? [];
  if (attempts.length === 0) return null;
  return attempts.reduce((best, a) => (a.score > best.score ? a : best));
}

/**
 * Check if a lesson has been passed (any attempt with passed === true).
 */
export function isLessonPassed(lessonId: string): boolean {
  return QUIZ_ATTEMPTS[lessonId]?.some((a) => a.passed) ?? false;
}
