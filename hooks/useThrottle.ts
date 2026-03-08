import { useState, useRef } from "react";

export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const [isThrottling, setIsThrottling] = useState(false);
  const lastRun = useRef<number>(0);

  return (...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = now;
      
      setIsThrottling(true);
      setTimeout(() => setIsThrottling(false), delay);
    }
  };
}