import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    name: 'BLC Campus API',
    version: '1.0.0',
    endpoints: {
      classes: '/api/classes',
      courses: '/api/courses',
      modules: '/api/modules',
      batches: '/api/batches',
      lecturers: '/api/lecturers',
      sheets: '/api/sheets',
      auth: '/api/auth',
    },
    status: 'operational',
    timestamp: new Date().toISOString(),
  });
}