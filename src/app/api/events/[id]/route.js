import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({ where: { id: +id } });
    if (!event) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { titleTr, titleEn, date, artist, image, descriptionTr, descriptionEn, active } = await req.json();
    const event = await prisma.event.update({
      where: { id: +id },
      data: {
        ...(titleTr       !== undefined && { titleTr }),
        ...(titleEn       !== undefined && { titleEn }),
        ...(date          !== undefined && { date: new Date(date) }),
        ...(artist        !== undefined && { artist }),
        ...(image         !== undefined && { image }),
        ...(descriptionTr !== undefined && { descriptionTr }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(active        !== undefined && { active }),
      },
    });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: 'Failed to update event.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.event.delete({ where: { id: +id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete event.' }, { status: 500 });
  }
}
