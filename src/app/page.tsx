"use client";

import Link from 'next/link'
import { workoutData } from '../data/WorkoutData';
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Workout Tracker</h1>
        <p className="mb-4">Please sign in to view your workouts</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Workout Phase {workoutData.phase}</h1>
      <div className="grid grid-cols-3 gap-4">
        {workoutData.weekly_workouts.map((week) => (
          <Link 
            key={week.week} 
            href={`/week/${week.week}`}
            className="p-4 border rounded hover:bg-gray-100"
          >
            Week {week.week}
          </Link>
        ))}
      </div>
    </main>
  );
}