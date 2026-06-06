import { getOutreachThisWeek } from '../../utils/dashboardCalculations'
import { ArrowUpRight } from 'lucide-react'

export function OutreachCard() {
  const outreachCount = getOutreachThisWeek().length
  const previousWeekCount = Math.round(outreachCount * 0.88) // Mock previous week
  const percentage = Math.round(((outreachCount - previousWeekCount) / previousWeekCount) * 100)

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm text-neutral-600 mb-2">Verstuurde mails</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold text-black">{outreachCount}</span>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">+{percentage}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini chart */}
      <div className="flex items-end gap-1 h-12 mt-4">
        {[65, 45, 78, 52, 83, 61, outreachCount].map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-neutral-100 rounded-sm hover:bg-neutral-200 transition-colors"
            style={{ height: `${height}%`, minHeight: '8px' }}
          />
        ))}
      </div>

      <p className="text-xs text-neutral-500 mt-3">Deze afgelopen week</p>
    </div>
  )
}