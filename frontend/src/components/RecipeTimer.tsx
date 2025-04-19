import React, { useState, useEffect, useRef } from "react"
import { Play, Pause, RefreshCw, Plus, Minus, Timer } from "lucide-react"

interface RecipeTimerProps {
  minTime: number | null
  maxTime: number | null
  onComplete: () => void
  darkMode: boolean
}

const RecipeTimer: React.FC<RecipeTimerProps> = ({
  minTime = 0,
  maxTime = 60,
  onComplete,
  darkMode,
}) => {
  // Store time in minutes for UI and seconds for countdown
  const [timeInMinutes, setTimeInMinutes] = useState(minTime || 0)
  const [timeInSeconds, setTimeInSeconds] = useState((minTime || 0) * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completed, setCompleted] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize timer based on provided minTime
  useEffect(() => {
    if (!isRunning && minTime !== null) {
      setTimeInMinutes(minTime)
      setTimeInSeconds(minTime * 60)
      setCompleted(false)
    }
  }, [minTime, isRunning])

  // Handle countdown logic
  useEffect(() => {
    if (isRunning && timeInSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTimeInSeconds((prevTime) => prevTime - 1)
        // Update minutes display when seconds change
        setTimeInMinutes((prev) => Math.ceil(timeInSeconds / 60))
      }, 1000)
    } else if (timeInSeconds === 0 && !completed && isRunning) {
      setCompleted(true)
      setIsRunning(false)
      onComplete()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeInSeconds, completed, onComplete])

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueInMinutes = parseInt(e.target.value, 10)
    if (!isNaN(valueInMinutes) && valueInMinutes >= 0) {
      setTimeInMinutes(valueInMinutes)
      setTimeInSeconds(valueInMinutes * 60)
      setCompleted(false)
    }
  }

  const increaseTime = () => {
    if (!isRunning) {
      const newTimeInMinutes = timeInMinutes + 1
      const maxTimeValue = maxTime || 60
      const finalTimeInMinutes = Math.min(newTimeInMinutes, maxTimeValue)

      setTimeInMinutes(finalTimeInMinutes)
      setTimeInSeconds(finalTimeInMinutes * 60)
      setCompleted(false)
    }
  }

  const decreaseTime = () => {
    if (!isRunning && timeInMinutes > 0) {
      const newTimeInMinutes = timeInMinutes - 1
      setTimeInMinutes(newTimeInMinutes)
      setTimeInSeconds(newTimeInMinutes * 60)
      setCompleted(false)
    }
  }

  const toggleTimer = () => {
    if (timeInSeconds === 0 && !isRunning) {
      // Reset timer to minTime if it's at 0
      const newTimeInMinutes = minTime || 0
      setTimeInMinutes(newTimeInMinutes)
      setTimeInSeconds(newTimeInMinutes * 60)
      setCompleted(false)
    }
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    const newTimeInMinutes = minTime || 0
    setTimeInMinutes(newTimeInMinutes)
    setTimeInSeconds(newTimeInMinutes * 60)
    setIsRunning(false)
    setCompleted(false)
  }

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <div
      className={`${darkMode ? "bg-gray-800" : "bg-gray-50"} p-4 rounded-lg`}
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center">
          <Timer className="h-5 w-5 text-primary mr-2" />
          <span
            className={`text-2xl font-mono font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {formatTime(timeInSeconds)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={decreaseTime}
            className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="Decrease time"
            disabled={isRunning || timeInMinutes <= 0}
          >
            <Minus size={16} />
          </button>

          <button
            onClick={toggleTimer}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors"
            aria-label={isRunning ? "Pause timer" : "Start timer"}
          >
            {isRunning ? <Pause size={16} /> : <Play size={16} />}
          </button>

          <button
            onClick={increaseTime}
            className={`p-2 rounded-full transition-colors disabled:opacity-50 ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="Increase time"
            disabled={
              isRunning || (maxTime !== null && timeInMinutes >= maxTime)
            }
          >
            <Plus size={16} />
          </button>

          <button
            onClick={resetTimer}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? "bg-gray-700 text-white hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            aria-label="Reset timer"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="w-full sm:w-auto">
          <input
            type="range"
            min={0}
            max={maxTime || 60}
            value={timeInMinutes}
            onChange={handleTimeChange}
            disabled={isRunning}
            className={`w-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}
            aria-label="Timer duration slider"
          />
        </div>
      </div>

      {completed && (
        <div
          className={`mt-2 text-sm ${
            darkMode ? "text-green-400" : "text-green-600"
          }`}
        >
          Timer completed! You can proceed to the next step.
        </div>
      )}
    </div>
  )
}

export default RecipeTimer
