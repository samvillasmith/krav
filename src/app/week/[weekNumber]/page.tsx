'use client';

import { useSearchParams } from 'next/navigation';
import WeekPageClient from './WeekPageClient';
import { workoutData } from '@/data/WorkoutData';
import { WeekData } from '@/types/workouts';

export default function WeekPage({ params }: { params: { weekNumber: string } }) {
  const weekNumber = parseInt(params.weekNumber);
  const searchParams = useSearchParams();
  const justCompletedDay = searchParams.get('completed') || undefined;

  const weekData = workoutData.weekly_workouts.find(w => w.week === weekNumber) as WeekData;
  if (!weekData) {
    return <div>Week not found</div>;
  }

  return <WeekPageClient weekNumber={weekNumber} weekData={weekData} justCompletedDay={justCompletedDay} />;
}