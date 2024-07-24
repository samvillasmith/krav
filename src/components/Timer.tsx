import React, { useState, useEffect } from 'react';

type TimerProps = {
  onComplete: () => void;
  onCancel: () => void;
};

const Timer: React.FC<TimerProps> = ({ onComplete, onCancel }) => {
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onComplete();
    }
  }, [seconds, onComplete]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 rounded-lg text-center">
        <h2 className="text-4xl font-bold mb-4 text-blue-400">Rest Time</h2>
        <p className="text-6xl mb-4 text-white">{seconds}</p>
        <button
          onClick={onCancel}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Timer;