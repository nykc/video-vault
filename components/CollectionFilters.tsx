'use client'

import type { FilterState } from '@/hooks/useCollectionFilter'

const DECADES = [
  { label: '70s', value: '1970' },
  { label: '80s', value: '1980' },
  { label: '90s', value: '1990' },
  { label: '00s', value: '2000' },
  { label: '10s', value: '2010' },
  { label: '20s', value: '2020' },
]

type Props = {
  filters: FilterState
  genres: string[]
  formats: string[]
  mpaaRatings: string[]
  hasActiveFilters: boolean
  onFilter: (key: keyof FilterState, value: string) => void
  onClear: () => void
  totalCount: number
  filteredCount: number
}

export function CollectionFilters({
  filters,
  genres,
  formats,
  mpaaRatings,
  hasActiveFilters,
  onFilter,
  onClear,
  totalCount,
  filteredCount,
}: Props) {
  const chipBase = 'font-mono text-[10px] border px-2 py-0.5 cursor-pointer transition-colors'
  const chipActive = 'border-[var(--color-primary)] text-[var(--color-primary)]'
  const chipInactive = 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]'

  return (
    <div className="flex flex-col gap-3 mb-6 border border-[var(--color-border)] p-4" style={{ backgroundColor: 'var(--surface)' }}>

      <div className="flex items-center border px-3" style={{ borderColor: 'var(--border)' }}>
        <span className="font-mono text-xs mr-2" style={{ color: 'var(--color-primary)' }}>FILTER{'>'}</span>
        <input
          className="flex-1 bg-transparent py-2 text-xs outline-none font-mono"
          style={{ color: 'var(--color-primary)' }}
          value={filters.search}
          onChange={(e) => onFilter('search', e.target.value)}
          placeholder="title, actor, director..."
        />
        {filters.search && (
          <button
            onClick={() => onFilter('search', '')}
            className="font-mono text-[10px] text-[var(--color-muted)] ml-2"
          >
            [X]
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono text-[10px] text-[var(--color-muted)] w-16">DECADE</span>
        {DECADES.map((d) => (
          <button
            key={d.value}
            className={`${chipBase} ${filters.decade === d.value ? chipActive : chipInactive}`}
            onClick={() => onFilter('decade', filters.decade === d.value ? '' : d.value)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {genres.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] text-[var(--color-muted)] w-16">GENRE</span>
          {genres.map((g) => (
            <button
              key={g}
              className={`${chipBase} ${filters.genre === g ? chipActive : chipInactive}`}
              onClick={() => onFilter('genre', filters.genre === g ? '' : g)}
            >
              {g}
            </button>
          ))}
        </div>
      )}

      {formats.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] text-[var(--color-muted)] w-16">FORMAT</span>
          {formats.map((f) => (
            <button
              key={f}
              className={`${chipBase} ${filters.format === f ? chipActive : chipInactive}`}
              onClick={() => onFilter('format', filters.format === f ? '' : f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {mpaaRatings.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] text-[var(--color-muted)] w-16">RATING</span>
          {mpaaRatings.map((r) => (
            <button
              key={r}
              className={`${chipBase} ${filters.mpaa === r ? chipActive : chipInactive}`}
              onClick={() => onFilter('mpaa', filters.mpaa === r ? '' : r)}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-[var(--color-muted)]">
          {hasActiveFilters ? `${filteredCount} of ${totalCount} titles` : `${totalCount} titles`}
        </span>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="font-mono text-[10px] text-[var(--color-muted)] border border-[var(--color-border)] px-2 py-0.5 hover:border-[var(--color-primary)] transition-colors"
          >
            [ CLEAR ALL ]
          </button>
        )}
      </div>

    </div>
  )
}
