"use client"

import { useState, useTransition } from "react"
import { requestLoan } from "@/app/actions/loans"

interface Props {
  bookId: string
  isAlreadyRequested: boolean
  isUnavailable: boolean
}

export function RequestLoanButton({ bookId, isAlreadyRequested, isUnavailable }: Props) {
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (isAlreadyRequested || done) {
    return (
      <span className="flex-1 px-4 py-3 bg-[#E6F7F5] text-[#0F7B6C] border border-[#0F7B6C]/20 rounded-lg text-sm font-semibold text-center">
        Requested ✓
      </span>
    )
  }

  if (isUnavailable) {
    return (
      <span className="flex-1 px-4 py-3 bg-white text-[#4A5568] border border-[#E5E9ED] rounded-lg text-sm font-semibold text-center opacity-50">
        Unavailable
      </span>
    )
  }

  return (
    <div className="flex-1 flex flex-col gap-1">
      <button
        disabled={isPending}
        onClick={() => {
          setError(null)
          startTransition(async () => {
            const res = await requestLoan(bookId)
            if (res.success) {
              setDone(true)
            } else {
              setError(res.error ?? "Request failed")
            }
          })
        }}
        className="w-full px-4 py-3 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 hover:-translate-y-px hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
      >
        {isPending ? "Requesting…" : "Request Loan"}
      </button>
      {error && <p className="text-xs text-[#C53030] px-1">{error}</p>}
    </div>
  )
}
