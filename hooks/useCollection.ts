import { useQuery } from '@tanstack/react-query'
import type { CollectionItem } from '@/lib/db/queries'

async function fetchCollection(): Promise<CollectionItem[]> {
  const res = await fetch('/api/collection')
  if (!res.ok) throw new Error('Failed to fetch collection')
  return res.json()
}

export function useCollection() {
  return useQuery({
    queryKey: ['collection'],
    queryFn: fetchCollection,
  })
}
