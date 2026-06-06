import { DashboardSidebar } from './components/dashboard/DashboardSidebar'
import { DashboardTopbar } from './components/dashboard/DashboardTopbar'
import { DashboardHeader } from './components/dashboard/DashboardHeader'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <DashboardSidebar isOpen={true} onClose={() => {}} />
      <div className="flex-1 flex flex-col ml-64">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto">
          <DashboardHeader />
          <div className="p-6">
            <h1 className="text-2xl font-bold text-black">Test: Layout werkt!</h1>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App