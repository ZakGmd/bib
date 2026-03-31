"use client"

import { useState, useTransition } from "react"
import { markAsRead, deleteMessage } from "@/app/actions/contact"

type Message = {
  id: string
  name: string
  email: string
  message: string
  read: boolean
  createdAt: string
}

const TABS = ["All", "Unread", "Read"] as const

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

export function MessagesManager({ messages }: { messages: Message[] }) {
  const [activeTab, setActiveTab] = useState<string>("All")
  const [expanded, setExpanded] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = messages.filter((m) => {
    if (activeTab === "Unread") return !m.read
    if (activeTab === "Read") return m.read
    return true
  })

  const counts = {
    All: messages.length,
    Unread: messages.filter((m) => !m.read).length,
    Read: messages.filter((m) => m.read).length,
  }

  function act(fn: () => Promise<{ success: boolean; error?: string }>) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (!res.success) setError(res.error ?? "Something went wrong")
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-[2rem] font-bold text-[#1A202C] tracking-tight mb-1">Messages</h1>
        <p className="text-[0.9375rem] text-[#718096]">Contact messages sent by students and visitors</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total",  value: counts.All,    color: "text-[#1A202C]" },
          { label: "Unread", value: counts.Unread,  color: "text-[#D97706]" },
          { label: "Read",   value: counts.Read,    color: "text-[#0F7B6C]" },
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
          <button onClick={() => setError(null)} className="ml-auto">✕</button>
        </div>
      )}

      {/* Messages card */}
      <div className="bg-white border border-[#E5E9ED] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-[#E5E9ED] px-1">
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
                {counts[tab as keyof typeof counts]}
              </span>
            </button>
          ))}
        </div>

        {/* List */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-[#718096] text-sm">No messages in this category</p>
          </div>
        ) : (
          <div className="divide-y divide-[#E5E9ED]">
            {filtered.map((msg) => (
              <div key={msg.id} className={`transition-colors duration-100 ${!msg.read ? "bg-[#FAFBFC]" : "bg-white"}`}>
                {/* Row */}
                <div
                  className="flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-[#F8F9FA]"
                  onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}
                >
                  {/* Unread dot */}
                  <div className={`w-2 h-2 rounded-full shrink-0 ${!msg.read ? "bg-[#2C5AA0]" : "bg-transparent"}`} />

                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[#EBF1FA] flex items-center justify-center shrink-0 font-serif text-sm font-bold text-[#2C5AA0]">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm truncate ${!msg.read ? "font-bold text-[#1A202C]" : "font-medium text-[#4A5568]"}`}>
                        {msg.name}
                      </p>
                      {!msg.read && (
                        <span className="px-1.5 py-0.5 bg-[#EBF1FA] text-[#2C5AA0] text-[0.625rem] font-bold uppercase tracking-wide rounded">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#718096] truncate">{msg.email}</p>
                  </div>

                  {/* Preview */}
                  <p className="hidden md:block text-sm text-[#718096] truncate max-w-[260px]">
                    {msg.message}
                  </p>

                  {/* Date + chevron */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#718096]">{fmt(msg.createdAt)}</span>
                    <svg
                      className={`w-4 h-4 text-[#718096] transition-transform duration-150 ${expanded === msg.id ? "rotate-180" : ""}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded content */}
                {expanded === msg.id && (
                  <div className="px-6 pb-5 ml-[52px]">
                    <div className="bg-[#FAFBFC] border border-[#E5E9ED] rounded-xl p-5 mb-4">
                      <p className="text-sm text-[#1A202C] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {!msg.read && (
                        <button
                          disabled={isPending}
                          onClick={() => act(() => markAsRead(msg.id))}
                          className="px-4 py-2 bg-[#2C5AA0] text-white rounded-lg text-xs font-semibold hover:bg-[#234780] transition-all duration-150 disabled:opacity-50"
                        >
                          Mark as read
                        </button>
                      )}
                      <a
                        href={`mailto:${msg.email}`}
                        className="px-4 py-2 bg-white border border-[#E5E9ED] text-[#4A5568] rounded-lg text-xs font-semibold hover:bg-[#F8F9FA] hover:text-[#1A202C] transition-all duration-150"
                      >
                        Reply by email
                      </a>
                      <button
                        disabled={isPending}
                        onClick={() => act(() => deleteMessage(msg.id))}
                        className="px-4 py-2 bg-white border border-[#E5E9ED] text-[#718096] rounded-lg text-xs font-semibold hover:border-[#FEB2B2] hover:text-[#C53030] hover:bg-[#FFF5F5] transition-all duration-150 disabled:opacity-50 ml-auto"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
