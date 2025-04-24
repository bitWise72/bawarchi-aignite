import React from 'react'

function ChoicePage() {
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4">
        <img src="./logo.png" alt="logo" className="h-10 w-10" />
        <h3 className="text-xl font-bold ml-2">Bawarchi.AI</h3>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center ">
        <div className="flex flex-col items-center justify-center ml-16">
          <h1 className="text-4xl font-bold mb-4">Bawarchi.AI</h1>
          <h2 className="text-4xl font-bold mb-4">Your Food Companion</h2>
          <p className="text-lg mb-8">Please select an option below:</p>
          <div className="flex space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Option 1
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">
              Option 2
            </button>
          
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChoicePage