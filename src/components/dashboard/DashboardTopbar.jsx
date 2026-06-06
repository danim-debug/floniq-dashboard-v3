import { Search, Bell, HelpCircle, Brain } from 'lucide-react'

export function DashboardTopbar() {
  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            placeholder="Zoek lead, bedrijf of vacature"
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Agent Brain */}
        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors">
          <Brain className="w-4 h-4" />
          <span className="hidden sm:inline">Agent Brain</span>
        </button>

        {/* Help */}
        <button className="p-2.5 hover:bg-neutral-100 rounded-lg transition-colors">
          <HelpCircle className="w-5 h-5 text-neutral-600" />
        </button>

        {/* Notifications */}
        <button className="p-2.5 hover:bg-neutral-100 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-neutral-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User */}
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-neutral-300 transition-all">
          <span className="text-white font-medium">D</span>
        </div>
      </div>
    </header>
  )
}