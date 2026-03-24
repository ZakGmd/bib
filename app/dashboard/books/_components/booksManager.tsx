"use client"

import { useState, useTransition } from "react"
import { createBook, updateBook, deleteBook, type BookFormData } from "@/app/actions/books"

type BookRow = {
  id: string
  title: string
  isbn: string | null
  publisher: string | null
  publishedYear: number | null
  category: string | null
  description: string | null
  coverUrl: string | null
  totalCopies: number
  availableCopies: number
  authors: { id: string; name: string }[]
}

type Author = { id: string; name: string }

const EMPTY_FORM: BookFormData = {
  title: "", isbn: "", publisher: "", publishedYear: "",
  category: "", description: "", coverUrl: "", totalCopies: "1", authorIds: [],
}

function bookToForm(book: BookRow): BookFormData {
  return {
    title: book.title,
    isbn: book.isbn ?? "",
    publisher: book.publisher ?? "",
    publishedYear: book.publishedYear?.toString() ?? "",
    category: book.category ?? "",
    description: book.description ?? "",
    coverUrl: book.coverUrl ?? "",
    totalCopies: book.totalCopies.toString(),
    authorIds: book.authors.map((a) => a.id),
  }
}

function InputField({ label, name, value, onChange, type = "text", placeholder = "", required = false }: {
  label: string; name: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1A202C] mb-1.5">
        {label}{required && <span className="text-[#C53030] ml-0.5">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full px-3.5 py-2.5 border border-[#E5E9ED] rounded-lg text-sm text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150"
      />
    </div>
  )
}

export function BooksManager({ books, authors }: { books: BookRow[]; authors: Author[] }) {
  const [search, setSearch] = useState("")
  const [modal, setModal] = useState<"add" | "edit" | null>(null)
  const [editTarget, setEditTarget] = useState<BookRow | null>(null)
  const [form, setForm] = useState<BookFormData>(EMPTY_FORM)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.category?.toLowerCase().includes(search.toLowerCase()) ||
      b.authors.some((a) => a.name.toLowerCase().includes(search.toLowerCase()))
  )

  function openAdd() {
    setForm(EMPTY_FORM)
    setFormError(null)
    setModal("add")
  }

  function openEdit(book: BookRow) {
    setEditTarget(book)
    setForm(bookToForm(book))
    setFormError(null)
    setModal("edit")
  }

  function closeModal() {
    setModal(null)
    setEditTarget(null)
    setFormError(null)
  }

  function toggleAuthor(id: string) {
    setForm((f) => ({
      ...f,
      authorIds: f.authorIds.includes(id) ? f.authorIds.filter((x) => x !== id) : [...f.authorIds, id],
    }))
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError(null)
    startTransition(async () => {
      const res = modal === "add"
        ? await createBook(form)
        : await updateBook(editTarget!.id, form)
      if (!res.success) {
        setFormError(res.error ?? "Something went wrong")
      } else {
        closeModal()
      }
    })
  }

  function handleDelete(bookId: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setActionError(null)
    startTransition(async () => {
      const res = await deleteBook(bookId)
      if (!res.success) setActionError(res.error ?? "Failed to delete")
    })
  }

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-[2rem] font-bold text-[#1A202C] tracking-tight mb-1">Books</h1>
          <p className="text-[0.9375rem] text-[#718096]">{books.length} books in the catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm hover:shadow-md hover:-translate-y-px"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Book
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books…"
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
              {["Title & Authors", "Category", "Year", "Copies", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-[0.8125rem] font-bold uppercase tracking-wider text-[#718096] border-b border-[#E5E9ED]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-[#718096]">No books found</td>
              </tr>
            ) : filtered.map((book, i) => (
              <tr key={book.id} className={`hover:bg-[#F8F9FA] transition-colors duration-100 ${i < filtered.length - 1 ? "border-b border-[#E5E9ED]" : ""}`}>
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold text-[#1A202C] leading-snug">{book.title}</p>
                  <p className="text-xs text-[#718096] mt-0.5">{book.authors.map((a) => a.name).join(", ") || "—"}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-block px-2.5 py-1 bg-[#FAFBFC] border border-[#E5E9ED] rounded text-xs font-medium text-[#4A5568]">
                    {book.category || "—"}
                  </span>
                </td>
                <td className="px-5 py-4 text-sm text-[#4A5568]">{book.publishedYear ?? "—"}</td>
                <td className="px-5 py-4">
                  <span className={`text-sm font-semibold ${book.availableCopies === 0 ? "text-[#C53030]" : book.availableCopies === 1 ? "text-[#D97706]" : "text-[#0F7B6C]"}`}>
                    {book.availableCopies}
                  </span>
                  <span className="text-sm text-[#718096]"> / {book.totalCopies}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEdit(book)}
                      className="px-3 py-1.5 border border-[#E5E9ED] rounded-lg text-xs font-semibold text-[#4A5568] hover:bg-[#F8F9FA] hover:border-[#D1D8DF] hover:text-[#1A202C] transition-all duration-150"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id, book.title)}
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
          <div className="bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E9ED]">
              <h2 className="font-serif text-xl font-bold text-[#1A202C]">
                {modal === "add" ? "Add New Book" : "Edit Book"}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <InputField label="Title" name="title" value={form.title} onChange={(v) => setForm((f) => ({ ...f, title: v }))} required placeholder="Book title" />
                </div>
                <InputField label="ISBN" name="isbn" value={form.isbn} onChange={(v) => setForm((f) => ({ ...f, isbn: v }))} placeholder="978-..." />
                <InputField label="Publisher" name="publisher" value={form.publisher} onChange={(v) => setForm((f) => ({ ...f, publisher: v }))} />
                <InputField label="Published Year" name="publishedYear" type="number" value={form.publishedYear} onChange={(v) => setForm((f) => ({ ...f, publishedYear: v }))} placeholder="2024" />
                <InputField label="Category" name="category" value={form.category} onChange={(v) => setForm((f) => ({ ...f, category: v }))} placeholder="e.g. Software Engineering" />
                <div className="col-span-2">
                  <InputField label="Cover URL" name="coverUrl" value={form.coverUrl} onChange={(v) => setForm((f) => ({ ...f, coverUrl: v }))} placeholder="https://..." />
                </div>
                <InputField label="Total Copies" name="totalCopies" type="number" value={form.totalCopies} onChange={(v) => setForm((f) => ({ ...f, totalCopies: v }))} required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A202C] mb-1.5">Description</label>
                <textarea
                  value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={3} placeholder="Brief description of the book…"
                  className="w-full px-3.5 py-2.5 border border-[#E5E9ED] rounded-lg text-sm text-[#1A202C] placeholder-[#A0AEC0] focus:outline-none focus:border-[#2C5AA0] focus:ring-2 focus:ring-[#2C5AA0]/10 transition-all duration-150 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1A202C] mb-2">Authors</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border border-[#E5E9ED] rounded-lg p-3">
                  {authors.map((author) => (
                    <label key={author.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox" checked={form.authorIds.includes(author.id)}
                        onChange={() => toggleAuthor(author.id)}
                        className="w-4 h-4 rounded border-[#E5E9ED] text-[#2C5AA0] focus:ring-[#2C5AA0]/20"
                      />
                      <span className="text-sm text-[#4A5568] group-hover:text-[#1A202C] transition-colors duration-150">{author.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-[#E5E9ED] rounded-lg text-sm font-semibold text-[#4A5568] hover:bg-[#F8F9FA] transition-all duration-150">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex-1 px-4 py-2.5 bg-[#2C5AA0] text-white rounded-lg text-sm font-semibold hover:bg-[#234780] transition-all duration-150 shadow-sm disabled:opacity-60">
                  {isPending ? "Saving…" : modal === "add" ? "Add Book" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
