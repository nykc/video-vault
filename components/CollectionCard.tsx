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
  const [expanded, setExpanded] = useState(false)
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
    <div className="border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)] transition-colors">

      <div className="flex gap-3 p-3">
        <div className="w-16 h-24 flex-shrink-0 overflow-hidden border border-[var(--color-border)]" style={{ backgroundColor: 'var(--surface)' }}>
          {posterUrl ? (
            <Image src={posterUrl} alt={item.title} width={64} height={96} className="object-cover w-full h-full" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-mono text-[8px] text-[var(--color-muted)] text-center leading-tight px-1">[ NO IMAGE ]</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <p
            className="font-mono text-sm font-bold text-[var(--color-primary)] truncate"
            style={{ textShadow: '0 0 8px var(--color-primary)' }}
          >
            {item.title}
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-[var(--color-muted)]">{item.year ?? '----'}</span>
            {item.runtime && (
              <span className="font-mono text-xs text-[var(--color-muted)]">{item.runtime}m</span>
            )}
            {item.tmdb_rating && (
              <span className="font-mono text-xs text-[var(--color-muted)]">★ {item.tmdb_rating.toFixed(1)}</span>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`font-mono text-[10px] border px-1.5 py-0.5 ${formatStyle}`}>{item.format}</span>
            {item.mpaa_rating && (
              <span className="font-mono text-[10px] border px-1.5 py-0.5 border-[var(--color-border)] text-[var(--color-muted)]">
                {item.mpaa_rating}
              </span>
            )}
            {item.condition && (
              <span className="font-mono text-[10px] text-[var(--color-muted)]">{item.condition}</span>
            )}
          </div>

          {item.genre && (
            <p className="font-mono text-[10px] text-[var(--color-muted)] truncate">{item.genre}</p>
          )}

          {item.director && (
            <p className="font-mono text-[10px] text-[var(--color-muted)] truncate">DIR: {item.director}</p>
          )}
        </div>

        <div className="flex flex-col justify-between items-end flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="font-mono text-[10px] text-red-400 border border-red-400/40 px-1 hover:bg-red-400/10 transition-colors"
          >
            {deleting ? '...' : '[X]'}
          </button>
          <button
            onClick={() => setExpanded(!expanded)}
            className="font-mono text-[10px] text-[var(--color-muted)] border border-[var(--color-border)] px-1 hover:border-[var(--color-primary)] transition-colors"
          >
            {expanded ? '[-]' : '[+]'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 border-t border-[var(--color-border)] pt-3 flex flex-col gap-2">
          {item.overview && (
            <p className="font-mono text-xs text-[var(--color-muted)] leading-relaxed">{item.overview}</p>
          )}
          {item.cast && (
            <p className="font-mono text-[10px] text-[var(--color-muted)]">
              <span style={{ color: 'var(--color-primary)' }}>CAST: </span>{item.cast}
            </p>
          )}
          {item.notes && (
            <p className="font-mono text-[10px] text-[var(--color-muted)]">
              <span style={{ color: 'var(--color-primary)' }}>NOTES: </span>{item.notes}
            </p>
          )}
        </div>
      )}

    </div>
  )
}
