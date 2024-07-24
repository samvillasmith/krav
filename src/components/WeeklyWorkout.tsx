import React from 'react';
import { Workout } from '@/types/workouts';  // Update this line
import Link from 'next/link';

type WeeklyWorkoutProps = {
  weeklyWorkout: WeeklyWorkoutType;
};

const WeeklyWorkout: React.FC<WeeklyWorkoutProps> = ({ weeklyWorkout }) => {
  return (
    <div className="mb-8 bg-gray-800 bg-opacity-50 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Week {weeklyWorkout.week}</h2>
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
              {Array.isArray(workouts) 
                ? `${workouts.length} exercises` 
                : typeof workouts === 'object' 
                  ? workouts.name 
                  : workouts}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WeeklyWorkout;