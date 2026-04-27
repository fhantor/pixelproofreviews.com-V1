import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('ff39d7dc1d78f189d91a65150d1cf923', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
