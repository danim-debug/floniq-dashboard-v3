import { getQuickActions } from '../../utils/dashboardCalculations'
import { MessageSquare, Calendar, Search, AlertCircle } from 'lucide-react'

const iconMap = {
  'MessageSquare': MessageSquare,
  'Calendar': Calendar,
  'Search': Search,
  'AlertCircle': AlertCircle
}

export function QuickActionsCard() {
  const actions = getQuickActions()

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6">
      <h3 className="text-base font-bold text-black mb-4">Quick actions</h3>

      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = iconMap[action.icon]
          return (
            <button
              key={action.action}
              className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                <Icon className="w-5 h-5 text-neutral-700 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black">{action.action}</p>
              </div>
              <div className="px-3 py-1 bg-neutral-100 rounded-full">
                <span className="text-sm font-bold text-black">{action.count}</span>
              </div>
            </button>
          )
        })}
      </div>

      {actions.length === 0 && (
        <p className="text-sm text-neutral-500 text-center py-4">
          Geen acties nodig
        </p>
      )}
    </div>
  )
}