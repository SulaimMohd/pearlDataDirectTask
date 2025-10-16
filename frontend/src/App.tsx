import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to PearlData
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your React + Vite + Tailwind CSS application is ready!
          </p>
          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🎉 Setup Complete
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>✅ React 18 with TypeScript</p>
              <p>✅ Vite for fast development</p>
              <p>✅ Tailwind CSS for styling</p>
              <p>✅ Glass-morphism design ready</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App