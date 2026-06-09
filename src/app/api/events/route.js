import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({ orderBy: { date: 'asc' } });
    return NextResponse.json(events);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch events.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { titleTr, titleEn, date, artist, image, descriptionTr, descriptionEn, active } = await req.json();
    if (!titleTr || !date || !artist) {
      return NextResponse.json({ error: 'titleTr, date, and artist are required.' }, { status: 400 });
    }
    const event = await prisma.event.create({
      data: { titleTr, titleEn: titleEn || '', date: new Date(date), artist, image: image || '', descriptionTr: descriptionTr || '', descriptionEn: descriptionEn || '', active: active ?? true },
    });
    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create event.' }, { status: 500 });
  }
}
