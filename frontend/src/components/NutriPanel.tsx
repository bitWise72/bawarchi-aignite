import React, { useState, useEffect } from "react"
import axios from "axios"

export interface NutritionResponse {
  [ingredient: string]: Record<string, string | null>;
}

interface Step {
  measurements: [string, string][];
}

interface NutritionProfileProps {
  ingredientsString: string | string[];
  isOpen: boolean;
  onClose: () => void;
  dark?: boolean;
  cachedData?: NutritionResponse;
  saveData: (key: string, data: NutritionResponse) => void;
}

const unitMap: Record<string, string> = {
  calories: 'kcal',
  protein: 'g',
  carbohydrates: 'g',
  fat: 'g',
  fiber: 'g',
  sugar: 'g',
  sodium: 'mg',
  cholesterol: 'mg',
  potassium: 'mg',
  calcium: 'mg',
  iron: 'mg',
  vitamin_c: 'mg',
  vitamin_d: 'IU',
  vitamin_b12: 'µg',
  magnesium: 'mg',
  zinc: 'mg',
};


export const NutritionProfile: React.FC<NutritionProfileProps> = ({
  ingredientsString,
  isOpen,
  onClose,
  dark = false,
  cachedData,
  saveData,
}) => {
  const [data, setData] = useState<NutritionResponse | null>(cachedData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<Record<string, number>>({});

  function convertToJSON(ingredientsString: string | string[]) {
    let steps: { [x: string]: { measurements: any; }; };
    try {
      const stringToParse = Array.isArray(ingredientsString) ? ingredientsString.join(',') : ingredientsString;
      steps = JSON.parse(stringToParse);
    } catch (error) {
      return "Error: Invalid input data";
    }
  
    let ingredientsArray = [];
  
    Object.keys(steps).forEach(step => {
      const measurements = steps[step]?.measurements;
      if (measurements) {
        measurements.forEach((item: [any, any]) => {
          const [name, measurement] = item;
          ingredientsArray.push(`("${name}", "${measurement}")`);
        });
      }
    });
  
    if (ingredientsArray.length === 0) {
      return JSON.stringify({"ingredients_string": "No ingredients found"});
    }
  
    const ingredientsStringFormatted = `ingredients: ${ingredientsArray.join(', ')}`;
  
    // Constructing the desired JSON format
    const result = {
      "ingredients_string": ingredientsStringFormatted
    };
  
    return result;
  }

  useEffect(() => {
    if (!isOpen || cachedData) return

    const fetchNutrition = async () => {
      setLoading(true)
      setError(null)
      try {
        // console.log(ingredientsString);

    const payload = convertToJSON(ingredientsString);
    // console.log(payload);

try {
  // const resp = await axios.post<NutritionResponse>(
  //   'https://gem-api-adv.vercel.app/get_nutri',
  //   payload,
  //   { headers: { 'Content-Type': 'application/json' } }
  // );
  const resp = await fetch('https://get-nutri.vercel.app/get_nutri', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await resp.json();
  setData(data);
  const cacheKey = 'nutrition_data_';
  saveData(cacheKey, data);
} catch (error) {
  console.error('Error fetching nutrition data:', error);
}


      } catch (err: any) {
        console.error(err)
        setError("Failed to load nutrition data.")
      } finally {
        setLoading(false)
      }
    }

    fetchNutrition()
  }, [ingredientsString])

  useEffect(() => {
    if (!data) return

    const newTotals: Record<string, number> = {}

    Object.values(data).forEach((info) => {
      Object.entries(info).forEach(([nutrient, value]) => {
        if (nutrient.trim().toLowerCase() === "error") return
        const numericValue = parseFloat(value || "0")
        if (isNaN(numericValue) || numericValue === 0) return
        newTotals[nutrient] = (newTotals[nutrient] || 0) + numericValue
      })
    })

    setTotals(newTotals)
  }, [data])

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full sm:w-[420px] shadow-xl z-50 transform transition-transform duration-500 ease-in-out font-sans
      ${
        dark
          ? "bg-oxford-blue-500 text-snow-DEFAULT"
          : "bg-anti-flash-white-500 text-gunmetal-DEFAULT"
      }
 ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
    >
      {/* Header */}
      <div
        className={`flex justify-between items-center px-6 py-4 border-b
 ${dark ? "border-oxford-blue-400" : "border-anti-flash-white-400"}`}
      >
        <h2
          className={`text-xl font-bold tracking-wide drop-shadow-md
 ${dark ? "text-snow-400" : "text-gunmetal-700"}`}
        >
          🥗 Nutrition Profile
        </h2>

        <button
          onClick={onClose}
          className={`text-xl transition-all duration-300 transform hover:scale-125
 ${
   dark
     ? "text-snow-DEFAULT hover:text-cardinal-DEFAULT"
     : "text-gunmetal-DEFAULT hover:text-cardinal-DEFAULT"
 }`}
        >
          &times;
        </button>
      </div>
      {/* Scrollable Content */}
      <div className="p-6 h-full overflow-y-auto space-y-8">
        {/* Added space-y-8 */} {/* Total Nutrition Panel */}
        {!loading && !error && totals && (
          <section
            className={`p-4 rounded-2xl shadow-md bg-white/10 backdrop-blur-sm
 ${
   dark
     ? "border border-oxford-blue-400 text-snow-DEFAULT"
     : "border border-anti-flash-white-400 text-gunmetal-DEFAULT"
 }
 transition-transform duration-300 hover:scale-[1.02]`}
          >
            <h3
              className={`text-lg font-semibold uppercase mb-3
 ${dark ? "text-snow-500" : "text-gunmetal-600"}`}
            >
              Total Nutrition
            </h3>

            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {Object.entries(totals).map(([nutrient, value]) => {
                return (
                  <React.Fragment key={nutrient}>
                    <dt className="font-medium capitalize">
                      {nutrient.replace(/_/g, " ")}
                    </dt>
                    <dd>
                      {value.toFixed(2)} {unitMap[nutrient] || ""}
                    </dd>
                    {/* Removed pb-5 */}
                  </React.Fragment>
                )
              })}
            </dl>
          </section>
        )}
        {/* Content */}
        {loading && (
          <p
            className={`text-lg font-semibold animate-pulse
 ${dark ? "text-snow-300" : "text-gunmetal-600"}`}
          >
            Loading nutrition data...
          </p>
        )}
        {error && (
          <p className="text-cardinal-DEFAULT font-medium text-md">{error}</p>
        )}
        {!loading && !error && data && (
          <div className="space-y-8 animate-fade-in">
            {/* Changed space-y-10 to space-y-8 and removed mb-5 */}
            {Object.entries(data).map(([ingredient, info]) => {
              const hasMeaningfulData = Object.entries(info).some(
                ([nutrient, value]) => {
                  const lowerNutrient = nutrient.trim().toLowerCase()
                  if (
                    lowerNutrient === "error" ||
                    lowerNutrient === "quantity"
                  ) {
                    return false
                  }
                  if (typeof value === "string") {
                    const lowerValue = value.toLowerCase()
                    return !(
                      lowerValue.includes("n/a") ||
                      lowerValue.includes("data not available") ||
                      lowerValue.trim() === "0" ||
                      lowerValue.trim() === "0 g" ||
                      lowerValue.trim() === "0g" ||
                      lowerValue.trim() === "0 kcal"
                    )
                  }
                  return value !== 0 && value !== null
                }
              )

              if (!hasMeaningfulData) {
                return null // skip the whole ingredient
              }

              return (
                <section
                  key={ingredient}
                  className={`p-4 rounded-2xl shadow-md bg-white/10 backdrop-blur-sm
 ${
   dark
     ? "border border-oxford-blue-400 text-snow-DEFAULT"
     : "border border-anti-flash-white-400 text-gunmetal-DEFAULT"
 }
 transition-transform duration-300 hover:scale-[1.02]`}
                >
                  <h3
                    className={`text-lg font-semibold uppercase mb-3
 ${dark ? "text-snow-500" : "text-gunmetal-600"}`}
                  >
                    {ingredient}
                  </h3>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    {Object.entries(info).map(([nutrient, value]) => {
                      const lowerNutrient = nutrient.trim().toLowerCase()
                      if (
                        lowerNutrient === "error" ||
                        lowerNutrient === "quantity"
                      ) {
                        return null
                      }
                      if (typeof value === "string") {
                        const lowerValue = value.toLowerCase()
                        if (
                          lowerValue.includes("n/a") ||
                          lowerValue.includes("data not available") ||
                          lowerValue.trim() === "0" ||
                          lowerValue.trim() === "0 g" ||
                          lowerValue.trim() === "0g" ||
                          lowerValue.trim() === "0 kcal"
                        ) {
                          return null // skip this nutrient
                        }
                      } else if (value === 0 || value === null) {
                        return null
                      }

                      return (
                        <React.Fragment key={nutrient}>
                          <dt className="font-medium capitalize">
                            {nutrient.replace(/_/g, " ")}
                          </dt>
                          <dd>{value}</dd>
                        </React.Fragment>
                      )
                    })}
                  </dl>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
