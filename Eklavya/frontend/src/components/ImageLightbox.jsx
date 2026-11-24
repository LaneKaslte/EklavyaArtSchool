import { useState, useEffect, useRef, useCallback } from 'react'

const MIN_ZOOM = 1
const MAX_ZOOM = 5
const STEP = 0.5

const clamp = (v, min, max) => Math.min(Math.max(v, min), max)

export default function ImageLightbox({ images, index, onClose, onChange }) {
  const [zoom, setZoom] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)
  const pinchStart = useRef(null)

  const img = images[index]
  const hasMany = images.length > 1

  const reset = useCallback(() => {
    setZoom(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const setZoomClamped = useCallback((next) => {
    const z = clamp(next, MIN_ZOOM, MAX_ZOOM)
    setZoom(z)
    if (z === 1) setOffset({ x: 0, y: 0 })
  }, [])

  const go = useCallback((dir) => {
    if (!hasMany) return
    reset()
    onChange((index + dir + images.length) % images.length)
  }, [hasMany, index, images.length, onChange, reset])

  // Keyboard controls + lock page scroll while open
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === '+' || e.key === '=') setZoomClamped(zoom + STEP)
      else if (e.key === '-') setZoomClamped(zoom - STEP)
      else if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [go, onClose, reset, setZoomClamped, zoom])

  const onWheel = (e) => {
    setZoomClamped(zoom + (e.deltaY < 0 ? 0.25 : -0.25))
  }

  // Mouse drag to pan when zoomed
  const onPointerDown = (e) => {
    if (zoom === 1 || e.pointerType === 'touch') return
    setDragging(true)
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging || !dragStart.current) return
    setOffset({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }
  const onPointerUp = () => {
    setDragging(false)
    dragStart.current = null
  }

  // Touch: pinch to zoom, one-finger drag to pan (or swipe to change image)
  const dist = (t) => Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY)
  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      pinchStart.current = { d: dist(e.touches), zoom }
    } else if (e.touches.length === 1) {
      const t = e.touches[0]
      dragStart.current = { x: t.clientX - offset.x, y: t.clientY - offset.y, sx: t.clientX }
    }
  }
  const onTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStart.current) {
      setZoomClamped(pinchStart.current.zoom * (dist(e.touches) / pinchStart.current.d))
    } else if (e.touches.length === 1 && dragStart.current && zoom > 1) {
      const t = e.touches[0]
      setOffset({ x: t.clientX - dragStart.current.x, y: t.clientY - dragStart.current.y })
    }
  }
  const onTouchEnd = (e) => {
    if (dragStart.current && zoom === 1 && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - dragStart.current.sx
      if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1)
    }
    pinchStart.current = null
    dragStart.current = null
  }

  const onDoubleClick = () => (zoom > 1 ? reset() : setZoomClamped(2.5))

  if (!img) return null

  const btn = 'w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed'

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={img.name}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
        <p className="font-bold truncate min-w-0">
          {img.name}
          {hasMany && <span className="ml-2 text-white/50 font-normal text-sm">{index + 1} / {images.length}</span>}
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button className={btn} onClick={() => setZoomClamped(zoom - STEP)} disabled={zoom <= MIN_ZOOM} aria-label="Zoom out" title="Zoom out (-)">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M20 12H4" /></svg>
          </button>
          <span className="w-12 text-center text-sm tabular-nums hidden sm:inline">{Math.round(zoom * 100)}%</span>
          <button className={btn} onClick={() => setZoomClamped(zoom + STEP)} disabled={zoom >= MAX_ZOOM} aria-label="Zoom in" title="Zoom in (+)">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
          <button className={btn} onClick={reset} disabled={zoom === 1} aria-label="Reset zoom" title="Reset (0)">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" /></svg>
          </button>
          <a className={btn} href={img.url} target="_blank" rel="noopener noreferrer" aria-label="Open original in new tab" title="Open original">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          <button className={btn} onClick={onClose} aria-label="Close" title="Close (Esc)">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Image stage */}
      <div
        className="relative flex-1 overflow-hidden flex items-center justify-center select-none touch-none"
        onClick={(e) => { if (e.target === e.currentTarget && zoom === 1) onClose() }}
        onWheel={onWheel}
      >
        <img
          src={img.url}
          alt={img.name}
          draggable={false}
          onDoubleClick={onDoubleClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          className={`max-w-[95vw] max-h-[calc(100vh-5rem)] object-contain ${dragging ? '' : 'transition-transform duration-200'} ${zoom > 1 ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'}`}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})` }}
        />

        {hasMany && (
          <>
            <button className={`${btn} absolute left-3 top-1/2 -translate-y-1/2`} onClick={() => go(-1)} aria-label="Previous image">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className={`${btn} absolute right-3 top-1/2 -translate-y-1/2`} onClick={() => go(1)} aria-label="Next image">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
