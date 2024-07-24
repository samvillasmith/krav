import { workoutData } from '../../../data/WorkoutData';
import WeekPageClient from './WeekPageClient';

export default function WeekPage({ params, searchParams }: { 
  params: { weekNumber: string },
  searchParams: { completed?: string }
}) {
  const weekNumber = parseInt(params.weekNumber);
  const weekData = workoutData.weekly_workouts.find(w => w.week === weekNumber);
  const justCompletedDay = searchParams.completed;

  if (!weekData) {
    return <div>Week not found</div>;
  }

  return <WeekPageClient weekNumber={weekNumber} weekData={weekData} justCompletedDay={justCompletedDay} />;
}

export function generateStaticParams() {
  return workoutData.weekly_workouts.map((week) => ({
    weekNumber: week.week.toString(),
  }));
}