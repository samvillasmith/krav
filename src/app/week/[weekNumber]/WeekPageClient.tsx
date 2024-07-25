'use client';

import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { Workout, WeekData } from '@/types/workouts';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import WeekProgress from '@/components/WeekProgress';

type WeekPageClientProps = {
  weekNumber: number;
  weekData: WeekData;
  justCompletedDay: string | null;
};

export default function WeekPageClient({ weekNumber, weekData, justCompletedDay }: WeekPageClientProps) {
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCompletedDays = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`/api/completedDays?week=${weekNumber}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCompletedDays(data.completedDays);
        } else {
          console.error('Failed to fetch completed days');
        }
      } catch (error) {
        console.error('Error fetching completed days:', error);
      }
    };

    fetchCompletedDays();
  }, [weekNumber, getToken]);

  const totalDays = Object.keys(weekData.workouts).length;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8">Week {weekNumber}</h1>
      <div className="w-full max-w-3xl">
        <WeekProgress completedDays={completedDays} totalDays={totalDays} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
        {Object.entries(weekData.workouts).map(([day, workouts]) => {
          const isCompleted = completedDays.includes(day.toLowerCase()) || justCompletedDay === day;
          
          const DayContent = (
            <div className="flex items-center justify-between w-full">
              <span className="text-lg font-semibold">{day}</span>
              {isCompleted && <FaCheckCircle className="text-green-500" />}
            </div>
          );

          const commonClasses = "p-4 border rounded-lg shadow-md w-full text-center transition-all duration-300";

          return isCompleted ? (
            <div
              key={day}
              className={`${commonClasses} bg-gray-200 cursor-not-allowed opacity-70`}
            >
              {DayContent}
            </div>
          ) : (
            <Link
              key={day}
              href={`/week/${weekNumber}/day/${day}`}
              className={`${commonClasses} bg-blue-600 hover:bg-blue-700 text-white`}
            >
              {DayContent}
            </Link>
          );
        })}
      </div>
    </main>
  );
}