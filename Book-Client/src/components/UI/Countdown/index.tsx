import React, { useState, useEffect } from 'react';

const CountDown = () => {
    const getEndDate = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2).getTime();
      };
    
      // Initialize state with the time remaining and the end date
      const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });
      const [endDate, setEndDate] = useState(getEndDate());
    
      useEffect(() => {
        // Update the countdown every second
        const interval = setInterval(() => {
          const now = new Date().getTime();
          const distance = endDate - now;
    
          // Calculate time left
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
          // Update state with the new time left
          setTimeLeft({ days, hours, minutes, seconds });
    
          // If we reach the end date, reset countdown for next day
          if (distance < 0) {
            setEndDate(getEndDate());
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          }
        }, 1000);
    
        // Clean up the interval on component unmount
        return () => clearInterval(interval);
      }, [endDate]);

  return (
    <>
      <div className="grid grid-flow-col gap-4 text-center items-center auto-cols-max border-rose-500 border rounded-md px-2 py-1">
        <div className="flex flex-col px-2 leading-none text-red-500">
          <span className="countdown font-semibold">
            {timeLeft.days.toString().padStart(2, '0')}
          </span>
          days
        </div>
        <div className="flex flex-col px-2 leading-none text-red-500">
          <span className="countdown font-semibold leading-3">
            {timeLeft.hours.toString().padStart(2, '0')}
          </span>
          hours
        </div>
        <div className="flex flex-col px-2 leading-none text-red-500">
          <span className="countdown font-semibold  leading-3">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </span>
          min
        </div>
        <div className="flex flex-col px-2 leading-none text-red-500">
          <span className="countdown font-semibold leading-3">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </span>
          sec
        </div>
      </div>
    </>
  )
}

export default CountDown;
