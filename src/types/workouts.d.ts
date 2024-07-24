export type BaseWorkout = {
  name: string;
};

export type StandardWorkout = BaseWorkout & {
  sets: number;
  reps: string | number;
};

export type HIITWorkout = BaseWorkout & {
  sets: number;
  work: string;
  rest: string;
};

export type DurationWorkout = BaseWorkout & {
  duration: string;
};

export type CircuitWorkout = BaseWorkout & {
  sets: number;
  exercises: {
    name: string;
    reps: number | string;
    duration?: string;
  }[];
};

export type Workout = StandardWorkout | HIITWorkout | DurationWorkout | CircuitWorkout;

export type WeekWorkouts = {
  [key: string]: string | Workout[];
};

export type WeekData = {
  week: number;
  workouts: WeekWorkouts;
};