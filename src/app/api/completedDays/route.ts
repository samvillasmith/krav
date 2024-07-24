import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const weekNumber = request.nextUrl.searchParams.get('week');

    if (!weekNumber) {
      return NextResponse.json({ error: 'Week number is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const completedDays = user.completedWorkouts
      .split(',')
      .filter(workout => workout.startsWith(`${weekNumber}-`))
      .map(workout => workout.split('-')[1]);

    console.log('User:', user);
    console.log('Completed workouts:', user.completedWorkouts);
    console.log('Filtered completed days:', completedDays);

    return NextResponse.json({ completedDays });
  } catch (error) {
    console.error('Error fetching completed days:', error);
    return NextResponse.json({ error: 'An error occurred while fetching completed days' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}