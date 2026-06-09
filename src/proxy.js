import { NextResponse } from 'next/server';

export const defaultLocale = 'tr';
export const locales = ['tr', 'en'];

export function resolveLocale(pathname) {
  const seg = pathname.split('/')[1];
  return locales.includes(seg) ? seg : defaultLocale;
}

export default function proxy(req) {
  const { pathname } = req.nextUrl;

  // Skip API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/uploads/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect bare `/` and unknown locales to default locale
  const seg = pathname.split('/')[1];
  if (!locales.includes(seg)) {
    const url = req.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
