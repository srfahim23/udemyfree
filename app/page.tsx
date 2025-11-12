import { CoursesGrid } from "@/components/courses-grid"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <CoursesGrid />
    </main>
  )
}
