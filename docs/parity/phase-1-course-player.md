# Phase 1: Core Learning Experience — Feature Spec

## Phase 1.1: Course Player & Lesson Route

### Reference Files

| File | Purpose |
|---|---|
| `_reference/click2skill/chunks/CourseLessonRoute-DhTiTmen.js` | Route component — lesson page with video player, access control, back-to-course |
| `_reference/click2skill/chunks/CoursePlayer-2icA96ky.js` | Main course player — video, quiz, progress, certificate, sidebar |
| `_reference/click2skill/chunks/EnhancedVideoPlayer-BRGriz9Q.js` | Video player — YouTube, Vimeo, Supabase, external |
| `_reference/click2skill/chunks/QuickQuizDialog-BjT2FQ0Z.js` | Quiz dialog for lesson assessment |
| `_reference/click2skill/chunks/useSubscription-CuULC_HM.js` | Subscription state hook (already implemented) |
| `_reference/click2skill/chunks/studentPreferences-k8XJ8C4f.js` | Student preferences hook (already implemented) |

### Routes

| Route | Purpose |
|---|---|
| `/courses/[slug]/lessons/[lessonId]` | Lesson player page — video, content, quiz, progress |
| `/courses/[slug]` | Course detail page (already exists) — entry point to lessons |

### Component Tree

```
CourseLessonRoute (page)
├── CoursePlayer (lazy-loaded client component)
│   ├── EnhancedVideoPlayer (video playback)
│   ├── Lesson content (text)
│   ├── QuizDialog (assessment)
│   ├── Progress tracker
│   ├── Certificate display (on completion)
│   └── Lesson navigation (next/prev)
```

### Data Tables (already exist in schema)

| Table | Already Exists? | Notes |
|---|---|---|
| lessons | Yes | Has video_url, video_provider, content, is_preview |
| lesson_progress | Yes | Added in Phase 0 schema |
| enrollments | Yes | Added in Phase 0 schema |
| courses | Yes | Already exists |
| users | Yes | Already exists |

### API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/lessons/[id]` | GET | Get lesson by ID (with access check) |
| `/api/lessons/[id]/progress` | POST | Mark lesson as complete, update watch time |
| `/api/courses/[slug]/lessons` | GET | List all lessons for a course |

### Business Rules

1. **Access Control:**
   - Published courses only (`is_published = true`)
   - Lessons with `is_preview = true` are accessible without enrollment
   - Non-preview lessons require enrollment or active membership
   - Unauthenticated users can access preview lessons only

2. **Progress Tracking:**
   - Mark lesson as completed when user finishes
   - Track watch time in seconds
   - Update course progress percentage

3. **Lesson Navigation:**
   - Next/Previous lesson buttons
   - Disable next if current not completed (unless preview)
   - Show lesson number in sequence

### Feature Spec Details

#### CourseLessonRoute Component
- Route: `/courses/[slug]/lessons/[lessonId]`
- Server component (fetches course + lesson data)
- Lazy-loads CoursePlayer client component
- Props: `courseId`, `lessonId` from URL params
- Behavior:
  1. Fetch course by ID, verify published
  2. Fetch lesson by ID + courseId, verify is_preview or user has access
  3. If loading → show "Loading session…"
  4. If not accessible → show "This session requires course access"
  5. If accessible → render CoursePlayer with lesson data

#### CoursePlayer Component (Client)
- Props: course, lesson, user
- Sections (top to bottom):
  1. Header: Back to course link + lesson title
  2. Video area: EnhancedVideoPlayer (16:9 aspect ratio)
  3. Content area: Lesson text content (whitespace-pre-line)
  4. Quiz section: QuickQuizDialog trigger (if lesson has quiz)
  5. Progress: Progress bar showing course completion
  6. Navigation: Previous/Next lesson buttons
  7. Certificate: Show on course completion

#### Video Providers Supported
- `youtube` → youtube-nocookie.com embed
- `vimeo` → player.vimeo.com embed
- `supabase`/`external` → HTML5 video element
- Unknown → "Unable to load video" message

### Implementation Plan

1. Create `lib/lessons.ts` — lesson data access functions
2. Create `app/api/lessons/[id]/route.ts` — lesson detail API
3. Create `app/api/lessons/[id]/progress/route.ts` — progress update API
4. Create `app/courses/[slug]/lessons/[lessonId]/page.tsx` — lesson route page
5. Create `components/course-player/CoursePlayer.tsx` — main player component
6. Create `components/course-player/EnhancedVideoPlayer.tsx` — video player
7. Create `components/course-player/QuickQuizDialog.tsx` — quiz dialog
8. Update `app/courses/[slug]/page.tsx` — add lesson links

---

**Status: Spec complete. Waiting for "go" before implementing.**