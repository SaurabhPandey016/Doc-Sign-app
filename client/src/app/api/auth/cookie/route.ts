import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, user } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token token string missing' }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, user });

    // Bake the HTTP-Only cookie parameter matrix securely into the client browser
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true, // Complete isolation from client-side JS scripts (XSS defense)
      secure: process.env.NODE_ENV === 'production', // Enforces SSL in production
      sameSite: 'lax', // Protections against malicious CSRF cross-origin vectors
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // Automatic token expiration in 7 days
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Registry Failure' }, { status: 500 });
  }
}