"use client"

import type React from "react"

import { useState } from "react"
import { mergeCourses } from "@/lib/merge-courses"
import type { Course } from "@/lib/types"
import coursesData from "@/data/courses.json"

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
      setMessage("")
    }
  }

  const handleMerge = async () => {
    if (!file) {
      setMessage("Please select a JSON file")
      setIsSuccess(false)
      return
    }

    setLoading(true)
    try {
      const fileContent = await file.text()
      const newCourses: Course[] = JSON.parse(fileContent)

      // Validate that it's an array
      if (!Array.isArray(newCourses)) {
        throw new Error("JSON must be an array of courses")
      }

      // Merge courses
      const existingCourses: Course[] = coursesData
      const mergedCourses = mergeCourses(existingCourses, newCourses)

      // Save to localStorage for demonstration
      // In production, this would save to a database or backend
      localStorage.setItem("merged_courses", JSON.stringify(mergedCourses))

      const newCoursesCount = newCourses.length
      const totalCourses = mergedCourses.length
      const updatedCourses = mergedCourses.filter((course) => {
        const existingCourse = existingCourses.find((c) => c.id === course.id)
        if (!existingCourse) return false
        const existingDate = new Date(existingCourse.date_found).getTime()
        const newDate = new Date(course.date_found).getTime()
        return newDate > existingDate
      }).length

      setMessage(
        `Successfully merged! Added: ${newCoursesCount} courses | Updated: ${updatedCourses} coupons | Total: ${totalCourses} courses`,
      )
      setIsSuccess(true)
      setFile(null)

      // Reload page to show updated data
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Failed to merge"}`)
      setIsSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground mb-8">Merge new course JSON files with existing data</p>

          <div className="space-y-6">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                disabled={loading}
              />
              <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-2">
                <div className="text-4xl">📁</div>
                <span className="text-lg font-semibold text-foreground">
                  {file ? file.name : "Click to select JSON file"}
                </span>
                <span className="text-sm text-muted-foreground">or drag and drop a JSON file here</span>
              </label>
            </div>

            <button
              onClick={handleMerge}
              disabled={!file || loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                file && !loading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              {loading ? "Merging..." : "Merge Courses"}
            </button>

            {message && (
              <div
                className={`p-4 rounded-lg border ${
                  isSuccess ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
                }`}
              >
                {message}
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">How it works:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Select a JSON file with new courses</li>
                <li>2. System will automatically merge with existing courses</li>
                <li>3. If course ID exists, newer coupon (by date_found) will replace old one</li>
                <li>4. Updated courses will show new coupon in URLs</li>
                <li>5. All changes persist across page reloads</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
