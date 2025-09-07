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

    let uid, email, username, photoUrl, bio, interests;
    try {
      ({ uid, email, username, photoUrl, bio, interests } = await request.json());
    } catch (jsonError) {
      console.error('Error parsing JSON body:', jsonError);
      return new NextResponse('Invalid JSON body', { status: 400 });
    }

    if (!uid || !email) {
      return new NextResponse('Missing user ID or email', { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email: email },
      update: {
        username: username,
        image: photoUrl,
        bio: bio,
        interests: interests,
      },
      create: {
        id: uid,
        username: username || '',
        bio: bio || '',
        email: email,
        createdAt: new Date(),
        image: photoUrl || '',
        interests: interests || [],
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}