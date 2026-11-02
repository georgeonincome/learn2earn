// Purchase/enroll in a book.
// Body: { bookId, amount?, paymentReference?, paymentMethod? }
import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/server/auth'
import { getStudentByUserId } from '@/lib/server/students'
import { enrollInBook } from '@/lib/server/books'
import { sendNotificationEmail } from '@/lib/server/notifications'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const bookId = body.bookId
  if (!bookId) return NextResponse.json({ error: 'bookId is required' }, { status: 400 })

  const user = await getCurrentUser()
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  const student = await getStudentByUserId(user.id)
  if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 })

  const studentId = student.id
  const amount = Number(body.amount ?? 0)
  const paymentMethod = body.paymentMethod ?? 'flutterwave'

  const result = await enrollInBook({
    studentId,
    bookId,
    amount,
    paymentReference: body.paymentReference,
    paymentMethod,
  })

  if (result.alreadyEnrolled) {
    return NextResponse.json({ ok: true, alreadyEnrolled: true, enrollmentId: result.enrollmentId })
  }

  const book = result.book
  if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 })

  // Notification email
  await sendNotificationEmail({
    type: 'book_purchase',
    user: { id: studentId, email: user.email, name: (student as any).full_name ?? user.email.split('@')[0] },
    book: { id: bookId, title: book.title, author: book.author, price: book.price },
  })

  return NextResponse.json({
    ok: true,
    enrollmentId: result.enrollmentId,
    amount,
    currency: 'ZMW',
    book: { id: bookId, title: book.title, price: book.price },
  })
}
