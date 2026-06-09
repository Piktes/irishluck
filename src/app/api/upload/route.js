import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { randomBytes } from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_PDF_TYPES   = ['application/pdf'];

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const type = formData.get('type') || 'misc';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isPdf   = ALLOWED_PDF_TYPES.includes(file.type);

    if (!isImage && !isPdf) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 });
    }

    const maxSize = isPdf ? 20 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: `File too large. Max ${isPdf ? '20MB' : '5MB'}.` }, { status: 400 });
    }

    const ext      = extname(file.name) || (isPdf ? '.pdf' : '.jpg');
    const filename = randomBytes(12).toString('hex') + ext;
    const subdir   = `uploads/${type}`;
    const dir      = join(process.cwd(), 'public', subdir);

    await mkdir(dir, { recursive: true });

    const bytes  = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(join(dir, filename), buffer);

    return NextResponse.json({ url: `/${subdir}/${filename}` });
  } catch (e) {
    console.error('Upload error:', e);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
