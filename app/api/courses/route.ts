import { NextResponse } from 'next/server'
import { COURSES } from '@/lib/data'

export async function GET() {
  try {
    return NextResponse.json({
      courses: COURSES,
      total: COURSES.length,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // In production, save to Turso database
    // const result = await db.insert(courses).values(body).execute()
    
    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      course: body,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}
