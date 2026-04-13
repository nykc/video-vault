'use client'

import { useState } from 'react'
import { useCollection } from '@/hooks/useCollection'
import { useCollectionFilter } from '@/hooks/useCollectionFilter'
import { CollectionCard } from './CollectionCard'
import { CollectionFilters } from './CollectionFilters'

export function CollectionGrid() {
  const { data: items = [], isLoading, isError } = useCollection()
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const {
    filters,
    filtered,
    genres,
    formats,
    mpaaRatings,
    hasActiveFilters,
    setFilter,
    clearFilters,
  } = useCollectionFilter(items)

  if (isLoading) return (
    <p className="font-mono text-sm animate-pulse" style={{ color: 'var(--color-muted)' }}>
      LOADING COLLECTION...
    </p>
  )

  if (isError) return (
    <p className="font-mono text-sm text-red-400">ERROR: COULD NOT FETCH COLLECTION</p>
  )

  const activeBtn = 'border-[var(--color-primary)] text-[var(--color-primary)]'
  const inactiveBtn = 'border-[var(--color-border)] text-[var(--color-muted)]'

  return (
    <div className="flex flex-col gap-4">
      <CollectionFilters
        filters={filters}
        genres={genres}
        formats={formats}
        mpaaRatings={mpaaRatings}
        hasActiveFilters={hasActiveFilters}
        onFilter={setFilter}
        onClear={clearFilters}
        totalCount={items.length}
        filteredCount={filtered.length}
      />

      <div className="flex items-center justify-between font-mono text-xs">
        <span style={{ color: 'var(--color-muted)' }}>
          {hasActiveFilters
            ? `SHOWING ${filtered.length} OF ${items.length}`
            : `${items.length} ITEM${items.length !== 1 ? 'S' : ''}`}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`px-2 py-0.5 border font-mono text-xs cursor-pointer ${view === 'grid' ? activeBtn : inactiveBtn}`}
          >
            GRID
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-2 py-0.5 border font-mono text-xs cursor-pointer ${view === 'list' ? activeBtn : inactiveBtn}`}
          >
            LIST
          </button>
        </div>
      </div>

      {filtered.length === 0 && items.length > 0 && (
        <p className="font-mono text-sm text-center py-8" style={{ color: 'var(--color-muted)' }}>
          NO TITLES MATCH YOUR FILTERS
        </p>
      )}

      {items.length === 0 && (
        <p className="font-mono text-sm" style={{ color: 'var(--color-muted)' }}>
          NO ITEMS IN COLLECTION.
        </p>
      )}

      <div className={view === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
        : 'flex flex-col gap-2'
      }>
        {filtered.map(item => (
          <CollectionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
