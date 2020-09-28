import  { useEffect, useRef } from 'react';

function useInterval(callback, runTimer) {
  const savedCallback = useRef()
  const intervalId = useRef()
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (runTimer) {
      intervalId.current = setInterval(tick, 1000)
    } else {
      clearInterval(intervalId.current)
    }
  }, [runTimer])
}

export default useInterval