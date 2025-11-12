export interface Course {
  id: number
  title: string
  link: string
  coupon_code: string
  date_found: string
  discount: number
  discount_time_left: string
  students: string
  rating: string
  language: string
  badge: string
  category: string
  availability: "free" | "paid"
}
