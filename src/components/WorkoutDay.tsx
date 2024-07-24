/* eslint-disable react-hooks/rules-of-hooks */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Workout } from '@/types/workout';
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

      if (currentSet < currentWorkout.sets) {
        setCurrentSet(prev => prev! + 1);
      } else if (currentWorkoutIndex < workouts.length - 1) {
        setCurrentExercise(workouts[currentWorkoutIndex + 1].name);
        setCurrentSet(1);
      }
    } else if (typeof workouts === 'object' && 'name' in workouts) {
      if (currentSet < workouts.sets) {
        setCurrentSet(prev => prev! + 1);
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

  const renderSet = useCallback((exerciseName: string, setNumber: number, goalReps: string) => {
    const [reps, setReps] = useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [weight, setWeight] = useState('');
    const isCurrentSet = currentExercise === exerciseName && currentSet === setNumber;
    const isCompleted = workoutRecord[exerciseName]?.some(set => set.setNumber === setNumber);

    return (
      <div 
        key={`${exerciseName}-set-${setNumber}`} 
        className={`flex flex-wrap items-center space-x-2 mb-2 p-2 rounded ${
          isCurrentSet 
            ? 'bg-gradient-to-r from-blue-900 to-blue-700' 
            : isCompleted
              ? 'bg-gradient-to-r from-green-900 to-green-700'
              : 'bg-gradient-to-r from-gray-900 to-gray-800'
        }`}
      >
        <span className={`w-12 text-xs sm:text-sm md:text-base ${isCurrentSet ? 'text-blue-200' : 'text-gray-300'}`}>Set {setNumber}</span>
        <span className={`w-16 text-xs sm:text-sm md:text-base ${isCurrentSet ? 'text-blue-200' : 'text-gray-300'}`}>Goal: {goalReps}</span>
        <input
          type="text"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="border bg-gray-800 text-white p-1 w-16 sm:w-20 text-xs sm:text-sm md:text-base mt-1"
          placeholder="Reps"
          disabled={isCompleted}
        />
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border bg-gray-800 text-white p-1 w-16 sm:w-20 text-xs sm:text-sm md:text-base mt-1"
          placeholder="Weight"
          disabled={isCompleted}
        />
        <button
          onClick={() => handleSetRecord(exerciseName, setNumber, reps, weight)}
          className={`${
            isCompleted 
              ? 'bg-green-600 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-bold py-1 px-2 rounded transition duration-300 text-xs sm:text-sm md:text-base mt-1`}
          disabled={isCompleted}
        >
          {isCompleted ? 'Completed' : 'Enter'}
        </button>
      </div>
    );
  }, [currentExercise, currentSet, handleSetRecord, workoutRecord]);

  const renderWorkout = useCallback((workout: Workout) => (
    <div key={workout.name} className="mb-6 p-4 border border-gray-700 rounded bg-gradient-to-r from-gray-900 to-gray-800">
      <h4 className="font-semibold text-lg mb-2 text-blue-400">{workout.name}</h4>
      {Array.from({ length: workout.sets }, (_, i) => i + 1).map(setNumber =>
        renderSet(workout.name, setNumber, workout.reps)
      )}
      {workout.work && workout.rest && (
        <p className="text-gray-300 text-xs sm:text-sm md:text-base">{workout.sets} rounds of {workout.work} work, {workout.rest} rest</p>
      )}
      {workout.duration && (
        <p className="text-gray-300 text-xs sm:text-sm md:text-base">{workout.duration}</p>
      )}
      {workout.exercises && (
        <ul className="list-disc list-inside text-gray-300 text-xs sm:text-sm md:text-base">
          {workout.exercises.map((exercise, i) => (
            <li key={i}>{exercise.name}: {exercise.reps || exercise.duration}</li>
          ))}
        </ul>
      )}
    </div>
  ), [renderSet]);

  return (
    <div className="mb-4 bg-gray-800 bg-opacity-50 p-4 rounded-lg hover:bg-opacity-70 transition-all duration-300">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-400 hover:text-black transition-colors duration-300">{day}</h3>
      {Array.isArray(workouts) ? (
        workouts.map(renderWorkout)
      ) : typeof workouts === 'object' ? (
        renderWorkout(workouts as Workout)
      ) : (
        <p className="text-gray-300 text-xs sm:text-sm md:text-base">{workouts}</p>
      )}
      <button
        onClick={finishWorkout}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300"
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