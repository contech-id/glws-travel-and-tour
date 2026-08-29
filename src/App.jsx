import { useEffect, useRef, useState } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { AdminLoginPage, AdminLayout, AdminPackagesPage, AdminToursPage, AdminArticlesPage } from './AdminPanel'
import { api } from './api'

import {
  ArrowRight,
  CalendarDays,
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Compass,
  ExternalLink,
  Globe2,
  Heart,
  Headphones,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Navigation,
  Package,
  Phone,
  Plane,
  PlayCircle,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  UserRound,
  Users,
  Video,
  X,
} from 'lucide-react'

import logoImage from './assets/logo.png'
import logoImageStroke from './assets/logo-stroke.png'
import avatarSophia from './assets/avatar-sophia.jpg'
import avatarJames from './assets/avatar-james.jpg'
import avatarEmily from './assets/avatar-emily.jpg'
import tourData from './data/tourData.json'
import serviceData from './data/serviceData.json'
import articleDataSeed from './data/articleData.json'
import eventPromoData from './data/eventPromoData.json'
import tourListData from './data/tourListData.json'
import galleryImage1 from './assets/gallery/gallery1.jpeg'
import galleryImage2 from './assets/gallery/gallery2.jpeg'
import galleryImage3 from './assets/gallery/gallery3.jpeg'
import galleryVideo4 from './assets/gallery/gallery4.mp4'
import galleryVideo5 from './assets/gallery/gallery5.mp4'
import galleryVideo6 from './assets/gallery/gallery6.mp4'
import galleryVideo7 from './assets/gallery/gallery7.mp4'
import galleryVideo8 from './assets/gallery/gallery8.mp4'
import galleryVideo9 from './assets/gallery/gallery9.mp4'

const navLinks = [
  { label: 'Beranda', href: '/', page: 'home' },
  { label: 'Tentang Kami', href: '/tentang', page: 'about' },
  { label: 'Wisata', href: '/#tour-packages', page: 'home', section: 'tour-packages', dropdown: 'wisata' },
  { label: 'Layanan Lain', href: '/#tour-packages', page: 'home', section: 'tour-packages', dropdown: 'services' },
  { label: 'Mengapa Kami', href: '/mengapa-kami', page: 'why-us' },
  { label: 'Artikel', href: '/artikel', page: 'articles' },
  { label: 'Kontak', href: '/#contact', page: 'home', section: 'contact' },
]

const wisataCategories = tourData.categories.map((category) => ({
  ...category,
  href: `/wisata/${category.slug}`,
  page: 'category',
}))

let tourPackages = tourData.packages
let articleData = { ...articleDataSeed, articles: articleDataSeed.articles }
const createTourSlug = (title = '') => encodeURIComponent(title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))

function normalizeTourJourney(tour) {
  const image = tour.image || ''
  const priceSummary = tour.priceSummary || (tour.price ? `Rp${Number(tour.price).toLocaleString('id-ID')}/orang` : 'Hubungi Kami')

  return {
    ...tour,
    slug: tour.slug || createTourSlug(tour.title),
    image,
    date: tour.date || tour.startDate || '-',
    travelers: tour.travelers || (tour.capacity ? `${tour.capacity} Traveler` : '-'),
    priceSummary,
    gallery: Array.isArray(tour.gallery) && tour.gallery.length ? tour.gallery : (image ? [image] : []),
    facilities: Array.isArray(tour.facilities) ? tour.facilities : [],
    attractions: Array.isArray(tour.attractions) ? tour.attractions : (Array.isArray(tour.itinerary) ? tour.itinerary : []),
  }
}

let tourJourneys = tourListData.map(normalizeTourJourney)

function getPackageWhatsAppUrl(tourPackage) {
  const message = [
    'Halo PT. Ganes Lancar Wisata Sukses, saya tertarik dengan paket tour berikut:',
    '',
    `Nama Paket: ${tourPackage.title}`,
    `Kategori: ${tourPackage.category}`,
    `Destinasi: ${tourPackage.location}`,
    `Harga: ${tourPackage.price} per orang`,
    `Durasi: ${tourPackage.duration}`,
    `Tanggal Keberangkatan: ${tourPackage.departure}`,
    `Kapasitas: ${tourPackage.capacity}`,
    '',
    'Mohon informasi ketersediaan dan cara pemesanannya. Terima kasih.',
  ].join('\n')

  return `https://wa.me/6281330663930?text=${encodeURIComponent(message)}`
}

function normalizeTourPackageCategory(tourPackage) {
  const categorySlug = tourPackage.categorySlug === 'wisata-dalam-negeri'
    ? 'wisata-dalam-negeri'
    : 'wisata-luar-negeri'

  return {
    ...tourPackage,
    categorySlug,
    category: categorySlug === 'wisata-dalam-negeri' ? 'Travel Domestik' : 'Travel Internasional',
  }
}

const serviceLinks = serviceData.services.map((service) => ({
  ...service,
  href: `/layanan/${service.slug}`,
  page: 'service',
}))

function resolveRoute(pathname = window.location.pathname) {
  if (pathname === '/admin') return { page: 'admin-login' }
  if (pathname === '/admin/packages') return { page: 'admin-packages' }
  if (pathname === '/admin/tours') return { page: 'admin-tours' }
  if (pathname === '/admin/articles') return { page: 'admin-articles' }

  if (pathname === '/search') {
    const searchParams = new URLSearchParams(window.location.search);
    return { page: 'search', query: searchParams.get('q') || '' };
  }

  if (pathname === '/tentang') return { page: 'about' }

  if (pathname === '/mengapa-kami') return { page: 'why-us' }

  if (pathname.startsWith('/wisata/')) {
    return { page: 'category', slug: pathname.split('/').filter(Boolean)[1] }
  }

  if (pathname.startsWith('/paket-tour/')) {
    return { page: 'package', slug: pathname.split('/').filter(Boolean)[1] }
  }

  if (pathname.startsWith('/layanan/')) {
    return { page: 'service', slug: pathname.split('/').filter(Boolean)[1] }
  }

  if (pathname.startsWith('/tour/')) {
    return { page: 'tour', slug: pathname.split('/').filter(Boolean)[1] }
  }

  if (pathname === '/artikel') return { page: 'articles' }

  if (pathname.startsWith('/artikel/')) {
    return { page: 'article-detail', slug: pathname.split('/').filter(Boolean)[1] }
  }

  return { page: 'home' }
}

const aboutGallery = [
  {
    src: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&w=520&q=80',
    alt: 'Traveler berdiskusi rencana perjalanan',
  },
  {
    src: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=520&q=80',
    alt: 'Perjalanan keluarga di destinasi alam',
  },
  {
    src: 'https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=520&q=80',
    alt: 'Grup traveler menikmati liburan',
  },
  {
    src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=520&q=80',
    alt: 'Destinasi wisata alam pilihan',
  },
]

const clients = [
  {
    name: 'Lacannar',
    detail: 'Education Partner',
    mark: 'L',
    tone: 'text-[#7b2534]',
    markTone: 'border-[#7b2534]/30 bg-[#f9eef0]',
  },
  {
    name: 'OXFORD',
    detail: 'INTERNATIONAL',
    mark: 'O',
    tone: 'text-[#151c4b]',
    markTone: 'border-[#151c4b]/25 bg-[#eef0f8]',
  },
  {
    name: 'CERRACAP',
    detail: 'VENTURES',
    mark: 'C',
    tone: 'text-[#c49518]',
    markTone: 'border-[#d2a72e]/30 bg-[#fff8df]',
  },
  {
    name: 'BUILDOING',
    detail: 'INNOVATION GROUP',
    mark: 'B',
    tone: 'text-[#172433]',
    markTone: 'border-[#172433]/25 bg-[#eef2f5]',
  },
  {
    name: 'barbri',
    detail: 'GLOBAL EDUCATION',
    mark: 'b',
    tone: 'text-secondary',
    markTone: 'border-secondary/25 bg-secondary/15',
  },
  {
    name: 'WILEY',
    detail: 'KNOWLEDGE PARTNER',
    mark: 'W',
    tone: 'text-[#4b4b4b]',
    markTone: 'border-[#4b4b4b]/20 bg-[#f3f3f3]',
  },
  {
    name: 'Future School',
    detail: 'LEARNING NETWORK',
    mark: 'fs',
    tone: 'text-[#55aeb8]',
    markTone: 'border-[#55aeb8]/25 bg-[#edfafa]',
  },
]

const tourJourneySeed = [
  {
    image: 'https://images.unsplash.com/photo-1688525141547-2e4c04a218d7?auto=format&fit=crop&w=1600&q=90',
    title: 'Surabaya',
    location: 'Surabaya, Jawa Timur',
    date: 'Juli 2026',
    travelers: '32 Traveler',
    attractions: ['Tugu Pahlawan', 'Kota Lama', 'House of Sampoerna', 'Pantai Kenjeran'],
  },
  {
    image: 'https://images.unsplash.com/photo-1602154663343-89fe0bf541ab?auto=format&fit=crop&w=1600&q=90',
    title: 'Bromo- Ijen Tumpak Sewu',
    location: 'Jawa Timur, Indonesia',
    date: 'Juni 2026',
    travelers: '24 Traveler',
    attractions: ['Gunung Bromo', 'Kawah Ijen', 'Tumpak Sewu', 'Bukit Penanjakan'],
  },
  {
    image: 'https://images.unsplash.com/photo-1602486493959-78e7be266a62?auto=format&fit=crop&w=1600&q=90',
    title: 'Labuan Bajo',
    location: 'Flores, Nusa Tenggara Timur',
    date: 'Mei 2026',
    travelers: '20 Traveler',
    attractions: ['Pulau Padar', 'Pink Beach', 'Pulau Komodo', 'Manta Point'],
  },
  {
    image: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1600&q=90',
    title: 'Bali',
    location: 'Bali, Indonesia',
    date: 'April 2026',
    travelers: '36 Traveler',
    attractions: ['Uluwatu', 'Tanah Lot', 'Ubud', 'Nusa Penida'],
  },
  {
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1600&q=90',
    title: 'China',
    location: 'China',
    date: 'Maret 2026',
    travelers: '28 Traveler',
    attractions: ['Great Wall', 'Forbidden City', 'Shanghai Bund', 'Zhangjiajie'],
  },
  {
    image: 'https://unsplash.com/photos/sMCNMrRopX4/download?force=true&w=1600',
    title: 'Bintan',
    location: 'Bintan, Kepulauan Riau',
    date: 'Februari 2026',
    travelers: '26 Traveler',
    attractions: ['Lagoi Bay', 'Gurun Pasir Busung', 'Danau Biru', 'Pantai Trikora'],
  },
  {
    image: 'https://images.unsplash.com/photo-1730178988919-0d7fe97bc499?auto=format&fit=crop&w=1600&q=90',
    title: 'Batam',
    location: 'Batam, Kepulauan Riau',
    date: 'Januari 2026',
    travelers: '30 Traveler',
    attractions: ['Jembatan Barelang', 'Pantai Nongsa', 'Ocarina Park', 'Maha Vihara'],
  },
  {
    image: 'https://images.unsplash.com/photo-1508062878650-88b52897f298?auto=format&fit=crop&w=1600&q=90',
    title: 'Malaysia',
    location: 'Malaysia',
    date: 'Desember 2025',
    travelers: '34 Traveler',
    attractions: ['Petronas Towers', 'Batu Caves', 'Putrajaya', 'Kota Melaka'],
  },
  {
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1600&q=90',
    title: 'Singapore',
    location: 'Singapore',
    date: 'November 2025',
    travelers: '30 Traveler',
    attractions: ['Marina Bay Sands', 'Merlion Park', 'Gardens by the Bay', 'Sentosa'],
  },
  {
    image: 'https://unsplash.com/photos/v_cClGhZ0Rk/download?force=true&w=1600',
    title: 'Manado',
    location: 'Manado, Sulawesi Utara',
    date: 'Oktober 2025',
    travelers: '22 Traveler',
    attractions: ['Taman Laut Bunaken', 'Tangkoko', 'Danau Linow', 'Kota Tomohon'],
  },
  {
    image: 'https://images.unsplash.com/photo-1741682739831-9f9627d15775?auto=format&fit=crop&w=1600&q=90',
    title: 'Jakarta',
    location: 'Jakarta, Indonesia',
    date: 'September 2025',
    travelers: '38 Traveler',
    attractions: ['Monas', 'Kota Tua', 'TMII', 'Kepulauan Seribu'],
  },
  {
    image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1600&q=90',
    title: 'Jogjakarta',
    location: 'Jogjakarta, Indonesia',
    date: 'Agustus 2025',
    travelers: '32 Traveler',
    attractions: ['Malioboro', 'Keraton Jogja', 'Candi Prambanan', 'Gunung Merapi'],
  },
]

const footerColumns = [
  {
    title: 'Perusahaan',
    links: ['Beranda', 'Tentang Kami', 'Mengapa Kami', 'Kontak'],
  },
  {
    title: 'Layanan',
    links: ['Wisata', 'Layanan Lain', 'Artikel'],
  },
  {
    title: 'Destinasi',
    links: ['Travel Domestik', 'Travel Internasional'],
  },
  {
    title: 'Layanan Bisnis',
    links: ['EO Korporat/MICE', 'Reservasi Hotel', 'Visa'],
  },
  {
    title: 'Inspirasi',
    links: ['Paket Tour', 'List Tour', 'Ulasan Traveler', 'Artikel'],
  },
]

const whatsappContacts = [
  {
    initials: 'AD',
    name: 'Kontak Admin',
    phone: '+62 813-3066-3930',
    color: 'bg-[#25d366]',
  }
]

const googleReviews = [
  {
    avatar: avatarSophia,
    name: 'Nur Hidayah',
    date: 'Feb 2026',
    review:
      'Ikut tour keluarga, semua peserta dilayani dengan baik. Anak-anak juga nyaman. Liburan berikutnya ingin bersama PT. Ganes Lancar lagi.',
  },
  {
    avatar: avatarJames,
    name: 'Ahmad Fauzi',
    date: 'Jun 2026',
    review:
      'Pelayanan PT. Ganes Lancar sangat memuaskan. Dibimbing dari awal pendaftaran sampai keberangkatan, tour leader-nya sabar dan profesional.',
  },
  {
    avatar: avatarEmily,
    name: 'Siti Rahmawati',
    date: 'Mei 2026',
    review:
      'Hotel dekat Masjidil Haram, makanannya halal dan enak. Pembimbing manasiknya jelas. Alhamdulillah lancar sampai pulang.',
  },
  {
    avatar: avatarSophia,
    name: 'Dewi Lestari',
    date: 'Apr 2026',
    review:
      'Mengikuti Turki tour bersama PT. Ganes Lancar menjadi pengalaman tak terlupakan. Destinasinya menarik dan guide-nya berpengalaman.',
  },
  {
    avatar: avatarJames,
    name: 'Rizky Maulana',
    date: 'Mar 2026',
    review:
      'Timnya responsif dan selalu memberi informasi yang jelas. Perjalanan tertata rapi dari keberangkatan hingga kembali ke Indonesia.',
  },
  {
    avatar: avatarEmily,
    name: 'Aisyah Putri',
    date: 'Jan 2026',
    review:
      'Sangat terbantu dengan pendampingan ibadahnya. Semua kebutuhan jamaah diperhatikan dengan baik dan penuh keramahan.',
  },
]

function App() {
  const [route, setRoute] = useState(() => resolveRoute())
  const [isAdminAuth, setIsAdminAuth] = useState(() => Boolean(localStorage.getItem(api.tokenKey)))
  const [, refreshApiData] = useState(0)

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      offset: 70,
      once: true,
      mirror: false,
    })
  }, [])

  useEffect(() => {
    if (!localStorage.getItem(api.tokenKey)) return
    api.me().catch(() => { localStorage.removeItem(api.tokenKey); setIsAdminAuth(false) })
  }, [])

  useEffect(() => {
    let ignore = false
    const loadApiData = () => Promise.all([api.list('tour-packages'), api.list('articles'), api.list('tours')]).then(([packages, articles, tours]) => {
      if (ignore) return
      tourPackages = packages.map(normalizeTourPackageCategory)
      articleData = { ...articleDataSeed, articles }
      tourJourneys = tours.length ? tours.map(normalizeTourJourney) : tourListData.map(normalizeTourJourney)
      refreshApiData((value) => value + 1)
    }).catch(() => {})
    loadApiData()
    window.addEventListener('glws-api-updated', loadApiData)
    return () => { ignore = true; window.removeEventListener('glws-api-updated', loadApiData) }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setRoute(resolveRoute())
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => AOS.refreshHard())

    return () => window.cancelAnimationFrame(animationFrame)
  }, [route.page, route.slug])

  const navigateTo = (event, link) => {
    if (!link.page) return

    event.preventDefault()
    setRoute({ page: link.page, slug: link.slug, query: link.query })
    window.history.pushState({}, '', link.href)

    if (link.page === 'home' && link.section) {
      window.setTimeout(() => {
        document.getElementById(link.section)?.scrollIntoView({ behavior: 'smooth' })
      }, 0)
      return
    }

    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const isAdminPage = route.page?.startsWith('admin')

  /* ─── Admin Pages ─── */
  if (isAdminPage) {
    if (route.page === 'admin-login' || !isAdminAuth) {
      return (
        <AdminLoginPage
          onLogin={() => {
            setIsAdminAuth(true)
            setRoute({ page: 'admin-packages' })
            window.history.pushState({}, '', '/admin/packages')
          }}
        />
      )
    }

    const handleAdminNavigate = (sectionId, href) => {
      setRoute({ page: sectionId })
      window.history.pushState({}, '', href)
    }

    const handleAdminLogout = () => {
      api.logout().catch(() => {}).finally(() => {
        setIsAdminAuth(false)
        setRoute({ page: 'admin-login' })
        window.history.pushState({}, '', '/admin')
      })
    }

    return (
      <AdminLayout currentSection={route.page} onNavigate={handleAdminNavigate} onLogout={handleAdminLogout}>
        {route.page === 'admin-articles' ? (
          <AdminArticlesPage />
        ) : route.page === 'admin-tours' ? (
          <AdminToursPage />
        ) : (
          <AdminPackagesPage />
        )}
      </AdminLayout>
    )
  }

  /* ─── Public Pages ─── */
  return (
    <div className="bg-white text-[#1b1a16]">
      <SiteNavbar currentPage={route.page} onNavigate={navigateTo} />
      {route.page === 'about' ? (
        <AboutPage />
      ) : route.page === 'why-us' ? (
        <WhyUsPage onNavigate={navigateTo} />
      ) : route.page === 'category' ? (
        <TourCategoryPage slug={route.slug} onNavigate={navigateTo} />
      ) : route.page === 'package' ? (
        <TourPackageDetailPage slug={route.slug} onNavigate={navigateTo} />
      ) : route.page === 'tour' ? (
        <TourJourneyDetailPage slug={route.slug} onNavigate={navigateTo} />
      ) : route.page === 'service' ? (
        <ServiceDetailPage slug={route.slug} onNavigate={navigateTo} />
      ) : route.page === 'articles' ? (
        <ArticlePage onNavigate={navigateTo} />
      ) : route.page === 'article-detail' ? (
        <ArticleDetailPage slug={route.slug} onNavigate={navigateTo} />
      ) : route.page === 'search' ? (
        <SearchPage query={route.query} onNavigate={navigateTo} />
      ) : (
        <>
          <TravelHero onNavigate={navigateTo} />
          <HeroStats />
          <ClientLogoSection />
          <TravelTypeSection onNavigate={navigateTo} />
          <TourPackageSection onNavigate={navigateTo} />
          <TourListSection onNavigate={navigateTo} />
          <OtherServicesSection />
          <GalleryCarouselSection />
          <GoogleBusinessSection />
          <EventPromoSection />
          <CTASection />
          <ContactSection />
        </>
      )}
      <SiteFooter onNavigate={navigateTo} />
      <WhatsAppWidget />
    </div>
  )
}

function TourCategoryPage({ slug, onNavigate }) {
  const category = wisataCategories.find((item) => item.slug === slug)

  if (!category) {
    return <PageNotFound onNavigate={onNavigate} />
  }

  const relatedPackages = tourPackages.filter((tourPackage) => tourPackage.categorySlug === category.slug)

  return (
    <main className="min-h-screen bg-[#f6f8fa]">
      <header
        className="relative flex min-h-[34rem] items-end overflow-hidden bg-cover bg-center px-6 pt-32 pb-16 text-white md:px-18 md:pb-20"
        style={{ backgroundImage: `url('${category.heroImage}')` }}
      >
        <div className="absolute inset-0 bg-[#07182d]/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07182d]/88 via-[#07182d]/15 to-[#07182d]/20" />
        <div className="relative z-10 mx-auto w-full max-w-[80rem]" data-aos="fade-up">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-secondary uppercase">
            <Compass size={16} /> Pilihan Wisata
          </p>
          <h1 className="max-w-[48rem] text-[clamp(2.5rem,6vw,4.8rem)] font-black leading-[0.98] text-white">
            {category.title}
          </h1>
          <p className="mt-5 max-w-[42rem] text-sm leading-7 text-white/85 md:text-base">{category.description}</p>
        </div>
      </header>

      <section className="border-b border-[#e1e6eb] bg-white px-6 py-8 md:px-18">
        <div className="mx-auto grid max-w-[80rem] gap-4 md:grid-cols-3">
          {category.highlights.map((highlight, index) => (
            <div
              className="flex items-center gap-3 rounded-lg border border-[#e6ebef] bg-white px-4 py-4 text-sm font-semibold text-[#344054]"
              data-aos="fade-up"
              data-aos-delay={index * 80}
              key={highlight}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-secondary/15 text-primary">
                <ShieldCheck size={17} />
              </span>
              {highlight}
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-14 md:px-18 md:py-20" aria-labelledby="category-package-title">
        <div className="mx-auto max-w-[80rem]">
          <div className="mb-8" data-aos="fade-up">
            <p className="text-xs font-bold text-primary">Paket Tersedia</p>
            <h2 className="mt-2 text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-[-0.04em] text-[#172433]" id="category-package-title">
              Pilihan {category.shortTitle}
            </h2>
            <p className="mt-2 max-w-[38rem] text-sm leading-6 text-[#717b89]">
              Pilih paket yang paling sesuai, lalu lihat detail jadwal, fasilitas, dan harga perjalanannya.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedPackages.map((tourPackage, index) => (
              <TourPackageCard
                layout="grid"
                tourPackage={tourPackage}
                onNavigate={onNavigate}
                animationDelay={index * 80}
                key={tourPackage.slug}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function TourPackageDetailPage({ slug, onNavigate }) {
  const detailTabs = [
    ['overview', 'Overview'],
    ['galeri', 'Galeri'],
    ['faq', 'FAQ'],
  ]
  const [activeDetailTab, setActiveDetailTab] = useState('overview')
  const [isShareOpen, setIsShareOpen] = useState(false)
  const [recommendedPackages, setRecommendedPackages] = useState([])
  const tourPackage = tourPackages.find((item) => item.slug === slug)

  useEffect(() => {
    api.list('packages').then(data => {
      setRecommendedPackages(data.filter(pkg => pkg.slug !== slug).slice(0, 4))
    }).catch(err => console.error('Failed to fetch recommended packages:', err))
  }, [slug])

  const faqData = [
    { question: 'Apa saja fasilitas yang sudah termasuk dalam harga paket?', answer: 'Fasilitas bervariasi bergantung pada paket yang dipilih. Umumnya mencakup transportasi, akomodasi, tiket wisata utama, dan konsumsi. Silakan baca bagian detail fasilitas pada brosur setiap paket.' },
    { question: 'Apakah jadwal perjalanan bisa diubah?', answer: 'Untuk paket private tour, jadwal sangat fleksibel dan dapat diubah sesuai kesepakatan. Namun, untuk paket open trip, jadwal sudah tetap dan tidak bisa diubah.' },
    { question: 'Bagaimana sistem pembayarannya?', answer: 'Pembayaran dapat dilakukan secara bertahap. Uang muka (DP) minimal 30% dibayarkan saat pemesanan, dan pelunasan paling lambat 7 hari sebelum keberangkatan.' },
    { question: 'Apakah harga paket sudah termasuk tiket pesawat?', answer: 'Beberapa paket sudah all-in termasuk tiket pesawat, namun ada pula paket land tour (tanpa tiket pesawat). Cek ringkasan harga di bagian atas untuk informasi lebih jelas.' }
  ]

  useEffect(() => {
    const updateActiveTab = () => {
      const scrollPosition = window.scrollY + 180
      let currentSection = detailTabs[0][0]

      detailTabs.forEach(([id]) => {
        const section = document.getElementById(id)

        if (section && section.getBoundingClientRect().top + window.scrollY <= scrollPosition) {
          currentSection = id
        }
      })

      setActiveDetailTab(currentSection)
    }

    updateActiveTab()
    window.addEventListener('scroll', updateActiveTab, { passive: true })

    return () => window.removeEventListener('scroll', updateActiveTab)
  }, [slug])

  if (!tourPackage) {
    return <PageNotFound onNavigate={onNavigate} />
  }

  const category = wisataCategories.find((item) => item.slug === tourPackage.categorySlug)
  const categoryLink = category ?? navLinks[2]
  const packageWhatsAppUrl = getPackageWhatsAppUrl(tourPackage)
  const shareUrl = encodeURIComponent(`${window.location.origin}/paket-tour/${tourPackage.slug}`)
  const shareText = encodeURIComponent(`Lihat paket ${tourPackage.title} dari PT. Ganes Lancar Wisata Sukses mulai ${tourPackage.price}.`)
  const socialShareLinks = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${shareText}%20${shareUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}` },
    { label: 'Telegram', href: `https://t.me/share/url?url=${shareUrl}&text=${shareText}` },
  ]

  return (
    <main className="min-h-screen bg-[#f3f5f7] pb-20">
      <header
        className="relative flex min-h-[27rem] items-end overflow-hidden bg-cover bg-center px-6 pt-32 pb-16 text-white md:px-18"
        style={{ backgroundImage: `url('${tourPackage.image}')` }}
      >
        <div className="absolute inset-0 bg-[#07182d]/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07182d]/90 via-transparent to-[#07182d]/20" />
        <div className="relative z-10 mx-auto w-full max-w-[72rem]" data-aos="fade-up">
          <a
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/88 transition-colors hover:text-white"
            href={categoryLink.href}
            onClick={(event) => onNavigate(event, categoryLink)}
          >
            <ChevronLeft size={16} /> Semua Paket {category?.shortTitle}
          </a>
          <span className="mt-6 block w-8 rounded-full border-t-4 border-primary" />
          <p className="mt-6 text-xs font-bold tracking-[0.12em] text-secondary uppercase">{tourPackage.badge}</p>
          <h1 className="mt-2 max-w-[52rem] text-[clamp(2.15rem,5vw,4.25rem)] font-black leading-[1.02] tracking-[-0.045em]">
            {tourPackage.title}
          </h1>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/85">
            <MapPin size={16} className="text-primary" /> {tourPackage.location}
          </p>
        </div>
      </header>

      <nav className="sticky top-[4.5rem] z-30 border-b border-[#dce2e7] bg-white/95 px-6 backdrop-blur md:px-18" aria-label="Navigasi detail paket">
        <div className="mx-auto flex max-w-[72rem] gap-2 overflow-x-auto py-3">
          {detailTabs.map(([id, label]) => (
            <a
              className={`shrink-0 rounded-full px-3.5 py-2 text-[0.7rem] font-semibold transition-colors ${activeDetailTab === id ? 'bg-primary text-white' : 'bg-[#f1f4f7] text-[#657080] hover:bg-secondary/15 hover:text-secondary'}`}
              href={`#${id}`}
              key={id}
              onClick={(event) => {
                event.preventDefault()
                setActiveDetailTab(id)
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto grid max-w-[72rem] items-start gap-5 px-6 pt-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-7">
          <DetailSection icon={Package} title="Ringkasan" id="overview">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                [CalendarDays, 'Berangkat', tourPackage.departure],
                [MapPin, 'Kota', tourPackage.location],
              ].map(([Icon, label, value], index) => (
                <div className="rounded-lg bg-[#f2f5f7] px-3 py-4 text-center" data-aos="zoom-in" data-aos-delay={index * 60} key={label}>
                  <Icon className="mx-auto text-secondary" size={18} />
                  <span className="mt-2 block text-[0.65rem] text-[#7a8491]">{label}</span>
                  <strong className="mt-1 block text-xs text-[#121820]">{value}</strong>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={Camera} title="Galeri Foto" id="galeri">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {tourPackage.gallery.map((image, index) => (
                <img
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                  src={image}
                  alt={`${tourPackage.title} galeri ${index + 1}`}
                  data-aos="zoom-in"
                  data-aos-delay={index * 60}
                  key={image}
                />
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={ShieldCheck} title="Fasilitas" id="fasilitas">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'Akomodasi hotel pilihan',
                'Transportasi selama perjalanan',
                'Sarapan dan makan sesuai program',
                'Tiket objek wisata utama',
                'Pemandu wisata profesional',
                'Dokumentasi perjalanan',
              ].map((facility) => (
                <div className="flex items-center gap-3 rounded-lg border border-[#e3e8ec] bg-[#f8fafb] px-4 py-3 text-sm text-[#4e5866]" key={facility}>
                  <ShieldCheck className="shrink-0 text-secondary" size={17} />
                  {facility}
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={MessageCircle} title="Pertanyaan Umum (FAQ)" id="faq">
            <div className="space-y-3">
              {faqData.map((item, index) => (
                <PackageFaqItem item={item} index={index} key={index} />
              ))}
            </div>
          </DetailSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[9.25rem]" data-aos="fade-left">
          <section className="rounded-xl border border-[#dce2e7] bg-white p-5 shadow-[0_8px_25px_rgba(31,48,70,0.06)]">
            <span className="text-xs text-[#7c8694]">Harga mulai dari</span>
            <strong className="mt-1 block text-2xl font-black text-[#121820]">{tourPackage.price}</strong>
            <span className="mt-1 block text-[0.65rem] text-[#89929e]">/orang (Twin Sharing)</span>
            <a
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold text-white shadow-[0_8px_18px_rgba(10,167,229,0.2)] transition-colors hover:bg-primary/90"
              href={packageWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> Daftar Sekarang
            </a>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dfe4e8] text-xs font-medium text-[#4e5866]" type="button">
                <Heart size={15} /> Wishlist
              </button>
              <div className="relative">
                <button
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#dfe4e8] text-xs font-medium text-[#4e5866] transition-colors hover:border-secondary hover:text-secondary"
                  type="button"
                  aria-expanded={isShareOpen}
                  aria-controls="package-share-menu"
                  onClick={() => setIsShareOpen((currentValue) => !currentValue)}
                >
                  <ExternalLink size={14} /> Bagikan
                </button>
                {isShareOpen && (
                  <div
                    className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-40 overflow-hidden rounded-lg border border-[#dce2e7] bg-white p-1.5 shadow-[0_12px_30px_rgba(31,48,70,0.15)]"
                    id="package-share-menu"
                  >
                    {socialShareLinks.map((platform) => (
                      <a
                        className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-[#4e5866] transition-colors hover:bg-[#eef7fb] hover:text-primary"
                        href={platform.href}
                        key={platform.label}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsShareOpen(false)}
                      >
                        {platform.label}
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#dce2e7] bg-white p-5 text-xs text-[#6f7987]">
            <p className="flex items-center gap-2"><ShieldCheck className="text-[#10b981]" size={15} /> Legalitas usaha terverifikasi</p>
            <p className="mt-3 flex items-center gap-2"><Star className="text-[#ffb311]" size={15} fill="currentColor" /> Rating 4.9 dari 5.0</p>
            <p className="mt-3 flex items-center gap-2"><Users className="text-secondary" size={15} /> 25.000+ traveler terlayani</p>
          </section>
        </aside>
      </div>

      {recommendedPackages.length > 0 && (
        <section className="mx-auto mt-16 max-w-[72rem] px-6 md:px-8" aria-labelledby="recommendation-title">
          <div className="mb-6" data-aos="fade-up">
            <h2 className="text-xl font-black text-[#121820]" id="recommendation-title">Rekomendasi Paket Lainnya</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {recommendedPackages.map((pkg, index) => (
              <TourPackageCard
                layout="grid"
                tourPackage={pkg}
                onNavigate={onNavigate}
                animationDelay={index * 60}
                key={pkg.slug}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

function ServiceDetailPage({ slug, onNavigate }) {
  const service = serviceLinks.find((item) => item.slug === slug)

  if (!service) {
    return <PageNotFound onNavigate={onNavigate} />
  }

  const serviceTabs = [
    ['service-overview', 'Overview'],
    ['service-gallery', 'Galeri'],
    ['service-benefits', 'Keunggulan'],
    ['service-scope', 'Cakupan'],
    ['service-process', 'Proses'],
    ['service-faq', 'FAQ'],
  ]

  return (
    <main className="min-h-screen bg-[#f3f5f7] pb-20">
      <header
        className="relative flex min-h-[27rem] items-end overflow-hidden bg-cover bg-center px-6 pt-32 pb-16 text-white md:px-18"
        style={{ backgroundImage: `url('${service.heroImage}')` }}
      >
        <div className="absolute inset-0 bg-[#07182d]/64" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07182d]/92 via-transparent to-[#07182d]/20" />
        <div className="relative z-10 mx-auto w-full max-w-[72rem]" data-aos="fade-up">
          <a
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/88 transition-colors hover:text-white"
            href={navLinks[3].href}
            onClick={(event) => onNavigate(event, navLinks[3])}
          >
            <ChevronLeft size={16} /> Semua Layanan
          </a>
          <span className="mt-6 block w-8 rounded-full border-t-4 border-primary" />
          <p className="mt-6 text-xs font-bold tracking-[0.12em] text-secondary uppercase">{service.badge}</p>
          <h1 className="mt-2 max-w-[52rem] text-[clamp(2.15rem,5vw,4.25rem)] font-black leading-[1.02] tracking-[-0.045em]">
            {service.title}
          </h1>
          <p className="mt-4 max-w-[42rem] text-sm leading-7 text-white/82">{service.summary}</p>
        </div>
      </header>

      <nav className="sticky top-[4.5rem] z-30 border-b border-[#dce2e7] bg-white/95 px-6 backdrop-blur md:px-18" aria-label="Navigasi detail layanan">
        <div className="mx-auto flex max-w-[72rem] gap-2 overflow-x-auto py-3">
          {serviceTabs.map(([id, label], index) => (
            <a
              className={`shrink-0 rounded-full px-3.5 py-2 text-[0.7rem] font-semibold transition-colors ${index === 0 ? 'bg-primary text-white' : 'bg-[#f1f4f7] text-[#657080] hover:bg-secondary/15 hover:text-secondary'}`}
              href={`#${id}`}
              key={id}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto grid max-w-[72rem] items-start gap-5 px-6 pt-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-7">
          <DetailSection icon={Package} title="Ringkasan Layanan" id="service-overview">
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                [Clock3, 'Respons Awal', service.responseTime],
                [Users, 'Kapasitas', service.clients],
                [Star, 'Estimasi', service.startingPrice],
              ].map(([Icon, label, value], index) => (
                <div className="rounded-lg bg-[#f2f5f7] px-4 py-5 text-center" data-aos="zoom-in" data-aos-delay={index * 70} key={label}>
                  <Icon className="mx-auto text-secondary" size={19} />
                  <span className="mt-2 block text-[0.65rem] text-[#7a8491]">{label}</span>
                  <strong className="mt-1 block text-xs text-[#121820]">{value}</strong>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-[#697483]">{service.summary}</p>
          </DetailSection>

          <DetailSection icon={Camera} title="Galeri Layanan" id="service-gallery">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {service.gallery.map((image, index) => (
                <img
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                  src={image}
                  alt={`${service.title} galeri ${index + 1}`}
                  data-aos="zoom-in"
                  data-aos-delay={index * 60}
                  key={image}
                />
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={ShieldCheck} title="Keunggulan" id="service-benefits">
            <div className="grid gap-3 sm:grid-cols-2">
              {service.benefits.map((benefit, index) => (
                <div className="flex items-center gap-3 rounded-lg bg-secondary/15 px-4 py-3 text-sm font-medium text-[#4f5a68]" data-aos="fade-up" data-aos-delay={index * 50} key={benefit}>
                  <ShieldCheck className="shrink-0 text-[#10b981]" size={17} /> {benefit}
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={Compass} title="Cakupan Layanan" id="service-scope">
            <div className="grid gap-3 sm:grid-cols-2">
              {service.scope.map((item, index) => (
                <div className="flex items-center gap-3 rounded-lg border border-[#e4e9ed] px-4 py-3 text-sm text-[#5c6674]" data-aos="fade-up" data-aos-delay={index * 50} key={item}>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full bg-secondary/15 text-[0.65rem] font-black text-primary">{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={Navigation} title="Alur Proses" id="service-process">
            <div className="space-y-4">
              {service.process.map((item, index) => (
                <div className="flex gap-4" data-aos="fade-up" data-aos-delay={index * 50} key={item}>
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary text-xs font-black text-white">{index + 1}</span>
                  <div className="pt-1.5">
                    <strong className="text-sm text-[#202733]">Tahap {index + 1}</strong>
                    <p className="mt-1 text-sm leading-6 text-[#6f7987]">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={MessageCircle} title="Pertanyaan Umum" id="service-faq">
            <div className="divide-y divide-[#e6eaee]">
              {service.faq.map((item, index) => (
                <div className="flex gap-3 py-4 first:pt-0 last:pb-0" data-aos="fade-up" data-aos-delay={index * 60} key={item}>
                  <span className="font-black text-primary">Q.</span>
                  <p className="text-sm leading-6 text-[#657080]">{item}</p>
                </div>
              ))}
            </div>
          </DetailSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[9.25rem]" data-aos="fade-left">
          <section className="rounded-xl border border-[#dce2e7] bg-white p-5 shadow-[0_8px_25px_rgba(31,48,70,0.06)]">
            <span className="text-xs text-[#7c8694]">Estimasi layanan</span>
            <strong className="mt-1 block text-xl font-black text-[#121820]">{service.startingPrice}</strong>
            <p className="mt-3 text-xs leading-5 text-[#7b8592]">Dapatkan konsultasi awal dan penawaran yang disesuaikan dengan kebutuhan Anda.</p>
            <a
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold text-white shadow-[0_8px_18px_rgba(10,167,229,0.2)] transition-colors hover:bg-primary/90"
              href="https://wa.me/6281330663930"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> Konsultasi Sekarang
            </a>
          </section>

          <section className="rounded-xl border border-[#dce2e7] bg-white p-5 text-xs text-[#6f7987]">
            <p className="flex items-center gap-2"><ShieldCheck className="text-[#10b981]" size={15} /> Tim layanan berpengalaman</p>
            <p className="mt-3 flex items-center gap-2"><Star className="text-[#ffb311]" size={15} fill="currentColor" /> Penawaran transparan</p>
            <p className="mt-3 flex items-center gap-2"><Headphones className="text-secondary" size={15} /> Pendampingan responsif</p>
          </section>
        </aside>
      </div>
    </main>
  )
}

function ArticlePage({ onNavigate }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const normalizedQuery = query.trim().toLowerCase()
  const filteredArticles = articleData.articles.filter((article) => {
    const matchesCategory = activeCategory === 'Semua' || article.category === activeCategory
    const matchesQuery = !normalizedQuery || `${article.title} ${article.excerpt} ${article.category}`.toLowerCase().includes(normalizedQuery)
    return matchesCategory && matchesQuery
  })
  const featuredArticles = filteredArticles.slice(0, 3)

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => AOS.refreshHard())
    return () => window.cancelAnimationFrame(animationFrame)
  }, [query, activeCategory])

  return (
    <main className="min-h-screen bg-[#f3f5f7]">
      <header className="bg-[#123251] px-6 pt-32 pb-14 text-center text-white md:px-18 md:pt-36 md:pb-16">
        <div className="mx-auto max-w-[48rem]" data-aos="fade-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[0.65rem] font-bold text-white/90">
            <Sparkles size={13} /> GANES TOUR MEDIA HUB
          </span>
          <h1 className="mt-5 text-[clamp(2.35rem,5vw,4rem)] font-black leading-none tracking-[-0.045em]">PT. Ganes Lancar Insight</h1>
          <p className="mx-auto mt-4 max-w-[40rem] text-sm leading-6 text-white/78">
            Inspirasi destinasi, panduan perjalanan, kuliner, petualangan, dan tips praktis
            untuk membantu Anda merancang pengalaman liburan yang lebih baik.
          </p>
          <label className="mx-auto mt-7 flex h-12 max-w-[34rem] items-center gap-3 rounded-xl bg-white px-4 text-[#667386] shadow-[0_10px_25px_rgba(3,18,34,0.14)]">
            <Search className="shrink-0 text-[#85919f]" size={18} />
            <input
              className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-[#a0a9b5]"
              type="search"
              value={query}
              placeholder="Cari artikel, video, panduan, berita..."
              aria-label="Cari artikel"
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <p className="mt-3 text-[0.65rem] text-white/55">{filteredArticles.length} konten dalam {articleData.categories.length - 1} kategori</p>
        </div>
      </header>

      <nav className="border-b border-[#dfe4e8] bg-white px-6 md:px-18" aria-label="Kategori artikel">
        <div className="mx-auto flex max-w-[80rem] gap-2 overflow-x-auto py-3">
          {articleData.categories.map((category) => (
            <button
              className={`shrink-0 rounded-full px-3.5 py-2 text-[0.7rem] font-semibold transition-colors ${activeCategory === category ? 'bg-primary text-white' : 'text-[#697483] hover:bg-secondary/15 hover:text-secondary'}`}
              type="button"
              key={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </nav>

      <div className="mx-auto max-w-[80rem] px-6 py-8 md:px-18 md:py-10">
        {featuredArticles.length > 0 ? (
          <section className="grid gap-4 lg:grid-cols-[2fr_1fr]" aria-label="Artikel unggulan">
            <ArticleFeatureCard article={featuredArticles[0]} onNavigate={onNavigate} large />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {featuredArticles.slice(1).map((article, index) => (
                <ArticleFeatureCard article={article} onNavigate={onNavigate} animationDelay={(index + 1) * 80} key={article.slug} />
              ))}
            </div>
          </section>
        ) : (
          <section className="rounded-xl border border-[#dfe4e8] bg-white px-6 py-16 text-center" data-aos="fade-up">
            <Search className="mx-auto text-[#9aa4af]" size={28} />
            <h2 className="mt-4 text-lg font-black text-[#172433]">Artikel tidak ditemukan</h2>
            <p className="mt-2 text-sm text-[#77818e]">Coba kata kunci atau kategori lainnya.</p>
          </section>
        )}

        <section className="mt-9" aria-labelledby="trending-topic-title" data-aos="fade-up">
          <h2 className="flex items-center gap-2 text-base font-black text-[#172433]" id="trending-topic-title">
            <Navigation className="text-[#ff7b21]" size={18} /> Trending Topics
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {articleData.trendingTopics.map((topic) => (
              <button
                className="rounded-full border border-[#dfe4e8] bg-white px-3 py-1.5 text-[0.68rem] font-medium text-[#566170] transition-colors hover:border-secondary hover:text-secondary"
                type="button"
                key={topic}
                onClick={() => setQuery(topic)}
              >
                # {topic}
              </button>
            ))}
          </div>
        </section>

        {filteredArticles.length > 3 && (
          <section className="mt-12 pb-16" aria-labelledby="article-list-title">
            <div data-aos="fade-up">
              <p className="text-xs font-bold text-primary">Insight Terbaru</p>
              <h2 className="mt-2 text-2xl font-black tracking-[-0.035em] text-[#172433]" id="article-list-title">Artikel Lainnya</h2>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.slice(3).map((article, index) => (
                <ArticleListCard article={article} onNavigate={onNavigate} animationDelay={index * 70} key={article.slug} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function ArticleDetailPage({ slug, onNavigate }) {
  const article = articleData.articles.find((item) => item.slug === slug)

  if (!article) {
    return <PageNotFound onNavigate={onNavigate} />
  }

  const relatedArticles = articleData.articles
    .filter((item) => item.slug !== article.slug)
    .sort((first, second) => Number(second.category === article.category) - Number(first.category === article.category))
    .slice(0, 4)

  return (
    <main className="min-h-screen bg-[#f3f5f7] px-6 pt-28 pb-20 md:px-18 md:pt-32">
      <article className="mx-auto max-w-[52rem]">
        <a
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#667386] transition-colors hover:text-primary"
          href="/artikel"
          onClick={(event) => onNavigate(event, navLinks[5])}
          data-aos="fade-right"
        >
          <ChevronLeft size={16} /> Kembali ke PT. Ganes Lancar Insight
        </a>

        <header className="mt-7" data-aos="fade-up">
          <div className="flex flex-wrap gap-2 text-[0.65rem] font-semibold">
            <span className="rounded-full bg-secondary/15 px-3 py-1.5 text-secondary">{article.type}</span>
            <span className="rounded-full bg-[#e8eefb] px-3 py-1.5 text-[#45619a]">Verified Content</span>
            <span className="rounded-full bg-[#172f4b] px-3 py-1.5 text-white">PT. Ganes Lancar Original</span>
          </div>
          <h1 className="mt-5 text-[clamp(2.1rem,5vw,4rem)] font-black leading-[1.04] tracking-[-0.05em] text-[#101722]">{article.title}</h1>
          <p className="mt-4 max-w-[44rem] text-sm leading-7 text-[#697483]">{article.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.68rem] text-[#84909e]">
            <strong className="text-[#202833]">{article.author}</strong>
            <span>{article.category}</span>
            <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} /> {article.date}</span>
            <span className="inline-flex items-center gap-1.5"><Globe2 size={13} /> {article.views}</span>
          </div>
        </header>

        <img
          className="mt-7 aspect-[16/9] w-full rounded-xl object-cover shadow-[0_12px_30px_rgba(31,48,70,0.1)]"
          src={article.image}
          alt={article.title}
          data-aos="zoom-in"
        />

        <div className="mt-8 space-y-6" data-aos="fade-up">
          {article.body.map((paragraph, index) => (
            <p className={`text-[0.95rem] leading-8 text-[#3f4956] ${index === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-black first-letter:leading-[0.8] first-letter:text-primary' : ''}`} key={paragraph}>
              {paragraph}
            </p>
          ))}
        </div>

        <section className="mt-8 rounded-xl border border-[#d9e8ef] bg-secondary/15 p-5" data-aos="fade-up" aria-labelledby="article-highlight-title">
          <h2 className="flex items-center gap-2 text-sm font-black text-[#15344c]" id="article-highlight-title">
            <Sparkles className="text-primary" size={17} /> Poin Penting
          </h2>
          <div className="mt-4 grid gap-3">
            {article.highlights.map((highlight, index) => (
              <p className="flex items-start gap-3 text-sm leading-6 text-[#526270]" key={highlight}>
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white text-[0.65rem] font-black text-primary">{index + 1}</span>
                {highlight}
              </p>
            ))}
          </div>
        </section>

        <div className="mt-8 flex flex-col gap-4 border-y border-[#dce2e7] py-4 sm:flex-row sm:items-center sm:justify-between" data-aos="fade-up">
          <div className="flex flex-wrap gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce2e7] bg-white px-3 text-xs font-medium text-[#4f5a68] hover:border-secondary hover:text-secondary" type="button">
              <ExternalLink size={14} /> Bagikan
            </button>
            <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce2e7] bg-white px-3 text-xs font-medium text-[#4f5a68] hover:border-secondary hover:text-secondary" type="button">
              <Heart size={14} /> Simpan
            </button>
            <button className="inline-flex h-9 items-center gap-2 px-2 text-xs font-medium text-[#6f7987] hover:text-[#ef5261]" type="button">
              <ShieldCheck size={14} /> Laporkan
            </button>
          </div>
          <a
            className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#19be63] px-4 text-xs font-bold text-white transition-colors hover:bg-[#14aa57]"
            href="https://wa.me/6281330663930"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={14} /> Konsultasi
          </a>
        </div>

        <div className="mt-5 flex flex-wrap gap-2" data-aos="fade-up">
          {article.tags.map((tag) => (
            <span className="text-[0.68rem] font-medium text-[#7a8592]" key={tag}># {tag}</span>
          ))}
        </div>

        <section className="mt-10" aria-labelledby="related-article-title">
          <h2 className="text-lg font-black text-[#172433]" id="related-article-title" data-aos="fade-up">Artikel Terkait</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedArticles.map((relatedArticle, index) => {
              const relatedLink = { href: `/artikel/${relatedArticle.slug}`, page: 'article-detail', slug: relatedArticle.slug }

              return (
                <a
                  className="group overflow-hidden rounded-lg border border-[#dce2e7] bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_10px_24px_rgba(31,48,70,0.09)]"
                  href={relatedLink.href}
                  onClick={(event) => onNavigate(event, relatedLink)}
                  data-aos="fade-up"
                  data-aos-delay={index * 70}
                  key={relatedArticle.slug}
                >
                  <img className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105" src={relatedArticle.image} alt={relatedArticle.title} />
                  <div className="p-3">
                    <span className="text-[0.58rem] font-bold text-primary">{relatedArticle.category}</span>
                    <h3 className="mt-1.5 line-clamp-2 text-xs font-black leading-5 text-[#172433]">{relatedArticle.title}</h3>
                    <p className="mt-2 text-[0.58rem] text-[#8a939f]">{relatedArticle.date}</p>
                  </div>
                </a>
              )
            })}
          </div>
        </section>
      </article>
    </main>
  )
}

function ArticleFeatureCard({ article, onNavigate, large = false, animationDelay = 0 }) {
  const articleLink = { href: `/artikel/${article.slug}`, page: 'article-detail', slug: article.slug }

  return (
    <a
      className={`group relative overflow-hidden rounded-xl bg-[#18324d] text-white shadow-[0_10px_25px_rgba(31,48,70,0.12)] ${large ? 'min-h-[20rem] lg:min-h-[25rem]' : 'min-h-[12rem]'}`}
      href={articleLink.href}
      onClick={(event) => onNavigate(event, articleLink)}
      data-aos="fade-up"
      data-aos-delay={animationDelay}
    >
      <img className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" src={article.image} alt={article.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07182d]/95 via-[#07182d]/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <div className="flex flex-wrap gap-2 text-[0.62rem] font-semibold">
          <span className="rounded-md bg-white/16 px-2 py-1 backdrop-blur">{article.type}</span>
          <span className="rounded-md bg-primary/85 px-2 py-1">{article.category}</span>
        </div>
        <h2 className={`mt-3 font-black leading-tight ${large ? 'text-[clamp(1.55rem,3vw,2.35rem)]' : 'text-xl'}`}>{article.title}</h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/78">{article.excerpt}</p>
        <p className="mt-3 text-[0.62rem] text-white/58">{article.author} &middot; {article.date}</p>
      </div>
    </a>
  )
}

function ArticleListCard({ article, onNavigate, animationDelay = 0 }) {
  const articleLink = { href: `/artikel/${article.slug}`, page: 'article-detail', slug: article.slug }

  return (
    <a
      className="overflow-hidden rounded-xl border border-[#dfe4e8] bg-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(31,48,70,0.1)]"
      href={articleLink.href}
      onClick={(event) => onNavigate(event, articleLink)}
      data-aos="fade-up"
      data-aos-delay={animationDelay}
    >
      <img className="aspect-[16/9] w-full object-cover" src={article.image} alt={article.title} />
      <div className="p-5">
        <span className="text-[0.65rem] font-bold text-primary">{article.category}</span>
        <h3 className="mt-2 text-base font-black leading-snug text-[#172433]">{article.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#717b89]">{article.excerpt}</p>
        <p className="mt-4 text-[0.62rem] text-[#8a939f]">{article.author} &middot; {article.date}</p>
      </div>
    </a>
  )
}

function DetailSection({ icon: Icon, title, id, children }) {
  return (
    <section className="scroll-mt-36" id={id} data-aos="fade-up">
      <h2 className="mb-4 flex items-center gap-2 text-base font-black text-[#17202b]">
        <Icon className="text-secondary" size={18} /> {title}
      </h2>
      <div className="rounded-xl border border-[#dce2e7] bg-white p-5 shadow-[0_5px_18px_rgba(31,48,70,0.04)]">{children}</div>
    </section>
  )
}

function PackageFaqItem({ item, index }) {
  const [isOpen, setIsOpen] = useState(index === 0)

  return (
    <div className="overflow-hidden rounded-lg border border-[#e1e6eb] bg-white" data-aos="fade-up" data-aos-delay={index * 60}>
      <button
        className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-sm font-semibold text-[#303846] transition-colors hover:bg-[#f7fafc]"
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
      >
        <span>{item.question}</span>
        <ChevronDown
          className={`shrink-0 text-primary transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          size={17}
        />
      </button>
      {isOpen && (
        <div className="border-t border-[#e9edf0] bg-[#f8fafb] px-4 py-3.5">
          <p className="text-sm leading-6 text-[#657080]">{item.answer}</p>
        </div>
      )}
    </div>
  )
}

function PageNotFound({ onNavigate }) {
  return (
    <main className="grid min-h-[70vh] place-items-center bg-[#f6f8fa] px-6 pt-24 text-center">
      <div data-aos="fade-up">
        <Compass className="mx-auto text-secondary" size={36} />
        <h1 className="mt-5 text-3xl font-black text-[#172433]">Halaman tidak ditemukan</h1>
        <p className="mt-3 text-sm text-[#717b89]">Kembali ke beranda untuk melihat paket perjalanan lainnya.</p>
        <a className="mt-6 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-bold text-white" href="/" onClick={(event) => onNavigate(event, navLinks[0])}>
          Kembali ke Beranda
        </a>
      </div>
    </main>
  )
}

function AboutPage() {
  return (
    <main className="min-h-screen bg-[#faf8f2]">
      <section
        className="relative overflow-hidden bg-cover bg-center px-6 pt-[7.5rem] pb-16 md:px-18 md:pt-[8.5rem]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1762374008579-c883ef74267a?auto=format&fit=crop&q=85&w=2400')",
        }}
      >
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
        <div className="absolute top-[5.75rem] left-[57%] z-10 hidden text-white/80 md:block" aria-hidden="true">
          <Sparkles size={25} strokeWidth={1.8} />
        </div>
        <div className="absolute top-[5.5rem] right-[30%] z-10 hidden h-16 w-12 md:block" aria-hidden="true">
          <span className="absolute top-0 left-3 size-2 rounded-full border-2 border-white/80" />
          <span className="absolute top-6 right-0 size-3 rounded-full border-2 border-white/80" />
          <span className="absolute bottom-0 left-8 size-2.5 rounded-full border-2 border-white/80" />
        </div>

        <div className="relative z-10 mx-auto max-w-[74rem] text-center" data-aos="fade-up">
          <h1 className="text-[clamp(2.35rem,5vw,4.15rem)] font-black leading-none tracking-[-0.055em] text-white drop-shadow-lg">
            Tentang Kami
          </h1>
          <p className="mx-auto mt-5 max-w-[38rem] text-xs leading-6 font-medium text-white/90 drop-shadow md:text-sm">
            PT. Ganes Lancar Wisata Sukses adalah Biro Perjalanan Wisata (TDUP) yang siap menjadi solusi perjalanan
            wisata domestik dan internasional Anda.
          </p>
        </div>

        <div className="relative z-10 mx-auto mt-12 grid max-w-[74rem] grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {aboutGallery.map((image, index) => (
            <img
              className={`h-[7.5rem] w-full rounded-xl object-cover shadow-[0_18px_35px_rgba(68,52,8,0.14)] sm:h-[9.5rem] md:h-[10.5rem] ${index === 2 ? 'sm:-mt-3' : ''
                }`}
              src={image.src}
              alt={image.alt}
              data-aos="zoom-in"
              data-aos-delay={index * 70}
              key={image.alt}
            />
          ))}
        </div>
      </section>

      <section className="px-6 py-14 md:px-18 md:py-[4.5rem]">
        <div className="mx-auto max-w-[74rem]" data-aos="fade-up">
          <h2 className="max-w-[43rem] text-[clamp(1.75rem,3.7vw,3rem)] font-black leading-[1.1] tracking-[-0.055em] text-[#1f222b]">
            PROFIL PERUSAHAAN
          </h2>

          <div className="mt-8 max-w-[52rem] text-sm leading-7 text-[#6c7280]">
            <p>
              Kami, “PT. Ganes Lancar Wisata Sukses”, adalah Biro Perjalanan Wisata (TDUP) dari PT. Ganes Lancar Wisata Sukses.
              Berdiri sejak tahun 2016, sejak itu pula telah menjadi komitmen kami untuk memberikan solusi terbaik kepada konsumen
              di bidang tour and travel. Percayakan kebutuhan perjalanan wisata Anda kepada PT. Ganes Lancar Wisata Sukses.
            </p>
            <p>
              Seiring perjalanan waktu, sebagai perusahaan yang berkecimpung di dunia pariwisata, kami juga telah menjalin kerja sama
              strategis dengan perusahaan nasional dan internasional. Kerja sama kami lakukan dengan perusahaan dari industri penerbangan,
              perhotelan, hingga tour operator di berbagai belahan dunia. Semua demi memberikan pelayanan terbaik kepada para konsumen
              termasuk Anda.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-18 md:pb-[5.5rem]">
        <div className="mx-auto grid max-w-[74rem] items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-[4.5rem]">
          <div className="relative max-w-[30rem]" data-aos="fade-right">
            <img
              className="h-72 w-full rounded-xl object-cover shadow-[0_20px_45px_rgba(37,42,54,0.12)] md:h-[20.5rem]"
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=820&q=80"
              alt="Traveler menyiapkan itinerary perjalanan"
            />
            <button
              className="absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-[#111827] shadow-[0_12px_28px_rgba(26,31,44,0.16)]"
              type="button"
              aria-label="Putar video profil PT. Ganes Lancar"
            >
              <PlayCircle size={27} fill="currentColor" strokeWidth={1.5} />
            </button>
            <div className="absolute right-6 -bottom-7 left-6 rounded-xl bg-white px-5 py-4 text-center shadow-[0_16px_35px_rgba(35,42,58,0.13)]">
              <strong className="block text-sm font-black tracking-[-0.02em] text-[#1d2028]">
                "Perjalanan nyaman, layanan terpercaya"
              </strong>
              <span className="mt-1 block text-xs font-medium text-[#818796]">PT. Ganes Lancar Wisata Sukses</span>
            </div>
          </div>

          <div className="pt-8 lg:pt-0" data-aos="fade-left">
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-primary">
              <Compass size={15} /> VISI KAMI
            </p>
            <h2 className="max-w-[34rem] text-[clamp(1.75rem,3.5vw,2.75rem)] font-black leading-[1.08] tracking-[-0.055em] text-[#1f222b]">
              Menjadi perusahaan perjalanan dan pariwisata yang menyediakan layanan di seluruh dunia.
            </h2>
            <p className="mt-7 text-xs font-bold text-primary">MISI KAMI</p>
            <ul className="mt-3 max-w-[35rem] list-disc space-y-2 pl-5 text-sm leading-6 text-[#6b7280]">
              <li>Memberikan pelayanan yang terbaik pada siapa pun.</li>
              <li>Membangun fundamental dan sinergi yang kuat dalam perusahaan kami.</li>
              <li>Memperluas jaringan hingga seluruh dunia dengan menjalin hubungan yang erat pada setiap entitas yang terkait.</li>
              <li>Menghadirkan nilai lebih pada perusahaan kami, rasa tanggung jawab, pekerjaan yang detail, dan memberikan layanan konsisten dan terus berkembang.</li>
              <li>Menjadi perusahaan travel yang terkenal dan bernilai, menjaga nama baik perusahaan pada setiap layanan yang kami berikan.</li>
              <li>Menghadirkan sesuatu yang berbeda dengan inovasi dan kreativitas yang kami berikan.</li>
              <li>Memahami dan menyadari akan segala kebutuhan yang berbeda pada setiap pelanggan kami.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="px-6 pb-[4.5rem] text-center md:px-18 md:pb-24">
        <div className="relative mx-auto max-w-[74rem]">
          <Sparkles className="absolute top-2 left-[18%] hidden text-[#1f242d] md:block" size={22} strokeWidth={1.8} />
          <span className="absolute top-0 right-[25%] hidden size-2 rounded-full border-2 border-[#1f242d] md:block" aria-hidden="true" />

          <h2 className="mx-auto max-w-[45rem] text-[clamp(1.75rem,3.5vw,2.85rem)] font-black leading-[1.08] tracking-[-0.055em] text-[#1f222b]" data-aos="fade-up">
            KLIEN KAMI
          </h2>
          <p className="mx-auto mt-4 max-w-[42rem] text-sm leading-6 text-[#777f8d]" data-aos="fade-up" data-aos-delay="80">
            PT. Ganes Lancar Wisata Sukses memiliki puluhan pelanggan dari perusahaan ternama maupun perseorangan yang tak terhitung lagi jumlahnya. Berikut beberapa di antaranya:
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4" data-aos="fade-up" data-aos-delay="120">
            {clients.map((client) => (
              <ClientLogo client={client} key={`about-${client.name}`} />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function WhyUsPage({ onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen bg-white pt-24" id="top">
      <section className="px-6 py-14 md:px-18 md:py-[4.5rem]">
        <div className="mx-auto max-w-[74rem]" data-aos="fade-up">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-primary">
            <Target size={15} /> LEGALITAS LENGKAP
          </p>
          <h2 className="max-w-[43rem] text-[clamp(1.75rem,3.7vw,3rem)] font-black leading-[1.1] tracking-[-0.055em] text-[#1f222b]">
            PT. Ganes Lancar Wisata Sukses, mitra perjalanan terpercaya Anda
          </h2>

          <div className="mt-8 grid gap-8 text-sm leading-7 text-[#6c7280] md:grid-cols-2 md:gap-[4.5rem]">
            <p>
              Berwisata membutuhkan biaya, dan pastinya Anda ingin agar bisa membelanjakan dana kepada pihak terpercaya. Kami,
              PT. Ganes Lancar Wisata Sukses, adalah entitas resmi berbadan hukum yaitu PT. Ganes Lancar Wisata Sukses.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-18 md:pb-[5.5rem]">
        <div className="mx-auto grid max-w-[74rem] items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-[4.5rem]">
          <div className="pt-8 lg:pt-0" data-aos="fade-right">
            <h2 className="max-w-[34rem] text-[clamp(1.75rem,3.5vw,2.75rem)] font-black leading-[1.08] tracking-[-0.055em] text-[#1f222b]">
              ANDAL DAN BERPENGALAMAN
            </h2>
            <p className="mt-5 max-w-[35rem] text-sm leading-7 text-[#6b7280]">
              Keandalan dalam menyelenggarakan perjalanan wisata sudah terbukti dari klien-klien kami. PT. Ganes Lancar Wisata Sukses mempunyai pengalaman mendukung puluhan perusahaan besar, mulai dari Bank BCA hingga Gudang Garam, lewat layanan wisata dan jasa yang kami sediakan. Belum lagi pelanggan perseorangan yang tak terhitung lagi banyaknya.
            </p>
            
            <button 
              className="mt-10 inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-bold text-white shadow-[0_8px_20px_rgba(10,167,229,0.25)] transition-all hover:-translate-y-0.5 hover:bg-primary/95"
              onClick={(e) => onNavigate(e, { page: 'home', section: 'tour-packages', href: '/#tour-packages' })}
            >
              Lihat Pilihan Paket Kami
            </button>
          </div>

          <div className="relative max-w-[32rem] lg:justify-self-end" data-aos="fade-left">
            <img
              className="h-72 w-full rounded-2xl object-cover shadow-[0_20px_45px_rgba(37,42,54,0.12)] md:h-[24rem]"
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
              alt="Tim melayani pelanggan"
            />
            <div className="absolute -left-8 top-12 rounded-xl bg-white p-4 shadow-[0_16px_35px_rgba(35,42,58,0.13)]">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-[#eef7fb] text-primary">
                  <Heart size={20} fill="currentColor" />
                </div>
                <div>
                  <strong className="block text-sm font-black tracking-[-0.02em] text-[#1d2028]">
                    Layanan Sepenuh Hati
                  </strong>
                  <span className="block text-xs font-medium text-[#818796]">Prioritas Utama Kami</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f8f9fb] px-6 py-[4.5rem] text-center md:px-18 md:py-24">
        <div className="relative mx-auto max-w-[74rem]">
          <h2 className="mx-auto max-w-[45rem] text-[clamp(1.75rem,3.5vw,2.85rem)] font-black leading-[1.08] tracking-[-0.055em] text-[#1f222b]" data-aos="fade-up">
            BERAGAM DESTINASI DAN LAYANAN
          </h2>
          <p className="mx-auto mt-4 max-w-[38rem] text-sm leading-6 text-[#777f8d]" data-aos="fade-up" data-aos-delay="80">
            Destinasi wisata di berbagai negara tersedia di PT. Ganes Lancar Wisata Sukses. Anda juga tidak perlu direpotkan oleh hal lain sebab mulai dari pengurusan VISA hingga tiket serta hotel juga kami sediakan.
          </p>

        </div>
      </section>
      <CTASection />
    </main>
  )
}

function TravelHero({ onNavigate }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const heroImages = [
    {
      src: 'https://images.unsplash.com/photo-1736523076168-fdda4640f1d8?auto=format&fit=crop&w=2400&q=90',
      alt: 'Pemandangan kepulauan Labuan Bajo dari udara',
    },
    {
      src: 'https://images.unsplash.com/photo-1602154663343-89fe0bf541ab?auto=format&fit=crop&w=2400&q=90',
      alt: 'Pemandangan Gunung Bromo di Jawa Timur',
    },
    {
      src: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=2400&q=90',
      alt: 'Pura dan danau di Bali',
    },
    {
      src: 'https://images.unsplash.com/photo-1511013411230-380c4ed5f0f1?auto=format&fit=crop&w=2400&q=90',
      alt: 'Tembok Besar China melintasi pegunungan',
    },
    {
      src: 'https://images.unsplash.com/photo-1741682739831-9f9627d15775?auto=format&fit=crop&w=2400&q=90',
      alt: 'Pemandangan gedung dan cakrawala Jakarta',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const url = '/search?q=' + encodeURIComponent(searchQuery.trim());
      window.history.pushState({}, '', url);
      onNavigate({ preventDefault: () => { } }, { page: 'search', query: searchQuery.trim(), href: url });
    }
  };

  return (
    <header className="relative flex min-h-[44rem] items-center overflow-hidden text-white md:min-h-[46rem]" id="top">
      {heroImages.map((image, index) => (
        <img
          key={image.src}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          src={image.src}
          alt={image.alt}
          fetchPriority={index === 0 ? 'high' : 'auto'}
        />
      ))}
      <div className="absolute inset-0 bg-[#07182d]/52" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#07182d]/35 via-transparent to-[#07182d]/62" />

      <div className="relative z-10 mx-auto w-full max-w-[80rem] px-6 pt-28 pb-28 text-center md:px-18" data-aos="fade-up">
        <p className="text-[0.68rem] font-semibold tracking-[0.38em] text-white/85 uppercase md:text-xs">
          PT. Ganes Lancar Wisata Sukses
        </p>
        <h1 className="mx-auto mt-5 max-w-[54rem] text-[clamp(2.75rem,6.8vw,5.4rem)] leading-[0.94] font-bold tracking-[-0.065em]">
          Jelajahi Keindahan
          <br />
          <span className="text-secondary">Dunia Bersama Kami</span>
        </h1>
        <p className="mx-auto mt-6 max-w-[42rem] text-sm leading-6 text-white/88 md:text-lg md:leading-7">
          Temukan paket tour pilihan, destinasi menakjubkan, dan pengalaman perjalanan yang dirancang
          khusus untuk menciptakan kenangan terbaik Anda.
        </p>

        <div className="mx-auto mt-9 max-w-[42rem] rounded-2xl border border-white/25 bg-[#07182d]/72 p-3 text-left shadow-[0_20px_50px_rgba(3,17,31,0.25)] backdrop-blur-md" data-aos="zoom-in" data-aos-delay="120">
          <div className="grid gap-2 sm:grid-cols-[1fr_7.5rem]">
            <label className="flex min-h-12 items-center gap-3 rounded-xl bg-white px-4 text-[#707a88]">
              <Search size={18} className="shrink-0 text-[#93a1ae]" />
              <input
                className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[#a7b0bb]"
                type="search"
                placeholder="Mau ke mana hari ini?"
                aria-label="Cari destinasi"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
            </label>
            <button
              className="min-h-12 rounded-xl bg-primary text-sm font-bold text-white transition-colors hover:bg-secondary"
              type="button"
              onClick={handleSearch}
            >
              Jelajahi
            </button>
          </div>
        </div>

      </div>
    </header>
  )
}

function HeroStats() {
  const stats = [
    {
      icon: Plane,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      title: 'Spesialis',
      subtitle: 'Tour & Travel',
      description: 'Domestik & Internasional',
    },
    {
      icon: Users,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      title: '25K+',
      subtitle: 'Traveler Bahagia',
      description: 'Sejak 2009',
    },
    {
      icon: Star,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      title: '4.9',
      subtitle: 'Rating Pelanggan',
      description: 'Dari 1.200+ ulasan',
    },
    {
      icon: Package,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      title: '100+',
      subtitle: 'Paket Wisata',
      description: 'Liburan sesuai impian',
    }
  ]

  return (
    <div className="mx-auto relative z-20 max-w-[80rem] px-6 lg:px-8 -mt-10 mb-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200 transition-transform hover:-translate-y-1" data-aos="fade-up" data-aos-delay={i * 70}>
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
              <stat.icon size={22} strokeWidth={2} />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <strong className="text-[1.05rem] font-bold text-[#172433] leading-none">{stat.title}</strong>
              </div>
              <p className="mt-1 text-[0.8rem] font-bold text-[#172433] leading-tight">{stat.subtitle}</p>
              <p className="mt-0.5 text-[0.72rem] text-[#667386]">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SiteNavbar({ currentPage, onNavigate }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const isSolid = hasScrolled || isMenuOpen || currentPage !== 'home'

  useEffect(() => {
    const updateNavbar = () => {
      setHasScrolled(window.scrollY > 8)
    }

    updateNavbar()
    window.addEventListener('scroll', updateNavbar, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateNavbar)
    }
  }, [])

  return (
    <div
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ease-out motion-reduce:transition-none ${isSolid
        ? 'border-b border-[#edf0f5] bg-white shadow-none'
        : 'border-b border-transparent bg-transparent'
        }`}
    >
      <nav
        className="mx-auto flex h-[4.5rem] max-w-[80rem] items-center justify-between gap-6 px-5 lg:px-8"
        aria-label="Navigasi utama"
      >
        <a
          className="flex shrink-0 items-center gap-2.5"
          href="/"
          aria-label="PT. Ganes Lancar beranda"
          onClick={(event) => onNavigate(event, navLinks[0])}
        >
          <img src={isSolid ? logoImageStroke : logoImage} alt="PT. Ganes Lancar" className="h-10 w-auto" />
        </a>

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 xl:flex">
          {navLinks.map((link) => {
            const dropdownItems = link.dropdown === 'wisata' ? wisataCategories : serviceLinks
            const isDropdownActive =
              (link.dropdown === 'wisata' && (currentPage === 'category' || currentPage === 'package')) ||
              (link.dropdown === 'services' && currentPage === 'service')
            const isArticleActive = link.page === 'articles' && currentPage === 'article-detail'
            const linkClassName = `inline-flex shrink-0 items-center gap-1.5 py-5 text-[0.72rem] font-semibold tracking-[0.02em] uppercase transition-colors ${isSolid
              ? (currentPage === link.page && !link.section) || isDropdownActive || isArticleActive
                ? 'text-primary'
                : 'text-[#626b78] hover:text-primary'
              : 'text-white/82 hover:text-white'
              }`

            if (!link.dropdown) {
              return (
                <a className={linkClassName} href={link.href} key={link.label} onClick={(event) => onNavigate(event, link)}>
                  {link.label}
                </a>
              )
            }

            return (
              <div className="group relative" key={link.label}>
                <a className={linkClassName} href={link.href} onClick={(event) => onNavigate(event, link)}>
                  {link.label}
                  <ChevronDown className="transition-transform group-hover:rotate-180" size={12} strokeWidth={1.8} aria-hidden="true" />
                </a>
                <div className="invisible absolute top-full left-1/2 w-64 -translate-x-1/2 translate-y-2 rounded-lg border border-[#e7ebf0] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(24,39,62,0.16)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  {dropdownItems.map((item) => (
                    <a
                      className="flex items-center gap-3 rounded-md px-3 py-3 text-xs font-semibold text-[#4e5968] transition-colors hover:bg-secondary/15 hover:text-secondary"
                      href={item.href}
                      key={item.slug}
                      onClick={(event) => onNavigate(event, item)}
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-secondary/15 text-primary">
                        {link.dropdown === 'wisata' ? <Compass size={15} strokeWidth={1.8} /> : <Package size={15} strokeWidth={1.8} />}
                      </span>
                      {item.shortTitle ?? item.title}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <button
            className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-[0.76rem] font-semibold transition-colors ${isSolid ? 'text-[#344054] hover:bg-[#f2f7fa]' : 'text-white/85 hover:bg-white/10 hover:text-white'
              }`}
            type="button"
            aria-label="Pilih bahasa"
          >
            <Globe2 size={16} strokeWidth={1.8} /> ID <ChevronDown size={12} />
          </button>
          <a
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-5 text-xs font-bold text-white shadow-[0_7px_18px_rgba(16,166,225,0.24)] transition-colors hover:bg-secondary"
            href="/#tour-packages"
            onClick={(event) => onNavigate(event, navLinks[2])}
          >
            Lihat Paket
          </a>
        </div>

        <button
          className={`grid size-10 shrink-0 place-items-center rounded-lg transition-colors xl:hidden ${isSolid ? 'text-[#232936] hover:bg-[#f2f6fa]' : 'text-white hover:bg-white/10'
            }`}
          type="button"
          aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div
          className="absolute top-full right-0 left-0 border-t border-[#edf0f5] bg-white px-5 py-4 shadow-[0_18px_30px_rgba(29,44,76,0.12)] xl:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto grid max-w-[80rem] grid-cols-2 gap-1">
            {navLinks.map((link) => (
              <div key={link.label}>
                <a
                  className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold uppercase hover:bg-secondary/15 hover:text-primary ${currentPage === link.page && !link.section ? 'text-primary' : 'text-[#596174]'
                    }`}
                  href={link.href}
                  onClick={(event) => {
                    onNavigate(event, link)
                    setIsMenuOpen(false)
                  }}
                >
                  {link.label}
                  {link.dropdown && <ChevronDown size={16} />}
                </a>
                {link.dropdown && (
                  <div className="ml-4 grid gap-1 border-l border-[#dce9f0] pl-3">
                    {(link.dropdown === 'wisata' ? wisataCategories : serviceLinks).map((item) => (
                      <a
                        className="rounded-md px-3 py-2 text-xs font-medium text-[#697383] hover:bg-secondary/15 hover:text-primary"
                        href={item.href}
                        key={item.slug}
                        onClick={(event) => {
                          onNavigate(event, item)
                          setIsMenuOpen(false)
                        }}
                      >
                        {item.shortTitle ?? item.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <a
              className="mt-3 inline-flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-white"
              href="/#tour-packages"
              onClick={(event) => {
                onNavigate(event, navLinks[2])
                setIsMenuOpen(false)
              }}
            >
              Lihat Paket
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function ClientLogoSection() {
  return (
    <section className="bg-white px-6 py-10 md:px-18" aria-label="Klien kami">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-7 text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf4ff] px-3 py-1.5 text-xs font-semibold text-[#253044]">
            <Sparkles size={13} className="text-secondary" />
            Klien Kami
          </span>
          <p className="mt-3 text-sm text-[#7a8391]">
            Kepercayaan mereka menjadi semangat kami untuk terus memberikan layanan perjalanan terbaik
          </p>
        </div>

        <div className="client-logo-viewport overflow-hidden" data-aos="fade-up" data-aos-delay="100">
          <div className="client-logo-track flex w-max">
            {[0, 1].map((groupIndex) => (
              <div
                className="flex items-center gap-12 pr-12"
                aria-hidden={groupIndex === 1 ? 'true' : undefined}
                key={groupIndex}
              >
                {clients.map((client) => (
                  <ClientLogo client={client} key={`${groupIndex}-${client.name}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ClientLogo({ client }) {
  return (
    <div className={`flex h-11 min-w-[8.5rem] shrink-0 items-center gap-2.5 ${client.tone}`}>
      <span
        className={`grid size-7 shrink-0 place-items-center rounded-full border text-[0.68rem] font-black ${client.markTone}`}
      >
        {client.mark}
      </span>
      <span className="leading-none">
        <strong className="block whitespace-nowrap text-[0.78rem] font-extrabold tracking-[-0.025em]">
          {client.name}
        </strong>
        <small className="mt-1 block whitespace-nowrap text-[0.42rem] font-semibold tracking-[0.07em] opacity-65">
          {client.detail}
        </small>
      </span>
    </div>
  )
}

function TravelTypeSection({ onNavigate }) {
  const travelTypes = [
    {
      slug: 'wisata-dalam-negeri',
      title: 'Travel Domestik',
      description: 'Jelajahi pesona Nusantara',
      icon: MapPin,
    },
    {
      slug: 'wisata-luar-negeri',
      title: 'Travel Internasional',
      description: 'Destinasi dunia pilihan',
      icon: Globe2,
    },
  ].map((travelType) => ({
    ...travelType,
    link: wisataCategories.find((category) => category.slug === travelType.slug),
  }))

  return (
    <section className="bg-white px-6 pt-2 pb-12 md:px-18" aria-labelledby="travel-type-title">
      <div className="mx-auto max-w-[80rem]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary/80 px-5 py-10 shadow-2xl shadow-primary/20 sm:px-8 lg:px-10">
          <div className="absolute -top-28 -right-20 size-72 rounded-full border-[3rem] border-white/5" />
          <div className="absolute -bottom-40 left-1/3 size-72 rounded-full bg-white/5" />

          <div className="relative z-10 text-center" data-aos="fade-up">
            <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] leading-tight font-bold text-white" id="travel-type-title">
              Temukan Jenis Wisata yang Sesuai
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-white/80">
              Pilih pengalaman perjalanan yang paling sesuai dengan rencana, kebutuhan, dan gaya liburan Anda.
            </p>
          </div>

          <div className="relative z-10 mx-auto mt-7 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
            {travelTypes.map((travelType, index) => {
              const Icon = travelType.icon

              return (
                <a
                  className="group flex min-h-36 rounded-xl flex-col items-center justify-center border border-white/25 bg-white/10 px-4 py-5 text-center transition-colors hover:bg-white/20"
                  data-aos="fade-up"
                  data-aos-delay={index * 70}
                  href={travelType.link?.href ?? '/#tour-packages'}
                  key={travelType.slug}
                  onClick={(event) => onNavigate(event, travelType.link ?? navLinks[2])}
                >
                  <span className="grid size-11 place-items-center rounded-lg bg-white text-primary shadow-sm transition-transform group-hover:-translate-y-1">
                    <Icon size={21} strokeWidth={1.8} />
                  </span>
                  <strong className="mt-3 text-sm font-bold text-white">{travelType.title}</strong>
                  <span className="mt-1 text-xs text-white/75">{travelType.description}</span>
                </a>
              )
            })}
          </div>

          <div className="relative z-10 mt-6 flex justify-center" data-aos="fade-up">
            <a
              className="group inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-7 text-sm font-semibold text-primary shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
              href={navLinks[2].href}
              onClick={(event) => onNavigate(event, navLinks[2])}
            >
              Jelajahi Semua Wisata
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function TourPackageSection({ onNavigate }) {
  const carouselRef = useRef(null)

  const moveCarousel = (direction) => {
    const carousel = carouselRef.current
    const firstCard = carousel?.querySelector('[data-package-card]')

    if (!carousel) return

    carousel.scrollBy({
      left: direction * ((firstCard?.offsetWidth ?? 300) + 16),
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-[#ffffff] px-6 py-12 md:px-18" id="tour-packages" aria-labelledby="tour-package-title">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-6 text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf4ff] px-3 py-1.5 text-xs font-semibold text-[#253044]">
            <Sparkles size={13} className="text-secondary" />
            Paket Tour
          </span>
          <h2
            className="mt-3 text-[clamp(1.35rem,2.2vw,1.8rem)] leading-tight font-bold tracking-[-0.035em] text-[#101624]"
            id="tour-package-title"
          >
            Paket Tour Pilihan untuk Perjalanan Anda
          </h2>
          <p className="mt-1.5 text-sm text-[#7a8391]">
            Temukan paket perjalanan yang dirancang untuk menghadirkan pengalaman terbaik di setiap destinasi
          </p>
        </div>

        <div className="mb-4 flex justify-end gap-2" data-aos="fade-left">
          <button
            className="grid size-10 place-items-center rounded-full border border-[#dfe3e8] bg-white text-[#344054] shadow-sm transition-colors hover:border-secondary hover:bg-secondary/15 hover:text-secondary"
            type="button"
            aria-label="Paket sebelumnya"
            onClick={() => moveCarousel(-1)}
          >
            <ChevronLeft size={19} />
          </button>
          <button
            className="grid size-10 place-items-center rounded-full bg-primary text-white shadow-[0_6px_16px_rgba(16,166,225,0.25)] transition-colors hover:bg-secondary"
            type="button"
            aria-label="Paket berikutnya"
            onClick={() => moveCarousel(1)}
          >
            <ChevronRight size={19} />
          </button>
        </div>

        <div
          className="tour-package-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2"
          ref={carouselRef}
          aria-label="Carousel paket tour"
        >
          {tourPackages.map((tourPackage, index) => (
            <TourPackageCard tourPackage={tourPackage} onNavigate={onNavigate} animationDelay={index * 70} key={tourPackage.title} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TourPackageCard({ tourPackage, onNavigate, animationDelay = 0, layout = 'carousel', className = '' }) {
  const detailLink = {
    href: `/paket-tour/${tourPackage.slug}`,
    page: 'package',
    slug: tourPackage.slug,
  }
  const layoutClassName = layout === 'grid'
    ? 'w-full min-w-0 max-w-none shrink-0 snap-none'
    : 'w-[84vw] max-w-[20rem] shrink-0 snap-start md:w-[calc((100%_-_1rem)/2)] md:max-w-none lg:w-[calc((100%_-_2rem)/3)] xl:w-[calc((100%_-_3rem)/4)]'

  return (
    <article
      className={`${layoutClassName} overflow-hidden rounded-[1.35rem] border border-[#dfe3e8] bg-white shadow-[0_10px_28px_rgba(42,57,78,0.08)] cursor-pointer hover:border-primary/50 transition-colors ${className}`}
      data-package-card
      data-aos="fade-up"
      data-aos-delay={animationDelay}
      onClick={(event) => {
        if (event.target.closest('button') || event.target.closest('a')) return
        onNavigate(event, detailLink)
      }}
    >
      <div className="relative">
        <img className="h-48 w-full object-cover" src={tourPackage.image} alt={tourPackage.title} />
        <span className="absolute top-3 left-3 rounded-full bg-secondary px-3 py-1.5 text-[0.66rem] font-bold text-white shadow-sm">
          {tourPackage.badge}
        </span>
        <button
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-white/95 text-[#344054] shadow-sm transition-colors hover:text-[#ef5261]"
          type="button"
          aria-label={`Simpan ${tourPackage.title}`}
        >
          <Heart size={17} strokeWidth={1.8} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold leading-tight text-[#151923]">{tourPackage.title}</h3>
            <p className="mt-1 text-xs text-[#747d8b]">{tourPackage.category}</p>
          </div>
          <span className="shrink-0 text-right text-[0.62rem] font-semibold text-primary">
            Mulai dari
          </span>
        </div>

        <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#4d5766]">
          <MapPin size={13} className="text-primary" /> {tourPackage.location}
        </p>

        <p className="mt-3 min-h-11 text-[0.68rem] leading-[1.55] text-[#727b88]">
          {tourPackage.description}
        </p>

        <div className="mt-3 flex items-end justify-between border-t border-[#edf0f3] pt-3">
          <span className="text-[0.62rem] text-[#7c8592]">Harga per orang</span>
          <strong className="text-sm font-extrabold text-[#111827]">{tourPackage.price}</strong>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <a
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#dfe3e8] text-xs font-semibold text-[#303846] transition-colors hover:border-secondary hover:text-secondary"
            href={detailLink.href}
            onClick={(event) => onNavigate(event, detailLink)}
          >
            Lihat Detail
          </a>
          <a
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary text-xs font-semibold text-white transition-colors hover:bg-secondary"
            href={getPackageWhatsAppUrl(tourPackage)}
            target="_blank"
            rel="noreferrer"
          >
            Pilih Paket
          </a>
        </div>
      </div>
    </article>
  )
}

function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className="fixed right-4 bottom-4 z-50 sm:right-7 sm:bottom-7" aria-label="Kontak WhatsApp">
      {isOpen && (
        <section
          className="absolute right-0 bottom-[4.9rem] w-[calc(100vw-2rem)] max-w-[17.9rem] overflow-hidden rounded-2xl bg-white shadow-[0_18px_50px_rgba(25,38,61,0.2)] ring-1 ring-black/5"
          id="whatsapp-contact-panel"
          aria-label="Pilih admin WhatsApp"
        >
          <div className="flex min-h-16 items-center gap-3 bg-[#25d366] px-4 text-white">
            <Headphones className="shrink-0" size={21} strokeWidth={2} aria-hidden="true" />
            <div className="min-w-0 flex-1 leading-tight">
              <strong className="block text-sm font-extrabold">Butuh Bantuan?</strong>
              <span className="block text-xs font-medium text-white/95">Tim kami siap melayani</span>
            </div>
            <button
              className="grid size-8 place-items-center rounded-full text-white/90 transition-colors hover:bg-white/15 hover:text-white"
              type="button"
              aria-label="Tutup kontak WhatsApp"
              onClick={() => setIsOpen(false)}
            >
              <X size={17} />
            </button>
          </div>

          <div className="px-5 pt-4 pb-3">
            <div className="grid gap-4">
              {whatsappContacts.map((contact) => (
                <div className="flex items-center gap-3" key={contact.phone}>
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold text-white ${contact.color}`}
                  >
                    {contact.initials}
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <strong className="block text-[0.94rem] font-semibold text-[#202432]">
                      {contact.name}
                    </strong>
                    <span className="mt-0.5 block text-xs text-[#7a8293]">{contact.phone}</span>
                  </div>
                  <a
                    className="text-xs font-semibold text-[#19c963] hover:text-[#0dac4d]"
                    href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Chat WhatsApp dengan ${contact.name}`}
                  >
                    Chat
                  </a>
                </div>
              ))}
            </div>
            <p className="mt-4 text-center text-[0.65rem] text-[#858c9b]">
              Chat akan diteruskan ke WhatsApp tim terkait
            </p>
          </div>
        </section>
      )}

      <button
        className="grid size-16 place-items-center rounded-full bg-[#19be63] text-white shadow-[0_12px_30px_rgba(20,154,78,0.34)] transition-all hover:scale-105 hover:bg-[#14aa57] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#19be63]/35"
        type="button"
        aria-label={isOpen ? 'Tutup kontak WhatsApp' : 'Buka kontak WhatsApp'}
        aria-expanded={isOpen}
        aria-controls="whatsapp-contact-panel"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? (
          <X size={30} strokeWidth={2} />
        ) : (
          <MessageCircle size={30} strokeWidth={2} fill="currentColor" />
        )}
      </button>
    </aside>
  )
}

function TourListSection({ onNavigate }) {
  const carouselRef = useRef(null)

  const moveCarousel = (direction) => {
    const carousel = carouselRef.current
    const firstCard = carousel?.querySelector('[data-tour-card]')

    if (!carousel) return

    carousel.scrollBy({
      left: direction * ((firstCard?.offsetWidth ?? 288) + 16),
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-[#f8f9fa] px-6 py-10 md:px-18" id="tour-list" aria-labelledby="tour-list-title">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-6 text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf4ff] px-3 py-1.5 text-xs font-semibold text-[#253044]">
            <Sparkles size={13} className="text-secondary" />
            List Tour
          </span>
          <h2
            className="mt-3 text-[clamp(1.35rem,2.2vw,1.8rem)] leading-tight font-bold tracking-[-0.035em] text-[#101624]"
            id="tour-list-title"
          >
            Destinasi Tour Pilihan
          </h2>
          <p className="mt-1.5 text-sm text-[#7a8391]">
            Pilih destinasi tour favorit Anda dan mulai rencanakan perjalanan bersama kami.
          </p>
        </div>

        <div className="mb-4 flex justify-end gap-2" data-aos="fade-left">
          <button
            className="grid size-10 place-items-center rounded-full border border-[#dfe3e8] bg-white text-[#344054] shadow-sm transition-colors hover:border-secondary hover:bg-secondary/15 hover:text-secondary"
            type="button"
            aria-label="Tour sebelumnya"
            onClick={() => moveCarousel(-1)}
          >
            <ChevronLeft size={19} />
          </button>
          <button
            className="grid size-10 place-items-center rounded-full bg-primary text-white shadow-[0_6px_16px_rgba(16,166,225,0.25)] transition-colors hover:bg-secondary"
            type="button"
            aria-label="Tour berikutnya"
            onClick={() => moveCarousel(1)}
          >
            <ChevronRight size={19} />
          </button>
        </div>

        <div
          className="tour-journey-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1"
          ref={carouselRef}
          aria-label="Daftar destinasi tour"
        >
          {tourJourneys.map((journey, index) => (
            <article
              className="w-[15rem] shrink-0 snap-start overflow-hidden rounded-[1.15rem] border border-[#dfe3e8] bg-white shadow-[0_8px_24px_rgba(42,57,78,0.07)] sm:w-[16rem] md:w-[17rem]"
              data-tour-card
              data-aos="fade-up"
              data-aos-delay={index * 60}
              key={journey.title}
            >
              <div className="relative overflow-hidden bg-[#eff4f7]">
                <img
                  className="h-32 w-full object-cover transition-transform duration-500 hover:scale-105"
                  src={journey.image}
                  alt={`Destinasi tour ${journey.title}`}
                  loading="lazy"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-[#07182d]/80 px-2.5 py-1 text-[0.6rem] font-semibold text-white">
                  {journey.location}
                </span>
              </div>

              <div className="p-3.5">
                <h3 className="text-sm font-bold leading-tight text-[#171a20]">{journey.title}</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {journey.attractions.slice(0, 2).map((attraction) => (
                    <span
                      className="rounded-full bg-[#eef7fb] px-2 py-1 text-[0.58rem] font-medium text-[#4f6172]"
                      key={attraction}
                    >
                      {attraction}
                    </span>
                  ))}
                </div>
                <a
                  className="mt-3 inline-flex items-center gap-1 text-[0.68rem] font-semibold text-primary transition-colors hover:text-secondary"
                  href={`/tour/${journey.slug}`}
                  onClick={(event) => onNavigate(event, { page: 'tour', slug: journey.slug, href: `/tour/${journey.slug}` })}
                >
                  Lihat Detail <ArrowRight size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const otherServices = [
  {
    icon: Users,
    title: 'EO KORPORAT/MICE',
    description: 'Hindari segala kerepotan penyelenggaraan acara dengan solusi MICE (Meetings, Incentive, Convention, and Events) dari kami. Dengan pengalaman mendukung acara puluhan perusahaan besar, profesionalitas PT. Ganes Lancar Wisata Sukses sudah tidak perlu diragukan.',
  },
  {
    icon: Globe2,
    title: 'SEWA MODEM',
    description: 'Butuh terkoneksi ke internet saat berada di luar negeri? Gunakan layanan sewa modem kami. Tetap terhubung ke keluarga, teman, maupun rekan bisnis melalui email, WhatsApp hingga sosial media meskipun sedang berwisata di luar Indonesia. Kami menyediakan modem kualitas terbaik dengan harga sewa terjangkau.',
  },
  {
    icon: Plane,
    title: 'TIKET',
    description: 'Butuh tiket untuk tujuan dalam dan luar negeri? Kontak kami segera. Tak perlu repot dan risau. Layanan booking tiket penerbangan dari PT. Ganes Lancar Wisata Sukses siap membantu Anda.',
  },
  {
    icon: MapPin,
    title: 'VOUCHER HOTEL',
    description: 'Pusing pilih hotel? Bingung mencari akomodasi terbaik? Serahkan kepada kami. Layanan pemesanan voucher hotel dari PT. Ganes Lancar Wisata Sukses memberikan Anda pilihan hotel terbaik dengan harga kompetitif.',
  },
  {
    icon: ShieldCheck,
    title: 'LAYANAN DOKUMEN/VISA',
    description: 'Kerumitan dan kebingungan pengurusan VISA tak perlu lagi Anda alami. PT. Ganes Lancar Wisata Sukses memberikan dukungan pengurusan dokumen perjalanan. Rencana wisata Anda ke luar negeri jadi kian mudah.',
  },
  {
    icon: CalendarDays,
    title: 'RESERVASI',
    description: 'Kami juga melayani reservasi yang mencakup penjualan paket pelayaran, kamar hotel, sewa bus, serta penyewaan mobil.',
  },
]

function OtherServicesSection() {
  return (
    <section className="bg-[#f8f9fa] px-6 py-12 md:px-18 md:py-16" id="other-services" aria-labelledby="other-services-title">
      <div className="mx-auto max-w-[80rem]">
        <div className="mx-auto max-w-2xl text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf4ff] px-3 py-1.5 text-xs font-semibold text-[#253044]">
            <Sparkles size={13} className="text-secondary" />
            Layanan Tambahan
          </span>
          <h2
            className="mt-3 text-[clamp(1.35rem,2.2vw,1.8rem)] leading-tight font-bold tracking-[-0.035em] text-[#101624]"
            id="other-services-title"
          >
            LAYANAN LAIN DARI KAMI
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherServices.map((service, index) => {
            const Icon = service.icon

            return (
              <article
                className="rounded-2xl border border-[#e1e6eb] bg-white p-5 shadow-[0_8px_24px_rgba(42,57,78,0.06)] transition-transform hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 60}
                key={service.title}
              >
                <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon size={21} strokeWidth={1.8} />
                </span>
                <h3 className="mt-4 text-sm font-black tracking-[-0.02em] text-[#172433]">{service.title}</h3>
                <p className="mt-2 text-xs leading-6 text-[#6f7987]">{service.description}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const galleryItems = [
  { src: galleryImage1, type: 'image', alt: 'Pemandangan perjalanan wisata' },
  { src: galleryImage2, type: 'image', alt: 'Momen liburan bersama traveler' },
  { src: galleryImage3, type: 'image', alt: 'Destinasi wisata pilihan' },
  { src: galleryVideo4, type: 'video', alt: 'Video suasana perjalanan wisata' },
  { src: galleryVideo5, type: 'video', alt: 'Video pengalaman liburan traveler' },
  { src: galleryVideo6, type: 'video', alt: 'Video pemandangan destinasi' },
  { src: galleryVideo7, type: 'video', alt: 'Video momen perjalanan' },
  { src: galleryVideo8, type: 'video', alt: 'Video aktivitas wisata' },
  { src: galleryVideo9, type: 'video', alt: 'Video cerita perjalanan' },
]

function GalleryCarouselSection() {
  const renderMedia = (item, index) => {
    const mediaClass = 'h-full w-full object-cover transition-transform duration-700 group-hover:scale-105'

    if (item.type === 'video') {
      return (
        <video
          className={mediaClass}
          src={item.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={item.alt}
        />
      )
    }

    return <img className={mediaClass} src={item.src} alt={item.alt} loading={index < 3 ? 'eager' : 'lazy'} />
  }

  const renderTrack = (items, direction) => (
    <div className="gallery-marquee-viewport">
      <div className={`gallery-marquee-track gallery-marquee-track-${direction}`}>
        {[...items, ...items].map((item, index) => (
          <div
            className="group relative h-36 w-[13rem] shrink-0 overflow-hidden rounded-2xl border border-white/70 bg-[#dfe8ee] shadow-[0_10px_24px_rgba(31,48,70,0.12)] sm:h-44 sm:w-[17rem] lg:h-52 lg:w-[20rem]"
            aria-hidden={index >= items.length}
            key={`${direction}-${item.src}-${index}`}
          >
            {renderMedia(item, index)}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07182d]/25 via-transparent to-transparent opacity-70" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <section className="overflow-hidden bg-white px-6 py-12 md:px-18 md:py-16" id="gallery" aria-labelledby="gallery-title">
      <div className="mx-auto max-w-[80rem]">
        <div className="mx-auto mb-8 max-w-2xl text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff7dc] px-3 py-1.5 text-xs font-semibold text-[#253044]">
            <Camera size={13} className="text-secondary" />
            Galeri Perjalanan
          </span>
          <h2
            className="mt-3 text-[clamp(1.35rem,2.2vw,1.8rem)] leading-tight font-bold tracking-[-0.035em] text-[#101624]"
            id="gallery-title"
          >
            Cerita dari Setiap Perjalanan
          </h2>
          <p className="mt-1.5 text-sm text-[#7a8391]">
            Lihat kembali momen seru dan destinasi indah yang telah kami kunjungi bersama traveler.
          </p>
        </div>

        <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
          {renderTrack(galleryItems, 'forward')}
          {renderTrack([...galleryItems].reverse(), 'reverse')}
        </div>
      </div>
    </section>
  )
}

function GoogleBusinessSection() {
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Jln%20nuansa%20II%20no%2C%202a%2C%20Taman%20griya%20jimbaran%20bali%2C%2080361'

  return (
    <section className="bg-white px-6 py-10 md:px-18" id="google-profile">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-4 flex items-center gap-3" data-aos="fade-up">
          <span className="grid size-8 place-items-center rounded-full bg-[#f1f3f4] text-lg font-black">
            <span className="bg-[conic-gradient(from_-35deg,#4285f4_0_25%,#34a853_0_50%,#fbbc05_0_75%,#ea4335_0)] bg-clip-text text-transparent">
              G
            </span>
          </span>
          <div className="leading-tight">
            <h2 className="text-sm font-bold text-[#17191d]">Profil Google Bisnis</h2>
            <p className="mt-0.5 text-[0.66rem] text-[#7a8290]">Informasi resmi &amp; ulasan dari Google</p>
          </div>
        </div>

        <article className="rounded-xl border border-[#dfe3e8] px-4 py-4 sm:px-5" data-aos="fade-up" data-aos-delay="80">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-base font-bold text-white">
              H
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#111319]">PT. Ganes Lancar Wisata Sukses</h3>
              <p className="mt-0.5 text-[0.67rem] text-[#717987]">Travel agency</p>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <strong className="text-xs font-bold text-[#12151b]">5.0</strong>
                <RatingStars size={13} />
                <span className="text-[0.67rem] text-[#747c89]">(42 ulasan)</span>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <a
                className="inline-flex h-8 items-center gap-2 rounded-lg bg-primary px-3.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-secondary"
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation size={15} /> Rute
              </a>
              <a
                className="inline-flex h-8 items-center gap-2 rounded-lg border border-[#dfe3e8] bg-white px-3.5 text-xs font-medium text-[#16191f] shadow-sm transition-colors hover:bg-[#f7f9fb]"
                href="#top"
              >
                <Globe2 size={15} /> Website
              </a>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#e1e4e8] pt-3 text-[0.66rem] text-[#28303c]">
            <span className="inline-flex items-start gap-2">
              <MapPin className="mt-px shrink-0 text-secondary" size={14} />
              Jln nuansa II no, 2a, Taman griya jimbaran bali, 80361
            </span>
            <span className="inline-flex items-center gap-2 whitespace-nowrap">
              <Clock3 className="text-secondary" size={14} /> Rabu · 9AM–5PM
            </span>
            <a className="inline-flex items-center gap-2 whitespace-nowrap hover:text-secondary" href="tel:+6281330663930">
              <Phone className="text-secondary" size={14} /> +62 813-3066-3930
            </a>
          </div>
        </article>

        <div className="mt-4 mb-2.5 flex items-center justify-between gap-4" data-aos="fade-up">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-bold text-[#14171c]">Ulasan Google</h3>
            <span className="rounded-full bg-[#fff1d9] px-2 py-1 text-[0.65rem] font-bold text-[#c97800]">
              5.0 ★
            </span>
            <span className="text-[0.66rem] text-[#7a8290]">42 ulasan</span>
          </div>
          <a
            className="inline-flex shrink-0 items-center gap-1 text-[0.68rem] font-medium text-secondary hover:text-secondary"
            href={googleMapsUrl}
            target="_blank"
            rel="noreferrer"
          >
            Lihat semua <ExternalLink size={11} />
          </a>
        </div>

        <div className="overflow-hidden" aria-label="Carousel ulasan Google">
          <div className="google-review-track flex w-max">
            {[0, 1].map((groupIndex) => (
              <div
                className="flex gap-4 pr-4"
                aria-hidden={groupIndex === 1 ? 'true' : undefined}
                key={groupIndex}
              >
                {googleReviews.map((review) => (
                  <GoogleReviewCard review={review} key={`${groupIndex}-${review.name}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function GoogleReviewCard({ review }) {
  return (
    <article className="w-[18rem] shrink-0 rounded-xl border border-[#dfe3e8] bg-white p-3 sm:w-[19rem] lg:w-[19.5rem]" data-aos="fade-up">
      <div className="flex items-center gap-2.5">
        <img className="size-7 rounded-full object-cover" src={review.avatar} alt={review.name} />
        <div className="min-w-0 flex-1">
          <strong className="block truncate text-[0.7rem] font-bold text-[#181b20]">{review.name}</strong>
          <div className="mt-0.5 flex items-center gap-1.5">
            <RatingStars size={12} />
            <span className="text-[0.58rem] text-[#89909d]">{review.date}</span>
          </div>
        </div>
      </div>
      <Quote className="mt-2 text-secondary/15" size={16} fill="currentColor" strokeWidth={0} />
      <p className="mt-1 line-clamp-3 text-[0.64rem] leading-[1.45] text-[#697180]">{review.review}</p>
    </article>
  )
}

function EventPromoSection() {
  return (
    <section className="bg-[#f8f9fa] px-6 py-10 md:px-18" id="event-promo" aria-labelledby="event-promo-title">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-5 flex items-end justify-between gap-4" data-aos="fade-up">
          <div>
            <p className="text-xs font-bold text-primary">Event &amp; Promo</p>
            <h2 className="mt-1.5 text-2xl font-black tracking-[-0.04em] text-[#172433]" id="event-promo-title">Jangan Lewatkan Event Terbaru</h2>
            <p className="mt-1 text-sm text-[#7a8391]">Penawaran khusus dan agenda perjalanan pilihan untuk Anda.</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {eventPromoData.map((promo) => (
            <article className="overflow-hidden rounded-2xl border border-[#dfe3e8] bg-white shadow-[0_10px_28px_rgba(42,57,78,0.08)]" data-aos="fade-up" key={promo.title}>
              <img className="h-48 w-full object-cover" src={promo.image} alt={`Poster ${promo.title}`} />
              <div className="p-5">
                <span className="w-fit rounded-full bg-secondary/15 px-3 py-1.5 text-[0.62rem] font-bold text-secondary">{promo.badge}</span>
                <h3 className="mt-3 text-lg font-black leading-tight text-[#172433]">{promo.title}</h3>
                <p className="mt-2 min-h-12 text-xs leading-5 text-[#687382]">{promo.description}</p>
                <strong className="mt-4 block text-sm font-black text-primary">{promo.offer}</strong>
                <a className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#f5c542] px-4 text-xs font-bold text-[#172433] transition-colors hover:bg-[#d9a900]" href={`https://wa.me/6281330663930?text=${encodeURIComponent(`Halo PT. Ganes Lancar Wisata Sukses, saya tertarik dengan ${promo.title}.`)}`} target="_blank" rel="noreferrer">
                  <MessageCircle size={15} /> Info Selengkapnya
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function SiteFooter({ onNavigate }) {
  const footerSectionLinks = [
    { label: 'Paket Tour', href: '/#tour-packages', page: 'home', section: 'tour-packages' },
    { label: 'List Tour', href: '/#tour-list', page: 'home', section: 'tour-list' },
    { label: 'Ulasan Traveler', href: '/#google-profile', page: 'home', section: 'google-profile' },
  ]

  const getFooterLink = (label) =>
    navLinks.find((link) => link.label === label) ??
    wisataCategories.find((category) => category.shortTitle === label) ??
    serviceLinks.find((service) => service.shortTitle === label) ??
    footerSectionLinks.find((link) => link.label === label) ??
    navLinks[0]

  return (
    <footer className="bg-[#07182d] px-6 py-14 text-[#8fa6c3] md:px-18 md:py-16" id="site-footer">
      <div className="mx-auto grid max-w-[80rem] gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[1.45fr_repeat(5,minmax(0,1fr))]">
        <div className="max-w-[18rem]" data-aos="fade-up">
          <a
            className="inline-flex items-baseline"
            href="/"
            onClick={(event) => onNavigate(event, navLinks[0])}
          >
            <img src={logoImage} alt="PT. Ganes Lancar" className="h-10 w-auto" />
          </a>
          <p className="mt-3 text-[0.78rem] leading-[1.55] text-[#9ab0cb]">
            Partner perjalanan tepercaya untuk umroh, wisata Muslim, dan pengalaman ibadah Anda.
          </p>

          <div className="mt-5 flex gap-3">
            <a
              className="grid size-9 place-items-center rounded-xl bg-[#1b2c43] text-white transition-colors hover:bg-[#263c59]"
              href="https://instagram.com/glws.tourtravel"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram PT. Ganes Lancar"
            >
              <Camera size={15} />
            </a>
            <a
              className="grid size-9 place-items-center rounded-xl bg-[#1b2c43] text-white transition-colors hover:bg-[#263c59]"
              href="https://tiktok.com/@glwstoutravel"
              target="_blank"
              rel="noreferrer"
              aria-label="Tiktok PT. Ganes Lancar"
            >
              <Video size={15} />
            </a>
          </div>

          <div className="mt-5 grid gap-2.5 text-[0.68rem]">
            <a className="flex items-center gap-2.5 hover:text-white" href="https://wa.me/6281330663930" target="_blank" rel="noreferrer">
              <MessageCircle size={13} strokeWidth={1.7} /> +62 813-3066-3930
            </a>
            <a className="flex items-center gap-2.5 hover:text-white" href="mailto:ganeslancarwisatasukses@gmail.com">
              <Mail size={13} strokeWidth={1.7} /> ganeslancarwisatasukses@gmail.com
            </a>
            <p className="flex items-center gap-2.5">
              <MapPin size={13} strokeWidth={1.7} /> Bandung, Indonesia
            </p>
            <p className="flex items-center gap-2.5">
              <Clock3 size={13} strokeWidth={1.7} /> Sen - Jum, 09:00 - 18:00 WIB
            </p>
          </div>
        </div>

        {footerColumns.map((column) => (
          <FooterColumn column={column} getFooterLink={getFooterLink} onNavigate={onNavigate} key={column.title} />
        ))}
      </div>
    </footer>
  )
}

function RatingStars({ size = 14 }) {
  return (
    <span className="inline-flex gap-0.5 text-[#ffb311]" aria-label="Rating 5 dari 5">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star size={size} fill="currentColor" strokeWidth={0} key={index} aria-hidden="true" />
      ))}
    </span>
  )
}

function FooterColumn({ column, getFooterLink, onNavigate }) {
  return (
    <div data-aos="fade-up">
      <h3 className="mb-5 text-[0.7rem] font-bold text-white uppercase">{column.title}</h3>
      {column.links.map((link) => {
        const footerLink = getFooterLink(link)

        return (
          <a
            className="mb-3.5 block text-[0.78rem] text-[#8fa6c3] transition-colors hover:text-white"
            href={footerLink.href}
            key={link}
            onClick={(event) => onNavigate(event, footerLink)}
          >
            {link}
          </a>
        )
      })}
    </div>
  )
}

export default App

function CTASection() {
  return (
    <section className="px-6 py-10 md:px-18 pb-20">
      <div className="mx-auto max-w-[80rem]">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-secondary/80 py-16 lg:py-24 shadow-2xl shadow-primary/20">
          {/* Gelembung (Bubbles) */}
          <div className="absolute -bottom-40 left-1/4 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-[2px]" />
          <div className="absolute -top-32 -right-16 w-96 h-96 bg-white/10 rounded-full blur-[2px]" />
          <div className="absolute top-10 -left-20 w-64 h-64 bg-white/5 rounded-full blur-[2px]" />
          <div className="absolute bottom-20 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-[2px]" />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10" data-aos="zoom-in">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
              Siap Merencanakan Liburan dan Perjalanan Impian Anda?
            </h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto">
              Konsultasikan rencana perjalanan Anda secara gratis dan dapatkan rekomendasi paket wisata yang paling sesuai dengan kebutuhan Anda.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-white text-primary text-sm font-semibold transition-all duration-300 hover:scale-105 hover:bg-gray-50 active:scale-95 shadow-xl shadow-black/10 w-full sm:w-auto group"
              >
                Konsultasi Gratis
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a
                href="https://wa.me/6281330663930"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-[#25d366] hover:bg-[#20bd5a] text-white text-sm font-semibold transition-all duration-300 hover:scale-105 shadow-xl shadow-black/10 active:scale-95 w-full sm:w-auto"
              >
                <MessageCircle size={18} /> Chat via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  return (
    <section className="scroll-mt-20 px-6 py-12 md:px-18 pb-20 bg-[#f8f9fa]" id="contact">
      <div className="mx-auto max-w-[80rem]">
        <div className="mb-10 text-center" data-aos="fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eaf4ff] px-3 py-1.5 text-xs font-semibold text-[#253044]">
            <Sparkles size={13} className="text-secondary" />
            Kontak Kami
          </span>
          <h2 className="mt-3 text-[clamp(1.35rem,2.2vw,1.8rem)] leading-tight font-bold tracking-[-0.035em] text-[#101624]">
            Hubungi Kami
          </h2>
          <p className="mt-1.5 text-sm text-[#7a8391]">
            Ada pertanyaan atau butuh bantuan? Tim kami siap melayani Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e1e6eb]" data-aos="fade-up" data-aos-delay="100">

          {/* Kolom Kiri: Informasi Kontak */}
          <div className="flex flex-col justify-center space-y-6 overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172433]">Alamat Kantor</h3>
                <p className="mt-1 text-[#667386] leading-relaxed">
                  Jln nuansa II no, 2a<br />
                  Taman griya jimbaran bali<br />
                  80361
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#172433]">Kontak Admin (WhatsApp)</h3>
                <a href="https://wa.me/6281330663930" target="_blank" rel="noreferrer" className="mt-1 block text-primary hover:underline font-medium">
                  +62 813-3066-3930
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[#172433]">Email</h3>
                <a href="mailto:ganeslancarwisatasukses@gmail.com" className="mt-1 block text-[#667386] hover:text-primary transition-colors break-words">
                  ganeslancarwisatasukses@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <Globe2 size={20} />
              </div>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-[#172433]">Sosial Media</h3>
                <div className="mt-2 flex items-center gap-4">
                  <a href="https://instagram.com/glws.tourtravel" target="_blank" rel="noreferrer" className="text-[#667386] hover:text-[#df3aa6] transition-colors font-medium text-sm flex items-center gap-1.5 truncate">
                    Instagram: @glws.tourtravel
                  </a>
                </div>
                <div className="mt-1 flex items-center gap-4">
                  <a href="https://tiktok.com/@glwstoutravel" target="_blank" rel="noreferrer" className="text-[#667386] hover:text-black transition-colors font-medium text-sm flex items-center gap-1.5 truncate">
                    Tiktok: @glwstoutravel
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Google Maps Embed */}
          <div className="h-[300px] lg:h-[400px] w-full rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 relative">
            <iframe
              src="https://maps.google.com/maps?q=Jln%20nuansa%20II%20no%2C%202a%2C%20Taman%20griya%20jimbaran%20bali%2C%2080361&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi PT. Ganes Lancar"
            ></iframe>
          </div>

        </div>
      </div>
    </section>
  )
}


function SearchPage({ query, onNavigate }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [query]);

  const searchTerm = query ? query.toLowerCase() : '';

  // Aggregate data from tourPackages (array), serviceData.services (array), articleData (object with .articles)
  const tourMatches = tourPackages.filter(p =>
    p.title.toLowerCase().includes(searchTerm) ||
    (p.description && p.description.toLowerCase().includes(searchTerm)) ||
    p.location.toLowerCase().includes(searchTerm) ||
    (p.category && p.category.toLowerCase().includes(searchTerm))
  );

  const serviceMatches = serviceData.services.filter(s =>
    s.title.toLowerCase().includes(searchTerm) ||
    s.summary.toLowerCase().includes(searchTerm)
  );

  const articles = articleData.articles || [];
  const articleMatches = articles.filter(a =>
    (a.title && a.title.toLowerCase().includes(searchTerm)) ||
    (a.excerpt && a.excerpt.toLowerCase().includes(searchTerm)) ||
    (a.category && a.category.toLowerCase().includes(searchTerm))
  );

  const totalResults = tourMatches.length + serviceMatches.length + articleMatches.length;

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-32 pb-12 px-6 md:px-18">
        <div className="max-w-[80rem] mx-auto">
          <h1 className="text-3xl font-black text-[#172433] mb-2">
            Hasil Pencarian untuk "{query}"
          </h1>
          <p className="text-[#667386] mb-6">
            Menemukan {totalResults} hasil yang relevan.
          </p>

          {/* Search bar on results page */}
          <div className="mb-10 max-w-xl">
            <div className="flex gap-2">
              <label className="flex flex-1 min-h-12 items-center gap-3 rounded-xl bg-[#f4f5f7] px-4 text-[#707a88] border border-[#e1e6eb]">
                <Search size={18} className="shrink-0 text-[#93a1ae]" />
                <input
                  className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-[#a7b0bb] text-[#172433]"
                  type="search"
                  placeholder="Cari ulang..."
                  defaultValue={query}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const url = '/search?q=' + encodeURIComponent(e.target.value.trim());
                      window.history.pushState({}, '', url);
                      onNavigate(e, { page: 'search', query: e.target.value.trim(), href: url });
                    }
                  }}
                />
              </label>
            </div>
          </div>

          {tourMatches.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#172433] mb-6 border-b pb-4">Paket Wisata & Destinasi</h2>
              <div className="search-results-grid grid gap-6">
                {tourMatches.map((tour, index) => (
                  <TourPackageCard key={tour.slug ?? index} tourPackage={tour} onNavigate={onNavigate} layout="grid" />
                ))}
              </div>
            </div>
          )}

          {serviceMatches.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#172433] mb-6 border-b pb-4">Layanan (Hotel, Visa, dll)</h2>
              <div className="search-results-grid grid gap-6">
                {serviceMatches.map((service, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer rounded-2xl bg-white p-5 shadow-sm border border-[#e1e6eb] transition-all hover:-translate-y-1 hover:shadow-md"
                    onClick={(e) => onNavigate(e, { page: 'service', slug: service.slug, href: `/layanan/${service.slug}` })}
                  >
                    <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
                      <img src={service.heroImage} alt={service.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="text-lg font-bold text-[#172433]">{service.title}</h3>
                    <p className="mt-2 text-sm text-[#667386] line-clamp-2">{service.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {articleMatches.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#172433] mb-6 border-b pb-4">Artikel (Kuliner, Panduan, dll)</h2>
              <div className="search-results-grid grid gap-6">
                {articleMatches.map((article, index) => (
                  <ArticleListCard key={index} article={article} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          )}

          {totalResults === 0 && (
            <div className="py-20 text-center">
              <Search className="mx-auto h-16 w-16 text-[#e1e6eb] mb-4" />
              <h3 className="text-xl font-bold text-[#172433]">Tidak ada hasil yang ditemukan</h3>
              <p className="text-[#667386] mt-2">Coba gunakan kata kunci lain untuk pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function TourDetailPage({ slug, onNavigate }) {
  const detailTabs = [
    ['overview', 'Overview'],
  ]
  const [activeDetailTab, setActiveDetailTab] = useState('overview')
  const [isShareOpen, setIsShareOpen] = useState(false)
  
  const tourJourney = tourJourneys.find((item) => item.slug === slug)

  useEffect(() => {
    const updateActiveTab = () => {
      const scrollPosition = window.scrollY + 180
      let currentSection = detailTabs[0][0]
      for (const [id] of detailTabs) {
        const element = document.getElementById(id)
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = id
        }
      }
      setActiveDetailTab(currentSection)
    }

    window.addEventListener('scroll', updateActiveTab)
    return () => window.removeEventListener('scroll', updateActiveTab)
  }, [])

  if (!tourJourney) {
    return <PageNotFound onNavigate={onNavigate} />
  }

  // URL Encode message for WhatsApp
  const tourWhatsAppUrl = getPackageWhatsAppUrl({
    title: tourJourney.title,
    category: 'List Tour',
    location: tourJourney.location,
    price: 'Hubungi Kami',
    duration: '-',
    departure: tourJourney.date || '-',
    capacity: tourJourney.travelers || '-'
  })

  const socialShareLinks = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}` },
    { label: 'Twitter', href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${tourJourney.title} - ${window.location.href}`)}` },
  ]

  return (
    <main className="min-h-screen bg-[#f6f8fa] pb-16 pt-24 md:pb-24">
      <div className="sticky top-16 z-30 flex overflow-x-auto border-b border-[#e9edf0] bg-white/95 px-6 pt-3 shadow-sm backdrop-blur-md md:top-20 md:px-8">
        <div className="mx-auto flex w-full max-w-[72rem] gap-6">
          {detailTabs.map(([id, label]) => (
            <a
              className={`whitespace-nowrap border-b-[2.5px] pb-3 text-[0.8rem] font-bold transition-colors ${activeDetailTab === id ? 'border-primary text-primary' : 'border-transparent text-[#7a8594] hover:border-[#ced4da] hover:text-[#424c58]'}`}
              href={`#${id}`}
              key={id}
              onClick={(e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
            >
              {label}
            </a>
          ))}
        </div>
      </div>

      <header className="mx-auto max-w-[72rem] px-6 pt-10 md:px-8" data-aos="fade-up">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-secondary">
              <MapPin size={14} /> <span>{tourJourney.location}</span>
            </div>
            <h1 className="mt-2 text-3xl font-black text-[#121820] sm:text-4xl">{tourJourney.title}</h1>
          </div>
        </div>
      </header>

      <div className="mx-auto mt-6 max-w-[72rem] px-6 md:px-8" data-aos="fade-up">
        <img className="aspect-[21/9] w-full rounded-2xl object-cover shadow-sm" src={tourJourney.image} alt={tourJourney.title} />
      </div>

      <div className="mx-auto grid max-w-[72rem] items-start gap-5 px-6 pt-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-7">
          <DetailSection icon={Package} title="Overview" id="overview">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
              <div className="rounded-lg bg-[#f2f5f7] px-3 py-4 text-center">
                <CalendarDays className="mx-auto text-secondary" size={18} />
                <span className="mt-2 block text-[0.65rem] text-[#7a8491]">Waktu Tour</span>
                <strong className="mt-1 block text-xs text-[#121820]">{tourJourney.date || '-'}</strong>
              </div>
              <div className="rounded-lg bg-[#f2f5f7] px-3 py-4 text-center">
                <Users className="mx-auto text-secondary" size={18} />
                <span className="mt-2 block text-[0.65rem] text-[#7a8491]">Kapasitas</span>
                <strong className="mt-1 block text-xs text-[#121820]">{tourJourney.travelers || '-'}</strong>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-bold mb-3 text-[#121820]">Atraksi/Destinasi:</h3>
              <ul className="list-disc pl-5 text-sm text-[#4a5568] space-y-1">
                {tourJourney.attractions.map(attr => (
                  <li key={attr}>{attr}</li>
                ))}
              </ul>
            </div>
          </DetailSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[9.25rem]" data-aos="fade-left">
          <section className="rounded-xl border border-[#dce2e7] bg-white p-5 shadow-[0_8px_25px_rgba(31,48,70,0.06)]">
            <span className="text-xs text-[#7c8694]">Harga</span>
            <strong className="mt-1 block text-2xl font-black text-[#121820]">Hubungi Kami</strong>
            <a
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold text-white shadow-[0_8px_18px_rgba(10,167,229,0.2)] transition-colors hover:bg-primary/90"
              href={tourWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> Tanya Tour
            </a>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dfe4e8] text-xs font-medium text-[#4e5866]" type="button">
                <Heart size={15} /> Wishlist
              </button>
              <div className="relative">
                <button
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#dfe4e8] text-xs font-medium text-[#4e5866] transition-colors hover:bg-[#f2f5f7]"
                  type="button"
                  aria-expanded={isShareOpen}
                  aria-controls="tour-share-menu"
                  onClick={() => setIsShareOpen((currentValue) => !currentValue)}
                >
                  <ExternalLink size={14} /> Bagikan
                </button>
                {isShareOpen && (
                  <div
                    className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-40 overflow-hidden rounded-lg border border-[#dce2e7] bg-white p-1.5 shadow-[0_12px_30px_rgba(31,48,70,0.15)]"
                    id="tour-share-menu"
                  >
                    {socialShareLinks.map((platform) => (
                      <a
                        className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-[#4e5866] transition-colors hover:bg-[#eef7fb] hover:text-primary"
                        href={platform.href}
                        key={platform.label}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => setIsShareOpen(false)}
                      >
                        {platform.label}
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  )
}

function TourJourneyDetailPage({ slug, onNavigate }) {
  const detailTabs = [
    ['overview', 'Overview'],
    ['gallery', 'Galeri'],
    ['facilities', 'Fasilitas'],
    ['destinations', 'Destinasi'],
    ['faq', 'FAQ'],
  ]
  const [activeDetailTab, setActiveDetailTab] = useState('overview')
  const [isShareOpen, setIsShareOpen] = useState(false)
  const tourJourney = tourJourneys.find((item) => item.slug === slug)

  useEffect(() => {
    const updateActiveTab = () => {
      const scrollPosition = window.scrollY + 180
      let currentSection = detailTabs[0][0]

      detailTabs.forEach(([id]) => {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top + window.scrollY <= scrollPosition) currentSection = id
      })

      setActiveDetailTab(currentSection)
    }

    updateActiveTab()
    window.addEventListener('scroll', updateActiveTab, { passive: true })
    return () => window.removeEventListener('scroll', updateActiveTab)
  }, [slug])

  if (!tourJourney) return <PageNotFound onNavigate={onNavigate} />

  const backLink = { page: 'home', section: 'tour-list', href: '/#tour-list' }
  const tourWhatsAppUrl = getPackageWhatsAppUrl({
    title: tourJourney.title,
    category: 'List Tour',
    location: tourJourney.location,
    price: tourJourney.priceSummary || 'Hubungi Kami',
    duration: '-',
    departure: tourJourney.date || '-',
    capacity: tourJourney.travelers || '-',
  })
  const shareUrl = encodeURIComponent(window.location.href)
  const socialShareLinks = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${tourJourney.title} - ${window.location.href}`)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${shareUrl}` },
  ]
  const faqData = [
    {
      question: 'Apa saja fasilitas yang sudah termasuk dalam tour ini?',
      answer: 'Fasilitas bervariasi bergantung pada tour yang dipilih. Umumnya mencakup transportasi, akomodasi, tiket wisata utama, dan konsumsi. Silakan baca bagian detail fasilitas pada informasi tour ini.',
    },
    {
      question: 'Apakah jadwal perjalanan tour bisa diubah?',
      answer: 'Untuk tour private, jadwal sangat fleksibel dan dapat diubah sesuai kesepakatan. Namun, untuk open trip, jadwal sudah tetap dan tidak bisa diubah.',
    },
    {
      question: 'Bagaimana sistem pembayarannya?',
      answer: 'Pembayaran dapat dilakukan secara bertahap. Uang muka (DP) minimal 30% dibayarkan saat pemesanan, dan pelunasan paling lambat 7 hari sebelum keberangkatan.',
    },
    {
      question: 'Apakah harga tour sudah termasuk tiket pesawat?',
      answer: 'Beberapa tour sudah all-in termasuk tiket pesawat, namun ada pula tour land (tanpa tiket pesawat). Cek ringkasan harga di bagian atas untuk informasi lebih jelas.',
    },
  ]

  return (
    <main className="min-h-screen bg-[#f3f5f7] pb-20">
      <header
        className="relative flex min-h-[27rem] items-end overflow-hidden bg-cover bg-center px-6 pt-32 pb-16 text-white md:px-18"
        style={{ backgroundImage: `url('${tourJourney.image}')` }}
      >
        <div className="absolute inset-0 bg-[#07182d]/62" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07182d]/90 via-transparent to-[#07182d]/20" />
        <div className="relative z-10 mx-auto w-full max-w-[72rem]" data-aos="fade-up">
          <a
            className="inline-flex items-center gap-2 text-xs font-semibold text-white/88 transition-colors hover:text-white"
            href={backLink.href}
            onClick={(event) => onNavigate(event, backLink)}
          >
            <ChevronLeft size={16} /> Kembali ke List Tour
          </a>
          <span className="mt-6 block w-8 rounded-full border-t-4 border-primary" />
          <p className="mt-6 text-xs font-bold tracking-[0.12em] text-secondary uppercase">List Tour</p>
          <h1 className="mt-2 max-w-[52rem] text-[clamp(2.15rem,5vw,4.25rem)] font-black leading-[1.02] tracking-[-0.045em]">
            {tourJourney.title}
          </h1>
          <p className="mt-4 inline-flex items-center gap-2 text-sm text-white/85">
            <MapPin size={16} className="text-primary" /> {tourJourney.location}
          </p>
        </div>
      </header>

      <nav className="sticky top-[4.5rem] z-30 border-b border-[#dce2e7] bg-white/95 px-6 backdrop-blur md:px-18" aria-label="Navigasi detail list tour">
        <div className="mx-auto flex max-w-[72rem] gap-2 overflow-x-auto py-3">
          {detailTabs.map(([id, label]) => (
            <a
              className={`shrink-0 rounded-full px-3.5 py-2 text-[0.7rem] font-semibold transition-colors ${activeDetailTab === id ? 'bg-primary text-white' : 'bg-[#f1f4f7] text-[#657080] hover:bg-secondary/15 hover:text-secondary'}`}
              href={`#${id}`}
              key={id}
              onClick={(event) => {
                event.preventDefault()
                setActiveDetailTab(id)
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mx-auto grid max-w-[72rem] items-start gap-5 px-6 pt-8 md:px-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 space-y-7">
          <DetailSection icon={Package} title="Ringkasan" id="overview">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {[
                [CalendarDays, 'Waktu Tour', tourJourney.date || '-'],
                [Users, 'Kapasitas', tourJourney.travelers || '-'],
                [Package, 'Ringkasan Harga', tourJourney.priceSummary || 'Hubungi Kami'],
              ].map(([Icon, label, value]) => (
                <div className="rounded-lg bg-[#f2f5f7] px-3 py-4 text-center" key={label}>
                  <Icon className="mx-auto text-secondary" size={18} />
                  <span className="mt-2 block text-[0.65rem] text-[#7a8491]">{label}</span>
                  <strong className="mt-1 block text-xs text-[#121820]">{value}</strong>
                </div>
              ))}
            </div>
            <p className="mt-5 text-sm leading-7 text-[#4e5866]">
              Nikmati perjalanan bersama PT. Ganes Lancar Wisata Sukses menuju {tourJourney.location}. Temukan pengalaman terbaik di setiap destinasi yang telah kami siapkan.
            </p>
          </DetailSection>

          <DetailSection icon={Camera} title="Galeri Foto" id="gallery">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {(tourJourney.gallery.length ? tourJourney.gallery : [tourJourney.image]).map((image, index) => (
                <img
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                  src={image}
                  alt={`${tourJourney.title} galeri ${index + 1}`}
                  loading="lazy"
                  key={`${image}-${index}`}
                />
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={ShieldCheck} title="Fasilitas" id="facilities">
            <div className="grid gap-3 sm:grid-cols-2">
              {(tourJourney.facilities.length ? tourJourney.facilities : ['Transportasi selama perjalanan', 'Akomodasi sesuai itinerary', 'Tiket wisata utama', 'Pendampingan tour leader']).map((facility, index) => (
                <div className="flex items-center gap-3 rounded-lg border border-[#e3e8ec] bg-[#f8fafb] px-4 py-3 text-sm text-[#4e5866]" key={`${facility}-${index}`}>
                  <ShieldCheck className="shrink-0 text-secondary" size={17} />
                  {facility}
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={MapPin} title="Destinasi" id="destinations">
            <div className="grid gap-3 sm:grid-cols-2">
              {(tourJourney.attractions.length ? tourJourney.attractions : ['Destinasi pilihan sesuai itinerary']).map((attraction, index) => (
                <div className="flex items-center gap-3 rounded-lg border border-[#e3e8ec] bg-[#f8fafb] px-4 py-3 text-sm text-[#4e5866]" key={`${attraction}-${index}`}>
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{index + 1}</span>
                  {attraction}
                </div>
              ))}
            </div>
          </DetailSection>

          <DetailSection icon={MessageCircle} title="Pertanyaan Umum (FAQ)" id="faq">
            <div className="space-y-3">
              {faqData.map((item, index) => (
                <PackageFaqItem item={item} index={index} key={item.question} />
              ))}
            </div>
          </DetailSection>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-[9.25rem]" data-aos="fade-left">
          <section className="rounded-xl border border-[#dce2e7] bg-white p-5 shadow-[0_8px_25px_rgba(31,48,70,0.06)]">
            <span className="text-xs text-[#7c8694]">Harga</span>
            <strong className="mt-1 block text-2xl font-black text-[#121820]">{tourJourney.priceSummary || 'Hubungi Kami'}</strong>
            <a
              className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary text-xs font-bold text-white shadow-[0_8px_18px_rgba(10,167,229,0.2)] transition-colors hover:bg-primary/90"
              href={tourWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> Tanya Tour
            </a>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#dfe4e8] text-xs font-medium text-[#4e5866]" type="button">
                <Heart size={15} /> Wishlist
              </button>
              <div className="relative">
                <button
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-[#dfe4e8] text-xs font-medium text-[#4e5866] transition-colors hover:border-secondary hover:text-secondary"
                  type="button"
                  aria-expanded={isShareOpen}
                  aria-controls="tour-share-menu"
                  onClick={() => setIsShareOpen((currentValue) => !currentValue)}
                >
                  <ExternalLink size={14} /> Bagikan
                </button>
                {isShareOpen && (
                  <div className="absolute top-[calc(100%+0.5rem)] right-0 z-20 w-40 overflow-hidden rounded-lg border border-[#dce2e7] bg-white p-1.5 shadow-[0_12px_30px_rgba(31,48,70,0.15)]" id="tour-share-menu">
                    {socialShareLinks.map((platform) => (
                      <a className="flex items-center justify-between rounded-md px-3 py-2 text-xs font-medium text-[#4e5866] transition-colors hover:bg-[#eef7fb] hover:text-primary" href={platform.href} key={platform.label} target="_blank" rel="noreferrer" onClick={() => setIsShareOpen(false)}>
                        {platform.label}
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
          <section className="rounded-xl border border-[#dce2e7] bg-white p-5 text-xs text-[#6f7987]">
            <p className="flex items-center gap-2"><ShieldCheck className="text-[#10b981]" size={15} /> Legalitas usaha terverifikasi</p>
            <p className="mt-3 flex items-center gap-2"><Star className="text-[#ffb311]" size={15} fill="currentColor" /> Pendampingan profesional</p>
            <p className="mt-3 flex items-center gap-2"><Users className="text-secondary" size={15} /> Siap melayani perjalanan Anda</p>
          </section>
        </aside>
      </div>
    </main>
  )
}
