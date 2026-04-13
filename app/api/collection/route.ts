import { NextRequest, NextResponse } from 'next/server'
import { addMovieToCollection } from '@/lib/db/queries'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    await addMovieToCollection(body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Failed to add item' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { getCollection } = await import('@/lib/db/queries')
    const items = getCollection()
    return NextResponse.json(items)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 })
  }
}
