// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FiUser, FiHeart, FiLock, FiMail, FiEdit, FiSave, FiPlus, FiX } from 'react-icons/fi';

// const ProfileDashboard = () => {
//   const storedUser = localStorage.getItem("user");
//   const [activeTab, setActiveTab] = useState('user');
//   const [editMode, setEditMode] = useState(false);
//   const [userData, setUserData] = useState({
//     name: `${storedUser ? JSON.parse(storedUser).name : ''}`,
//     email: `${storedUser ? JSON.parse(storedUser).email : ''}`,
//     password: ''
//   });
//   const [healthData, setHealthData] = useState({
//     allergies: [],
//     intolerances: [],
//     conditions: [],
//     diet: '',
//     weightGoal: '',
//     deficiencies: [],
//     aversions: [],
//     age: 0,
//     sex: '',
//     activity: '',
//     preferences: []
//   });

//   const handleInputChange = (e, section, field) => {
//     if (section === 'user') {
//       setUserData({ ...userData, [field]: e.target.value });
//     } else {
//       if (field === 'macros') {
//         setHealthData({
//           ...healthData,
//           // macros: { ...healthData.macros, [e.target.name]: parseInt(e.target.value) || 0 }
//         });
//       } else {
//         setHealthData({ ...healthData, [field]: e.target.value });
//       }
//     }
//   };

//   const handleArrayInput = (e, field) => {
//     const value = e.target.value;
//     if (e.key === 'Enter' && value.trim()) {
//       setHealthData({
//         ...healthData,
//         [field]: [...healthData[field], value.trim()]
//       });
//       e.target.value = '';
//     }
//   };

//   const removeItem = (field, index) => {
//     setHealthData({
//       ...healthData,
//       [field]: healthData[field].filter((_, i) => i !== index)
//     });
//   };

//   const saveData = () => {
//     setEditMode(false);
//     console.log('Data saved:', { userData, healthData });
//   };

//   return (
//     <div className="flex h-screen bg-gray-50 text-gray-800 overflow-hidden font-sans">
//     {/* Sidebar */}
//     <motion.div 
//       initial={{ x: -100 }}
//       animate={{ x: 0 }}
//       transition={{ duration: 0.5 }}
//       className="w-64 bg-indigo-700 text-white shadow-lg hidden md:block"
//     >
//       <div className="p-6">
//         <h1 className="text-2xl font-bold font-serif">Health Profile</h1>
//         <div className="mt-10 space-y-2">
//           <button
//             onClick={() => setActiveTab('user')}
//             className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab === 'user' ? 'bg-indigo-900 font-medium' : 'hover:bg-indigo-800'}`}
//           >
//             <FiUser className="mr-3" />
//             User Details
//           </button>
//           <button
//             onClick={() => setActiveTab('health')}
//             className={`flex items-center w-full p-3 rounded-lg transition-all ${activeTab === 'health' ? 'bg-indigo-900 font-medium' : 'hover:bg-indigo-800'}`}
//           >
//             <FiHeart className="mr-3" />
//             Health Details
//           </button>
//         </div>
//       </div>
//     </motion.div>

//     {/* Mobile Sidebar Toggle */}
//     <div className="md:hidden fixed bottom-4 right-4 z-50">
//       <button
//         onClick={() => setActiveTab(prev => prev === 'user' ? 'health' : 'user')}
//         className="bg-indigo-600 text-white p-3 rounded-full shadow-lg"
//       >
//         {activeTab === 'user' ? <FiHeart size={24} /> : <FiUser size={24} />}
//       </button>
//     </div>

//     {/* Main Content */}
//     <div className="flex-1 overflow-y-auto p-4 md:p-6">
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={activeTab}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white rounded-xl shadow-md p-4 md:p-6"
//         >
//           {activeTab === 'user' ? (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl md:text-2xl font-semibold font-serif">User Details</h2>
//                 {editMode ? (
//                   <button
//                     onClick={saveData}
//                     className="flex items-center bg-green-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-green-700 transition-colors text-sm md:text-base"
//                   >
//                     <FiSave className="mr-2" />
//                     Save
//                   </button>
//                 ) : (
//                   <button
//                     onClick={() => setEditMode(true)}
//                     className="flex items-center bg-indigo-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base"
//                   >
//                     <FiEdit className="mr-2" />
//                     Edit
//                   </button>
//                 )}
//               </div>

//               <div className="space-y-4">
//                 <div className="flex items-center">
//                   <FiUser className="text-gray-500 mr-3 text-lg md:text-xl" />
//                   <div className="flex-1">
//                     <label className="block text-xs md:text-sm text-gray-500">Full Name</label>
//                     {editMode ? (
//                       <input
//                         type="text"
//                         value={userData.name}
//                         onChange={(e) => handleInputChange(e, 'user', 'name')}
//                         className="w-full p-2 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none text-base md:text-lg"
//                       />
//                     ) : (
//                       <p className="text-base md:text-lg">{userData.name || <span className="text-gray-400">Not provided</span>}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <FiMail className="text-gray-500 mr-3 text-lg md:text-xl" />
//                   <div className="flex-1">
//                     <label className="block text-xs md:text-sm text-gray-500">Email</label>
//                     {editMode ? (
//                       <input
//                         type="email"
//                         value={userData.email}
//                         onChange={(e) => handleInputChange(e, 'user', 'email')}
//                         className="w-full p-2 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none text-base md:text-lg"
//                       />
//                     ) : (
//                       <p className="text-base md:text-lg">{userData.email || <span className="text-gray-400">Not provided</span>}</p>
//                     )}
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <FiLock className="text-gray-500 mr-3 text-lg md:text-xl" />
//                   <div className="flex-1">
//                     <label className="block text-xs md:text-sm text-gray-500">Password</label>
//                     {editMode ? (
//                       <input
//                         type="password"
//                         value={userData.password}
//                         onChange={(e) => handleInputChange(e, 'user', 'password')}
//                         className="w-full p-2 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none text-base md:text-lg"
//                       />
//                     ) : (
//                       <p className="text-base md:text-lg">{userData.password || <span className="text-gray-400">Not provided</span>}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div>
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl md:text-2xl font-semibold font-serif">Health Details</h2>
//                 <button
//                   onClick={() => setEditMode(!editMode)}
//                   className={`flex items-center ${editMode ? 'bg-green-600' : 'bg-indigo-600'} text-white px-3 py-1 md:px-4 md:py-2 rounded-lg hover:opacity-90 transition-opacity text-sm md:text-base`}
//                 >
//                   {editMode ? (
//                     <>
//                       <FiSave className="mr-2" />
//                       Save
//                     </>
//                   ) : (
//                     <>
//                       <FiEdit className="mr-2" />
//                       Edit
//                     </>
//                   )}
//                 </button>
//               </div>

//               <div className="space-y-4 md:space-y-6">
//                 {/* Allergies */}
//                 <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Allergies</h3>
//                   {healthData.allergies.length > 0 || editMode ? (
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       {healthData.allergies.map((item, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ scale: 0.9 }}
//                           animate={{ scale: 1 }}
//                           className="bg-red-100 text-red-800 px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center text-sm md:text-base"
//                         >
//                           {item}
//                           {editMode && (
//                             <button
//                               onClick={() => removeItem('allergies', index)}
//                               className="ml-1 md:ml-2 text-red-600 hover:text-red-900"
//                             >
//                               <FiX size={12} className="md:size-[14px]" />
//                             </button>
//                           )}
//                         </motion.div>
//                       ))}
//                       {editMode && (
//                         <div className="relative w-full md:w-auto">
//                           <input
//                             type="text"
//                             onKeyDown={(e) => handleArrayInput(e, 'allergies')}
//                             placeholder="Add allergy"
//                             className="pl-3 pr-8 py-1 border-2 border-gray-200 rounded-full focus:border-indigo-500 outline-none text-sm w-full"
//                           />
//                           <FiPlus className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 italic text-sm md:text-base">No allergies recorded</p>
//                   )}
//                 </div>

//                 {/* Intolerances */}
//                 <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Intolerances</h3>
//                   {healthData.intolerances.length > 0 || editMode ? (
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       {healthData.intolerances.map((item, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ scale: 0.9 }}
//                           animate={{ scale: 1 }}
//                           className="bg-amber-100 text-amber-800 px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center text-sm md:text-base"
//                         >
//                           {item}
//                           {editMode && (
//                             <button
//                               onClick={() => removeItem('intolerances', index)}
//                               className="ml-1 md:ml-2 text-amber-600 hover:text-amber-900"
//                             >
//                               <FiX size={12} className="md:size-[14px]" />
//                             </button>
//                           )}
//                         </motion.div>
//                       ))}
//                       {editMode && (
//                         <div className="relative w-full md:w-auto">
//                           <input
//                             type="text"
//                             onKeyDown={(e) => handleArrayInput(e, 'intolerances')}
//                             placeholder="Add intolerance"
//                             className="pl-3 pr-8 py-1 border-2 border-gray-200 rounded-full focus:border-indigo-500 outline-none text-sm w-full"
//                           />
//                           <FiPlus className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 italic text-sm md:text-base">No intolerances recorded</p>
//                   )}
//                 </div>

//                 {/* Diet */}
//                 <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Diet</h3>
//                   {editMode ? (
//                     <select
//                       value={healthData.diet}
//                       onChange={(e) => handleInputChange(e, 'health', 'diet')}
//                       className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm md:text-base"
//                     >
//                       <option value="">Select diet</option>
//                       <option value="Vegetarian">Vegetarian</option>
//                       <option value="Vegan">Vegan</option>
//                       <option value="Paleo">Paleo</option>
//                       <option value="Keto">Keto</option>
//                       <option value="Mediterranean">Mediterranean</option>
//                     </select>
//                   ) : (
//                     <p className="text-base md:text-lg">{healthData.diet || <span className="text-gray-400">Not specified</span>}</p>
//                   )}
//                 </div>

//                 {/* Weight Goal */}
//                 <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Weight Goal</h3>
//                   {editMode ? (
//                     <select
//                       value={healthData.weightGoal}
//                       onChange={(e) => handleInputChange(e, 'health', 'weightGoal')}
//                       className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm md:text-base"
//                     >
//                       <option value="">Select weight goal</option>
//                       <option value="Lose weight">Lose weight</option>
//                       <option value="Gain weight">Gain weight</option>
//                       <option value="Maintain weight">Maintain weight</option>
//                     </select>
//                   ) : (
//                     <p className="text-base md:text-lg">{healthData.weightGoal || <span className="text-gray-400">Not specified</span>}</p>
//                   )}
//                 </div>

//                 {/* Macros */}
//                 {/* <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Macronutrients (g/day)</h3>
//                   <div className="grid grid-cols-3 gap-2 md:gap-4">
//                     {['protein', 'carbs', 'fat'].map((macro) => (
//                       <div key={macro}>
//                         <label className="block text-xs md:text-sm font-medium text-gray-500 mb-1 capitalize">{macro}</label>
//                         {editMode ? (
//                           <input
//                             type="number"
//                             name={macro}
//                             value={healthData.macros[macro]}
//                             onChange={(e) => handleInputChange(e, 'health', 'macros')}
//                             className="w-full p-1 md:p-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm md:text-base"
//                           />
//                         ) : (
//                           <p className="text-base md:text-lg">
//                             {healthData.macros[macro] > 0 ? healthData.macros[macro] : <span className="text-gray-400">Not set</span>}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div> */}

//                 {/* Deficiencies */}
//                 <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Nutrient Deficiencies</h3>
//                   {healthData.deficiencies.length > 0 || editMode ? (
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       {healthData.deficiencies.map((item, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ scale: 0.9 }}
//                           animate={{ scale: 1 }}
//                           className="bg-blue-100 text-blue-800 px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center text-sm md:text-base"
//                         >
//                           {item}
//                           {editMode && (
//                             <button
//                               onClick={() => removeItem('deficiencies', index)}
//                               className="ml-1 md:ml-2 text-blue-600 hover:text-blue-900"
//                             >
//                               <FiX size={12} className="md:size-[14px]" />
//                             </button>
//                           )}
//                         </motion.div>
//                       ))}
//                       {editMode && (
//                         <div className="relative w-full md:w-auto">
//                           <input
//                             type="text"
//                             onKeyDown={(e) => handleArrayInput(e, 'deficiencies')}
//                             placeholder="Add deficiency"
//                             className="pl-3 pr-8 py-1 border-2 border-gray-200 rounded-full focus:border-indigo-500 outline-none text-sm w-full"
//                           />
//                           <FiPlus className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 italic text-sm md:text-base">No deficiencies recorded</p>
//                   )}
//                 </div>

//                 {/* Aversions */}
//                 {/* <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Food Aversions</h3>
//                   {healthData.aversions.length > 0 || editMode ? (
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       {healthData.aversions.map((item, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ scale: 0.9 }}
//                           animate={{ scale: 1 }}
//                           className="bg-gray-100 text-gray-800 px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center text-sm md:text-base"
//                         >
//                           {item}
//                           {editMode && (
//                             <button
//                               onClick={() => removeItem('aversions', index)}
//                               className="ml-1 md:ml-2 text-gray-600 hover:text-gray-900"
//                             >
//                               <FiX size={12} className="md:size-[14px]" />
//                             </button>
//                           )}
//                         </motion.div>
//                       ))}
//                       {editMode && (
//                         <div className="relative w-full md:w-auto">
//                           <input
//                             type="text"
//                             onKeyDown={(e) => handleArrayInput(e, 'aversions')}
//                             placeholder="Add aversion"
//                             className="pl-3 pr-8 py-1 border-2 border-gray-200 rounded-full focus:border-indigo-500 outline-none text-sm w-full"
//                           />
//                           <FiPlus className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 italic text-sm md:text-base">No food aversions recorded</p>
//                   )}
//                 </div> */}

//                 {/* Preferences */}
//                 {/* <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Food Preferences</h3>
//                   {healthData.preferences.length > 0 || editMode ? (
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       {healthData.preferences.map((item, index) => (
//                         <motion.div
//                           key={index}
//                           initial={{ scale: 0.9 }}
//                           animate={{ scale: 1 }}
//                           className="bg-green-100 text-green-800 px-2 py-1 md:px-3 md:py-1 rounded-full flex items-center text-sm md:text-base"
//                         >
//                           {item}
//                           {editMode && (
//                             <button
//                               onClick={() => removeItem('preferences', index)}
//                               className="ml-1 md:ml-2 text-green-600 hover:text-green-900"
//                             >
//                               <FiX size={12} className="md:size-[14px]" />
//                             </button>
//                           )}
//                         </motion.div>
//                       ))}
//                       {editMode && (
//                         <div className="relative w-full md:w-auto">
//                           <input
//                             type="text"
//                             onKeyDown={(e) => handleArrayInput(e, 'preferences')}
//                             placeholder="Add preference"
//                             className="pl-3 pr-8 py-1 border-2 border-gray-200 rounded-full focus:border-indigo-500 outline-none text-sm w-full"
//                           />
//                           <FiPlus className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 italic text-sm md:text-base">No food preferences recorded</p>
//                   )}
//                 </div> */}

//                 {/* Age */}
//                 <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Age</h3>
//                   {editMode ? (
//                     <input
//                       type="number"
//                       value={healthData.age}
//                       onChange={(e) => handleInputChange(e, 'health', 'age')}
//                       className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm md:text-base"
//                     />
//                   ) : (
//                     <p className="text-base md:text-lg">{healthData.age || <span className="text-gray-400">Not specified</span>}</p>
//                   )}
//                 </div>

//                 {/* Sex */}
//                 {/* <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Sex</h3>
//                   {editMode ? (
//                     <select
//                       value={healthData.sex}
//                       onChange={(e) => handleInputChange(e, 'health', 'sex')}
//                       className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm md:text-base"
//                     >
//                       <option value="">Select sex</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   ) : (
//                     <p className="text-base md:text-lg">{healthData.sex || <span className="text-gray-400">Not specified</span>}</p>
//                   )}
//                 </div> */}

//                 {/* Activity Level */}
//                 <div>
//                   <h3 className="text-base md:text-lg font-medium text-gray-700 mb-2">Activity Level</h3>
//                   {editMode ? (
//                     <select
//                       value={healthData.activity}
//                       onChange={(e) => handleInputChange(e, 'health', 'activity')}
//                       className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 outline-none text-sm md:text-base"
//                     >
//                       <option value="">Select activity level</option>
//                       <option value="Sedentary">Sedentary</option>
//                       <option value="Light">Light</option>
//                       <option value="Moderate">Moderate</option>
//                       <option value="Active">Active</option>
//                       <option value="Very Active">Very Active</option>
//                     </select>
//                   ) : (
//                     <p className="text-base md:text-lg">{healthData.activity || <span className="text-gray-400">Not specified</span>}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </motion.div>
//       </AnimatePresence>
//     </div>
//   </div>
//   );
// };

// export default ProfileDashboard;


import React from "react"

// Define the main ProfileDashboard component
const ProfileDashboard: React.FC = () => {
  return (
    // Main container with a simple background and padding
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Flex container for the sidebar and main content */}
      <div className="flex">
        {/* Sidebar - styled to match the image */}
        <div className="w-16 bg-gray-800 text-white flex flex-col items-center py-6 rounded-lg shadow-lg mr-4">
          {/* HR Logo placeholder */}
          <div className="mb-8 text-xl font-bold">HR</div>
          {/* Navigation Icons - using placeholder divs */}
          <div className="flex flex-col items-center space-y-6">
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          </div>
          {/* User Avatar placeholder at the bottom */}
          <div className="mt-auto w-10 h-10 bg-gray-500 rounded-full"></div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white p-8 rounded-lg shadow-lg">
          {/* Header Section */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            {/* Back arrow and User Name */}
            <div className="flex items-center space-x-4">
              {/* Back Arrow placeholder */}
              <div className="text-gray-500 text-xl">←</div>
              {/* User Avatar */}
              <img
                src="https://placehold.co/40x40/cccccc/ffffff?text=JS" // Placeholder image
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://placehold.co/40x40/cccccc/ffffff?text=JS"
                }} // Fallback
              />
              {/* User Name */}
              <h1 className="text-2xl font-semibold text-gray-800">
                Russel Sims
              </h1>
            </div>
            {/* Added date and Delete button */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Added on 21/04/2022</span>
              {/* Delete Button */}
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>

          {/* Content Grid - using grid for layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column: Profile Image and Employee Details */}
            <div className="col-span-1">
              {/* Profile Image Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  PROFILE IMAGE
                </h2>
                {/* Profile Image Placeholder */}
                <img
                  src="https://placehold.co/300x400/e0e0e0/333333?text=Profile+Image" // Placeholder image
                  alt="Profile"
                  className="w-full h-auto object-cover rounded-md mb-4"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/300x400/e0e0e0/333333?text=Profile+Image"
                  }} // Fallback
                />
                {/* Change Profile Image Button */}
                <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300">
                  Change Profile Image
                </button>
              </div>

              {/* Employee Details Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  EMPLOYEE DETAILS
                </h2>
                {/* Detail Item */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">
                    First Name
                  </label>
                  <input
                    type="text"
                    value="Russel"
                    readOnly
                    className="mt-1 block w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {/* Detail Item */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value="Sims"
                    readOnly
                    className="mt-1 block w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {/* Detail Item */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  <input
                    type="text"
                    value="russel@mycompany.com"
                    readOnly
                    className="mt-1 block w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {/* Detail Item */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value="+1255 29345690"
                    readOnly
                    className="mt-1 block w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {/* Detail Item */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">
                    Position
                  </label>
                  <input
                    type="text"
                    value="IOS Developer"
                    readOnly
                    className="mt-1 block w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Role, Team, and Onboarding */}
            <div className="col-span-2">
              {/* Role Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  ROLE
                </h2>
                {/* Role Dropdown Placeholder */}
                <select className="mt-1 block w-full border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:border-blue-500">
                  <option>Employee</option>
                </select>
              </div>

              {/* Team Section */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  TEAM
                </h2>
                {/* Team Member Placeholder */}
                <div className="flex items-center justify-between mb-2">
                  <span>Kate Middleton</span>
                  {/* Dropdown Icon Placeholder */}
                  <div className="text-gray-500">▼</div>
                </div>
                {/* Team Member Placeholder */}
                <div className="flex items-center justify-between mb-2">
                  <span>Kirk Mitrohin</span>
                  {/* Dropdown Icon Placeholder */}
                  <div className="text-gray-500">▼</div>
                </div>
                {/* Team Member Placeholder */}
                <div className="flex items-center justify-between mb-2">
                  <span>Eugene Hummell</span>
                  {/* Dropdown Icon Placeholder */}
                  <div className="text-gray-500">▼</div>
                </div>
              </div>

              {/* Onboarding Section */}
              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  ONBOARDING
                </h2>
                {/* Starts On Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">
                    Starts on
                  </label>
                  <input
                    type="text"
                    value="21.05.2022"
                    readOnly
                    className="mt-1 block w-full border-b border-gray-300 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                {/* Onboarding Required Toggle */}
                <div className="flex items-center justify-between mb-4">
                  <span>Onboarding required</span>
                  {/* Toggle Placeholder */}
                  <div className="w-10 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                </div>
                {/* Current Status */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">
                    Current Status
                  </label>
                  {/* Progress Bar Placeholder */}
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: "35%" }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500">Onboarding 35%</span>
                </div>
                {/* View Answers Button */}
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-6">
                  View Answers
                </button>

                {/* Onboarding Scripts */}
                <h3 className="text-md font-semibold text-gray-700 mb-4">
                  Onboarding Scripts
                </h3>
                {/* Onboarding Script Item */}
                <div className="flex items-center justify-between mb-2">
                  <span>Office Tour</span>
                  {/* Toggle Placeholder */}
                  <div className="w-10 h-6 bg-green-500 rounded-full p-1 flex items-center justify-end">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="text-sm text-gray-500">100%</span>
                </div>
                {/* Onboarding Script Item */}
                <div className="flex items-center justify-between mb-2">
                  <span>Management Introductory</span>
                  {/* Toggle Placeholder */}
                  <div className="w-10 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                {/* Onboarding Script Item */}
                <div className="flex items-center justify-between mb-2">
                  <span>Work Tools</span>
                  {/* Toggle Placeholder */}
                  <div className="w-10 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="text-sm text-gray-500">20%</span>
                </div>
                {/* Onboarding Script Item */}
                <div className="flex items-center justify-between mb-2">
                  <span>Meet Your Colleagues</span>
                  {/* Toggle Placeholder */}
                  <div className="w-10 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                {/* Onboarding Script Item */}
                <div className="flex items-center justify-between mb-2">
                  <span>Duties Journal</span>
                  {/* Toggle Placeholder */}
                  <div className="w-10 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                {/* Onboarding Script Item */}
                <div className="flex items-center justify-between mb-2">
                  <span>Requests Handling</span>
                  {/* Toggle Placeholder */}
                  <div className="w-10 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
                {/* Onboarding Script Item */}
                <div className="flex items-center justify-between mb-2">
                  <span>Activity Tracking</span>
                  {/* Toggle Placeholder */}
                  <div className="w-10 h-6 bg-gray-300 rounded-full p-1 flex items-center">
                    <div className="w-4 h-4 bg-white rounded-full shadow"></div>
                  </div>
                  <span className="text-sm text-gray-500">0%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end space-x-4 mt-8">
            {/* Save Changes Button */}
            <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
              Save Changes
            </button>
            {/* Cancel Button */}
            <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileDashboard
