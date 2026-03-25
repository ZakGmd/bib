"use client"

import { useState, useTransition } from "react"
import { approveLoan, denyLoan, returnLoan } from "@/app/actions/loans"

type Loan = {
  id: string
  status: string
  notes: string | null
  requestDate: string
  approvedAt: string | null
  loanDate: string | null
  dueDate: string | null
  returnDate: string | null
  user: { id: string; name: string; email: string; role: string }
  book: { id: string; title: string; availableCopies: number; totalCopies: number }
}

const TABS = ["All", "Pending", "Approved", "Denied", "Returned", "Overdue"] as const

const STATUS_STYLES: Record<string, string> = {
  PENDING:  "bg-[#FEF3E2] text-[#D97706] border-[#D97706]/20",
  APPROVED: "bg-[#E6F7F5] text-[#0F7B6C] border-[#0F7B6C]/20",
  DENIED:   "bg-[#FFF5F5] text-[#C53030] border-[#C53030]/20",
  RETURNED: "bg-[#FAFBFC] text-[#718096] border-[#E5E9ED]",
  OVERDUE:  "bg-[#FFF5F5] text-[#C53030] border-[#C53030]/20",
}

function fmt(iso: string | null) {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function isOverdue(loan: Loan) {
  return loan.status === "APPROVED" && loan.dueDate && new Date(loan.dueDate) < new Date()
}

export function LoansManager({ loans }: { loans: Loan[] }) {
  const [activeTab, setActiveTab] = useState<string>("All")
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
    Denied:   loans.filter((l) => l.status === "DENIED").length,
    Returned: loans.filter((l) => l.status === "RETURNED").length,
    Overdue:  loans.filter((l) => isOverdue(l)).length,
  }

  function act(fn: () => Promise<{ success: boolean; error?: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (!res.success) setError(res.error ?? "Something went wrong")
    })
  }

  return (
    <div className="p-8 h-screen">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-[2rem] font-bold text-[#1A202C] tracking-tight mb-1">Loan Management</h1>
        <p className="text-[0.9375rem] text-[#718096]">Review, approve, deny and process loan returns</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total",    value: loans.length,             color: "text-[#1A202C]" },
          { label: "Pending",  value: counts.Pending,           color: "text-[#D97706]" },
          { label: "Active",   value: counts.Approved,          color: "text-[#0F7B6C]" },
          { label: "Overdue",  value: counts.Overdue,           color: "text-[#C53030]" },
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
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          {error}
          <button onClick={() => setError(null)} className="ml-auto text-[#C53030]/60 hover:text-[#C53030]">✕</button>
        </div>
      )}

      {/* Tabs + table card */}
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

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#718096] text-sm">No loans in this category</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FAFBFC]">
                  {["User", "Book", "Requested", "Due Date", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3.5 text-left text-[0.8125rem] font-bold uppercase tracking-wider text-[#718096] border-b border-[#E5E9ED]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((loan, i) => {
                  const overdue = isOverdue(loan)
                  const displayStatus = overdue ? "OVERDUE" : loan.status
                  const isLast = i === filtered.length - 1

                  return (
                    <tr key={loan.id} className={`hover:bg-[#F8F9FA] transition-colors duration-100 ${!isLast ? "border-b border-[#E5E9ED]" : ""}`}>
                      {/* User */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#1A202C]">{loan.user.name}</p>
                        <p className="text-xs text-[#718096] mt-0.5">{loan.user.email}</p>
                        <span className="inline-block mt-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-[#4A5568]">
                          {loan.user.role}
                        </span>
                      </td>

                      {/* Book */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#1A202C] max-w-[200px] leading-snug">{loan.book.title}</p>
                        <p className="text-xs text-[#718096] mt-0.5">
                          {loan.book.availableCopies} / {loan.book.totalCopies} copies left
                        </p>
                      </td>

                      {/* Requested */}
                      <td className="px-5 py-4 text-sm text-[#4A5568]">{fmt(loan.requestDate)}</td>

                      {/* Due date */}
                      <td className="px-5 py-4 text-sm">
                        {loan.dueDate ? (
                          <span className={overdue ? "text-[#C53030] font-semibold" : "text-[#4A5568]"}>
                            {fmt(loan.dueDate)}
                          </span>
                        ) : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${STATUS_STYLES[displayStatus] ?? ""}`}>
                          {displayStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {loan.status === "PENDING" && (
                            <>
                              <button
                                disabled={isPending}
                                onClick={() => act(() => approveLoan(loan.id))}
                                className="px-3 py-1.5 bg-[#E6F7F5] text-[#0F7B6C] border border-[#0F7B6C]/20 rounded-lg text-xs font-semibold hover:bg-[#0F7B6C] hover:text-white transition-all duration-150 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                disabled={isPending}
                                onClick={() => act(() => denyLoan(loan.id))}
                                className="px-3 py-1.5 bg-[#FFF5F5] text-[#C53030] border border-[#C53030]/20 rounded-lg text-xs font-semibold hover:bg-[#C53030] hover:text-white transition-all duration-150 disabled:opacity-50"
                              >
                                Deny
                              </button>
                            </>
                          )}
                          {(loan.status === "APPROVED" || overdue) && (
                            <button
                              disabled={isPending}
                              onClick={() => act(() => returnLoan(loan.id))}
                              className="px-3 py-1.5 bg-[#EBF1FA] text-[#2C5AA0] border border-[#2C5AA0]/20 rounded-lg text-xs font-semibold hover:bg-[#2C5AA0] hover:text-white transition-all duration-150 disabled:opacity-50"
                            >
                              Mark Returned
                            </button>
                          )}
                          {(loan.status === "DENIED" || loan.status === "RETURNED") && (
                            <span className="text-xs text-[#A0AEC0]">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
