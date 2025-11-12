"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchFilterProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedAvailability: string
  setSelectedAvailability: (availability: string) => void
}

export function SearchFilter({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedAvailability,
  setSelectedAvailability,
}: SearchFilterProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-foreground">Search by Title</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Type course title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-foreground">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="AI & Technology">AI & Technology</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Business & Language">Business & Language</SelectItem>
              <SelectItem value="Leadership">Leadership</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Personal Development">Personal Development</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-foreground">Availability</label>
          <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="free">Free Courses</SelectItem>
              <SelectItem value="paid">Paid Courses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(searchTerm || selectedCategory !== "all" || selectedAvailability !== "all") && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm">
              <span>Title: {searchTerm}</span>
              <button onClick={() => setSearchTerm("")} className="hover:text-destructive">
                ×
              </button>
            </div>
          )}
          {selectedCategory !== "all" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm">
              <span>Category: {selectedCategory}</span>
              <button onClick={() => setSelectedCategory("all")} className="hover:text-destructive">
                ×
              </button>
            </div>
          )}
          {selectedAvailability !== "all" && (
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm">
              <span>Availability: {selectedAvailability}</span>
              <button onClick={() => setSelectedAvailability("all")} className="hover:text-destructive">
                ×
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
