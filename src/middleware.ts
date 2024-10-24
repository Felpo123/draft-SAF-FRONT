import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth-config';

export async function middleware(request: NextRequest) {
  const sesión = await auth();

  if (request.nextUrl.pathname.startsWith('/imgs/')) {
    return NextResponse.next();
  }

  if (!sesión && request.nextUrl.pathname !== '/') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|$).*)'],
};
