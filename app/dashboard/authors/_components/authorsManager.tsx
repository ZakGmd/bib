"use client"

import { useState, useTransition } from "react"
import { createAuthor, updateAuthor, deleteAuthor, type AuthorFormData } from "@/app/actions/authors"

type AuthorRow = {
  id: string
  name: string
  bio: string | null
  photoUrl: string | null
  bookCount: number
}

const EMPTY_FORM: AuthorFormData = { name: "", bio: "", photoUrl: "" }

function authorToForm(a: AuthorRow): AuthorFormData {
  return { name: a.name, bio: a.bio ?? "", photoUrl: a.photoUrl ?? "" }
}

export function AuthorsManager({ authors }: { authors: AuthorRow[] }) {
  const [search, setSearch] = useState("")
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editTarget, setEditTarget] = useState<AuthorRow | null>(null)
  const [form, setForm] = useState<AuthorFormData>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = authors.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setForm(EMPTY_FORM)
    setFormError(null)
    setModal("add")
  }

  function openEdit(author: AuthorRow) {
    setEditTarget(author)
    setForm(authorToForm(author))
    setFormError(null)
    setModal("edit")
  }

  function closeModal() {
    setModal(null)
    setEditTarget(null)
    setFormError(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    startTransition(async () => {
      const res = modal === "add"
        ? await createAuthor(form)
        : await updateAuthor(editTarget!.id, form)
      if (!res.success) {
        setFormError(res.error ?? "Something went wrong")
      } else {
        closeModal()
      }
    })
  }

  function handleDelete(authorId: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setActionError(null)
    startTransition(async () => {
      const res = await deleteAuthor(authorId)
      if (!res.success) setActionError(res.error ?? "Failed to delete")
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] font-bold text-[#1A202C] tracking-tight mb-1">Authors</h1>
          <p className="text-[0.9375rem] text-[#718096]">{authors.length} authors in the system</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-px"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Author
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search authors…"
          className="w-full pl-10 pr-4 py-2.5 border border-[#E5E9ED] rounded-lg text-sm text-[#1A202C] placeholder-[#A0AEC0] bg-white focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
        />
      </div>

      {/* Action error */}
      {actionError && (
        <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-[#FFF5F5] border border-[#FEB2B2] rounded-lg text-sm text-[#C53030]">
          {actionError}
          <button onClick={() => setActionError(null)} className="ml-auto">✕</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E5E9ED] rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#FAFBFC]">
              {["Author", "Bio", "Books", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-[0.8125rem] font-bold uppercase tracking-wider text-[#718096] border-b border-[#E5E9ED]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-12 text-center text-sm text-[#718096]">No authors found</td>
              </tr>
            ) : filtered.map((author, i) => (
              <tr key={author.id} className={`hover:bg-[#F8F9FA] transition-colors duration-100 ${i < filtered.length - 1 ? "border-b border-[#E5E9ED]" : ""}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f5f7fa] to-[#e8ecf1] flex items-center justify-center text-sm font-bold text-[#718096] shrink-0">
                      {author.name.charAt(0).toUpperCase()}
                    </div>
                    <p className="text-sm font-semibold text-[#1A202C]">{author.name}</p>
                  </div>
                </td>
                <td className="px-5 py-4 max-w-[320px]">
                  <p className="text-sm text-[#4A5568] truncate">{author.bio || "—"}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-block px-2.5 py-1 bg-[#EBF1FA] text-[#2C5AA0] text-xs font-semibold rounded">
                    {author.bookCount} {author.bookCount === 1 ? "book" : "books"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(author)}
                      className="px-3 py-1.5 border border-[#E5E9ED] rounded-lg text-xs font-semibold text-[#4A5568] hover:bg-[#F8F9FA] hover:border-[#D1D8DF] hover:text-[#1A202C] transition-all duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(author.id, author.name)}
                      disabled={isPending}
                      className="px-3 py-1.5 border border-[#FEB2B2] rounded-lg text-xs font-semibold text-[#C53030] hover:bg-[#FFF5F5] transition-all duration-150 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E9ED]">
              <h2 className="font-serif text-xl font-bold text-[#1A202C]">
                {modal === "add" ? "Add New Author" : "Edit Author"}
              </h2>
              <button onClick={closeModal} className="p-1.5 text-[#718096] hover:text-[#1A202C] hover:bg-[#F8F9FA] rounded-lg transition-all duration-150">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="px-4 py-3 bg-[#FFF5F5] border border-[#FEB2B2] rounded-lg text-sm text-[#C53030]">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#1A202C] mb-1.5">
                  Name <span className="text-[#C53030]">*</span>
                </label>
                <input
                  value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required placeholder="Author full name"
                  className="w-full px-3.5 py-2.5 border border-[#E5E9ED] rounded-lg text-sm text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A202C] mb-1.5">Bio</label>
                <textarea
                  value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                  rows={4} placeholder="Short biography…"
                  className="w-full px-3.5 py-2.5 border border-[#E5E9ED] rounded-lg text-sm text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A202C] mb-1.5">Photo URL</label>
                <input
                  value={form.photoUrl} onChange={(e) => setForm((f) => ({ ...f, photoUrl: e.target.value }))}
                  placeholder="https://…"
                  className="w-full px-3.5 py-2.5 border border-[#E5E9ED] rounded-lg text-sm text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-[#E5E9ED] rounded-lg text-sm font-semibold text-[#4A5568] hover:bg-[#F8F9FA] transition-all duration-150">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-1 px-4 py-2.5 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm disabled:opacity-60">
                  {isPending ? "Saving…" : modal === "add" ? "Add Author" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
