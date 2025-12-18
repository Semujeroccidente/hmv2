
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that require authentication
const protectedPaths = [
    '/vender',
    '/perfil',
    '/mis-ventas',
    '/mis-compras',
    '/favoritos', // Assuming we have this
    '/carrito',   // Maybe? Usually cart is visible but checkout needs auth.
    '/admin'      // Admin routes
]

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const authToken = request.cookies.get('auth-token')?.value

    // Check if the path starts with any of the protected paths
    const isProtected = protectedPaths.some(path => pathname.startsWith(path))

    if (isProtected) {
        if (!authToken) {
            // User is not logged in, redirect to login
            const url = new URL('/login', request.url)
            // Save the return URL to redirect back after login (optional, implemented if login page supports it)
            url.searchParams.set('returnUrl', pathname)
            return NextResponse.redirect(url)
        }
    }

    // Admin protection could be enhanced here by checking role in token
    // but for now, basic auth existence is a good start.

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
    ],
}
