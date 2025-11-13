import type { Course } from "./types"

export function mergeCourses(existingCourses: Course[], newCourses: Course[]): Course[] {
  // Create a map of existing courses by ID
  const courseMap = new Map<number, Course>()

  existingCourses.forEach((course) => {
    courseMap.set(course.id, course)
  })

  // Merge new courses, updating coupons if they're newer
  newCourses.forEach((newCourse) => {
    const existingCourse = courseMap.get(newCourse.id)

    if (existingCourse) {
      // Parse dates to compare
      const existingDate = new Date(existingCourse.date_found).getTime()
      const newDate = new Date(newCourse.date_found).getTime()

      // If new coupon is newer, replace the old one
      if (newDate > existingDate) {
        courseMap.set(newCourse.id, {
          ...existingCourse,
          coupon_code: newCourse.coupon_code,
          date_found: newCourse.date_found,
          discount: newCourse.discount,
        })
      }
      // If dates are same, keep the existing coupon
    } else {
      // New course, add it
      courseMap.set(newCourse.id, newCourse)
    }
  })

  return Array.from(courseMap.values())
}
