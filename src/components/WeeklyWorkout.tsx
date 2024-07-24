import React, { useEffect, useState } from 'react';
import { WeekData, Workout } from '@/types/workouts';
import Link from 'next/link';
import WeekProgress from './WeekProgress';
import { useAuth } from '@clerk/nextjs';

type WeeklyWorkoutProps = {
  weeklyWorkout: WeekData;
};

const WeeklyWorkout: React.FC<WeeklyWorkoutProps> = ({ weeklyWorkout }) => {
  const [completedDays, setCompletedDays] = useState<string[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCompletedDays = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`/api/completedDays?week=${weeklyWorkout.week}`, {
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
  }, [weeklyWorkout.week, getToken]);

  const getWorkoutDescription = (workouts: string | Workout[]): string => {
    if (Array.isArray(workouts)) {
      return `${workouts.length} exercises`;
    } else if (typeof workouts === 'string') {
      return workouts;
    } else {
      return 'Unknown workout type';
    }
  };

  return (
    <div className="mb-8 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Week {weeklyWorkout.week}</h2>
      <WeekProgress completedDays={completedDays} totalDays={Object.keys(weeklyWorkout.workouts).length} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(weeklyWorkout.workouts).map(([day, workouts]) => (
          <Link 
            key={day} 
            href={`/week/${weeklyWorkout.week}/${day.toLowerCase()}`}
            className="mb-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg hover:bg-opacity-70 transition-all duration-300"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-400 hover:text-black transition-colors duration-300">
              {day}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base">
              {getWorkoutDescription(workouts)}
            </p>
            {completedDays.includes(day.toLowerCase()) && (
              <span className="text-green-500 ml-2">✓</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WeeklyWorkout;