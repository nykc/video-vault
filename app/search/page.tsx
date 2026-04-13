'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import { getPosterUrl, type TMDBMovie } from '@/lib/tmdb'
import AddItemModal from '@/components/AddItemModal'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [manualModalVisible, setManualModalVisible] = useState(false)

  const { data: results = [], isFetching } = useQuery({
    queryKey: ['search', query],
    queryFn: async () => {
      if (query.length < 3) return []
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      return res.json()
    },
    enabled: query.length > 2,
  })

  return (
    <div className="max-w-2xl mx-auto">

      <div className="flex items-center border px-4 mb-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
        <span className="text-sm mr-3" style={{ color: 'var(--primary)' }}>SEARCH{'>'}</span>
        <input
          className="flex-1 bg-transparent py-3 text-sm outline-none"
          style={{ color: 'var(--text)', fontFamily: 'monospace' }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="enter title..."
          autoFocus
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      <div className="flex justify-end mb-4">
        <button
          className="text-xs tracking-widest cursor-pointer"
          style={{ color: 'var(--textMuted)' }}
          onClick={() => setManualModalVisible(true)}
        >
          [ + ADD MANUALLY ]
        </button>
      </div>

      {isFetching && (
        <p className="text-xs tracking-widest text-center py-8" style={{ color: 'var(--textMuted)' }}>
          SEARCHING...
        </p>
      )}

      {!isFetching && results.length === 0 && query.length > 2 && (
        <p className="text-xs tracking-widest text-center py-8" style={{ color: 'var(--textMuted)' }}>
          NO RESULTS FOUND
        </p>
      )}

      <div className="flex flex-col">
        {results.map((movie: TMDBMovie) => (
          <button
            key={movie.id}
            className="flex items-center gap-4 py-3 border-b text-left cursor-pointer w-full"
            style={{ borderColor: 'var(--border)', backgroundColor: 'transparent' }}
            onClick={() => {
              setSelectedMovie(movie)
              setModalVisible(true)
            }}
          >
            <div className="w-10 h-14 flex-shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--surface)' }}>
              {movie.poster_path ? (
                <Image
                  src={getPosterUrl(movie.poster_path) ?? ''}
                  alt={movie.title}
                  width={40}
                  height={56}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm" style={{ color: 'var(--text)', fontFamily: 'monospace' }}>
                {movie.title}
              </span>
              <span className="text-xs mt-1" style={{ color: 'var(--textMuted)', fontFamily: 'monospace' }}>
                {movie.release_date ? movie.release_date.substring(0, 4) : 'UNKNOWN'}
              </span>
            </div>
          </button>
        ))}
      </div>

      <AddItemModal
        visible={modalVisible}
        tmdbMovie={selectedMovie ?? undefined}
        onClose={() => { setModalVisible(false); setSelectedMovie(null) }}
        onSuccess={() => { setModalVisible(false); setSelectedMovie(null) }}
      />

      <AddItemModal
        visible={manualModalVisible}
        onClose={() => setManualModalVisible(false)}
        onSuccess={() => setManualModalVisible(false)}
      />

    </div>
  )
}
