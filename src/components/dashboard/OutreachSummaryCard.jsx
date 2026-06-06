import { getOutreachSummary } from '../../utils/dashboardCalculations'
import { Mail, MessageSquare, Flame, Calendar } from 'lucide-react'

export function OutreachSummaryCard() {
  const summary = getOutreachSummary()

  const metrics = [
    { label: 'Mails', count: summary.emailsSent, icon: Mail, color: 'bg-neutral-100' },
    { label: 'Replies', count: summary.replies, icon: MessageSquare, color: 'bg-blue-50' },
    { label: 'Hot leads', count: summary.hotLeads, icon: Flame, color: 'bg-orange-50' },
    { label: 'Meetings', count: summary.meetings, icon: Calendar, color: 'bg-green-50' }
  ]

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6">
      <div className="mb-4">
        <p className="text-3xl font-bold text-black">{summary.totalLeads} leads</p>
        <p className="text-sm text-neutral-600 mt-1">
          Deze week · focus op {summary.focus}
        </p>
      </div>

      {/* Bar chart */}
      <div className="space-y-3">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const maxCount = Math.max(...metrics.map(m => m.count))
          const percentage = (metric.count / maxCount) * 100

          return (
            <div key={metric.label} className="flex items-center gap-3">
              <div className={`w-10 h-10 ${metric.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 text-neutral-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-black">{metric.label}</p>
                  <p className="text-sm font-bold text-black">{metric.count}</p>
                </div>
                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}