import { getHighlightedLead } from '../../utils/dashboardCalculations'
import { Building2, MapPin, Flame, MessageSquare, User, ArrowRight } from 'lucide-react'

export function HighlightedLeadCard() {
  const lead = getHighlightedLead()

  if (!lead) {
    return (
      <div className="bg-white rounded-3xl border border-neutral-200 p-6">
        <p className="text-sm text-neutral-600">Geen leads beschikbaar</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 p-6">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-black to-neutral-700 rounded-2xl flex items-center justify-center flex-shrink-0">
          <span className="text-2xl font-bold text-white">
            {lead.COMPANY?.charAt(0) || lead.FIRSTNAME?.charAt(0) || 'U'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-black truncate">{lead.COMPANY}</h3>
              {lead.LEAD_QUALITY === 'hot' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded-full">
                  <Flame className="w-3 h-3 text-orange-600" />
                  <span className="text-xs font-medium text-orange-700">Hot lead</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{lead.CITY}</span>
              </div>
              <span>·</span>
              <span>{lead.CONTACT_TYPE}</span>
            </div>
          </div>

          {/* Score */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-neutral-600">Lead score</p>
              <span className="text-2xl font-bold text-black">{lead.LEAD_SCORE}%</span>
            </div>
            <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-black rounded-full"
                style={{ width: `${lead.LEAD_SCORE}%` }}
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg">
              <MessageSquare className="w-4 h-4 text-neutral-600" />
              <span className="text-sm font-medium text-black">
                Stap {lead.EMAIL_STEP}
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-sm font-medium text-green-700">
                {lead.REPLY_CATEGORY || 'interested'}
              </span>
            </div>
          </div>

          {/* Action */}
          {lead.ESCALATED_TO_DANI && (
            <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-xl">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">
                  Dani opvolgen
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-orange-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}