# Phase 1.2: Student Dashboard — Feature Spec

## Reference Files

| File | Purpose |
|---|---|
| `_reference/click2skill/chunks/StudentDashboard-Dh-ypbFE.js` | Main dashboard component — 559KB |
| `_reference/click2skill/chunks/CertificatePanel-CXemqskQ.js` | Certificate panel component |
| `_reference/click2skill/chunks/CertificateTemplate-4SLLODc7.js` | Certificate template |
| `_reference/click2skill/chunks/downloadCertificate-DjDo-ZXq.js` | Certificate download |
| `_reference/click2skill/chunks/subscriptionTracking-Dau-5aD7.js` | Subscription tracking (already implemented) |
| `_reference/click2skill/chunks/studentPreferences-k8XJ8C4f.js` | Student preferences (already implemented) |

## Routes

| Route | Purpose |
|---|---|
| `/dashboard` | Student dashboard — main landing with progress, certificates, announcements |
| `/dashboard/courses` | My courses — enrolled courses with progress |
| `/dashboard/cohorts` | My cohorts — live cohort programs |
| `/dashboard/certificates` | Certificates — earned certificates with download/verify |
| `/dashboard/reviews` | Reviews — write/edit/delete course reviews |
| `/dashboard/plan` | Subscription plan management |
| `/dashboard/settings` | Account settings |

### Data Tables (from Phase 0)

| Table | Purpose |
|---|---|
| students | User profiles/student records |
| enrollments | Course/cohort/membership enrollment records |
| lesson_progress | Per-lesson completion tracking |
| cohort_lesson_progress | Per-lesson progress within cohorts |
| subscriptions | Active subscription records |
| student_preferences | Student notification/learning preferences |
| transactions | Full payment audit trail |
| announcements | Platform announcements |
| messages | Direct messages between students and George |
| tickets | Support tickets |
| certificates | Course completion certificates |
| cohort_certificates | Cohort completion certificates |

### Feature Spec Details

#### Dashboard Page (`/dashboard`)
- **Header**: Welcome message, user profile, notification bell
- **Stats Cards**: Courses enrolled, lessons completed, certificates earned, streak days
- **Progress Section**: Overall course completion percentage, progress bar
- **Active Cohorts**: Live cohort programs with countdown timers
- **Upcoming Lessons**: Next lessons to watch
- **Announcements**: Latest platform announcements
- **Quick Actions**: Start learning, view certificates, join cohorts

#### My Courses Page (`/dashboard/courses`)
- List of enrolled courses with progress bars
- Lesson completion status per course
- Resume learning button
- Certificate download (if completed)

#### My Cohorts Page (`/dashboard/cohorts`)
- Active cohort programs
- Session countdown timers
- Live class links
- Completed cohorts with certificates

#### Certificates Page (`/dashboard/certificates`)
- List of earned certificates
- Download certificate (PDF)
- Verify certificate (public link)
- Share certificate

#### Reviews Page (`/dashboard/reviews`)
- Write reviews for completed courses
- Edit/delete own reviews
- View course ratings

#### Plan Page (`/dashboard/plan`)
- Current subscription plan
- Upgrade/downgrade options
- Payment history
- Renewal date

#### Settings Page (`/dashboard/settings`)
- Account information
- Notification preferences (uses studentPreferences hook)
- Password/email change
- Delete account

### Implementation Plan

1. Create `lib/dashboard.ts` — dashboard data access functions
2. Create `app/dashboard/page.tsx` — main dashboard page
3. Create `app/dashboard/courses/page.tsx` — my courses page
4. Create `app/dashboard/cohorts/page.tsx` — my cohorts page
5. Create `app/dashboard/certificates/page.tsx` — certificates page
6. Create `app/dashboard/reviews/page.tsx` — reviews page
7. Create `app/dashboard/plan/page.tsx` — subscription plan page
8. Create `app/dashboard/settings/page.tsx` — settings page
9. Create `components/dashboard/ProgressCard.tsx` — progress display
10. Create `components/dashboard/StatsCard.tsx` — stats display
11. Create `components/dashboard/CourseCard.tsx` — course enrollment card
12. Create `components/dashboard/CertificateCard.tsx` — certificate card
13. Update `app/layout.tsx` — add dashboard navigation

### Dependencies

- Phase 0 (auth, enrollment, subscription) — **DONE**
- Lesson progress tracking — **PARTIAL** (Phase 1.1 created lesson pages)

---

**Status: Spec complete. Waiting for "go" before implementing.**