
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/firebase-admin';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: true,
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid } = decodedToken;

    const { title, content } = await req.json();

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: uid,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Error creating post', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
