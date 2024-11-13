import { useState, useEffect } from 'react';

interface TimerProps {
  isRunning: boolean;
}

const Timer: React.FC<TimerProps> = ({ isRunning }) => {
  const [time, setTime] = useState(0);
  // const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: number;
    if (isRunning) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, time]);

  useEffect(() => {
    if (isRunning) {
      setTime(0);
    }
  }, [isRunning]);

  const minutes = Math.floor((time % 360000) / 6000);
  const seconds = Math.floor((time % 6000) / 100);

  return (
    <div className="text-xl">
      {minutes.toString().padStart(2, '0')}:
      {seconds.toString().padStart(2, '0')}
    </div>
  );
};

export default Timer;
