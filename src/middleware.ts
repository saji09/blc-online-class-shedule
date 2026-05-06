import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname;
  
  console.log('Middleware - Path:', path);
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/login';
  const isRootPath = path === '/';
  
  // Get the token from cookies
  const token = request.cookies.get('isLoggedIn')?.value;
  const isAuthenticated = token === 'true';
  
  console.log('Middleware - Is Authenticated:', isAuthenticated);
  console.log('Middleware - Is Public Path:', isPublicPath);
  
  // Redirect logic
  if (isAuthenticated && isPublicPath) {
    console.log('Middleware - Redirecting authenticated user from login to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isAuthenticated && !isPublicPath && !isRootPath) {
    console.log('Middleware - Redirecting unauthenticated user to login');
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  console.log('Middleware - Allowing request');
  return NextResponse.next();
}

// Specify which routes this middleware will run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/'
  ],
};