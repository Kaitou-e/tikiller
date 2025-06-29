import { useEffect, useRef } from "react";
/*
function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

Fix error TS2554: Expected 1 arguments, but got 0.

4   const ref = useRef<T>();

deepseek suggested fix below
*/

function usePrevious<T>(value: T): T | undefined {
  // const ref = useRef<T>();
    // P suggested fix of the DS result...
  const ref = useRef<T | null>(null);
  //
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default usePrevious;
