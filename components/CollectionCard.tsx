'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useQueryClient } from '@tanstack/react-query'
import type { CollectionItem } from '@/lib/db/queries'

const TMDB_IMG_BASE = 'https://image.tmdb.org/t/p/w185'

const FORMAT_COLORS: Record<string, string> = {
  '4K':      'bg-blue-500/20 text-blue-300 border-blue-500/40',
  'Blu-ray': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  'DVD':     'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
  'VHS':     'bg-purple-500/20 text-purple-300 border-purple-500/40',
  'Digital': 'bg-green-500/20 text-green-300 border-green-500/40',
}

export function CollectionCard({ item }: { item: CollectionItem }) {
  const [hovered, setHovered] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const queryClient = useQueryClient()

  const posterUrl = item.poster_path ? `${TMDB_IMG_BASE}${item.poster_path}` : null
  const formatStyle = FORMAT_COLORS[item.format] ?? 'bg-gray-500/20 text-gray-300 border-gray-500/40'

  async function handleDelete() {
    setDeleting(true)
    try {
      const res = await fetch(`/api/collection/${item.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      queryClient.invalidateQueries({ queryKey: ['collection'] })
    } catch (err) {
      console.error(err)
      setDeleting(false)
    }
  }

  return (
    <div
      className="relative flex gap-3 p-3 border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-colors"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Delete button */}
      {hovered && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-1 right-1 font-mono text-[10px] text-red-400 border border-red-400/40 px-1 hover:bg-red-400/10 transition-colors"
        >
          {deleting ? '...' : '[X]'}
        </button>
      )}

      {/* Poster */}
      <div className="w-16 h-24 flex-shrink-0 flex items-center justify-center bg-black/40 border border-[var(--color-border)]">
        {posterUrl ? (
          <Image src={posterUrl} alt={item.title} width={64} height={96} className="object-cover w-full h-full" />
        ) : (
          <span className="font-mono text-[8px] text-[var(--color-muted)] text-center leading-tight px-1">
            [ NO<br />IMAGE ]
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <p className="font-mono text-sm font-bold text-[var(--color-primary)] truncate"
           style={{ textShadow: '0 0 8px var(--color-primary)' }}>
          {item.title}
        </p>
        <p className="font-mono text-xs text-[var(--color-muted)]">
          {item.year ?? '----'}
        </p>
        <span className={`font-mono text-[10px] border px-1.5 py-0.5 w-fit ${formatStyle}`}>
          {item.format}
        </span>
        {item.condition && (
          <p className="font-mono text-[10px] text-[var(--color-muted)]">
            {item.condition}
          </p>
        )}
      </div>
    </div>
  )
}
