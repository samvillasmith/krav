import React, { useEffect, useState } from 'react';
import { WeekWorkouts as WeeklyWorkoutType } from '@/types/workouts';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

type WeeklyWorkoutProps = {
  weeklyWorkout: WeeklyWorkoutType & { week: number };
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

  return (
    <div className="mb-8 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Week {weeklyWorkout.week}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(weeklyWorkout.workouts).map(([day, workouts]) => {
          const isCompleted = completedDays.includes(day.toLowerCase());
          
          const WorkoutContent = (
            <>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-400 hover:text-white transition-colors duration-300">
                {day}
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base">
                {Array.isArray(workouts) 
                  ? `${workouts.length} exercises` 
                  : typeof workouts === 'object' && 'name' in workouts
                    ? workouts.name 
                    : 'Unknown workout'}
              </p>
              {isCompleted && (
                <span className="text-green-500 mt-2 inline-block">✓ Completed</span>
              )}
            </>
          );

          return isCompleted ? (
            <div 
              key={day}
              className="mb-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg opacity-50"
            >
              {WorkoutContent}
            </div>
          ) : (
            <Link 
              key={day}
              href={`/week/${weeklyWorkout.week}/${day.toLowerCase()}`}
              className="mb-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              {WorkoutContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyWorkout;