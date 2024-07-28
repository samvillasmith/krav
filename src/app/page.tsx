"use client";

import Link from 'next/link'
import { workoutData } from '../data/WorkoutData';
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Krav</h1>
        <p className="mb-4">Please sign in to view your workouts</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold mb-8">Workout Phase {workoutData.phase}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {workoutData.weekly_workouts.map((week) => (
          <Link
            key={week.week}
            href={`/week/${week.week}`}
            className="bg-gray-800 p-6 rounded-lg shadow-md text-center transition duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-2">Week {week.week}</h2>
            <p className="text-gray-400">Click to view workouts</p>
          </Link>
        ))}
      </div>
    </main>
  );
}