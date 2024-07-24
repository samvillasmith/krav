import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        workouts: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Calculate additional stats
    const totalReps = user.workouts.reduce((sum, workout) => sum + workout.reps, 0);
    const totalSets = user.workouts.reduce((sum, workout) => sum + workout.sets, 0);
    const totalWeightLifted = user.workouts.reduce((sum, workout) => sum + (workout.reps * workout.weight), 0);
    
    const completedWorkouts = user.completedWorkouts.split(',').filter(w => w !== '');
    const totalDaysCompleted = completedWorkouts.length;
    const totalWeeksCompleted = new Set(completedWorkouts.map(w => w.split('-')[0])).size;

    return NextResponse.json({
      ...user,
      totalReps,
      totalSets,
      totalWeightLifted,
      totalDaysCompleted,
      totalWeeksCompleted,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: 'An error occurred while fetching your profile' }, { status: 500 });
  }
}