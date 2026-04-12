const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

export const getPosterUrl = (posterPath: string | null, size = 'w500') => {
  if (!posterPath) return null
  return `${IMAGE_BASE_URL}/${size}${posterPath}`
}

export type TMDBMovie = {
  id: number
  title: string
  release_date: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
}

export type TMDBMovieDetails = TMDBMovie & {
  runtime: number | null
  genres: { id: number; name: string }[]
  credits: {
    crew: { job: string; name: string }[]
  }
}

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY ?? '')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`)
  return res.json()
}

export async function searchMovies(query: string): Promise<TMDBMovie[]> {
  if (!query.trim()) return []
  const data = await tmdbFetch<{ results: TMDBMovie[] }>('/search/movie', { query })
  return data.results
}

export async function getMovieDetails(tmdbId: number): Promise<TMDBMovieDetails> {
  return tmdbFetch<TMDBMovieDetails>(`/movie/${tmdbId}`, {
    append_to_response: 'credits',
  })
}
