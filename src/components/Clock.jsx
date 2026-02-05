import React, { useEffect, useState } from 'react';

const Clock = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []); // ✅ dependency array ensures interval is set only once

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl md:text-7xl font-bold">
        {currentTime.toLocaleTimeString()}
      </h1>
      <p className="text-sm md:text-base font-medium">
        {currentTime.toLocaleDateString()}
      </p>
    </div>
  );
};

export default Clock;