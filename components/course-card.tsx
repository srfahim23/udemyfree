"use client"

import type { Course } from "@/lib/types"
import { ExternalLink, Copy, Check } from "lucide-react"
import { useState } from "react"

interface CourseCardProps {
  course: Course
  availableCount?: number
  isVisited?: boolean
  onVisit?: () => void
}

export function CourseCard({ course, availableCount = 1, isVisited = false, onVisit }: CourseCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(course.coupon_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleVisitCourse = () => {
    onVisit?.()
  }

  const courseUrl = new URL(course.link)
  courseUrl.searchParams.append("couponCode", course.coupon_code)
  const courseUrlWithCoupon = courseUrl.toString()

  return (
    <div
      className={`group flex flex-col rounded-lg border bg-card p-6 transition-all hover:shadow-lg ${
        isVisited ? "border-muted-foreground/30 opacity-75" : "border-border hover:border-accent"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{course.title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isVisited && (
            <span className="whitespace-nowrap rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Check className="h-3 w-3" />
              Visited
            </span>
          )}
          <span className="whitespace-nowrap rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
            {course.badge}
          </span>
        </div>
      </div>

      <p className="mb-4 flex-1 text-sm text-muted-foreground">{course.title}</p>

      {availableCount > 1 && (
        <div className="mb-3 rounded-md bg-blue-500/10 px-3 py-2 border border-blue-500/30">
          <p className="text-sm font-medium text-blue-600">Available in {availableCount} sources</p>
        </div>
      )}

      <div className="mb-4 space-y-2 rounded-md bg-muted p-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Coupon Code</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 font-mono text-sm font-bold text-foreground">{course.coupon_code}</code>
          <button
            onClick={handleCopyCode}
            className="rounded p-1.5 transition-colors hover:bg-background"
            title="Copy coupon code"
          >
            <Copy className={`h-4 w-4 transition-colors ${copied ? "text-accent" : "text-muted-foreground"}`} />
          </button>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="font-semibold text-accent">{course.discount}%</span>
          <span>Discount</span>
        </span>
        <span className="text-xs">Found: {new Date(course.date_found).toLocaleDateString()}</span>
      </div>

      <a
        href={courseUrlWithCoupon}
        onClick={handleVisitCourse}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${
          isVisited
            ? "bg-muted text-muted-foreground hover:opacity-80"
            : "bg-primary text-primary-foreground hover:opacity-90"
        }`}
      >
        {isVisited ? "Visit Again" : "Visit Course"}
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )
}
