import { getActivityHeatmap } from '../../utils/dashboardCalculations'

export function ActivityHeatmapCard() {
  const heatmap = getActivityHeatmap()

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return 'bg-neutral-100'
    if (intensity < 0.25) return 'bg-neutral-200'
    if (intensity < 0.5) return 'bg-neutral-400'
    if (intensity < 0.75) return 'bg-neutral-600'
    return 'bg-black'
  }

  const maxCount = Math.max(...heatmap.map(d => d.count))

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6">
      <h3 className="text-base font-bold text-black mb-2">Activiteit heatmap</h3>
      <p className="text-xs text-neutral-600 mb-4">Reply activiteit · laatste 7 dagen</p>

      <div className="space-y-2">
        {heatmap.map((day) => (
          <div key={day.date} className="flex items-center gap-3">
            <div className="w-8 text-sm text-neutral-600">{day.day}</div>
            <div className="flex-1 flex gap-1">
              {Array.from({ length: Math.max(5, day.count) }).map((_, index) => (
                <div
                  key={index}
                  className={`
                    h-3 rounded-sm transition-all duration-300
                    ${index < day.count ? getIntensityColor(day.intensity) : 'bg-neutral-50'}
                  `}
                  style={{ width: '100%', minWidth: '8px' }}
                />
              ))}
            </div>
            <div className="w-8 text-sm font-medium text-black text-right">
              {day.count}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-200">
        <span className="text-xs text-neutral-600">Activiteit:</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-neutral-100 rounded-sm" />
          <div className="w-3 h-3 bg-neutral-200 rounded-sm" />
          <div className="w-3 h-3 bg-neutral-400 rounded-sm" />
          <div className="w-3 h-3 bg-neutral-600 rounded-sm" />
          <div className="w-3 h-3 bg-black rounded-sm" />
        </div>
      </div>

      {heatmap.every(d => d.count === 0) && (
        <p className="text-sm text-neutral-500 text-center py-4">
          Geen activiteit in de afgelopen 7 dagen
        </p>
      )}
    </div>
  )
}