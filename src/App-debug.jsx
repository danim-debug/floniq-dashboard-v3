import { useState } from 'react'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold text-black">Floniq Dashboard Debug</h1>
        <p className="text-black mt-2">Sidebar state: {sidebarOpen ? 'open' : 'closed'}</p>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Toggle Sidebar
        </button>
      </div>
    </div>
  )
}

export default App