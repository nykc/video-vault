import { getDatabase } from './database'
import type { TMDBMovie } from '@/lib/tmdb'

export type AddItemInput = {
  tmdbMovie?: TMDBMovie
  manualTitle?: string
  manualYear?: string
  format: string
  condition: string
  notes: string
}

export type CollectionItem = {
  id: number
  movie_id: number
  title: string
  year: number | null
  poster_path: string | null
  format: string
  condition: string | null
  notes: string | null
  created_at: string
}

export function addMovieToCollection(input: AddItemInput): void {
  const db = getDatabase()

  const title = input.tmdbMovie?.title ?? input.manualTitle ?? 'Unknown'
  const year = input.tmdbMovie?.release_date
    ? parseInt(input.tmdbMovie.release_date.substring(0, 4))
    : input.manualYear
    ? parseInt(input.manualYear)
    : null

  let movieId: number

  if (input.tmdbMovie) {
    const existing = db.prepare('SELECT id FROM movies WHERE tmdb_id = ?').get(input.tmdbMovie.id) as { id: number } | undefined

    if (existing) {
      movieId = existing.id
    } else {
      const result = db.prepare(`
        INSERT INTO movies (tmdb_id, title, year, poster_path, backdrop_path, overview)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        input.tmdbMovie.id,
        title,
        year,
        input.tmdbMovie.poster_path ?? null,
        input.tmdbMovie.backdrop_path ?? null,
        input.tmdbMovie.overview ?? null
      )
      movieId = result.lastInsertRowid as number
    }
  } else {
    const result = db.prepare(
      'INSERT INTO movies (title, year) VALUES (?, ?)'
    ).run(title, year)
    movieId = result.lastInsertRowid as number
  }

  db.prepare(`
    INSERT INTO collection_items (movie_id, format, condition, notes)
    VALUES (?, ?, ?, ?)
  `).run(movieId, input.format, input.condition || null, input.notes || null)
}

export function getCollection(): CollectionItem[] {
  const db = getDatabase()
  return db.prepare(`
    SELECT
      ci.id,
      ci.movie_id,
      m.title,
      m.year,
      m.poster_path,
      ci.format,
      ci.condition,
      ci.notes,
      ci.created_at
    FROM collection_items ci
    JOIN movies m ON m.id = ci.movie_id
    ORDER BY m.title ASC
  `).all() as CollectionItem[]
}
