import React from 'react';
import { WeekData, Workout, BaseWorkout } from '@/types/workouts';
import Link from 'next/link';

type WeeklyWorkoutProps = {
  weeklyWorkout: WeekData;
};

const WeeklyWorkout: React.FC<WeeklyWorkoutProps> = ({ weeklyWorkout }) => {
  const renderWorkout = (workout: Workout) => {
    if ('sets' in workout && 'reps' in workout) {
      return `${workout.name} - ${workout.sets} sets, ${workout.reps} reps`;
    } else if ('duration' in workout) {
      return `${workout.name} - ${workout.duration}`;
    } else if ('work' in workout && 'rest' in workout) {
      return `${workout.name} - ${workout.sets} rounds of ${workout.work} work, ${workout.rest} rest`;
    } else if ('exercises' in workout) {
      return `${workout.name} - Circuit workout`;
    } else {
      // This case handles the BaseWorkout type or any unexpected workout type
      return (workout as BaseWorkout).name || 'Unknown workout';
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Week {weeklyWorkout.week}</h2>
      {Object.entries(weeklyWorkout.workouts).map(([day, workouts]) => (
        <div key={day} className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{day}</h3>
          {Array.isArray(workouts) ? (
            <ul>
              {workouts.map((workout, index) => (
                <li key={index} className="mb-1">
                  {renderWorkout(workout)}
                </li>
              ))}
            </ul>
          ) : (
            <p>{workouts}</p>
          )}
          <Link href={`/week/${weeklyWorkout.week}/day/${day}`} className="text-blue-500 hover:underline">
            View Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default WeeklyWorkout;