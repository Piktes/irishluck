import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({ orderBy: { id: 'desc' } });
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch reviews.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { author, rating, contentTr, contentEn, approved } = await req.json();
    if (!author || !contentTr) {
      return NextResponse.json({ error: 'author and contentTr are required.' }, { status: 400 });
    }
    const review = await prisma.review.create({
      data: { author, rating: rating ?? 5, contentTr, contentEn: contentEn || '', approved: approved ?? false },
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create review.' }, { status: 500 });
  }
}
