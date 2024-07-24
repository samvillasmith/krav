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

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const completedDays = user.completedWorkouts ? user.completedWorkouts.split(',') : [];
      const workoutId = `${weekNumber}-${day.toLowerCase()}`;
      if (!completedDays.includes(workoutId)) {
        completedDays.push(workoutId);
        await prisma.user.update({
          where: { id: userId },
          data: {
            completedWorkouts: completedDays.join(','),
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