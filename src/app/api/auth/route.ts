import { NextRequest, NextResponse } from 'next/server';

// Hardcoded credentials
const VALID_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: { username, role: 'admin' },
      });
    }
    
    return NextResponse.json(
      { success: false, error: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Auth endpoint is working',
    requires: ['username', 'password'],
  });
}