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

    const { day, workoutRecord, weekNumber } = await req.json();

    // Save each exercise set as a separate record
    for (const [exerciseName, sets] of Object.entries(workoutRecord)) {
      for (const set of sets as { setNumber: number; reps: string; weight: string }[]) {
        await prisma.workout.create({
          data: {
            userId,
            day,
            exercise: exerciseName,
            sets: set.setNumber,
            reps: parseInt(set.reps),
            weight: parseFloat(set.weight),
          },
        });
      }
    }

    // Update user's completed workouts
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const completedWorkouts = user.completedWorkouts ? user.completedWorkouts.split(',') : [];
      const workoutId = `${weekNumber}-${day.toLowerCase()}`;
      if (!completedWorkouts.includes(workoutId)) {
        completedWorkouts.push(workoutId);
        await prisma.user.update({
          where: { id: userId },
          data: {
            completedWorkouts: completedWorkouts.join(','),
          },
        });
      }
    }

    return NextResponse.json({ message: 'Workout saved successfully' }, { status: 200 });
  } catch (error) {
    console.error("Error saving workout:", error);
    return NextResponse.json({ error: 'An error occurred while saving your workout' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}