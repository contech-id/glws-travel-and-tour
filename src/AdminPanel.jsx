import { useEffect, useState } from 'react'
import {
  ArrowRight,
  ChevronDown,
  Edit3,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import tourData from './data/tourData.json'
import articleData from './data/articleData.json'

/* ─── LocalStorage helpers ─── */
const LS_PACKAGES_KEY = 'glws_admin_packages'
const LS_ARTICLES_KEY = 'glws_admin_articles'
const LS_AUTH_KEY = 'glws_admin_auth'

function loadPackages() {
  try {
    const saved = localStorage.getItem(LS_PACKAGES_KEY)
    return saved ? JSON.parse(saved) : tourData.packages
  } catch { return tourData.packages }
}

function savePackages(packages) {
  localStorage.setItem(LS_PACKAGES_KEY, JSON.stringify(packages))
}

function loadArticles() {
  try {
    const saved = localStorage.getItem(LS_ARTICLES_KEY)
    return saved ? JSON.parse(saved) : articleData.articles
  } catch { return articleData.articles }
}

function saveArticles(articles) {
  localStorage.setItem(LS_ARTICLES_KEY, JSON.stringify(articles))
}

/* ─── Export these for public pages to use ─── */
export function getPackages() { return loadPackages() }
export function getArticles() { return loadArticles() }

/* ─── Dummy credentials ─── */
const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASSWORD = 'Admin_123'

/* ─── Category list ─── */
const categoryOptions = tourData.categories.map(c => ({ slug: c.slug, title: c.title }))

/* ─── Slug generator ─── */
function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/* ══════════════════════════════════════════════════
   AdminLoginPage
   ══════════════════════════════════════════════════ */
export function AdminLoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem(LS_AUTH_KEY, 'true')
        onLogin()
      } else {
        setError('Email atau password salah. Silakan coba lagi.')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07182d] via-[#0d2647] to-[#07182d] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/20 text-primary mb-4">
            <LayoutDashboard size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin Panel</h1>
          <p className="text-sm text-white/60 mt-1">GLWS Tour & Travel</p>
        </div>

        <form
          className="rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/10 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
          onSubmit={handleSubmit}
        >
          <div className="mb-5">
            <label className="block text-xs font-semibold text-white/70 mb-2">Email</label>
            <input
              className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              type="email"
              placeholder="admin@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-white/70 mb-2">Password</label>
            <input
              className="w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/15 border border-red-500/25 px-4 py-3 text-xs font-medium text-red-300">
              {error}
            </div>
          )}

          <button
            className="w-full h-12 rounded-xl bg-primary text-sm font-bold text-white shadow-[0_8px_20px_rgba(166,12,29,0.3)] transition-all hover:brightness-110 disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Memverifikasi...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   AdminLayout  (Sidebar + Content)
   ══════════════════════════════════════════════════ */
export function AdminLayout({ currentSection, onNavigate, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { id: 'admin-packages', label: 'Kelola Paket', icon: Package, href: '/admin/packages' },
    { id: 'admin-articles', label: 'Kelola Artikel', icon: FileText, href: '/admin/articles' },
  ]

  return (
    <div className="min-h-screen bg-[#f3f5f7]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#07182d] text-white transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div className="flex items-center gap-2.5">
            <div className="grid size-8 place-items-center rounded-lg bg-primary text-xs font-black text-white">G</div>
            <span className="text-sm font-bold tracking-tight">GLWS Admin</span>
          </div>
          <button
            className="grid size-8 place-items-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="mt-4 px-3 space-y-1">
          {menuItems.map(item => {
            const isActive = currentSection === item.id
            return (
              <button
                key={item.id}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'bg-primary text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'}`}
                onClick={() => {
                  onNavigate(item.id, item.href)
                  setSidebarOpen(false)
                }}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-3">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/50 transition-colors hover:bg-red-500/15 hover:text-red-400"
            onClick={onLogout}
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e1e6eb] bg-white/90 px-5 backdrop-blur-md">
          <button
            className="grid size-10 place-items-center rounded-xl border border-[#e1e6eb] text-[#4e5866] lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="text-sm font-bold text-[#172433]">
            {currentSection === 'admin-packages' ? 'Kelola Paket Wisata' : 'Kelola Artikel'}
          </div>
          <a
            className="text-xs font-medium text-primary hover:underline"
            href="/"
            onClick={(e) => { e.preventDefault(); window.open('/', '_blank') }}
          >
            Lihat Situs →
          </a>
        </header>

        {/* Content */}
        <main className="p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   AdminPackagesPage
   ══════════════════════════════════════════════════ */
export function AdminPackagesPage() {
  const [packages, setPackages] = useState(loadPackages)
  const [editingPackage, setEditingPackage] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = packages.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSave = (pkg) => {
    let updated
    if (editingPackage) {
      updated = packages.map(p => p.slug === editingPackage.slug ? { ...pkg, slug: pkg.slug || editingPackage.slug } : p)
    } else {
      updated = [...packages, { ...pkg, slug: pkg.slug || toSlug(pkg.title) }]
    }
    setPackages(updated)
    savePackages(updated)
    setIsFormOpen(false)
    setEditingPackage(null)
  }

  const handleDelete = (slug) => {
    const updated = packages.filter(p => p.slug !== slug)
    setPackages(updated)
    savePackages(updated)
    setDeleteConfirm(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-[#172433]">Paket Wisata</h1>
          <p className="text-xs text-[#7a8391] mt-1">{packages.length} paket tersedia</p>
        </div>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
          onClick={() => { setEditingPackage(null); setIsFormOpen(true) }}
        >
          <Plus size={16} /> Tambah Paket
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="flex h-11 items-center gap-3 rounded-xl border border-[#e1e6eb] bg-white px-4">
          <Search size={16} className="text-[#93a1ae]" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#b0b8c4]"
            type="search"
            placeholder="Cari paket wisata..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e1e6eb] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#eef1f4] bg-[#f8f9fb]">
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475]">Gambar</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475]">Nama Paket</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475] hidden md:table-cell">Kategori</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475] hidden lg:table-cell">Lokasi</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475] hidden lg:table-cell">Harga</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f4]">
              {filtered.map((pkg) => (
                <tr key={pkg.slug} className="transition-colors hover:bg-[#f8fafb]">
                  <td className="px-5 py-3">
                    <div className="size-12 overflow-hidden rounded-lg bg-[#eef1f4]">
                      <img src={pkg.image} alt={pkg.title} className="size-full object-cover" />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-[#172433]">{pkg.title}</span>
                    <span className="block text-xs text-[#7a8391] mt-0.5">{pkg.duration}</span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-[0.65rem] font-semibold text-primary">{pkg.category}</span>
                  </td>
                  <td className="px-5 py-3 text-[#5a6475] hidden lg:table-cell">{pkg.location}</td>
                  <td className="px-5 py-3 font-semibold text-[#172433] hidden lg:table-cell">{pkg.price}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="grid size-8 place-items-center rounded-lg border border-[#e1e6eb] text-[#5a6475] transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                        title="Edit"
                        onClick={() => { setEditingPackage(pkg); setIsFormOpen(true) }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="grid size-8 place-items-center rounded-lg border border-[#e1e6eb] text-[#5a6475] transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-500"
                        title="Hapus"
                        onClick={() => setDeleteConfirm(pkg.slug)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#93a1ae]">
                    Tidak ada paket yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <PackageFormModal
          pkg={editingPackage}
          onSave={handleSave}
          onClose={() => { setIsFormOpen(false); setEditingPackage(null) }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <ConfirmDeleteModal
          title="Hapus Paket"
          message="Apakah Anda yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}

/* ── Package Form Modal ── */
function PackageFormModal({ pkg, onSave, onClose }) {
  const isEdit = !!pkg
  const [form, setForm] = useState({
    title: pkg?.title ?? '',
    categorySlug: pkg?.categorySlug ?? categoryOptions[0]?.slug ?? '',
    category: pkg?.category ?? categoryOptions[0]?.title ?? '',
    image: pkg?.image ?? '',
    badge: pkg?.badge ?? 'Populer',
    location: pkg?.location ?? '',
    duration: pkg?.duration ?? '',
    capacity: pkg?.capacity ?? '',
    price: pkg?.price ?? '',
    departure: pkg?.departure ?? '',
    description: pkg?.description ?? '',
    overview: pkg?.overview ?? '',
    hotel: pkg?.hotel ?? '',
    flight: pkg?.flight ?? '',
  })

  const updateField = (key, value) => {
    setForm(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'categorySlug') {
        const cat = categoryOptions.find(c => c.slug === value)
        if (cat) next.category = cat.title
      }
      return next
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const slug = isEdit ? pkg.slug : toSlug(form.title)
    onSave({
      ...pkg,
      ...form,
      slug,
      gallery: pkg?.gallery ?? [],
      facilities: pkg?.facilities ?? [],
      itinerary: pkg?.itinerary ?? [],
      faq: pkg?.faq ?? [],
    })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16 pb-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eef1f4] px-6 py-4">
          <h2 className="text-base font-bold text-[#172433]">{isEdit ? 'Edit Paket' : 'Tambah Paket Baru'}</h2>
          <button className="grid size-8 place-items-center rounded-lg text-[#7a8391] hover:bg-[#f3f5f7]" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="space-y-4 p-6" onSubmit={handleSubmit}>
          <FormField label="Nama Paket *" value={form.title} onChange={v => updateField('title', v)} required />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#4e5866] mb-1.5">Kategori *</label>
              <select
                className="w-full h-11 rounded-xl border border-[#e1e6eb] bg-white px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={form.categorySlug}
                onChange={(e) => updateField('categorySlug', e.target.value)}
                required
              >
                {categoryOptions.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </div>
            <FormField label="Badge" value={form.badge} onChange={v => updateField('badge', v)} />
          </div>

          <FormField label="URL Gambar *" value={form.image} onChange={v => updateField('image', v)} required placeholder="https://..." />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Lokasi *" value={form.location} onChange={v => updateField('location', v)} required />
            <FormField label="Durasi" value={form.duration} onChange={v => updateField('duration', v)} placeholder="4 Hari 3 Malam" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Kapasitas" value={form.capacity} onChange={v => updateField('capacity', v)} placeholder="30 Orang" />
            <FormField label="Harga" value={form.price} onChange={v => updateField('price', v)} placeholder="Rp5.500.000" />
            <FormField label="Keberangkatan" value={form.departure} onChange={v => updateField('departure', v)} placeholder="15 Sep 2026" />
          </div>

          <FormTextarea label="Deskripsi Singkat" value={form.description} onChange={v => updateField('description', v)} rows={2} />
          <FormTextarea label="Overview" value={form.overview} onChange={v => updateField('overview', v)} rows={3} />
          <FormTextarea label="Info Hotel" value={form.hotel} onChange={v => updateField('hotel', v)} rows={2} />

          <div className="flex justify-end gap-3 border-t border-[#eef1f4] pt-4">
            <button
              className="h-10 rounded-xl border border-[#e1e6eb] px-5 text-xs font-semibold text-[#5a6475] hover:bg-[#f3f5f7]"
              type="button"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
              type="submit"
            >
              <Save size={14} /> {isEdit ? 'Simpan Perubahan' : 'Tambah Paket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   AdminArticlesPage
   ══════════════════════════════════════════════════ */
export function AdminArticlesPage() {
  const [articles, setArticles] = useState(loadArticles)
  const [editingArticle, setEditingArticle] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const filtered = articles.filter(a =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSave = (article) => {
    let updated
    if (editingArticle) {
      updated = articles.map(a => a.slug === editingArticle.slug ? { ...article, slug: article.slug || editingArticle.slug } : a)
    } else {
      updated = [...articles, { ...article, slug: article.slug || toSlug(article.title) }]
    }
    setArticles(updated)
    saveArticles(updated)
    setIsFormOpen(false)
    setEditingArticle(null)
  }

  const handleDelete = (slug) => {
    const updated = articles.filter(a => a.slug !== slug)
    setArticles(updated)
    saveArticles(updated)
    setDeleteConfirm(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-black text-[#172433]">Artikel</h1>
          <p className="text-xs text-[#7a8391] mt-1">{articles.length} artikel tersedia</p>
        </div>
        <button
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-primary/90"
          onClick={() => { setEditingArticle(null); setIsFormOpen(true) }}
        >
          <Plus size={16} /> Tambah Artikel
        </button>
      </div>

      {/* Search */}
      <div className="mb-5">
        <label className="flex h-11 items-center gap-3 rounded-xl border border-[#e1e6eb] bg-white px-4">
          <Search size={16} className="text-[#93a1ae]" />
          <input
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#b0b8c4]"
            type="search"
            placeholder="Cari artikel..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e1e6eb] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#eef1f4] bg-[#f8f9fb]">
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475]">Gambar</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475]">Judul</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475] hidden md:table-cell">Kategori</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475] hidden lg:table-cell">Penulis</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475] hidden lg:table-cell">Tanggal</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-[#5a6475] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eef1f4]">
              {filtered.map((article) => (
                <tr key={article.slug} className="transition-colors hover:bg-[#f8fafb]">
                  <td className="px-5 py-3">
                    <div className="size-12 overflow-hidden rounded-lg bg-[#eef1f4]">
                      <img src={article.image} alt={article.title} className="size-full object-cover" />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="font-semibold text-[#172433] line-clamp-1">{article.title}</span>
                    <span className="block text-xs text-[#7a8391] mt-0.5 line-clamp-1">{article.excerpt}</span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="inline-block rounded-full bg-secondary/15 px-2.5 py-1 text-[0.65rem] font-semibold text-[#6b5a00]">{article.category}</span>
                  </td>
                  <td className="px-5 py-3 text-[#5a6475] hidden lg:table-cell">{article.author}</td>
                  <td className="px-5 py-3 text-[#5a6475] hidden lg:table-cell">{article.date}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="grid size-8 place-items-center rounded-lg border border-[#e1e6eb] text-[#5a6475] transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                        title="Edit"
                        onClick={() => { setEditingArticle(article); setIsFormOpen(true) }}
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        className="grid size-8 place-items-center rounded-lg border border-[#e1e6eb] text-[#5a6475] transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-500"
                        title="Hapus"
                        onClick={() => setDeleteConfirm(article.slug)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[#93a1ae]">
                    Tidak ada artikel yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <ArticleFormModal
          article={editingArticle}
          onSave={handleSave}
          onClose={() => { setIsFormOpen(false); setEditingArticle(null) }}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <ConfirmDeleteModal
          title="Hapus Artikel"
          message="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
          onConfirm={() => handleDelete(deleteConfirm)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  )
}

/* ── Article Form Modal ── */
function ArticleFormModal({ article, onSave, onClose }) {
  const isEdit = !!article
  const [form, setForm] = useState({
    title: article?.title ?? '',
    excerpt: article?.excerpt ?? '',
    category: article?.category ?? '',
    type: article?.type ?? 'guide',
    author: article?.author ?? '',
    date: article?.date ?? new Date().toISOString().split('T')[0],
    views: article?.views ?? '0',
    image: article?.image ?? '',
    tags: article?.tags?.join(', ') ?? '',
    body: article?.body ?? '',
  })

  const updateField = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const slug = isEdit ? article.slug : toSlug(form.title)
    onSave({
      ...article,
      ...form,
      slug,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      highlights: article?.highlights ?? [],
    })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-16 pb-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#eef1f4] px-6 py-4">
          <h2 className="text-base font-bold text-[#172433]">{isEdit ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
          <button className="grid size-8 place-items-center rounded-lg text-[#7a8391] hover:bg-[#f3f5f7]" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form className="space-y-4 p-6" onSubmit={handleSubmit}>
          <FormField label="Judul Artikel *" value={form.title} onChange={v => updateField('title', v)} required />
          <FormTextarea label="Ringkasan (Excerpt) *" value={form.excerpt} onChange={v => updateField('excerpt', v)} rows={2} required />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Kategori *" value={form.category} onChange={v => updateField('category', v)} required placeholder="Kuliner, Panduan, Tips" />
            <div>
              <label className="block text-xs font-semibold text-[#4e5866] mb-1.5">Tipe</label>
              <select
                className="w-full h-11 rounded-xl border border-[#e1e6eb] bg-white px-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={form.type}
                onChange={(e) => updateField('type', e.target.value)}
              >
                <option value="guide">Guide</option>
                <option value="review">Review</option>
                <option value="tips">Tips</option>
                <option value="news">News</option>
              </select>
            </div>
          </div>

          <FormField label="URL Gambar *" value={form.image} onChange={v => updateField('image', v)} required placeholder="https://..." />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Penulis" value={form.author} onChange={v => updateField('author', v)} />
            <FormField label="Tanggal" value={form.date} onChange={v => updateField('date', v)} placeholder="2026-01-15" />
            <FormField label="Views" value={form.views} onChange={v => updateField('views', v)} />
          </div>

          <FormField label="Tags (pisahkan koma)" value={form.tags} onChange={v => updateField('tags', v)} placeholder="bali, kuliner, hotel" />
          <FormTextarea label="Body / Konten" value={form.body} onChange={v => updateField('body', v)} rows={6} />

          <div className="flex justify-end gap-3 border-t border-[#eef1f4] pt-4">
            <button
              className="h-10 rounded-xl border border-[#e1e6eb] px-5 text-xs font-semibold text-[#5a6475] hover:bg-[#f3f5f7]"
              type="button"
              onClick={onClose}
            >
              Batal
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-6 text-xs font-bold text-white shadow-sm hover:bg-primary/90"
              type="submit"
            >
              <Save size={14} /> {isEdit ? 'Simpan Perubahan' : 'Tambah Artikel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════
   Shared Utility Components
   ══════════════════════════════════════════════════ */
function FormField({ label, value, onChange, required = false, placeholder = '' }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#4e5866] mb-1.5">{label}</label>
      <input
        className="w-full h-11 rounded-xl border border-[#e1e6eb] bg-white px-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-[#b0b8c4]"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
      />
    </div>
  )
}

function FormTextarea({ label, value, onChange, rows = 3, required = false }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#4e5866] mb-1.5">{label}</label>
      <textarea
        className="w-full rounded-xl border border-[#e1e6eb] bg-white px-3.5 py-3 text-sm leading-6 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-[#b0b8c4] resize-y"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        required={required}
      />
    </div>
  )
}

function ConfirmDeleteModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
        <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-red-50 text-red-500">
          <Trash2 size={24} />
        </div>
        <h3 className="text-base font-bold text-[#172433]">{title}</h3>
        <p className="mt-2 text-sm text-[#7a8391]">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            className="flex-1 h-10 rounded-xl border border-[#e1e6eb] text-xs font-semibold text-[#5a6475] hover:bg-[#f3f5f7]"
            onClick={onCancel}
          >
            Batal
          </button>
          <button
            className="flex-1 h-10 rounded-xl bg-red-500 text-xs font-bold text-white hover:bg-red-600"
            onClick={onConfirm}
          >
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
