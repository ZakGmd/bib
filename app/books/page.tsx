// app/books/page.tsx
"use client"

import { useState } from "react"
import { BookCard } from "../components/books/bookCard"
import { BookTable } from "../components/books/bookTable"


// Fake data
const FAKE_BOOKS = [
  {
    id: "1",
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    authors: ["Robert C. Martin"],
    category: "Technology",
    publishedYear: 2008,
    availableCopies: 3,
    totalCopies: 3,
    coverUrl: null,
    description: "A handbook of agile software craftsmanship"
  },
  {
    id: "2",
    title: "Refactoring: Improving the Design of Existing Code",
    authors: ["Martin Fowler"],
    category: "Technology",
    publishedYear: 2018,
    availableCopies: 2,
    totalCopies: 2,
    coverUrl: null,
    description: "Improving the design of existing code"
  },
  {
    id: "3",
    title: "One Hundred Years of Solitude",
    authors: ["Gabriel García Márquez"],
    category: "Fiction",
    publishedYear: 1967,
    availableCopies: 1,
    totalCopies: 2,
    coverUrl: null,
    description: "The multi-generational story of the Buendía family"
  },
  {
    id: "4",
    title: "The Pragmatic Programmer",
    authors: ["David Thomas", "Andrew Hunt"],
    category: "Technology",
    publishedYear: 2019,
    availableCopies: 0,
    totalCopies: 2,
    coverUrl: null,
    description: "Your journey to mastery"
  },
  {
    id: "5",
    title: "Sapiens: A Brief History of Humankind",
    authors: ["Yuval Noah Harari"],
    category: "History",
    publishedYear: 2011,
    availableCopies: 4,
    totalCopies: 4,
    coverUrl: null,
    description: "A brief history of humankind"
  },
  {
    id: "6",
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    authors: ["Gang of Four"],
    category: "Technology",
    publishedYear: 1994,
    availableCopies: 1,
    totalCopies: 3,
    coverUrl: null,
    description: "Elements of reusable object-oriented software"
  }
]

export default function BooksPage() {
  // Simple state - easy for students to understand
  const [viewMode, setViewMode] = useState<"card" | "table">("card")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  
  // Get unique categories
  const categories = Array.from(new Set(FAKE_BOOKS.map(b => b.category)))
  
  // Filter books based on search and filters
  // This happens instantly as you type!
  let filteredBooks = FAKE_BOOKS
  
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
  
  // Calculate stats
  const totalBooks = FAKE_BOOKS.length
  const availableBooks = FAKE_BOOKS.filter(b => b.availableCopies > 0).length
  const onLoan = FAKE_BOOKS.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0)
  
  return (
    <div className="flex min-h-screen bg-[#FAFBFC]">
      {/* 
       <aside className="w-[280px] bg-white border-r border-[#E5E9ED] p-6 flex flex-col sticky top-0 h-screen">
        <div className="mb-12">
          <div className="font-serif text-[1.75rem] font-bold text-[#1A202C] mb-2 tracking-tight">Bibliotheca</div>
          <div className="text-sm text-[#718096] font-medium">Library Management</div>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-[#4A5568] rounded-lg hover:bg-[#F8F9FA] hover:text-[#1A202C] transition-all duration-150 font-medium text-[0.9375rem]">
                <svg className="w-5 h-5 mr-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-white bg-[#2C5AA0] rounded-lg transition-all duration-150 font-medium text-[0.9375rem]">
                <svg className="w-5 h-5 mr-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
                Books
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-[#4A5568] rounded-lg hover:bg-[#F8F9FA] hover:text-[#1A202C] transition-all duration-150 font-medium text-[0.9375rem]">
                <svg className="w-5 h-5 mr-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                Loan Requests
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-[#4A5568] rounded-lg hover:bg-[#F8F9FA] hover:text-[#1A202C] transition-all duration-150 font-medium text-[0.9375rem]">
                <svg className="w-5 h-5 mr-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Members
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center px-4 py-3 text-[#4A5568] rounded-lg hover:bg-[#F8F9FA] hover:text-[#1A202C] transition-all duration-150 font-medium text-[0.9375rem]">
                <svg className="w-5 h-5 mr-3 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                Authors
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="pt-5 border-t border-[#E5E9ED] mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#667EEA] to-[#764BA2] flex items-center justify-center text-white font-semibold text-sm">
              ZG
            </div>
            <div className="flex-1">
              <div className="font-semibold text-[0.9375rem] text-[#1A202C]">Zakaria</div>
              <div className="text-[0.8125rem] text-[#718096]">Librarian</div>
            </div>
          </div>
        </div>
      </aside>
      
      */}
      
      
      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-serif text-[2.5rem] font-bold text-[#1A202C] mb-2 tracking-tight leading-tight">Books Collection</h1>
          <p className="text-base text-[#4A5568]">Manage your library's catalog and track book availability</p>
        </header>
        
        {/* Stats bar */}
        <div className="flex gap-5 mb-6 p-5 bg-white border border-[#E5E9ED] rounded-xl">
          <div className="flex flex-col">
            <div className="text-sm text-[#718096] mb-2">Total Books</div>
            <div className="font-serif text-[1.75rem] font-bold text-[#1A202C] tracking-tight">{totalBooks}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-[#718096] mb-2">Available</div>
            <div className="font-serif text-[1.75rem] font-bold text-[#1A202C] tracking-tight">{availableBooks}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-[#718096] mb-2">On Loan</div>
            <div className="font-serif text-[1.75rem] font-bold text-[#1A202C] tracking-tight">{onLoan}</div>
          </div>
          <div className="flex flex-col">
            <div className="text-sm text-[#718096] mb-2">Categories</div>
            <div className="font-serif text-[1.75rem] font-bold text-[#1A202C] tracking-tight">{categories.length}</div>
          </div>
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
            {/* View toggle - simple onClick with setState */}
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
            
            <button className="px-5 py-3 bg-[#2C5AA0] text-white rounded-lg text-[0.9375rem] font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-px flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              Add New Book
            </button>
          </div>
        </div>
        
        {/* Books display */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {filteredBooks.map(book => (
              <BookCard 
                key={book.id}
                book={book}
                isAuthenticated={true}
              />
            ))}
          </div>
        ) : (
          <BookTable 
            books={filteredBooks}
            isAuthenticated={true}
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