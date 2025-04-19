import React, { useState } from "react"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f3ff] p-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Side (Form) */}
        <div className="p-10">
          <h2 className="text-3xl font-bold mb-2">Welcome 👋</h2>
          <p className="text-gray-500 mb-6">
            {isLogin
              ? "Please, enter your details and start your work!"
              : "Create your account to get started!"}
          </p>

          {/* Tabs */}
          <div className="flex mb-6 border-b border-gray-200">
            <button
              onClick={() => setIsLogin(true)}
              className={`px-4 py-2 font-semibold ${
                isLogin
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-400"
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-4 py-2 font-semibold ${
                !isLogin
                  ? "border-b-2 border-purple-500 text-purple-600"
                  : "text-gray-400"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {!isLogin && (
              <>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm font-medium">
                      First Name
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-4 py-2 mt-1 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm font-medium">
                      Last Name
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-4 py-2 mt-1 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium">E-mail</label>
              <input
                type="email"
                placeholder="johndoe@gmail.com"
                className="w-full px-4 py-2 mt-1 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 mt-1 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full mt-6 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition">
            {isLogin ? "Log in" : "Sign up"}
          </button>

          {/* Optional Login Extras */}
          {isLogin && (
            <div className="flex justify-between items-center mt-2 text-sm text-purple-600">
              <span></span>
              <a href="#" className="hover:underline">
                Forget your password?
              </a>
            </div>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center justify-center text-gray-400">
            <span className="w-1/4 border-t border-gray-300" />
            <span className="mx-4 text-sm">or</span>
            <span className="w-1/4 border-t border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="space-y-3">
            {["Google"].map((platform) => (
              <button
                key={platform}
                className="w-full border border-purple-200 text-sm py-2 rounded-lg flex items-center justify-center hover:bg-purple-50 transition"
              >
                Login with {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side (Illustration) */}
        <div className="bg-indigo-900 text-white flex items-center justify-center">
          <img
            src="/illustration.jpg"
            alt="Login illustration"
            className="max-h-[500px] object-contain p-8"
          />
        </div>
      </div>
    </div>
  )
}
