import { getActionNeeded, getMeetingNeedsPlanning } from '../../utils/dashboardCalculations'
import { AlertCircle } from 'lucide-react'

export function ActionNeededCard() {
  const actionNeeded = getActionNeeded()
  const meetingsToPlan = getMeetingNeedsPlanning().length
  const escalatedCount = actionNeeded.filter(l => l.ESCALATED_TO_DANI).length
  const riskCount = actionNeeded.filter(l => l.RISK_LEVEL === 'high').length

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-neutral-600 mb-2">Opvolgingen voor Dani</p>
          <span className="text-5xl font-bold text-black">{actionNeeded.length}</span>
        </div>
        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-orange-600" />
        </div>
      </div>

      {/* Heatmap blocks */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-red-600">{escalatedCount}</p>
          <p className="text-xs text-red-700 mt-1">Escalated</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-orange-600">{meetingsToPlan}</p>
          <p className="text-xs text-orange-700 mt-1">Meetings</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
          <p className="text-lg font-bold text-yellow-600">{riskCount}</p>
          <p className="text-xs text-yellow-700 mt-1">Risico</p>
        </div>
      </div>

      <p className="text-xs text-neutral-500 mt-3">Replies, meetings en risico's</p>
    </div>
  )
}