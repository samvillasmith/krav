export type Workout = {
    name: string;
    sets: number;
    reps: string | number;
    duration?: string;
    rest?: string;
    work?: string;
    exercises?: {
      name: string;
      reps: number;
      duration?: string;
    }[];
  };

  // types.ts

export type BaseWorkout = {
  name: string;
  sets: number;
};

export type StandardWorkout = BaseWorkout & {
  reps: string;
};

export type HIITWorkout = BaseWorkout & {
  work: string;
  rest: string;
};

export type CircuitExercise = {
  name: string;
  reps: number | string;
  duration?: string;
};

export type CircuitWorkout = {
  name: string;
  sets: number;
  exercises: CircuitExercise[];
};

export type CardioWorkout = {
  name: string;
  duration: string;
};

export type DailyWorkout = StandardWorkout | HIITWorkout | CircuitWorkout | CardioWorkout;

export type WeekData = {
  week: number;
  workouts: {
    [key: string]: DailyWorkout[] | string;
  };
};

export type WorkoutData = {
  phase: number;
  duration: string;
  weekly_workouts: WeekData[];
};