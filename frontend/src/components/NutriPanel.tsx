import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface NutritionResponse {
  [ingredient: string]: Record<string, string | null>;
}

interface NutritionProfileProps {
  ingredientsString: string;
  isOpen: boolean;
  onClose: () => void;
  dark?: boolean;
  cachedData?: NutritionResponse;
  saveData: (key: string, data: NutritionResponse) => void;
}

export const NutritionProfile: React.FC<NutritionProfileProps> = ({
  ingredientsString,
  isOpen,
  onClose,
  dark = false,
  cachedData,
  saveData
}) => {
  const [data, setData] = useState<NutritionResponse | null>(cachedData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || cachedData) return;

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
        // console.log('Nutrition data:', resp.data);
        // console.log('Nutrition data:', typeof(resp.data.basmati_rice.Error));
        saveData(ingredientsString, resp.data); // cache it
      } catch (err: any) {
        console.error(err);
        setError('Failed to load nutrition data.');
      } finally {
        setLoading(false);
      }
    };

    fetchNutrition();
  }, [ingredientsString, isOpen, cachedData, saveData]);


  return (
<div
  className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-gradient-to-br ${
    dark ? 'from-yellow-900 via-yellow-800 to-yellow-700' : 'from-orange-100 via-orange-200 to-orange-300'
  } shadow-xl z-50 transform transition-transform duration-500 ease-in-out ${
    isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
  }`}
>
  {/* Header */}
  <div
    className={`flex justify-between items-center px-6 py-4 border-b ${
      dark ? 'border-yellow-600' : 'border-orange-500'
    }`}
  >
    <h2
      className={`text-xl font-bold ${
        dark ? 'text-yellow-100' : 'text-orange-800'
      } tracking-wide drop-shadow-md`}
    >
      🥗 Nutrition Profile
    </h2>
    <button
      onClick={onClose}
      className="text-xl transition-all duration-300 transform hover:scale-125 hover:text-red-400"
    >
      &times;
    </button>
  </div>

  {/* Content */}
  <div className="p-6 overflow-y-auto h-[calc(100%-4rem)]">
    {loading && (
      <p
        className={`text-lg font-semibold animate-pulse ${
          dark ? 'text-yellow-100' : 'text-orange-700'
        }`}
      >
        Loading nutrition data...
      </p>
    )}

    {error && (
      <p className="text-red-500 font-medium text-md">{error}</p>
    )}

    {!loading && !error && data && (
      <div className="space-y-6 animate-fade-in">
        {Object.entries(data).map(([ingredient, info], idx) => (
          <section
            key={ingredient}
            className={`p-4 rounded-2xl shadow-md bg-white/10 backdrop-blur-sm ${
              dark
                ? 'border border-yellow-600 text-yellow-100'
                : 'border border-orange-300 text-orange-800'
            } transition-transform duration-300 hover:scale-[1.02]`}
          >
            <h3
              className={`text-lg font-semibold uppercase mb-3 ${
                dark ? 'text-yellow-200' : 'text-orange-700'
              }`}
            >
              {ingredient}
            </h3>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            {Object.entries(info).map(([nutrient, value]) => {
  // Trim nutrient name and compare it to 'Error', ignoring case sensitivity
  if (nutrient.trim().toLowerCase() === 'error') {
    return null; // If it's 'Error', return null to skip this entry
  }
  return (
    <React.Fragment key={nutrient}>
      <dt className="font-medium capitalize">
        {nutrient.replace(/_/g, ' ')}
      </dt>
      <dd>
        {value ?? (
          <span className="opacity-50 italic">N/A</span>
        )}
      </dd>
    </React.Fragment>
  );
})}

            </dl>
          </section>
        ))}
      </div>
    )}
  </div>
</div>

  );
};
