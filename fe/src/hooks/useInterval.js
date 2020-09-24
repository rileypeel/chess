import React, { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay, runTimer) {
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
      intervalId.current = setInterval(tick, delay)
    } else {
      console.log("clearing interval")
      clearInterval(intervalId.current)
    }
  }, [runTimer])

  
}

export default useInterval