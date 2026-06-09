import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.setting.findMany();
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { settings } = await req.json();
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'settings object required.' }, { status: 400 });
    }

    const ops = Object.entries(settings).map(([key, { valueTr, valueEn }]) =>
      prisma.setting.upsert({
        where: { key },
        update: { valueTr: valueTr ?? '', valueEn: valueEn ?? '' },
        create: { key, valueTr: valueTr ?? '', valueEn: valueEn ?? '' },
      })
    );
    await prisma.$transaction(ops);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings.' }, { status: 500 });
  }
}
