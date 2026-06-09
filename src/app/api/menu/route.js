import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const info = await prisma.menuInfo.findFirst();
    return NextResponse.json(info || {});
  } catch {
    return NextResponse.json({ error: 'Failed to fetch menu info.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { pdfUrl, descriptionTr, descriptionEn } = await req.json();
    const existing = await prisma.menuInfo.findFirst();
    const data = { pdfUrl: pdfUrl || '', descriptionTr: descriptionTr || '', descriptionEn: descriptionEn || '' };
    let info;
    if (existing) {
      info = await prisma.menuInfo.update({ where: { id: existing.id }, data });
    } else {
      info = await prisma.menuInfo.create({ data });
    }
    return NextResponse.json(info);
  } catch {
    return NextResponse.json({ error: 'Failed to save menu info.' }, { status: 500 });
  }
}
