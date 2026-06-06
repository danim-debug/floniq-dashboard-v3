import { getMailflowFunnel } from '../../utils/dashboardCalculations'
import { ArrowRight } from 'lucide-react'

export function MailflowFunnel() {
  const funnel = getMailflowFunnel()

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-black">Mailflow funnel</h2>
        <p className="text-sm text-neutral-600 mt-1">Van nieuwe lead naar klant</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {funnel.map((step, index) => (
          <div key={step.step} className="relative">
            {/* Step card */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
              <p className="text-xs text-neutral-600 mb-2">{step.step}</p>
              <p className="text-2xl font-bold text-black mb-2">{step.count}</p>
              <p className="text-xs text-neutral-500">{step.percentage}%</p>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${step.percentage}%` }}
                />
              </div>
            </div>

            {/* Arrow */}
            {index < funnel.length - 1 && (
              <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                <ArrowRight className="w-5 h-5 text-neutral-400" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}