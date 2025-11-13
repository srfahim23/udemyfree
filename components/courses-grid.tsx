"use client"

import { useState, useMemo, useEffect } from "react"
import type { Course } from "@/lib/types"
import { CourseCard } from "./course-card"
import { SearchFilter } from "./search-filter"
import coursesData from "@/data/courses.json"

const COURSES_PER_PAGE = 20

interface CourseWithCount extends Course {
  availableCount: number
}

export function CoursesGrid() {
  const courses: Course[] = coursesData.courses
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAvailability, setSelectedAvailability] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [visitedCourses, setVisitedCourses] = useState<Set<string>>(new Set())

  useEffect(() => {
    const saved = localStorage.getItem("visitedCourses")
    if (saved) {
      setVisitedCourses(new Set(JSON.parse(saved)))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("visitedCourses", JSON.stringify(Array.from(visitedCourses)))
  }, [visitedCourses])

  const uniqueCoursesWithCount = useMemo(() => {
    const courseMap = new Map<string, CourseWithCount>()

    courses.forEach((course) => {
      if (courseMap.has(course.id)) {
        const existing = courseMap.get(course.id)!
        existing.availableCount += 1
      } else {
        courseMap.set(course.id, {
          ...course,
          availableCount: 1,
        })
      }
    })

    return Array.from(courseMap.values())
  }, [courses])

  const filteredCourses = useMemo(() => {
    return uniqueCoursesWithCount.filter((course) => {
      const matchesTitle = course.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
      const matchesAvailability = selectedAvailability === "all" || course.availability === selectedAvailability

      return matchesTitle && matchesCategory && matchesAvailability
    })
  }, [searchTerm, selectedCategory, selectedAvailability, uniqueCoursesWithCount])

  const totalCoursesCount = useMemo(() => {
    return filteredCourses.reduce((sum, course) => sum + course.availableCount, 0)
  }, [filteredCourses])

  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE)
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + COURSES_PER_PAGE)

  const handleFilterChange = (newSearchTerm: string, newCategory: string, newAvailability: string) => {
    setSearchTerm(newSearchTerm)
    setSelectedCategory(newCategory)
    setSelectedAvailability(newAvailability)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const markCourseAsVisited = (courseId: string) => {
    const newVisited = new Set(visitedCourses)
    newVisited.add(courseId)
    setVisitedCourses(newVisited)
  }

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) pages.push("...")
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...")
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="py-12 pb-4">
        <h2 className="mb-2 text-2xl font-bold text-foreground">Browse Courses</h2>
        <p className="text-muted-foreground">
          Found {filteredCourses.length} unique course{filteredCourses.length !== 1 ? "s" : ""} ({totalCoursesCount}{" "}
          available total)
        </p>
      </div>

      <div className="sticky top-0 z-10 mb-8 bg-background pb-4 pt-2">
        <SearchFilter
          searchTerm={searchTerm}
          setSearchTerm={(term) => handleFilterChange(term, selectedCategory, selectedAvailability)}
          selectedCategory={selectedCategory}
          setSelectedCategory={(category) => handleFilterChange(searchTerm, category, selectedAvailability)}
          selectedAvailability={selectedAvailability}
          setSelectedAvailability={(availability) => handleFilterChange(searchTerm, selectedCategory, availability)}
        />
      </div>

      {filteredCourses.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                availableCount={(course as CourseWithCount).availableCount}
                isVisited={visitedCourses.has(course.id)}
                onVisit={() => markCourseAsVisited(course.id)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-muted-foreground/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex flex-wrap items-center justify-center gap-1">
                {getPageNumbers().map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => typeof page === "number" && handlePageChange(page)}
                    disabled={page === "..."}
                    className={`h-10 min-w-10 rounded-lg border transition-colors ${
                      page === "..."
                        ? "border-transparent cursor-default"
                        : currentPage === page
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 hover:bg-muted disabled:cursor-not-allowed"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-muted-foreground/30 px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
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
