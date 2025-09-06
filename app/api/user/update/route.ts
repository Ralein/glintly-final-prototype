import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    if (request.headers.get('content-type') !== 'application/json') {
      return new NextResponse('Invalid Content-Type. Expected application/json', { status: 400 });
    }

    let uid, username, bio;
    try {
      ({ uid, username, bio } = await request.json());
    } catch (jsonError) {
      console.error('Error parsing JSON body:', jsonError);
      return new NextResponse('Invalid JSON body', { status: 400 });
    }

    if (!uid) {
      return new NextResponse('Missing user ID', { status: 400 });
    }

    try {
      const updatedUser = await prisma.user.update({
        where: { id: uid },
        data: {
          username,
          bio,
        },
      });
      return NextResponse.json(updatedUser);
    } catch (prismaError: any) {
      if (prismaError.code === 'P2025') {
        console.error('User not found for update:', uid);
        return new NextResponse('User not found', { status: 404 });
      }
      throw prismaError; // Re-throw other Prisma errors
    }
  } catch (error) {
    console.error('Error updating user profile:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}