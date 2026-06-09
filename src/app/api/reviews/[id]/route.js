import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { author, rating, contentTr, contentEn, approved } = await req.json();
    const review = await prisma.review.update({
      where: { id: +id },
      data: {
        ...(author    !== undefined && { author }),
        ...(rating    !== undefined && { rating }),
        ...(contentTr !== undefined && { contentTr }),
        ...(contentEn !== undefined && { contentEn }),
        ...(approved  !== undefined && { approved }),
      },
    });
    return NextResponse.json(review);
  } catch {
    return NextResponse.json({ error: 'Failed to update review.' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await prisma.review.delete({ where: { id: +id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete review.' }, { status: 500 });
  }
}
