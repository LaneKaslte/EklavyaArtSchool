import { useState, useEffect, useRef } from 'react'
import { getAllGalleryImages } from '../api/client'
import ImageGrid from '../components/ImageGrid'
import { PageHeader } from '../components/Theme'

const PAGE_SIZE = 4

// Page numbers to show, with '…' gaps for long ranges (e.g. 1 … 4 5 6 … 12)
function getPageItems(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items = [1]
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  if (start > 2) items.push('…')
  for (let p = start; p <= end; p++) items.push(p)
  if (end < total - 1) items.push('…')
  items.push(total)
  return items
}

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const topRef = useRef(null)

  useEffect(() => {
    getAllGalleryImages()
      .then(res => setImages(res.data.images))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE))
  const startIdx = (page - 1) * PAGE_SIZE
  const pageImages = images.slice(startIdx, startIdx + PAGE_SIZE)

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return
    setPage(p)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navBtn =
    'px-4 py-2 rounded-full font-bold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed'

  return (
    <div className="min-h-screen bg-paper">
      <PageHeader
        eyebrow="Our collection"
        title="Art Gallery"
        subtitle="Explore beautiful artwork created by our Teacher — from first sketches to finished paintings."
      />

      {/* Gallery Content */}
      <div ref={topRef} className="container mx-auto px-4 py-12 scroll-mt-24">
        {!loading && images.length > 0 && (
          <p className="text-ink/60 mb-8">
            Showing <span className="font-semibold text-ink">{startIdx + 1}–{startIdx + pageImages.length}</span> of{' '}
            <span className="font-semibold text-ink">{images.length}</span> artworks
          </p>
        )}

        <ImageGrid images={pageImages} loading={loading} skeletonCount={PAGE_SIZE} />

        {!loading && totalPages > 1 && (
          <nav aria-label="Gallery pagination" className="flex flex-wrap justify-center items-center gap-2 mt-10">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className={`${navBtn} bg-white border border-paint-marigold/40 text-ink hover:border-paint-coral hover:text-paint-coral`}>
              ← Prev
            </button>

            {getPageItems(page, totalPages).map((item, i) =>
              item === '…' ? (
                <span key={`gap-${i}`} className="px-2 text-ink/40">…</span>
              ) : (
                <button
                  type="button"
                  key={item}
                  onClick={() => goToPage(item)}
                  aria-current={item === page ? 'page' : undefined}
                  className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                    item === page
                      ? 'bg-ink text-paper shadow-sm ring-2 ring-paint-marigold/60'
                      : 'bg-white border border-paint-marigold/40 text-ink hover:border-paint-coral hover:text-paint-coral'
                  }`}>
                  {item}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className={`${navBtn} bg-white border border-paint-marigold/40 text-ink hover:border-paint-coral hover:text-paint-coral`}>
              Next →
            </button>
          </nav>
        )}
      </div>
    </div>
  )
}
