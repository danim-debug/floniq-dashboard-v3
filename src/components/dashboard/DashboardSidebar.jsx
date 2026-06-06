import { useState } from 'react'
import { X, Menu, Building2, BriefcaseBusiness, BarChart3, Flame, MessageSquare, Calendar, Users, Brain, Settings, ArrowUpRight } from 'lucide-react'

export function DashboardSidebar({ isOpen, onClose }) {
  const [activeItem, setActiveItem] = useState('Dashboard')

  const menuItems = [
    { section: 'MENU', items: [
      { name: 'Dashboard', icon: BarChart3 },
      { name: 'Leads', icon: Users },
      { name: 'Bedrijven', icon: Building2 },
      { name: 'Vacatures', icon: BriefcaseBusiness },
      { name: 'Gesprekken', icon: MessageSquare },
      { name: 'Follow-ups', icon: Calendar }
    ]},
    { section: 'DATABASE', items: [
      { name: 'Analytics', icon: BarChart3 },
      { name: 'Pipeline', icon: Flame },
      { name: 'Agent Brain', icon: Brain }
    ]},
    { section: 'SYSTEM', items: [
      { name: 'Integraties', icon: Settings },
      { name: 'Instellingen', icon: Settings }
    ]}
  ]

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-neutral-200 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-black">Floniq</h1>
                <p className="text-sm text-neutral-600 mt-1">Agent command center</p>
              </div>
              <button
                onClick={onClose}
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            {menuItems.map((menuGroup) => (
              <div key={menuGroup.section} className="mb-6">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                  {menuGroup.section}
                </p>
                <ul className="space-y-1">
                  {menuGroup.items.map((item) => {
                    const Icon = item.icon
                    const isActive = activeItem === item.name

                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => setActiveItem(item.name)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                            text-sm font-medium transition-colors
                            ${isActive
                              ? 'bg-black text-white'
                              : 'text-neutral-700 hover:bg-neutral-100'
                            }
                          `}
                        >
                          <Icon className="w-4 h-4" />
                          {item.name}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-medium">D</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">Dani Meertens</p>
                <p className="text-xs text-neutral-600 truncate">Founder · Floniq</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile toggle */}
      {!isOpen && (
        <button
          onClick={() => setActiveItem(true)}
          className="lg:hidden fixed bottom-4 right-4 w-14 h-14 bg-black text-white rounded-full shadow-lg z-50 flex items-center justify-center"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </>
  )
}