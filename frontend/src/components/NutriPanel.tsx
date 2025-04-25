import React, { useState } from 'react';
import axios from 'axios';

// Type definitions for the API response
export interface NutritionResponse {
  [ingredient: string]: Record<string, string | null>;
}

// Props for the NutritionProfile component
interface NutritionProfileProps {
  ingredientsString: string;
}

export const NutritionProfile: React.FC<NutritionProfileProps> = ({ ingredientsString }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<NutritionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNutrition = async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = { ingredients_string: ingredientsString };
      const resp = await axios.post<NutritionResponse>(
        'https://gem-api-adv.vercel.app/get_nutri',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );
      setData(resp.data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to load nutrition data.');
    } finally {
      setLoading(false);
    }
  };

  const openPanel = () => {
    setIsOpen(true);
    if (!data && !loading && !error) {
      fetchNutrition();
    }
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* <button
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
        onClick={openPanel}
      >
        Nutrition Profile
      </button> */}

      {/* Slide-over panel */}
      { (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closePanel}
          />

          {/* Panel */}
          <aside className="relative ml-auto w-full max-w-md bg-white dark:bg-gray-800 shadow-xl p-6 overflow-y-auto">
            <header className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Nutrition Profile
              </h2>
              <button
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900"
                onClick={closePanel}
                aria-label="Close"
              >
                ✕
              </button>
            </header>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {/* Render data dynamically */}
            {!loading && !error && data && (
              <div className="space-y-6">
                {Object.entries(data).map(([ingredient, info]) => (
                  <section key={ingredient}>
                    <h3 className="text-md font-medium uppercase text-gray-800 dark:text-gray-200 mb-2">
                      {ingredient}
                    </h3>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(info).map(([nutrient, value]) => (
                        <React.Fragment key={nutrient}>
                          <dt className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {nutrient.replace(/_/g, ' ')}
                          </dt>
                          <dd className="text-sm text-gray-800 dark:text-gray-200">
                            {value ?? 'N/A'}
                          </dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </section>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
};
