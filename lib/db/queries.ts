import { getDatabase } from './database'
import { getMovieDetails } from '@/lib/tmdb'

export type AddItemInput = {
  tmdbMovie?: {
    id: number
    title: string
    release_date: string
    poster_path: string | null
    backdrop_path: string | null
    overview: string
  }
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
  overview: string | null
  runtime: number | null
  genre: string | null
  director: string | null
  cast: string | null
  tmdb_rating: number | null
  mpaa_rating: string | null
  keywords: string | null
  created_at: string
}

export async function addMovieToCollection(input: AddItemInput): Promise<void> {
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
      const details = await getMovieDetails(input.tmdbMovie.id)

      const director = details.credits?.crew
        ?.filter((c) => c.job === 'Director')
        .map((c) => c.name)
        .join(', ') ?? null

      const cast = details.credits?.cast
        ?.slice(0, 10)
        .map((c) => c.name)
        .join(', ') ?? null

      const genres = details.genres
        ?.map((g) => g.name)
        .join(', ') ?? null

      const mpaaRating = details.release_dates?.results
        ?.find((r) => r.iso_3166_1 === 'US')
        ?.release_dates
        ?.find((d) => d.certification && d.type === 3)
        ?.certification
        ?? details.release_dates?.results
        ?.find((r) => r.iso_3166_1 === 'US')
        ?.release_dates
        ?.find((d) => d.certification)
        ?.certification
        ?? null

      const result = db.prepare(`
        INSERT INTO movies (
          tmdb_id, title, year, poster_path, backdrop_path,
          overview, runtime, genre, director, cast, tmdb_rating, mpaa_rating
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        input.tmdbMovie.id,
        title,
        year,
        input.tmdbMovie.poster_path ?? null,
        input.tmdbMovie.backdrop_path ?? null,
        details.overview ?? null,
        details.runtime ?? null,
        genres,
        director,
        cast,
        details.vote_average ?? null,
        mpaaRating
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
      m.overview,
      m.runtime,
      m.genre,
      m.director,
      m."cast",
      m.tmdb_rating,
      m.mpaa_rating,
      m.keywords,
      ci.format,
      ci.condition,
      ci.notes,
      ci.created_at
    FROM collection_items ci
    JOIN movies m ON m.id = ci.movie_id
    ORDER BY m.title ASC
  `).all() as CollectionItem[]
}
