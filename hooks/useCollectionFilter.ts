import { useMemo, useState } from 'react'
import type { CollectionItem } from '@/lib/db/queries'

export type FilterState = {
  search: string
  genre: string
  decade: string
  format: string
  mpaa: string
}

const EMPTY_FILTERS: FilterState = {
  search: '',
  genre: '',
  decade: '',
  format: '',
  mpaa: '',
}

export function useCollectionFilter(items: CollectionItem[]) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (filters.search) {
        const q = filters.search.toLowerCase()
        const searchable = [
          item.title,
          item.director,
          item.cast,
          item.overview,
        ].filter(Boolean).join(' ').toLowerCase()
        if (!searchable.includes(q)) return false
      }

      if (filters.genre) {
        if (!item.genre?.toLowerCase().includes(filters.genre.toLowerCase())) return false
      }

      if (filters.decade) {
        const decade = parseInt(filters.decade)
        if (!item.year) return false
        if (item.year < decade || item.year >= decade + 10) return false
      }

      if (filters.format) {
        if (item.format !== filters.format) return false
      }

      if (filters.mpaa) {
        if (item.mpaa_rating !== filters.mpaa) return false
      }

      return true
    })
  }, [items, filters])

  const genres = useMemo(() => {
    const all = items
      .flatMap((item) => item.genre?.split(', ') ?? [])
      .filter(Boolean)
    return [...new Set(all)].sort()
  }, [items])

  const formats = useMemo(() => {
    return [...new Set(items.map((item) => item.format))].sort()
  }, [items])

  const mpaaRatings = useMemo(() => {
    return [...new Set(items.map((item) => item.mpaa_rating).filter(Boolean))].sort() as string[]
  }, [items])

  const hasActiveFilters = Object.values(filters).some(Boolean)

  function setFilter(key: keyof FilterState, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS)
  }

  return {
    filters,
    filtered,
    genres,
    formats,
    mpaaRatings,
    hasActiveFilters,
    setFilter,
    clearFilters,
  }
}
