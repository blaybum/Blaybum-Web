import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = 'http://blaybum.haeyul.cloud:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const url = `${EXTERNAL_API_BASE}/auth/register`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: body,
    });

    const data = await response.text();
    
    return new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}