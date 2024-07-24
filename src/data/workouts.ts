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