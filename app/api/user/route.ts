import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');

  if (!uid) {
    return new NextResponse('Missing user ID', { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: uid },
    });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return new NextResponse('Invalid Content-Type. Expected application/json', { status: 400 });
    }

    let uid, email, username, photoUrl;
    try {
      ({ uid, email, username, photoUrl } = await request.json());
    } catch (jsonError) {
      console.error('Error parsing JSON body:', jsonError);
      return new NextResponse('Invalid JSON body', { status: 400 });
    }

    if (!uid || !email) {
      return new NextResponse('Missing user ID or email', { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { id: uid },
      update: {
        username: username || '',
        email: email,
        image: photoUrl || '',
      },
      create: {
        id: uid,
        username: username || '',
        bio: '',
        email: email,
        createdAt: new Date(),
        image: photoUrl || '',
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}