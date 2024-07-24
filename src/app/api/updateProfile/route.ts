import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const { email, age, height, weight, goal } = await req.json();

    console.log('Received data:', { userId, email, age, height, weight, goal });

    const upsertedUser = await prisma.user.upsert({
      where: { id: userId },
      update: { 
        age: age ? parseInt(age) : null, 
        height: height ? parseInt(height) : null, 
        weight: weight ? parseFloat(weight) : null, 
        goal 
      },
      create: { 
        id: userId, 
        email, 
        age: age ? parseInt(age) : null, 
        height: height ? parseInt(height) : null, 
        weight: weight ? parseFloat(weight) : null, 
        goal 
      },
    });

    console.log('Upserted user:', upsertedUser);

    return NextResponse.json(upsertedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ 
      error: 'An error occurred while updating your profile', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}