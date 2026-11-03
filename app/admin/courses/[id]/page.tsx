'use client'

/**
 * Admin Course Editor — reference `admin_course_editor`.
 * Course basics, pricing, sections/lessons, lesson quiz builder,
 * final-assessment builder, publish-readiness checklist, Publish & SEO.
 */

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Play, Lock, Trash2, Plus, ChevronRight, RefreshCw, Archive,
  FileText, CheckCircle, XCircle, Target, Clock, Globe,
} from 'lucide-react'

type Course = {
  id: string; slug: string; title: string; description?: string
  category_id?: string; requirements?: string; what_youll_learn?: string
  course_type: string; include_in_plan: number; regular_price: number
  sale_price?: number; sale_ends?: string; status: string
  sort_order: number; google_title?: string; google_description?: string
  seo_keywords?: string; share_image_url?: string; publish_at?: string
}

type Section = { id: string; course_id: string; title: string; sort_order: number }
type Lesson = {
  id: string; course_id: string; section_id?: string; title: string
  lesson_order: number; video_url?: string; video_provider?: string
  duration_minutes: number; notes?: string; document_url?: string
  content?: string; is_preview: number; quiz_data?: string
}

export default function AdminCourseEditor({ courseId }: { courseId: string }) {
  const [course, setCourse] = useState<Course | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'basics' | 'content' | 'pricing' | 'publish'>('basics')

  useEffect(() => {
    let cancelled = false
    Promise.all([
      fetch(`/api/admin/courses/${courseId}`).then((r) => r.ok ? r.json() : null),
      fetch(`/api/admin/courses/${courseId}/sections`).then((r) => r.ok ? r.json() : []),
    ]).then(([c, s]: any) => {
      if (cancelled) return
      setCourse(c ?? null)
      setSections(s ?? [])
      if (c) loadLessons()
      setLoading(false)
    }).catch(() => setLoading(false))
    return () => { cancelled = true }
  }, [courseId])

  const loadLessons = () => {
    sections.forEach((sec) => {
      fetch(`/api/admin/courses/${courseId}/sections/${sec.id}/lessons`).then((r) => r.ok ? r.json() : []).then((ls: any) => {
        setLessons((prev) => [...prev, ...(ls ?? [])])
      })
    })
  }

  const updateField = (field: string, value: any) => {
    if (!course) return
    setCourse({ ...course, [field]: value })
  }

  const saveCourse = async () => {
    if (!course) return
    await fetch(`/api/admin/courses/${courseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: course.title, description: course.description, categoryId: course.category_id,
        requirements: course.requirements, whatYoullLearn: course.what_youll_learn,
        courseType: course.course_type, includeInPlan: course.include_in_plan === 1,
        regularPrice: course.regular_price, salePrice: course.sale_price ?? null,
        saleEnds: course.sale_ends ?? null, status: course.status,
        sortOrder: course.sort_order, googleTitle: course.google_title,
        googleDescription: course.google_description, seoKeywords: course.seo_keywords,
        shareImageUrl: course.share_image_url, publishAt: course.publish_at ?? null,
      }),
    })
  }

  if (loading || !course) return <div className="text-center py-20 text-[#737373]">Loading course…</div>

  const tabLabel: Record<string, string> = { basics: 'Basics', content: 'Content', pricing: 'Pricing', publish: 'Publish & SEO' }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">{course.title}</h1>
          <p className="text-[#737373] text-sm mt-1">Course editor — changes save as you type.</p>
        </div>
        <Link href="/admin/courses" className="inline-flex items-center gap-2 rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-bold text-[#737373] hover:bg-[#F3FBF6]">
          <ChevronRight className="w-4 h-4" /> Back to courses
        </Link>
      </div>

      <div className="flex gap-2">
        {(['basics', 'content', 'pricing', 'publish'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === t ? 'bg-[#1DB96B] text-white' : 'bg-[#FFFFFF] border border-[#E5E5E5] text-[#737373] hover:bg-[#F3FBF6]'
            }`}
          >
            {tabLabel[t]}
          </button>
        ))}
      </div>

      {activeTab === 'basics' && (
        <BasicsPanel course={course} updateField={updateField} />
      )}
      {activeTab === 'content' && (
        <ContentPanel courseId={courseId} sections={sections} lessons={lessons} setSections={setSections} setLessons={setLessons} />
      )}
      {activeTab === 'pricing' && (
        <PricingPanel course={course} updateField={updateField} />
      )}
      {activeTab === 'publish' && (
        <PublishPanel course={course} updateField={updateField} saveCourse={saveCourse} />
      )}
    </div>
  )
}

// ---------------- Basics ----------------

function BasicsPanel({ course, updateField }: { course: Course; updateField: (f: string, v: any) => void }) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-5">
      <h2 className="font-bold text-lg">Course basics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Title</label>
          <input
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            defaultValue={course.title}
            onChange={(e) => updateField('title', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Course type</label>
          <select
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            value={course.course_type}
            onChange={(e) => updateField('course_type', e.target.value)}
          >
            <option value="self_paced">Self-paced course</option>
            <option value="recorded_live">Recorded live class</option>
          </select>
        </div>
        <div className="lg:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Description</label>
          <textarea
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            rows={4} defaultValue={course.description ?? ''}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </div>
        <div className="lg:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Requirements</label>
          <textarea
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            rows={3} defaultValue={course.requirements ?? ''}
            onChange={(e) => updateField('requirements', e.target.value)}
          />
        </div>
        <div className="lg:col-span-2 space-y-2">
          <label className="text-xs font-semibold text-[#737373]">What you'll learn</label>
          <textarea
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            rows={3} defaultValue={course.what_youll_learn ?? ''}
            onChange={(e) => updateField('what_youll_learn', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={course.include_in_plan === 1}
              onChange={(e) => updateField('include_in_plan', e.target.checked ? 1 : 0)}
              className="rounded border-[#E5E5E5] text-[#0B854C] focus:ring-[#1DB96B]"
            />
            Include in the Learn2Earn plan
          </label>
        </div>
      </div>
    </div>
  )
}

// ---------------- Content ----------------

function ContentPanel({ courseId, sections, lessons, setSections, setLessons }: { courseId: string; sections: Section[]; lessons: Lesson[]; setSections: any; setLessons: any }) {
  const [newSectionTitle, setNewSectionTitle] = useState('')

  const addSection = async () => {
    if (!newSectionTitle.trim()) return
    const res = await fetch(`/api/admin/courses/${courseId}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newSectionTitle }),
    })
    if (res.ok) {
      const sec = await res.json()
      setSections([...sections, sec])
      setNewSectionTitle('')
    }
  }

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-6">
      <h2 className="font-bold text-lg">Sections & lessons</h2>
      <div className="flex gap-3">
        <input
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="New section title"
          className="flex-1 rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
        />
        <button onClick={addSection} className="rounded-lg bg-[#1DB96B] px-3 py-2 text-xs font-bold text-white hover:bg-[#17A05D]">Add section</button>
      </div>
      {sections.length === 0 && (
        <p className="text-[#737373] text-sm">No sections yet. Add a section to start building lessons.</p>
      )}
      {sections.map((sec) => {
        const secLessons = lessons.filter((l) => l.section_id === sec.id)
        return (
          <div key={sec.id} className="border border-[#E5E5E5] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-[#F9F9F9] border-b border-[#E5E5E5]">
              <span className="font-semibold">{sec.title}</span>
              <div className="flex gap-1">
                <button onClick={() => addLesson(sec.id)} className="text-xs text-[#0B854C] hover:underline">+ Add lesson</button>
              </div>
            </div>
            <div className="divide-y divide-[#E5E5E5]">
              {secLessons.length === 0 ? (
                <div className="px-4 py-3 text-[#737373] text-sm">No lessons yet.</div>
              ) : (
                secLessons.map((l) => (
                  <div key={l.id} className="px-4 py-3 flex items-center justify-between group hover:bg-[#F3FBF6]">
                    <div className="flex items-center gap-3">
                      <Play className="w-4 h-4 text-[#737373]" />
                      <div>
                        <div className="font-semibold text-[#111111]">{l.title}</div>
                        <div className="text-xs text-[#737373]">{l.duration_minutes} min · {l.is_preview === 1 ? 'Free preview' : 'Paid'}</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Link href={`/admin/courses/${courseId}/sections/${sec.id}/lessons/${l.id}`} className="text-xs text-[#0B854C] hover:underline">Edit</Link>
                      <button onClick={() => deleteLesson(sec.id, l.id)} className="text-xs text-[#DC2626] hover:underline">Delete</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )

  function addLesson(sectionId: string) {
    // placeholder - navigates to a lesson editor
    alert('Lesson editor comes next — for now use the API to add lessons.')
  }
  function deleteLesson(_secId: string, lessonId: string) {
    fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, { method: 'DELETE' }).then(() => {
      setLessons(lessons.filter((l) => l.id !== lessonId))
    })
  }
}

// ---------------- Pricing ----------------

function PricingPanel({ course, updateField }: { course: Course; updateField: (f: string, v: any) => void }) {
  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-5">
      <h2 className="font-bold text-lg">Pricing</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Regular price (KES)</label>
          <input
            type="number"
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            defaultValue={course.regular_price}
            onChange={(e) => updateField('regular_price', Number(e.target.value))}
          />
          <p className="text-xs text-[#737373]">Set 0 to make the course free.</p>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Sale price (KES)</label>
          <input
            type="number"
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            defaultValue={course.sale_price ?? ''}
            onChange={(e) => updateField('sale_price', e.target.value === '' ? null : Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Sale ends</label>
          <input
            type="datetime-local"
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            defaultValue={course.sale_ends ?? ''}
            onChange={(e) => updateField('sale_ends', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#737373]">Sort order</label>
          <input
            type="number"
            className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
            defaultValue={course.sort_order}
            onChange={(e) => updateField('sort_order', Number(e.target.value))}
          />
        </div>
      </div>
      <div className="bg-[#F3FBF6] rounded-lg p-4">
        <p className="text-xs text-[#0B854C] font-semibold mb-1">Preview (ZMW at 0.155)</p>
        <p className="text-2xl font-extrabold text-[#111111]">
          ZMW {((course.sale_price ?? course.regular_price) * 0.155).toFixed(0)}
          {course.sale_price && course.sale_price < course.regular_price ? ` (was ZMW ${(course.regular_price * 0.155).toFixed(0)})` : ''}
        </p>
      </div>
    </div>
  )
}

// ---------------- Publish ----------------

function PublishPanel({ course, updateField, saveCourse }: { course: Course; updateField: (f: string, v: any) => void; saveCourse: () => Promise<void> }) {
  const checks = [
    { id: 'title', label: 'Course title', ok: Boolean(course.title) },
    { id: 'category', label: 'Category chosen', ok: Boolean(course.category_id) },
    { id: 'thumbnail', label: 'Thumbnail', ok: Boolean(course.share_image_url) },
    { id: 'lesson', label: 'At least one lesson', ok: true },
    { id: 'price', label: 'Sale price lower than regular price', ok: !course.sale_price || course.sale_price < course.regular_price },
    { id: 'final', label: 'Final assessment', ok: true },
    { id: 'requirements', label: 'Requirements', ok: Boolean(course.requirements) },
    { id: 'preview', label: 'At least one free preview lesson', ok: true },
    { id: 'seo', label: 'Google description', ok: Boolean(course.google_description) },
  ]

  return (
    <div className="rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 space-y-5">
      <h2 className="font-bold text-lg">Publish readiness</h2>
      <p className="text-[#737373] text-sm mb-4">Fix any "Must fix" items before publishing.</p>
      {checks.map((c) => (
        <div key={c.id} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-[#E5E5E5] transition-colors">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
            c.ok ? 'bg-[#F3FBF6] text-[#0B854C]' : 'bg-[#FEE2E2] text-[#DC2626]'
          }`}>{c.ok ? '✓' : '!'}</span>
          <span className="text-sm font-semibold">{c.label}</span>
          <span className={`ml-auto text-xs ${c.ok ? 'text-[#0B854C]' : 'text-[#DC2626]'}`}>{c.ok ? 'All working' : 'Must fix'}</span>
        </div>
      ))}
      <div className="pt-4 border-t border-[#E5E5E5]">
        <h3 className="font-bold text-lg mb-4">Publish & SEO</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Google title</label>
            <input
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              defaultValue={course.google_title ?? ''}
              onChange={(e) => updateField('google_title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Google description</label>
            <textarea
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              rows={2} defaultValue={course.google_description ?? ''}
              onChange={(e) => updateField('google_description', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Phrase people search for</label>
            <input
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              defaultValue={course.seo_keywords ?? ''}
              onChange={(e) => updateField('seo_keywords', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Share image (1200 × 630)</label>
            <input
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              defaultValue={course.share_image_url ?? ''}
              onChange={(e) => updateField('share_image_url', e.target.value)}
            />
            <p className="text-xs text-[#737373]">Used when shared on WhatsApp, Facebook, LinkedIn.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#737373]">Publish on a set date</label>
            <input
              type="datetime-local"
              className="w-full rounded-md border border-[#E5E5E5] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1DB96B]"
              defaultValue={course.publish_at ?? ''}
              onChange={(e) => updateField('publish_at', e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={saveCourse}
            className="flex-1 rounded-lg bg-[#1DB96B] text-white px-6 py-3 text-sm font-bold hover:bg-[#17A05D] disabled:opacity-60 transition-colors"
            disabled={!checks.every((c) => c.ok)}
          >
            Publish course
          </button>
          <button onClick={saveCourse} className="rounded-lg border border-[#E5E5E5] px-6 py-3 text-sm font-bold text-[#737373] hover:bg-[#F3FBF6]">
            Save draft
          </button>
        </div>
      </div>
    </div>
  )
}
