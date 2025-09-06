
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/firebase-admin';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const authorization = req.headers.get('authorization');
    if (!authorization) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const idToken = authorization.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    let user = await prisma.user.findUnique({
      where: {
        id: uid,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: uid,
          email: email || '',
          name: name || '',
          image: picture || '',
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in user API route', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
