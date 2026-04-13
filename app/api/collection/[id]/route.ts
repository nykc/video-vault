import { NextRequest, NextResponse } from 'next/server'
import { getDatabase } from '@/lib/db/database'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const db = getDatabase()
    db.prepare('DELETE FROM collection_items WHERE id = ?').run(Number(id))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, error: 'Failed to delete item' }, { status: 500 })
  }
}
