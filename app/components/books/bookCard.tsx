// components/books/BookCard.tsx
import Link from "next/link"

interface Book {
  id: string
  title: string
  authors: string[]
  category: string
  publishedYear: number
  availableCopies: number
  totalCopies: number
  coverUrl: string | null
  description?: string
}

interface BookCardProps {
  book: Book
  isAuthenticated: boolean
}

export function BookCard({ book, isAuthenticated }: BookCardProps) {
  const isAvailable = book.availableCopies > 0
  const isLimited = book.availableCopies === 1
  const isUnavailable = book.availableCopies === 0
  
  return (
    <article className="bg-white border border-[#E5E9ED] rounded-xl overflow-hidden transition-all duration-200 flex flex-col shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] hover:border-[#D1D8DF] hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.08),0_4px_6px_-2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 group">
      {/* Book cover */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1] flex items-center justify-center overflow-hidden">
        <div className="font-serif text-2xl font-bold text-[#718096] text-center p-5 leading-tight">
          {book.title}
        </div>
        
        {/* Availability badge */}
        <div className="absolute top-3 right-3 py-2 rounded-lg text-xs font-semibold shadow-sm backdrop-blur-sm">
          {isAvailable && !isLimited && (
            <span className="bg-[#E6F7F5] text-[#0F7B6C] border border-[#0F7B6C]/20 px-3 py-2 rounded-lg">
              {book.availableCopies} Available
            </span>
          )}
          {isLimited && (
            <span className="bg-[#FEF3E2] text-[#D97706] border border-[#D97706]/20 px-3 py-2 rounded-lg">
              {book.availableCopies} Available
            </span>
          )}
          {isUnavailable && (
            <span className="bg-white/95 text-[#718096] border border-[#E5E9ED] px-3 py-2 rounded-lg">
              0 Available
            </span>
          )}
        </div>
      </div>
      
      {/* Book info */}
      <div className="p-5 flex flex-col flex-1">
        {/* Category */}
        <div className="text-xs font-semibold uppercase tracking-wider text-[#2C5AA0] mb-2">
          {book.category}
        </div>
        
        {/* Title */}
        <h3 className="font-serif text-xl font-bold text-[#1A202C] mb-2 leading-tight tracking-tight group-hover:text-[#2C5AA0] transition-colors duration-200">
          {book.title}
        </h3>
        
        {/* Author */}
        <p className="text-[0.9375rem] text-[#4A5568] mb-4">
          {book.authors.join(", ")}
        </p>
        
        {/* Meta info */}
        <div className="flex gap-4 mb-4 pt-4 border-t border-[#E5E9ED] text-sm">
          <div className="flex flex-col">
            <span className="text-xs text-[#718096] mb-1">Published</span>
            <span className="text-[#1A202C] font-semibold">{book.publishedYear}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#718096] mb-1">Copies</span>
            <span className="text-[#1A202C] font-semibold">{book.availableCopies} / {book.totalCopies}</span>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {isAuthenticated ? (
            <button 
              disabled={isUnavailable}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2 ${
                isUnavailable
                  ? 'bg-white text-[#4A5568] border border-[#E5E9ED] opacity-50 cursor-not-allowed'
                  : 'bg-[#2C5AA0] text-white hover:bg-[#234780] hover:-translate-y-px hover:shadow-sm'
              }`}
            >
              Request Loan
            </button>
          ) : (
            <Link 
              href="/login"
              className="flex-1 px-4 py-3 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 hover:-translate-y-px hover:shadow-sm text-center"
            >
              Login to Request
            </Link>
          )}
          
          <Link 
            href={`/books/${book.id}`}
            className="flex-1 px-4 py-3 bg-white text-[#4A5568] border border-[#E5E9ED] rounded-lg text-sm font-semibold hover:bg-[#F8F9FA] hover:border-[#D1D8DF] hover:text-[#1A202C] transition-all duration-150 text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  )
}