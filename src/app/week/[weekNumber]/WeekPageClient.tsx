// src/app/week/[weekNumber]/WeekPageClient.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { WeekData } from '@/types/workout';
import WeekProgress from '@/components/WeekProgress';

type WeekPageClientProps = {
  weekNumber: number;
  weekData: WeekData;
};

export default function WeekPageClient({ weekNumber, weekData }: WeekPageClientProps) {
  const { getToken } = useAuth();
  const [completedDays, setCompletedDays] = useState<string[]>([]);

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
      <div className="grid grid-cols-3 gap-4 mt-8">
        {Object.entries(weekData.workouts).map(([day, workouts]) => {
          const isCompleted = completedDays.includes(day.toLowerCase());

          return (
            <Link
              key={day}
              href={isCompleted ? '#' : `/week/${weekNumber}/day/${day}`}
              className={`p-4 border rounded ${
                isCompleted ? 'bg-green-100 cursor-not-allowed' : 'hover:bg-gray-100'
              } flex items-center`}
            >
              <span>{day}</span>
              {isCompleted && <FaCheckCircle className="ml-2 text-green-500" />}
            </Link>
          );
        })}
      </div>
    </main>
  );
}