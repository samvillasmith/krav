// src/components/WeekProgress.tsx
import React, { useEffect, useState } from 'react';

type WeekProgressProps = {
  completedDays: string[];
  totalDays: number;
};

const WeekProgress: React.FC<WeekProgressProps> = ({ completedDays, totalDays }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculatedProgress = (completedDays.length / totalDays) * 100;
    setProgress(calculatedProgress);
    
    console.log('Completed days:', completedDays);
    console.log('Total days:', totalDays);
    console.log('Progress:', calculatedProgress);
  }, [completedDays, totalDays]);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default WeekProgress;