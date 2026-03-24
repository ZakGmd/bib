// components/books/BooksHeader.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface BooksHeaderProps {
  searchQuery: string
  categoryFilter: string
  categories: string[]
  viewMode: string
  totalBooks: number
}

export function BooksHeader({
  searchQuery,
  categoryFilter,
  categories,
  viewMode,
  totalBooks
}: BooksHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [localSearch, setLocalSearch] = useState(searchQuery)
  
  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === "" || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`?${params.toString()}`)
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL("search", localSearch)
  }
  
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title and count */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Book Catalog</h1>
          <p className="text-sm text-gray-600 mt-1">
            {totalBooks} {totalBooks === 1 ? "book" : "books"} available
          </p>
        </div>
        
        {/* Filters row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full px-4 py-2.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </form>
          
          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => updateURL("category", e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          {/* View mode switcher */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => updateURL("view", "grid")}
              className={`px-4 py-2.5 transition ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              title="Grid view"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <button
              onClick={() => updateURL("view", "list")}
              className={`px-4 py-2.5 border-l transition ${
                viewMode === "list"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300"
              }`}
              title="List view"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}