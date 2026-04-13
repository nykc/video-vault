import { CollectionGrid } from '@/components/CollectionGrid'

export default function CollectionPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1
          className="font-mono text-2xl font-bold text-[var(--color-primary)]"
          style={{ textShadow: '0 0 12px var(--color-primary)' }}
        >
          MY COLLECTION
        </h1>
        <p className="font-mono text-xs text-[var(--color-muted)] mt-1">
          ══════════════════════════
        </p>
      </div>
      <CollectionGrid />
    </main>
  )
}
