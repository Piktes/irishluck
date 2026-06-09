import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(items);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch gallery.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { imageUrl, category } = await req.json();
    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required.' }, { status: 400 });
    }
    const item = await prisma.galleryItem.create({
      data: { imageUrl, category: category || 'atmosphere' },
    });
    return NextResponse.json(item, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create gallery item.' }, { status: 500 });
  }
}
