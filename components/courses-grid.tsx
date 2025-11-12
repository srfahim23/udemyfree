"use client"

import { useState, useMemo } from "react"
import type { Course } from "@/lib/types"
import { CourseCard } from "./course-card"
import { SearchFilter } from "./search-filter"
import coursesData from "@/data/courses.json"

export function CoursesGrid() {
  const courses: Course[] = coursesData.courses
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesTitle = course.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
      const matchesAvailability = selectedAvailability === "all" || course.availability === selectedAvailability

      return matchesTitle && matchesCategory && matchesAvailability
    })
  }, [searchTerm, selectedCategory, selectedAvailability, courses])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-12 pb-4">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Browse Courses</h2>
        <p className="text-muted-foreground">
          Found {filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="sticky top-0 z-10 mb-8 bg-background pb-4 pt-2">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedAvailability={selectedAvailability}
          setSelectedAvailability={setSelectedAvailability}
        />
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/30 py-12 text-center">
          <p className="text-muted-foreground">
            No courses found matching your filters. Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  )
}
