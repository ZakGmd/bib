// components/books/BooksControls.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

interface BooksControlsProps {
  categories: string[]
  totalBooks: number
  availableBooks: number
  onLoan: number
}

export function BooksControls({
  categories,
  totalBooks,
  availableBooks,
  onLoan
}: BooksControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const currentView = searchParams.get("view") || "card"
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  
  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === "" || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    
    router.push(`?${params.toString()}`)
  }
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateURL("search", searchQuery)
  }
  
  const handleViewChange = (view: string) => {
    updateURL("view", view)
  }
  
  return (
    <>
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
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
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
          </form>
          
          {/* Category filter */}
          <select 
            onChange={(e) => updateURL("category", e.target.value)}
            defaultValue={searchParams.get("category") || "all"}
            className="px-4 py-3 border border-[#E5E9ED] rounded-lg text-[0.9375rem] bg-white text-[#1A202C] font-medium min-w-[160px] cursor-pointer hover:border-[#D1D8DF] focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>
          
          {/* Availability filter */}
          <select 
            onChange={(e) => updateURL("availability", e.target.value)}
            defaultValue={searchParams.get("availability") || "all"}
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
              onClick={() => handleViewChange("card")}
              className={`px-3 py-2 rounded transition-all duration-150 flex items-center justify-center ${
                currentView === "card"
                  ? "bg-[#2C5AA0] text-white"
                  : "text-[#718096] hover:bg-[#F8F9FA] hover:text-[#1A202C]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 6v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleViewChange("table")}
              className={`px-3 py-2 rounded transition-all duration-150 flex items-center justify-center ${
                currentView === "table"
                  ? "bg-[#2C5AA0] text-white"
                  : "text-[#718096] hover:bg-[#F8F9FA] hover:text-[#1A202C]"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
            </button>
          </div>
          
          {/* Add book button */}
          <button className="px-5 py-3 bg-[#2C5AA0] text-white rounded-lg text-[0.9375rem] font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-px flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Add New Book
          </button>
        </div>
      </div>
    </>
  )
}