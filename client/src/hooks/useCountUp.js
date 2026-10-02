import { useState, useEffect } from 'react';
import useReducedMotion from './useReducedMotion';

/**
 * Custom hook to animate a number from 0 to `end` over `duration` ms.
 */
export function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setCount(end);
      return undefined;
    }
    let startTimestamp = null;
    let frameId;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      setCount(easeProgress * end);
      
      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };
    frameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frameId);
  }, [end, duration, reducedMotion]);

  return count;
}
