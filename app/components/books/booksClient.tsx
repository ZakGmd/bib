// components/books/BooksClient.tsx
"use client"

import { useState } from "react"
import { BookCard } from "./bookCard"
import { BookTable } from "./bookTable"


type Book = {
  id: string
  title: string
  authors: string[]
  category: string
  publishedYear: number | null
  availableCopies: number
  totalCopies: number
  coverUrl: string | null
  description: string | null
  isbn: string | null
}

type BooksClientProps = {
  books: Book[]
  isAuthenticated: boolean
  activeLoanBookIds: string[]
}

export function BooksClient({ books, isAuthenticated, activeLoanBookIds }: BooksClientProps) {
  // Simple state - easy for students to understand
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  
  // Get unique categories from real data
  const categories = Array.from(new Set(books.map(b => b.category)))
  
  // Filter books based on search and filters
  // This happens instantly as you type!
  let filteredBooks = books
  
  // Search filter (runs on every keystroke)
  if (searchQuery) {
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }
  
  // Category filter
  if (categoryFilter !== "all") {
    filteredBooks = filteredBooks.filter(book => 
      book.category.toLowerCase() === categoryFilter.toLowerCase()
    )
  }
  
  // Availability filter
  if (availabilityFilter !== "all") {
    filteredBooks = filteredBooks.filter(book => {
      if (availabilityFilter === "available") return book.availableCopies >= 2
      if (availabilityFilter === "limited") return book.availableCopies === 1
      if (availabilityFilter === "unavailable") return book.availableCopies === 0
      return true
    })
  }
  
  // Calculate stats from real data
  const totalBooks = books.length
  const availableBooks = books.filter(b => b.availableCopies > 0).length
  const onLoan = books.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0)
  
  return (
    <div className="flex min-h-screen bg-[#FAFBFC]">
      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-serif text-[2.5rem] font-bold text-[#1A202C] mb-2 tracking-tight leading-tight">Books Collection</h1>
          <p className="text-base text-[#4A5568]">Manage your library's catalog and track book availability</p>
        </header>
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Books",  value: totalBooks,        color: "text-[#1A202C]" },
            { label: "Available",    value: availableBooks,    color: "text-[#0F7B6C]" },
            { label: "On Loan",      value: onLoan,            color: "text-[#D97706]" },
            { label: "Categories",   value: categories.length, color: "text-[#2C5AA0]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-[#E5E9ED] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
              <p className="text-sm text-[#718096] mb-1.5">{label}</p>
              <p className={`font-serif text-[2rem] font-bold tracking-tight ${color}`}>{value}</p>
            </div>
          ))}
        </div>
        
        {/* Controls */}
        <div className="flex justify-between items-center gap-5 mb-6 flex-wrap">
          <div className="flex gap-3 flex-1 max-w-[700px]">
            {/* Search - instant filtering as you type! */}
            <div className="flex-1 relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, author, or ISBN..."
                className="w-full pl-12 pr-4 py-3 border border-[#E5E9ED] rounded-lg text-[0.9375rem] bg-white text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
              />
            </div>
            
            {/* Category filter */}
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 border border-[#E5E9ED] rounded-lg text-[0.9375rem] bg-white text-[#1A202C] font-medium min-w-[160px] cursor-pointer hover:border-[#D1D8DF] focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat.toLowerCase()}>{cat}</option>
              ))}
            </select>
            
            {/* Availability filter */}
            <select 
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="px-4 py-3 border border-[#E5E9ED] rounded-lg text-[0.9375rem] bg-white text-[#1A202C] font-medium min-w-[160px] cursor-pointer hover:border-[#D1D8DF] focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
            >
              <option value="all">All Books</option>
              <option value="available">Available</option>
              <option value="limited">Limited Stock</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          
          <div className="flex gap-3 items-center">
            {/* View toggle */}
            <div className="flex bg-white border border-[#E5E9ED] rounded-lg p-1">
              <button
                type="button"
                onClick={() => setViewMode("card")}
                className={`px-3 py-2 rounded transition-all duration-150 flex items-center justify-center ${
                  viewMode === "card"
                    ? "bg-[#2C5AA0] text-white"
                    : "text-[#718096] hover:bg-[#F8F9FA] hover:text-[#1A202C]"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 rounded transition-all duration-150 flex items-center justify-center ${
                  viewMode === "table"
                    ? "bg-[#2C5AA0] text-white"
                    : "text-[#718096] hover:bg-[#F8F9FA] hover:text-[#1A202C]"
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Books display */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {filteredBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                isAuthenticated={isAuthenticated}
                isAlreadyRequested={activeLoanBookIds.includes(book.id)}
              />
            ))}
          </div>
        ) : (
          <BookTable
            books={filteredBooks}
            isAuthenticated={isAuthenticated}
            activeLoanBookIds={activeLoanBookIds}
          />
        )}
        
        {/* No results */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-[#4A5568] mb-2">No books found</h3>
            <p className="text-[#718096]">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}