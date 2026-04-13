'use client'

import { useState } from 'react'

const FORMATS = ['DVD', 'Blu-ray', '4K', 'VHS', 'Digital']
const CONDITIONS = ['Brand New', 'Like New', 'Very Good', 'Good', 'Acceptable']

type TMDBMovie = {
  id: number
  title: string
  release_date: string
  poster_path: string | null
}

type Props = {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
  tmdbMovie?: TMDBMovie
}

export default function AddItemModal({ visible, onClose, onSuccess, tmdbMovie }: Props) {
  const [format, setFormat] = useState('Blu-ray')
  const [condition, setCondition] = useState('Very Good')
  const [notes, setNotes] = useState('')
  const [manualTitle, setManualTitle] = useState('')
  const [manualYear, setManualYear] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isManual = !tmdbMovie
  const title = tmdbMovie?.title ?? manualTitle
  const year = tmdbMovie?.release_date?.substring(0, 4) ?? manualYear

  async function handleSave() {
    if (!title.trim()) {
      setError('TITLE REQUIRED')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tmdbMovie, manualTitle, manualYear, format, condition, notes }),
      })
      if (!res.ok) throw new Error('Save failed')
      onSuccess()
      handleClose()
    } catch {
      setError('SAVE FAILED')
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setFormat('Blu-ray')
    setCondition('Very Good')
    setNotes('')
    setManualTitle('')
    setManualYear('')
    setError(null)
    onClose()
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-6" style={{ backgroundColor: '#000000cc' }}>
      <div className="w-full max-w-md border p-6 overflow-y-auto max-h-screen" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--primary)' }}>

        <div className="mb-4">
          <p className="text-sm tracking-widest" style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>
            {isManual ? 'MANUAL ENTRY' : title.toUpperCase()}
          </p>
          {year && (
            <p className="text-xs mt-1" style={{ color: 'var(--textMuted)', fontFamily: 'monospace' }}>{year}</p>
          )}
        </div>

        {isManual && (
          <>
            <label className="block text-xs tracking-widest mb-2 mt-4" style={{ color: 'var(--textMuted)' }}>TITLE</label>
            <input
              className="w-full border px-3 py-2 text-sm bg-transparent outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'monospace' }}
              value={manualTitle}
              onChange={(e) => setManualTitle(e.target.value)}
              placeholder="movie title..."
            />
            <label className="block text-xs tracking-widest mb-2 mt-4" style={{ color: 'var(--textMuted)' }}>YEAR</label>
            <input
              className="w-full border px-3 py-2 text-sm bg-transparent outline-none"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'monospace' }}
              value={manualYear}
              onChange={(e) => setManualYear(e.target.value)}
              placeholder="1984"
              maxLength={4}
            />
          </>
        )}

        <label className="block text-xs tracking-widest mb-2 mt-4" style={{ color: 'var(--textMuted)' }}>FORMAT</label>
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className="px-3 py-1 text-xs border cursor-pointer"
              style={{
                fontFamily: 'monospace',
                borderColor: format === f ? 'var(--primary)' : 'var(--border)',
                color: format === f ? 'var(--primary)' : 'var(--textMuted)',
                backgroundColor: format === f ? 'var(--primary)22' : 'transparent',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <label className="block text-xs tracking-widest mb-2 mt-4" style={{ color: 'var(--textMuted)' }}>CONDITION</label>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c}
              onClick={() => setCondition(c)}
              className="px-3 py-1 text-xs border cursor-pointer"
              style={{
                fontFamily: 'monospace',
                borderColor: condition === c ? 'var(--primary)' : 'var(--border)',
                color: condition === c ? 'var(--primary)' : 'var(--textMuted)',
                backgroundColor: condition === c ? 'var(--primary)22' : 'transparent',
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <label className="block text-xs tracking-widest mb-2 mt-4" style={{ color: 'var(--textMuted)' }}>NOTES</label>
        <textarea
          className="w-full border px-3 py-2 text-sm bg-transparent outline-none resize-none"
          style={{ borderColor: 'var(--border)', color: 'var(--text)', fontFamily: 'monospace' }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="optional notes..."
          rows={3}
        />

        {error && (
          <p className="text-xs text-center mt-3" style={{ color: 'var(--error)', fontFamily: 'monospace' }}>{error}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 border py-2 text-xs tracking-widest cursor-pointer"
            style={{ borderColor: 'var(--border)', color: 'var(--textMuted)', fontFamily: 'monospace' }}
          >
            [ CANCEL ]
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 border py-2 text-xs tracking-widest cursor-pointer"
            style={{ borderColor: 'var(--primary)', color: 'var(--primary)', backgroundColor: 'var(--primary)22', fontFamily: 'monospace' }}
          >
            {saving ? '[ SAVING... ]' : '[ ADD TO VAULT ]'}
          </button>
        </div>

      </div>
    </div>
  )
}
