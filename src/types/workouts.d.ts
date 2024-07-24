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

export type WeekWorkouts = {
Monday: string | Workout[];
Tuesday: Workout[];
Wednesday: Workout[];
Thursday: Workout[];
Friday: Workout[];
Saturday: Workout[];
Sunday: Workout[];
};

export type WeekData = {
week: number;
workouts: WeekWorkouts;
};