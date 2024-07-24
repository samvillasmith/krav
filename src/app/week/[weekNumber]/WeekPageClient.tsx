'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { WeekData, Workout } from '@/types/workouts';  // Import types from your types file
import WeekProgress from '@/components/WeekProgress';
import { useAuth } from '@clerk/nextjs';

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

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl font-bold mb-8">Week {weekNumber}</h1>
      <WeekProgress completedDays={completedDays} totalDays={Object.keys(weekData.workouts).length} />
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(weekData.workouts).map(([day, workouts]) => (
          <Link
            key={day}
            href={`/week/${weekNumber}/day/${day}`}
            className="p-4 border rounded hover:bg-gray-100 flex items-center"
          >
            <span>{day}</span>
            {(justCompletedDay === day || completedDays.includes(day.toLowerCase())) && (
              <FaCheckCircle className="ml-2 text-green-500" />
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}