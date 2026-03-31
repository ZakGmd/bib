"use client"

import { useState, useTransition } from "react"
import { submitContact } from "@/app/actions/contact"

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await submitContact(form)
      if (res.success) {
        setSuccess(true)
        setForm({ name: "", email: "", message: "" })
      } else {
        setError(res.error ?? "Something went wrong.")
      }
    })
  }

  if (success) {
    return (
      <div className="bg-white border border-[#E5E9ED] rounded-xl p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)] flex flex-col items-center text-center py-12">
        <div className="w-12 h-12 bg-[#E6F7F5] rounded-full flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-[#0F7B6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-xl font-bold text-[#1A202C] mb-2">Message sent!</h3>
        <p className="text-sm text-[#718096] mb-6 leading-relaxed">
          Thank you for reaching out. Our librarian will get back to you soon.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm font-semibold text-[#2C5AA0] hover:text-[#234780] transition-colors"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#E5E9ED] rounded-xl p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.04)]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <p className="font-serif text-xl font-bold text-[#1A202C] mb-1">Send a message</p>
          <p className="text-sm text-[#718096]">We'll reply as soon as possible.</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-[#FFF5F5] border border-[#FEB2B2] rounded-lg text-sm text-[#C53030]">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#4A5568] uppercase tracking-wide">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Your full name"
            className="px-4 py-3 border border-[#E5E9ED] rounded-lg text-sm text-[#1A202C] placeholder-[#A0AEC0] bg-white focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#4A5568] uppercase tracking-wide">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="your@email.com"
            className="px-4 py-3 border border-[#E5E9ED] rounded-lg text-sm text-[#1A202C] placeholder-[#A0AEC0] bg-white focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#4A5568] uppercase tracking-wide">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Write your message here..."
            className="px-4 py-3 border border-[#E5E9ED] rounded-lg text-sm text-[#1A202C] placeholder-[#A0AEC0] bg-white focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full px-4 py-3 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Sending..." : "Send message"}
        </button>
      </form>
    </div>
  )
}
