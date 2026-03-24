// components/books/BookTable.tsx
import Link from "next/link"

interface Book {
  id: string
  title: string
  authors: string[]
  category: string
  publishedYear: number | null
  availableCopies: number
  totalCopies: number
  coverUrl: string | null
}

interface BookTableProps {
  books: Book[]
  isAuthenticated: boolean
}

export function BookTable({ books, isAuthenticated }: BookTableProps) {
  return (
    <div className="bg-white border border-[#E5E9ED] rounded-xl overflow-hidden shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
      <table className="w-full border-collapse">
        <thead className="bg-[#FAFBFC]">
          <tr>
            <th className="px-5 py-4 text-left text-[0.8125rem] font-bold uppercase tracking-wider text-[#718096] border-b border-[#E5E9ED]">
              Book
            </th>
            <th className="px-5 py-4 text-left text-[0.8125rem] font-bold uppercase tracking-wider text-[#718096] border-b border-[#E5E9ED]">
              Category
            </th>
            <th className="px-5 py-4 text-left text-[0.8125rem] font-bold uppercase tracking-wider text-[#718096] border-b border-[#E5E9ED]">
              Published
            </th>
            <th className="px-5 py-4 text-left text-[0.8125rem] font-bold uppercase tracking-wider text-[#718096] border-b border-[#E5E9ED]">
              Availability
            </th>
            <th className="px-5 py-4 text-left text-[0.8125rem] font-bold uppercase tracking-wider text-[#718096] border-b border-[#E5E9ED]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => {
            const isLast = index === books.length - 1
            const isAvailable = book.availableCopies > 0
            const isLimited = book.availableCopies === 1
            const isUnavailable = book.availableCopies === 0
            
            return (
              <tr 
                key={book.id}
                className={`${!isLast ? 'border-b border-[#E5E9ED]' : ''} hover:bg-[#F8F9FA] transition-colors duration-150`}
              >
                {/* Book info with thumbnail */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded flex-shrink-0 bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1] flex items-center justify-center font-serif text-sm font-bold text-[#718096]">
                      {book.title.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-serif font-bold text-[#1A202C] text-base mb-1 tracking-tight">
                        {book.title}
                      </div>
                      <div className="text-sm text-[#4A5568]">
                        {book.authors.join(", ")}
                      </div>
                    </div>
                  </div>
                </td>
                
                {/* Category */}
                <td className="px-5 py-4 text-[#4A5568] text-[0.9375rem]">
                  <span className="inline-block px-3 py-2 bg-[#FAFBFC] rounded text-[0.8125rem] font-semibold text-[#4A5568]">
                    {book.category}
                  </span>
                </td>
                
                {/* Published year */}
                <td className="px-5 py-4 text-[#4A5568] text-[0.9375rem]">
                  {book.publishedYear}
                </td>
                
                {/* Availability */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      isAvailable && !isLimited ? 'bg-[#0F7B6C]' :
                      isLimited ? 'bg-[#D97706]' :
                      'bg-[#A0AEC0]'
                    }`}></span>
                    <span className="font-semibold text-[#1A202C]">
                      {book.availableCopies} / {book.totalCopies}
                    </span>
                  </div>
                </td>
                
                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex gap-2 justify-end">
                    <button 
                      disabled={isUnavailable}
                      className="p-2 bg-white border border-[#E5E9ED] rounded transition-all duration-150 flex items-center justify-center text-[#4A5568] hover:bg-[#F8F9FA] hover:border-[#D1D8DF] hover:text-[#1A202C] disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Request Loan"
                    >
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </button>
                    <Link 
                      href={`/books/${book.id}`}
                      className="p-2 bg-white border border-[#E5E9ED] rounded transition-all duration-150 flex items-center justify-center text-[#4A5568] hover:bg-[#F8F9FA] hover:border-[#D1D8DF] hover:text-[#1A202C]"
                      title="View Details"
                    >
                      <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    </Link>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}