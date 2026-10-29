import Link from 'next/link'
import { COURSES } from '@/lib/data'
import { BookOpen, Play, Lock, ArrowRight, TrendingUp } from 'lucide-react'

export default function AdminCourses() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111]">Courses</h1>
          <p className="text-[#737373] text-sm">Manage all published courses and course content.</p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1DB96B] text-[#111111] text-sm font-bold hover:bg-[#17A05D] transition-colors"
        >
          View Courses <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E5E5]">
                <th className="py-4 text-sm font-bold text-[#737373]">Course</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Category</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Price</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Level</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Status</th>
                <th className="py-4 text-sm font-bold text-[#737373]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {COURSES.map((course) => (
                <tr key={course.slug} className="border-b border-[#F3F4F6] hover:bg-[#FAFAFA] transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#EEF1EE] flex items-center justify-center text-center">
                        {course.title.slice(0, 1)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#111111]">{course.title}</p>
                        <p className="text-xs text-[#737373]">{course.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#F3FBF6', color: '#0F7A42' }}>
                      {course.category}
                    </span>
                  </td>
                  <td className="py-4 text-sm font-medium text-[#111111]">
                    ZMW {course.price.toLocaleString('en-ZM')}
                  </td>
                  <td className="py-4 text-sm text-[#737373]">{course.level}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#E8F6EF', color: '#0F7A42' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1DB96B]" /> Published
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/courses/${course.slug}`}
                        className="text-xs font-medium text-[#1DB96B] hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
        <h2 className="text-lg font-bold text-[#111111] mb-6">Course Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { label: 'Total Courses', value: COURSES.length, icon: BookOpen },
            { label: 'Published', value: COURSES.filter(c => c.featured).length, icon: Play },
            { label: 'In Membership Plan', value: COURSES.filter(c => c.featured).length, icon: TrendingUp },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#111111]">{stat.value}</p>
                  <p className="text-xs text-[#737373]">{stat.label}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#1DB96B]/10 flex items-center justify-center">
                  <stat.icon className="w-4 h-4 text-[#1DB96B]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
