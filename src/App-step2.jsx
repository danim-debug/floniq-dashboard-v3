import { DashboardSidebar } from './components/dashboard/DashboardSidebar'
import { DashboardTopbar } from './components/dashboard/DashboardTopbar'
import { DashboardHeader } from './components/dashboard/DashboardHeader'
import { LeadQualityCard } from './components/dashboard/LeadQualityCard'
import { OutreachCard } from './components/dashboard/OutreachCard'
import { ActionNeededCard } from './components/dashboard/ActionNeededCard'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 flex">
      <DashboardSidebar isOpen={true} onClose={() => {}} />
      <div className="flex-1 flex flex-col ml-64">
        <DashboardTopbar />
        <main className="flex-1 overflow-y-auto">
          <DashboardHeader />
          <div className="p-6 space-y-6">
            {/* Row 1: Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <LeadQualityCard />
              <OutreachCard />
              <ActionNeededCard />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App