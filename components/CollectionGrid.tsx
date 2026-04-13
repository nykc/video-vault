'use client'
import { useState } from 'react'
import { useCollection } from '@/hooks/useCollection'
import { CollectionCard } from './CollectionCard'

export function CollectionGrid() {
  const { data: items, isLoading, isError } = useCollection()
  const [view, setView] = useState<'grid' | 'list'>('grid')

  if (isLoading) return (
    <p className="font-mono text-sm animate-pulse">LOADING COLLECTION...</p>
  )

  if (isError) return (
    <p className="font-mono text-sm text-red-400">ERROR: COULD NOT FETCH COLLECTION</p>
  )

  if (!items?.length) return (
    <p className="font-mono text-sm">NO ITEMS IN COLLECTION.</p>
  )

  const activeBtn = 'border-[var(--color-primary)] text-[var(--color-primary)]'
  const inactiveBtn = 'border-[var(--color-border)]'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between font-mono text-xs">
        <span>{items.length} ITEM{items.length !== 1 ? 'S' : ''}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setView('grid')}
            className={`px-2 py-0.5 border ${view === 'grid' ? activeBtn : inactiveBtn}`}
          >
            GRID
          </button>
          <button
            onClick={() => setView('list')}
            className={`px-2 py-0.5 border ${view === 'list' ? activeBtn : inactiveBtn}`}
          >
            LIST
          </button>
        </div>
      </div>

      <div className={view === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'
        : 'flex flex-col gap-2'
      }>
        {items.map(item => (
          <CollectionCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
