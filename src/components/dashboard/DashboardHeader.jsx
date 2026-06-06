import { Download, Plus } from 'lucide-react'

export function DashboardHeader() {
  return (
    <div className="px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-black">Dashboard</h1>
          <p className="text-sm text-neutral-600 mt-1">
            Floniq werkgever-agent: leads, vacatures, replies, afspraken en follow-ups.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-neutral-300 rounded-xl text-sm font-medium hover:bg-neutral-50 transition-colors">
            <Download className="w-4 h-4" />
            Export report
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors">
            <Plus className="w-4 h-4" />
            Nieuwe lead
          </button>
        </div>
      </div>
    </div>
  )
}