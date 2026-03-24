"use client"

import { useState, useTransition } from "react"
import { cancelLoan } from "@/app/actions/loans"
import Link from "next/link"

type Loan = {
  id: string
  status: string
  notes: string | null
  requestDate: string
  approvedAt: string | null
  loanDate: string | null
  dueDate: string | null
  returnDate: string | null
  book: {
    id: string
    title: string
    authors: string[]
    category: string | null
    coverUrl: string | null
  }
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:  "bg-[#FEF3E2] text-[#D97706] border-[#D97706]/20",
  APPROVED: "bg-[#E6F7F5] text-[#0F7B6C] border-[#0F7B6C]/20",
  DENIED:   "bg-[#FFF5F5] text-[#C53030] border-[#C53030]/20",
  RETURNED: "bg-[#FAFBFC] text-[#718096] border-[#E5E9ED]",
  OVERDUE:  "bg-[#FFF5F5] text-[#C53030] border-[#C53030]/20",
}

const TABS = ["All", "Pending", "Approved", "Returned", "Denied"] as const

function fmt(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function isOverdue(loan: Loan) {
  return loan.status === "APPROVED" && loan.dueDate && new Date(loan.dueDate) < new Date()
}

export function MyLoansClient({ loans, userName }: { loans: Loan[]; userName: string }) {
  const [activeTab, setActiveTab] = useState("All")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = loans.filter((l) => {
    if (activeTab === "All") return true
    return l.status === activeTab.toUpperCase()
  })

  const counts = {
    All:      loans.length,
    Pending:  loans.filter((l) => l.status === "PENDING").length,
    Approved: loans.filter((l) => l.status === "APPROVED").length,
    Returned: loans.filter((l) => l.status === "RETURNED").length,
    Denied:   loans.filter((l) => l.status === "DENIED").length,
  }

  function handleCancel(loanId: string) {
    setError(null)
    startTransition(async () => {
      const res = await cancelLoan(loanId)
      if (!res.success) setError(res.error ?? "Failed to cancel")
    })
  }

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8 py-10">

        {/* Header */}
        <header className="mb-8">
          <h1 className="font-serif text-[2rem] font-bold text-[#1A202C] tracking-tight mb-1">My Loans</h1>
          <p className="text-[0.9375rem] text-[#718096]">
            Welcome back, <span className="font-semibold text-[#4A5568]">{userName}</span> — track your loan requests here
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total",    value: counts.All,      color: "text-[#1A202C]" },
            { label: "Pending",  value: counts.Pending,  color: "text-[#D97706]" },
            { label: "Active",   value: counts.Approved, color: "text-[#0F7B6C]" },
            { label: "Returned", value: counts.Returned, color: "text-[#718096]" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-[#E5E9ED] rounded-xl p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.03)]">
              <p className="text-sm text-[#718096] mb-1.5">{label}</p>
              <p className={`font-serif text-[2rem] font-bold tracking-tight ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-[#FFF5F5] border border-[#FEB2B2] rounded-lg text-sm text-[#C53030]">
            {error}
            <button onClick={() => setError(null)} className="ml-auto">✕</button>
          </div>
        )}

        {loans.length === 0 ? (
          /* Empty state */
          <div className="bg-white border border-[#E5E9ED] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] py-20 text-center">
            <div className="w-14 h-14 bg-[#EBF1FA] rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-[#2C5AA0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1A202C] mb-2">No loans yet</h3>
            <p className="text-[#718096] text-sm mb-6">Browse the catalog and request your first book</p>
            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-[#E5E9ED] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-[#E5E9ED] px-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-150 ${
                    activeTab === tab
                      ? "border-[#2C5AA0] text-[#2C5AA0]"
                      : "border-transparent text-[#718096] hover:text-[#1A202C]"
                  }`}
                >
                  {tab}
                  <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                    activeTab === tab ? "bg-[#EBF1FA] text-[#2C5AA0]" : "bg-[#F8F9FA] text-[#718096]"
                  }`}>
                    {counts[tab]}
                  </span>
                </button>
              ))}
            </div>

            {/* List */}
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-sm text-[#718096]">No loans in this category</div>
            ) : (
              <div className="divide-y divide-[#E5E9ED]">
                {filtered.map((loan) => {
                  const overdue = isOverdue(loan)
                  const displayStatus = overdue ? "OVERDUE" : loan.status

                  return (
                    <div key={loan.id} className="flex items-center gap-5 px-6 py-4 hover:bg-[#F8F9FA] transition-colors duration-100">
                      {/* Book icon */}
                      <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1] flex items-center justify-center shrink-0 font-serif text-sm font-bold text-[#718096]">
                        {loan.book.title.charAt(0)}
                      </div>

                      {/* Book info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A202C] truncate">{loan.book.title}</p>
                        <p className="text-xs text-[#718096] mt-0.5">{loan.book.authors.join(", ")}</p>
                        {loan.book.category && (
                          <span className="inline-block mt-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-[#2C5AA0]">
                            {loan.book.category}
                          </span>
                        )}
                      </div>

                      {/* Dates */}
                      <div className="hidden sm:flex flex-col items-end gap-1 text-xs text-[#718096] shrink-0">
                        <span>Requested {fmt(loan.requestDate)}</span>
                        {loan.dueDate && (
                          <span className={overdue ? "text-[#C53030] font-semibold" : ""}>
                            Due {fmt(loan.dueDate)}
                          </span>
                        )}
                        {loan.returnDate && (
                          <span className="text-[#0F7B6C]">Returned {fmt(loan.returnDate)}</span>
                        )}
                      </div>

                      {/* Status */}
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border shrink-0 ${STATUS_STYLES[displayStatus] ?? ""}`}>
                        {displayStatus}
                      </span>

                      {/* Cancel */}
                      {loan.status === "PENDING" && (
                        <button
                          disabled={isPending}
                          onClick={() => handleCancel(loan.id)}
                          className="px-3 py-1.5 border border-[#E5E9ED] rounded-lg text-xs font-semibold text-[#718096] hover:border-[#FEB2B2] hover:text-[#C53030] hover:bg-[#FFF5F5] transition-all duration-150 shrink-0 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        <p className="text-center mt-6">
          <Link href="/books" className="text-sm font-medium text-[#2C5AA0] hover:text-[#234780] transition-colors duration-150">
            ← Back to catalog
          </Link>
        </p>

      </div>
    </div>
  )
}
