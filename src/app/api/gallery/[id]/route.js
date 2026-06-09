import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.galleryItem.delete({ where: { id: +id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete gallery item.' }, { status: 500 });
  }
}
