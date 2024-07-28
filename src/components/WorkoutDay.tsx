/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useCallback } from 'react';
import { Workout, StandardWorkout, HIITWorkout, DurationWorkout, CircuitWorkout } from '@/types/workouts';
import Timer from './Timer';
import Toast from './Toast';
import { useAuth } from '@clerk/nextjs';

type WorkoutDayProps = {
  day: string;
  workouts: Workout[] | Workout | string;
  onComplete: (day: string) => void;
  weekNumber: number;
};

type SetRecord = {
  setNumber: number;
  reps: string;
  weight: string;
};

type WorkoutRecord = {
  [exerciseName: string]: SetRecord[];
};

const WorkoutDay: React.FC<WorkoutDayProps> = ({ day, workouts, onComplete, weekNumber }) => {
  const [workoutRecord, setWorkoutRecord] = useState<WorkoutRecord>({});
  const [currentExercise, setCurrentExercise] = useState<string | null>(null);
  const [currentSet, setCurrentSet] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { getToken } = useAuth();

  useEffect(() => {
    if (Array.isArray(workouts) && workouts.length > 0) {
      setCurrentExercise(workouts[0].name);
      setCurrentSet(1);
    } else if (typeof workouts === 'object' && 'name' in workouts) {
      setCurrentExercise(workouts.name);
      setCurrentSet(1);
    }
  }, [workouts]);

  const handleSetRecord = useCallback((exerciseName: string, setNumber: number, reps: string, weight: string) => {
    if (!reps.trim() || !weight.trim()) {
      alert('Please enter both reps and weight.');
      return;
    }

    setWorkoutRecord(prev => ({
      ...prev,
      [exerciseName]: [
        ...(prev[exerciseName] || []),
        { setNumber, reps, weight }
      ]
    }));
    console.log(`Workout for ${day} - ${exerciseName} Set ${setNumber}:`, { reps, weight });
    setShowTimer(true);
  }, [day]);

  const moveToNextSet = useCallback(() => {
    if (Array.isArray(workouts)) {
      const currentWorkoutIndex = workouts.findIndex(w => w.name === currentExercise);
      const currentWorkout = workouts[currentWorkoutIndex];

      if (currentSet !== null && currentWorkout) {
        if ('sets' in currentWorkout && currentSet < currentWorkout.sets) {
          setCurrentSet(prev => (prev !== null ? prev + 1 : 1));
        } else if (currentWorkoutIndex < workouts.length - 1) {
          setCurrentExercise(workouts[currentWorkoutIndex + 1].name);
          setCurrentSet(1);
        }
      }
    } else if (typeof workouts === 'object' && 'name' in workouts) {
      if ('sets' in workouts && currentSet !== null && currentSet < workouts.sets) {
        setCurrentSet(prev => (prev !== null ? prev + 1 : 1));
      }
    }
  }, [workouts, currentExercise, currentSet]);

  const finishWorkout = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch('/api/saveWorkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          day,
          workoutRecord,
          weekNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout');
      }

      setShowToast(true);
      onComplete(day);
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Failed to save workout. Please try again.');
    }
  }, [day, workoutRecord, onComplete, getToken, weekNumber]);

  const handleTimerComplete = useCallback(() => {
    setShowTimer(false);
    moveToNextSet();
  }, [moveToNextSet]);

  const handleTimerCancel = useCallback(() => {
    setShowTimer(false);
    moveToNextSet();
  }, [moveToNextSet]);

  const renderSet = useCallback((exerciseName: string, setNumber: number, goalReps: string | number) => {
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const isCurrentSet = currentExercise === exerciseName && currentSet === setNumber;
    const isCompleted = workoutRecord[exerciseName]?.some(set => set.setNumber === setNumber);

    return (
      <div
        key={`${exerciseName}-set-${setNumber}`}
        className={`mb-4 p-4 rounded-lg shadow-md ${
          isCurrentSet
            ? 'bg-blue-500'
            : isCompleted
              ? 'bg-green-500'
              : 'bg-gray-800'
        }`}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
          <span className={`text-lg font-semibold mb-2 md:mb-0 ${isCurrentSet || isCompleted ? 'text-white' : 'text-blue-400'}`}>
            Set {setNumber}
          </span>
          <span className={`text-lg font-semibold ${isCurrentSet || isCompleted ? 'text-white' : 'text-blue-400'}`}>
            Goal: {goalReps}
          </span>
        </div>
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="border border-gray-300 rounded p-2 bg-gray-700 text-white"
            placeholder="Reps"
            disabled={isCompleted}
          />
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border border-gray-300 rounded p-2 bg-gray-700 text-white"
            placeholder="Weight"
            disabled={isCompleted}
          />
          <button
            onClick={() => handleSetRecord(exerciseName, setNumber, reps, weight)}
            className={`${
              isCompleted
                ? 'bg-gray-400 cursor-not-allowed'
                : isCurrentSet
                  ? 'bg-gray-800 text-blue-400 hover:bg-gray-700'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
            } font-semibold py-2 px-4 rounded transition duration-300`}
            disabled={isCompleted}
          >
            {isCompleted ? 'Completed' : 'Enter'}
          </button>
        </div>
      </div>
    );
  }, [currentExercise, currentSet, handleSetRecord, workoutRecord]);

  const renderWorkout = useCallback((workout: Workout) => (
    <div key={workout.name} className="mb-8 p-4 bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-blue-400">{workout.name}</h3>
      {'sets' in workout && 'reps' in workout && Array.from({ length: workout.sets }, (_, i) => i + 1).map(setNumber =>
        renderSet(workout.name, setNumber, workout.reps)
      )}
      {'work' in workout && 'rest' in workout && (
        <p className="text-gray-300">{workout.sets} rounds of {workout.work} work, {workout.rest} rest</p>
      )}
      {'duration' in workout && (
        <p className="text-gray-300">{workout.duration}</p>
      )}
      {'exercises' in workout && (
        <ul className="list-disc list-inside text-gray-300">
          {workout.exercises.map((exercise, i) => (
            <li key={i}>{exercise.name}: {exercise.reps || exercise.duration}</li>
          ))}
        </ul>
      )}
    </div>
  ), [renderSet]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">{day}</h2>
      {Array.isArray(workouts) ? (
        workouts.map(renderWorkout)
      ) : typeof workouts === 'object' ? (
        renderWorkout(workouts as Workout)
      ) : (
        <p className="text-gray-300">{workouts}</p>
      )}
      <button
        onClick={finishWorkout}
        className="mt-8 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded transition duration-300 w-full md:w-auto"
      >
        Finish Workout
      </button>
      {showTimer && (
        <Timer onComplete={handleTimerComplete} onCancel={handleTimerCancel} />
      )}
      {showToast && (
        <Toast
          message="Congratulations! You've completed your workout!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default WorkoutDay;