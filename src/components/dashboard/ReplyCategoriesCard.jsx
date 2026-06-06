import { getReplyCategories } from '../../utils/dashboardCalculations'

export function ReplyCategoriesCard() {
  const categories = getReplyCategories()

  const maxCount = Math.max(...categories.map(c => c.count), 1)

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6">
      <h3 className="text-base font-bold text-black mb-4">Reply categorieën</h3>

      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.name} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium text-black capitalize">
                  {category.name.replace('_', ' ')}
                </p>
                <p className="text-sm font-bold text-black">{category.count}</p>
              </div>
              <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${(category.count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-neutral-500 text-center py-4">
          Nog geen replies ontvangen
        </p>
      )}
    </div>
  )
}