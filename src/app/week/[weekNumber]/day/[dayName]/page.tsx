'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { workoutData } from '../../../../../data/WorkoutData';
import WorkoutDay from '@/components/WorkoutDay';

type Workout = {
  name: string;
  sets: number;
  reps?: string | number;
  duration?: string;
  rest?: string;
  work?: string;
  exercises?: {
    name: string;
    reps: number;
    duration?: string;
  }[];
};

type WeekWorkouts = {
  Monday: string;
  Tuesday: Workout[];
  Wednesday: Workout[];
  Thursday: Workout[];
  Friday: Workout[];
  Saturday: Workout[];
  Sunday: Workout[];
};

type WeekData = {
  week: number;
  workouts: WeekWorkouts;
};

export default function DayPage({ params }: { params: { weekNumber: string, dayName: string } }) {
  const router = useRouter();
  const weekNumber = parseInt(params.weekNumber);
  const dayName = params.dayName;
  const weekData = workoutData.weekly_workouts.find(w => w.week === weekNumber) as WeekData;

  if (!weekData || !weekData.workouts[dayName as keyof WeekWorkouts]) {
    return <div>Workout not found</div>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const handleWorkoutComplete = useCallback((day: string) => {
    setTimeout(() => {
      router.push(`/week/${weekNumber}?completed=${day}`);
    }, 3000);
  }, [weekNumber, router]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link href={`/week/${weekNumber}`} className="mb-4 text-blue-500 hover:underline">Back to Week {weekNumber}</Link>
      <h1 className="text-4xl font-bold mb-8">{dayName} - Week {weekNumber}</h1>
      <WorkoutDay 
        day={dayName} 
        workouts={weekData.workouts[dayName as keyof WeekWorkouts] as Workout[]} 
        onComplete={handleWorkoutComplete}
      />
    </main>
  );
}