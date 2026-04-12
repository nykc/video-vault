import { NextRequest, NextResponse } from 'next/server'
import { searchMovies } from '@/lib/tmdb'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q') ?? ''
  try {
    const results = await searchMovies(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
