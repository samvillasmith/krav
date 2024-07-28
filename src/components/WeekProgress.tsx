import React, { useEffect, useState } from 'react';

type WeekProgressProps = {
  completedDays: string[];
  totalDays: number;
};

const WeekProgress: React.FC<WeekProgressProps> = ({ completedDays, totalDays }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculatedProgress = completedDays ? (completedDays.length / totalDays) * 100 : 0;
    setProgress(calculatedProgress);
  }, [completedDays, totalDays]);

  return (
    <div className="w-full bg-gray-700 rounded-full h-4">
      <div
        className="bg-blue-600 h-4 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default WeekProgress;