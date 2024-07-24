'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { Workout } from '@/types/workouts';

type WeekPageClientProps = {
  weekNumber: number;
  weekData: {
    week: number;
    workouts: {
      [key: string]: Workout[] | Workout | string;
    };
  };
  justCompletedDay?: string;
};

export default function WeekPageClient({ weekNumber, weekData, justCompletedDay }: WeekPageClientProps) {
  const [completedDays, setCompletedDays] = useState<string[]>([]);

  useEffect(() => {
    if (justCompletedDay) {
      setCompletedDays([justCompletedDay]);
    }
  }, [justCompletedDay]);

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link href="/" className="mb-4 text-blue-500 hover:underline">Back to All Weeks</Link>
      <h1 className="text-4xl font-bold mb-8">Week {weekNumber}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {Object.entries(weekData.workouts).map(([day, workout]) => (
          <Link 
            key={day} 
            href={`/week/${weekNumber}/day/${day}`}
             className="p-4 border rounded bg-gray-800 hover:bg-gray-700 flex items-center justify-between transition-colors duration-300"
          >
            <span>{day}</span>
            {completedDays.includes(day) && <FaCheckCircle className="text-green-500" />}
          </Link>
        ))}
      </div>
    </main>
  );
}