import React, { useState } from "react"
import { Clock, ChevronRight, CheckCircle } from "lucide-react"
import type { Recipe } from "@/services/recipeService"
import RecipeTimer from "./RecipeTimer"

interface RecipeTimelineProps {
  recipe: Recipe
  onNextStep: () => void
  currentStep: number
  darkMode: boolean
}

const RecipeTimeline: React.FC<RecipeTimelineProps> = ({
  recipe,
  onNextStep,
  currentStep,
  darkMode,
}) => {
  const steps = Object.keys(recipe)
  const totalSteps = steps.length

  // Helper function to parse time from API and format it nicely
  const parseTimeFromAPI = (
    timeString: string | [number | null, number | null]
  ) => {
    if (!timeString) return { display: null, minTime: null, maxTime: null }

    let min = null
    let max = null

    // Handle different formats that might come from the API
    if (Array.isArray(timeString)) {
      ;[min, max] = timeString
    } else if (typeof timeString === "string") {
      // Check if in format "(X, Y)"
      const matches = timeString.match(/\((\d+),\s*(\d+)\)/)
      if (matches) {
        min = parseInt(matches[1], 10)
        max = parseInt(matches[2], 10)
      }
    }

    // Format for display
    if (min !== null && max !== null) {
      if (min === max) {
        return {
          display: `${min} min`,
          minTime: min,
          maxTime: max,
        }
      } else {
        return {
          display: `${min}-${max} min`,
          minTime: min,
          maxTime: max,
        }
      }
    }

    return { display: null, minTime: null, maxTime: null }
  }

  const capitalizeFirstLetter = (string: string) => {
    return string
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const formatSentenceCase = (text: string) => {
    if (!text) return ""
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  return (
    <div className="space-y-6 my-8">
      <div className="flex items-center justify-between mb-4">
        <h2
          className={`text-xl font-semibold ${
            darkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Recipe Steps
        </h2>
        <span
          className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}
        >
          Step {currentStep + 1} of {totalSteps}
        </span>
      </div>

      <div className="space-y-4">
        {steps.map((stepKey, index) => {
          const step = recipe[stepKey]
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          // Parse time information
          const {
            display: timeDisplay,
            minTime,
            maxTime,
          } = parseTimeFromAPI(step.time)

          return (
            <div
              key={stepKey}
              className={`border rounded-lg transition-all duration-300 ${
                isActive
                  ? `border-primary ${
                      darkMode ? "bg-gray-700/30" : "bg-primary-light"
                    } shadow-md`
                  : isCompleted
                  ? `${
                      darkMode
                        ? "border-gray-700 bg-gray-800/50"
                        : "border-gray-200 bg-gray-50"
                    }`
                  : darkMode
                  ? "border-gray-700"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start p-4">
                {/* Left Section - 80% Width */}
                <div className="flex items-start w-11/12">
                  {/* Step Indicator */}
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full border mr-3 flex-shrink-0 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-grow">
                    <h3
                      className={`font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Step {index + 1}
                    </h3>
                    <p
                      className={`mt-1 text-sm leading-snug px-4 ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      {formatSentenceCase(step.procedure)}
                    </p>
                  </div>
                </div>

                {/* Right Section - 20% Width (Time Display) */}
                {timeDisplay && (
                  <div
                    className={`w-1/12 flex items-center justify-center px-3 py-1 rounded-md ml-auto ${
                      darkMode
                        ? "bg-gray-700 text-gray-200"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium text-center">
                      {timeDisplay}
                    </span>
                  </div>
                )}
              </div>
              {isActive && (
                <div
                  className={`p-4 rounded-b-lg animate-fade-in ${
                    darkMode ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {step.measurements.length > 0 && (
                    <div className="mb-4">
                      <h4
                        className={`text-sm font-medium mb-2 ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        Ingredients for this step:
                      </h4>
                      <ul className="space-y-1">
                        {step.measurements.map(
                          ([ingredient, quantity], idx) => (
                            <li key={idx} className="flex text-sm">
                              <span
                                className={`font-medium w-24 ${
                                  darkMode ? "text-gray-200" : "text-gray-800"
                                }`}
                              >
                                {capitalizeFirstLetter(ingredient)}:
                              </span>
                              <span
                                className={
                                  darkMode ? "text-gray-300" : "text-gray-700"
                                }
                              >
                                {quantity}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {(minTime !== null || maxTime !== null) && (
                    <RecipeTimer
                      minTime={minTime}
                      maxTime={maxTime}
                      onComplete={() => {
                        // Text-to-speech when timer completes
                        if (index < totalSteps - 1) {
                          const speech = new SpeechSynthesisUtterance(
                            "This concludes this step, let's move to the next step."
                          )
                          window.speechSynthesis.speak(speech)
                        } else {
                          const speech = new SpeechSynthesisUtterance(
                            "Congratulations! You've completed all steps in this recipe."
                          )
                          window.speechSynthesis.speak(speech)
                        }
                      }}
                      darkMode={darkMode}
                    />
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={onNextStep}
                      className="flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors"
                      disabled={index === totalSteps - 1}
                    >
                      {index === totalSteps - 1 ? "Complete" : "Next"}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecipeTimeline
