import { getAverageLeadScore } from '../../utils/dashboardCalculations'

export function LeadQualityCard() {
  const averageScore = getAverageLeadScore()

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-600 mb-2">Gemiddelde leadscore</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-black">{averageScore}%</span>
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            Gebaseerd op actieve werkgeversleads
          </p>
        </div>

        {/* Circular progress */}
        <div className="relative w-20 h-20">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f5f5f5"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="black"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - averageScore / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{averageScore}</span>
          </div>
        </div>
      </div>
    </div>
  )
}