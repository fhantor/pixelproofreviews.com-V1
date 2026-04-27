import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('b310ff50d4bf1091f226c225b104c6f0', {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
