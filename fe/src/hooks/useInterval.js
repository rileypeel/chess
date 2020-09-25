import React, { useState, useEffect, useRef } from 'react';

function useInterval(callback, delay, runTimer) {
  const savedCallback = useRef()
  const intervalId = useRef()
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect((test) => {
    function tick() {
      savedCallback.current()
    }
    console.log(test)
    if (runTimer) {
      intervalId.current = setInterval(tick, delay)
      console.log("should go when turn starts once")
    } else {
      console.log("should go when turn ends once")
      clearInterval(intervalId.current)
    }
  }, [runTimer])

  
}

export default useInterval