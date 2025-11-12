"use client"

import type { Course } from "@/lib/types"
import { ExternalLink, Copy } from "lucide-react"
import { useState } from "react"

export function CourseCard({ course }: { course: Course }) {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = () => {
    navigator.clipboard.writeText(course.coupon_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const courseUrl = new URL(course.link)
  courseUrl.searchParams.append("couponCode", course.coupon_code)
  const courseUrlWithCoupon = courseUrl.toString()

  return (
    <div className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg hover:border-accent">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex-1">
          <h3 className="line-clamp-2 text-lg font-semibold text-foreground">{course.title}</h3>
        </div>
        <span className="whitespace-nowrap rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">
          {course.badge}
        </span>
      </div>

      <p className="mb-4 flex-1 text-sm text-muted-foreground">{course.title}</p>

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
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
      >
        Visit Course
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )
}
