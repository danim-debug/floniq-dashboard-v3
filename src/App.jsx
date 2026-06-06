import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  BriefcaseBusiness,
  MessageSquare,
  CalendarCheck,
  BarChart3,
  GitBranch,
  Brain,
  Plug,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Download,
  Plus,
  ArrowUpRight,
  Flame,
  Mail,
  AlertTriangle,
  Clock,
  ChevronRight,
} from "lucide-react";

// Mock Brevo Data
const mockBrevoData = [
  {
    EMAIL: "jan@krachtrecruitment.nl",
    FIRSTNAME: "Jan",
    LASTNAME: "Jansen",
    COMPANY: "Kracht Recruitment",
    CITY: "Kapelle",
    REGION: "Zeeland",
    CONTACT_TYPE: "werkgever",
    LEAD_SCORE: 82,
    LEAD_QUALITY: "hot",
    URGENCY: "high",
    EMAIL_STEP: 3,
    LAST_CONTACT_DATE: "2026-06-05",
    FOLLOW_UP_STATUS: "active",
    REPLY_RECEIVED: true,
    REPLY_CATEGORY: "pricing_question",
    REPLY_DATE: "2026-06-06",
    RISK_LEVEL: "low",
    ESCALATED_TO_DANI: true,
    NEEDS_RESEARCH: false,
    NEEDS_CALENDAR: false,
    MEETING_REQUESTED: true,
    MEETING_SCHEDULED: false,
    DEAL_STATUS: "interested",
    UNSUBSCRIBED: false,
    DO_NOT_CONTACT: false,
  },
  {
    EMAIL: "maria@bouwbedrijf.nl",
    FIRSTNAME: "Maria",
    LASTNAME: "de Vries",
    COMPANY: "Bouwbedrijf De Vries",
    CITY: "Rotterdam",
    REGION: "Zuid-Holland",
    CONTACT_TYPE: "werkgever",
    LEAD_SCORE: 78,
    LEAD_QUALITY: "hot",
    URGENCY: "medium",
    EMAIL_STEP: 2,
    LAST_CONTACT_DATE: "2026-06-04",
    FOLLOW_UP_STATUS: "active",
    REPLY_RECEIVED: true,
    REPLY_CATEGORY: "interested",
    REPLY_DATE: "2026-06-05",
    RISK_LEVEL: "low",
    ESCALATED_TO_DANI: true,
    NEEDS_RESEARCH: false,
    NEEDS_CALENDAR: true,
    MEETING_REQUESTED: true,
    MEETING_SCHEDULED: false,
    DEAL_STATUS: "meeting_requested",
    UNSUBSCRIBED: false,
    DO_NOT_CONTACT: false,
  },
  {
    EMAIL: "info@installatiebedrijf.nl",
    FIRSTNAME: "Peter",
    LASTNAME: "van den Berg",
    COMPANY: "Installatiebedrijf Van den Berg",
    CITY: "Utrecht",
    REGION: "Utrecht",
    CONTACT_TYPE: "werkgever",
    LEAD_SCORE: 65,
    LEAD_QUALITY: "warm",
    URGENCY: "low",
    EMAIL_STEP: 1,
    LAST_CONTACT_DATE: "2026-06-03",
    FOLLOW_UP_STATUS: "active",
    REPLY_RECEIVED: false,
    REPLY_CATEGORY: null,
    REPLY_DATE: null,
    RISK_LEVEL: "low",
    ESCALATED_TO_DANI: false,
    NEEDS_RESEARCH: false,
    NEEDS_CALENDAR: false,
    MEETING_REQUESTED: false,
    MEETING_SCHEDULED: false,
    DEAL_STATUS: "mailflow_active",
    UNSUBSCRIBED: false,
    DO_NOT_CONTACT: false,
  },
  {
    EMAIL: "sarah@bouwconcurrent.nl",
    FIRSTNAME: "Sarah",
    LASTNAME: "Bakker",
    COMPANY: "Bouw Concurrent",
    CITY: "Amsterdam",
    REGION: "Noord-Holland",
    CONTACT_TYPE: "werkgever",
    LEAD_SCORE: 91,
    LEAD_QUALITY: "hot",
    URGENCY: "high",
    EMAIL_STEP: 4,
    LAST_CONTACT_DATE: "2026-06-06",
    FOLLOW_UP_STATUS: "active",
    REPLY_RECEIVED: true,
    REPLY_CATEGORY: "interested",
    REPLY_DATE: "2026-06-07",
    RISK_LEVEL: "medium",
    ESCALATED_TO_DANI: true,
    NEEDS_RESEARCH: false,
    NEEDS_CALENDAR: true,
    MEETING_REQUESTED: true,
    MEETING_SCHEDULED: true,
    DEAL_STATUS: "meeting_scheduled",
    UNSUBSCRIBED: false,
    DO_NOT_CONTACT: false,
  },
  {
    EMAIL: "john@technicalsolutions.nl",
    FIRSTNAME: "John",
    LASTNAME: "Smit",
    COMPANY: "Technical Solutions",
    CITY: "Eindhoven",
    REGION: "Noord-Brabant",
    CONTACT_TYPE: "werkgever",
    LEAD_SCORE: 45,
    LEAD_QUALITY: "cold",
    URGENCY: "low",
    EMAIL_STEP: 2,
    LAST_CONTACT_DATE: "2026-06-02",
    FOLLOW_UP_STATUS: "active",
    REPLY_RECEIVED: true,
    REPLY_CATEGORY: "not_interested",
    REPLY_DATE: "2026-06-03",
    RISK_LEVEL: "low",
    ESCALATED_TO_DANI: false,
    NEEDS_RESEARCH: false,
    NEEDS_CALENDAR: false,
    MEETING_REQUESTED: false,
    MEETING_SCHEDULED: false,
    DEAL_STATUS: "not_interested",
    UNSUBSCRIBED: false,
    DO_NOT_CONTACT: false,
  },
];

// Helper Functions
function getActiveLeads(leads) {
  return leads.filter(lead =>
    !lead.DO_NOT_CONTACT &&
    !lead.UNSUBSCRIBED &&
    lead.DEAL_STATUS !== "won" &&
    lead.DEAL_STATUS !== "lost" &&
    lead.DEAL_STATUS !== "not_interested"
  );
}

function getHotLeads(leads) {
  return leads.filter(lead =>
    lead.LEAD_QUALITY === "hot" ||
    lead.LEAD_SCORE >= 70 ||
    lead.URGENCY === "high" ||
    lead.REPLY_CATEGORY === "interested" ||
    lead.MEETING_REQUESTED
  );
}

function getActionNeeded(leads) {
  return leads.filter(lead =>
    lead.ESCALATED_TO_DANI ||
    lead.NEEDS_CALENDAR ||
    (lead.MEETING_REQUESTED && !lead.MEETING_SCHEDULED) ||
    lead.RISK_LEVEL === "high" ||
    lead.NEEDS_RESEARCH
  );
}

function getCustomerCount(leads) {
  return leads.filter(lead => lead.DEAL_STATUS === "won").length;
}

function getMeetingNeedsPlanning(leads) {
  return leads.filter(lead =>
    lead.MEETING_REQUESTED && !lead.MEETING_SCHEDULED
  );
}

function getHighlightedLead(leads) {
  let bestLead = null;
  let bestScore = 0;

  leads.forEach(lead => {
    let score = lead.LEAD_SCORE || 0;

    if (lead.MEETING_REQUESTED) score += 50;
    if (lead.REPLY_CATEGORY === "interested") score += 40;
    if (lead.ESCALATED_TO_DANI) score += 30;
    if (lead.LEAD_QUALITY === "hot") score += 20;

    if (score > bestScore) {
      bestScore = score;
      bestLead = lead;
    }
  });

  return bestLead || leads[0];
}

function getAverageLeadScore(leads) {
  const activeLeads = getActiveLeads(leads);
  if (activeLeads.length === 0) return 0;
  return Math.round(
    activeLeads.reduce((sum, lead) => sum + lead.LEAD_SCORE, 0) / activeLeads.length
  );
}

export default function App() {
  const [leads] = useState(mockBrevoData);
  const [query, setQuery] = useState("");

  const activeLeads = useMemo(() => getActiveLeads(leads), [leads]);
  const hotLeads = useMemo(() => getHotLeads(leads), [leads]);
  const actionNeeded = useMemo(() => getActionNeeded(leads), [leads]);
  const customerCount = useMemo(() => getCustomerCount(leads), [leads]);
  const meetingNeedsPlanning = useMemo(() => getMeetingNeedsPlanning(leads), [leads]);
  const highlightedLead = useMemo(() => getHighlightedLead(leads), [leads]);
  const averageLeadScore = useMemo(() => getAverageLeadScore(leads), [leads]);

  const weeklyOutreach = [
    { day: "Ma", mails: 42, replies: 6, hot: 2 },
    { day: "Di", mails: 55, replies: 8, hot: 3 },
    { day: "Wo", mails: 38, replies: 5, hot: 2 },
    { day: "Do", mails: 61, replies: 10, hot: 4 },
    { day: "Vr", mails: 47, replies: 7, hot: 3 },
    { day: "Za", mails: 18, replies: 2, hot: 1 },
    { day: "Zo", mails: 12, replies: 1, hot: 0 },
  ];

  const funnelData = [
    { step: 'Nieuwe leads', count: 126, percentage: 100 },
    { step: 'Mail 1', count: 112, percentage: 89 },
    { step: 'Mail 2', count: 84, percentage: 67 },
    { step: 'Mail 3', count: 51, percentage: 40 },
    { step: 'Reply', count: 18, percentage: 14 },
    { step: 'Meeting', count: 6, percentage: 5 },
    { step: 'Klant', count: 2, percentage: 2 },
  ];

  const replyCategories = [
    { label: "Interested", count: 8 },
    { label: "Pricing question", count: 4 },
    { label: "Not interested", count: 3 },
    { label: "Auto reply", count: 2 },
    { label: "Wrong person", count: 1 },
  ];

  const quickActions = [
    { label: "Replies beoordelen", count: 5, icon: MessageSquare },
    { label: "Meetings plannen", count: 3, icon: Clock },
    { label: "Research missen", count: 12, icon: Search },
    { label: "Risico replies", count: 4, icon: AlertTriangle },
  ];

  const heatmap = [
    [1, 0, 2, 1, 0, 2, 1],
    [0, 1, 3, 2, 1, 0, 2],
    [1, 0, 1, 0, 2, 3, 1],
    [0, 2, 1, 3, 0, 1, 0],
  ];

  const menuSections = [
    {
      title: "MENU",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "leads", label: "Leads", icon: Users },
        { id: "companies", label: "Bedrijven", icon: Building2 },
        { id: "vacancies", label: "Vacatures", icon: BriefcaseBusiness },
        { id: "conversations", label: "Gesprekken", icon: MessageSquare },
        { id: "followups", label: "Follow-ups", icon: CalendarCheck },
      ],
    },
    {
      title: "DATABASE",
      items: [
        { id: "analytics", label: "Analytics", icon: BarChart3 },
        { id: "pipeline", label: "Pipeline", icon: GitBranch },
        { id: "brain", label: "Agent Brain", icon: Brain },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { id: "integrations", label: "Integraties", icon: Plug },
        { id: "settings", label: "Instellingen", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-neutral-200">
        <Sidebar menuSections={menuSections} />
      </div>

      {/* Main Content Wrapper */}
      <div className="ml-[260px] min-h-screen">
        {/* Topbar */}
        <div className="h-[72px] bg-white border-b border-neutral-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-6 w-96">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Zoek lead, bedrijf of vacature"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg transition">
              <Brain className="w-4 h-4" />
              Agent Brain
            </button>
            <button className="p-2.5 hover:bg-neutral-100 rounded-lg transition">
              <HelpCircle className="w-5 h-5 text-neutral-600" />
            </button>
            <button className="p-2.5 hover:bg-neutral-100 rounded-lg transition relative">
              <Bell className="w-5 h-5 text-neutral-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">D</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-8">
          <div className="mx-auto max-w-[1440px]">
            {/* Dashboard Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                <p className="mt-2 text-sm text-neutral-600">
                  Floniq werkgever-agent: leads, vacatures, replies, afspraken en follow-ups.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-neutral-300 bg-white hover:bg-neutral-50 rounded-xl transition">
                  <Download className="w-4 h-4" />
                  Export report
                </button>
                <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border border-black bg-black text-white hover:bg-neutral-800 rounded-xl transition">
                  <Plus className="w-4 h-4" />
                  Nieuwe lead
                </button>
              </div>
            </div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <LeadQualityCard score={averageLeadScore} activeCount={activeLeads.length} />
              <OutreachCard weeklyOutreach={weeklyOutreach} />
              <ActionNeededCard actionCount={actionNeeded.length} />
            </div>

            {/* Mailflow Funnel */}
            <div className="mb-6">
              <MailflowFunnel funnelData={funnelData} />
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="col-span-2">
                <OutreachSummaryCard
                  leadCount={activeLeads.length}
                  weeklyOutreach={weeklyOutreach}
                />
              </div>
              <div className="col-span-1">
                <HighlightedLeadCard lead={highlightedLead} />
              </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-3 gap-6">
              <ReplyCategoriesCard categories={replyCategories} />
              <QuickActionsCard actions={quickActions} />
              <ActivityHeatmapCard heatmap={heatmap} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Sidebar({ menuSections }) {
  const [activeItem, setActiveItem] = useState("dashboard");

  return (
    <div className="flex flex-col h-full p-6">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Floniq</h1>
        <p className="text-sm text-neutral-500 mt-1">Agent command center</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title}>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
              {section.title}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeItem === item.id;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveItem(item.id)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl
                        text-sm font-medium transition-all duration-200
                        ${isActive
                          ? 'bg-neutral-900 text-white'
                          : 'text-neutral-700 hover:bg-neutral-100'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="border-t border-neutral-200 pt-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-medium">D</span>
          </div>
          <div>
            <p className="text-sm font-medium text-black">Dani Meertens</p>
            <p className="text-xs text-neutral-500">Founder · Floniq</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadQualityCard({ score, activeCount }) {
  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[190px]">
      <div className="flex items-start justify-between h-full">
        <div className="flex-1">
          <p className="text-sm text-neutral-600 mb-3">Gemiddelde leadscore</p>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-bold text-black">{score}%</span>
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            Gebaseerd op {activeCount} actieve werkgeversleads
          </p>
        </div>

        {/* Circular Progress */}
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#f5f5f5"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="black"
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{score}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OutreachCard({ weeklyOutreach }) {
  const totalMails = weeklyOutreach.reduce((sum, day) => sum + day.mails, 0);
  const previousWeekTotal = Math.round(totalMails * 0.88);
  const percentage = Math.round(((totalMails - previousWeekTotal) / previousWeekTotal) * 100);

  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[190px]">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm text-neutral-600 mb-3">Verstuurde mails</p>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-bold text-black">{totalMails}</span>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="w-5 h-5" />
                <span className="text-lg font-medium">+{percentage}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Chart */}
        <div className="flex items-end gap-2 flex-1">
          {weeklyOutreach.map((day, index) => (
            <div
              key={index}
              className="flex-1 bg-neutral-100 rounded-sm hover:bg-neutral-200 transition-colors"
              style={{ height: `${(day.mails / 70) * 100}%`, minHeight: '12px' }}
            />
          ))}
        </div>

        <p className="text-xs text-neutral-500 mt-auto">Deze afgelopen week</p>
      </div>
    </div>
  );
}

function ActionNeededCard({ actionCount }) {
  const escalatedCount = 3;
  const meetingsToPlan = 2;
  const riskCount = 2;

  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[190px]">
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <p className="text-sm text-neutral-600 mb-3">Opvolgingen voor Dani</p>
            <span className="text-5xl font-bold text-black">{actionCount}</span>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
        </div>

        {/* Action Blocks */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{escalatedCount}</p>
            <p className="text-xs text-red-700 mt-1">Escalated</p>
          </div>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{meetingsToPlan}</p>
            <p className="text-xs text-orange-700 mt-1">Meetings</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{riskCount}</p>
            <p className="text-xs text-yellow-700 mt-1">Risico</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailflowFunnel({ funnelData }) {
  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[230px]">
      <div className="flex flex-col h-full">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-black">Mailflow funnel</h2>
          <p className="text-sm text-neutral-600 mt-1">Van nieuwe lead naar klant</p>
        </div>

        <div className="flex-1 grid grid-cols-7 gap-4">
          {funnelData.map((step, index) => (
            <div key={step.step} className="relative">
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 h-full flex flex-col justify-between">
                <div>
                  <p className="text-xs text-neutral-600 mb-2">{step.step}</p>
                  <p className="text-2xl font-bold text-black mb-1">{step.count}</p>
                  <p className="text-xs text-neutral-500">{step.percentage}%</p>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${step.percentage}%` }}
                  />
                </div>
              </div>

              {/* Arrow */}
              {index < funnelData.length - 1 && (
                <div className="absolute -right-3 top-1/2 -translate-y-1/2">
                  <ChevronRight className="w-6 h-6 text-neutral-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OutreachSummaryCard({ leadCount, weeklyOutreach }) {
  const totalMails = weeklyOutreach.reduce((sum, day) => sum + day.mails, 0);
  const totalReplies = weeklyOutreach.reduce((sum, day) => sum + day.replies, 0);
  const totalHot = weeklyOutreach.reduce((sum, day) => sum + day.hot, 0);
  const totalMeetings = 6;

  const metrics = [
    { label: 'Mails', count: totalMails, icon: Mail },
    { label: 'Replies', count: totalReplies, icon: MessageSquare },
    { label: 'Hot leads', count: totalHot, icon: Flame },
    { label: 'Meetings', count: totalMeetings, icon: CalendarCheck },
  ];

  const maxCount = Math.max(...metrics.map(m => m.count));

  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[260px]">
      <div className="mb-6">
        <p className="text-3xl font-bold text-black">{leadCount} leads</p>
        <p className="text-sm text-neutral-600 mt-1">
          Deze week · focus op bouw en installatie
        </p>
      </div>

      <div className="space-y-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = (metric.count / maxCount) * 100;

          return (
            <div key={metric.label} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-neutral-700" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
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
          );
        })}
      </div>
    </div>
  );
}

function HighlightedLeadCard({ lead }) {
  if (!lead) {
    return (
      <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[260px]">
        <p className="text-sm text-neutral-600">Geen leads beschikbaar</p>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[260px]">
      <div className="flex flex-col h-full">
        <p className="text-sm text-neutral-600 mb-4">Highlighted lead</p>

        <div className="flex items-start gap-4 mb-6">
          {/* Avatar */}
          <div className="w-16 h-16 bg-gradient-to-br from-black to-neutral-700 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-white">
              {lead.COMPANY.charAt(0)}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-black truncate">{lead.COMPANY}</h3>
                {lead.LEAD_QUALITY === "hot" && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded-full">
                    <Flame className="w-3 h-3 text-orange-600" />
                    <span className="text-xs font-medium text-orange-700">Hot lead</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-600">
                <span>{lead.CITY}</span>
                <span>·</span>
                <span>{lead.CONTACT_TYPE}</span>
              </div>
            </div>

            {/* Score */}
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
        </div>

        {/* Status */}
        <div className="mt-auto">
          <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-black">
                Stap {lead.EMAIL_STEP} · {lead.REPLY_CATEGORY || 'interested'}
              </span>
            </div>
            {lead.ESCALATED_TO_DANI && (
              <div className="text-xs text-orange-600 font-medium">Dani opvolgen</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReplyCategoriesCard({ categories }) {
  const maxCount = Math.max(...categories.map(c => c.count), 1);

  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[260px]">
      <h3 className="text-base font-bold text-black mb-4">Reply categorieën</h3>

      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.label} className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-black capitalize">
                  {category.label.toLowerCase()}
                </p>
                <p className="text-sm font-bold text-black">{category.count}</p>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
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
  );
}

function QuickActionsCard({ actions }) {
  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[260px]">
      <h3 className="text-base font-bold text-black mb-4">Quick actions</h3>

      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors text-left group"
            >
              <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-black group-hover:text-white transition-colors">
                <Icon className="w-5 h-5 text-neutral-700 group-hover:text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-black">{action.label}</p>
              </div>
              <div className="px-3 py-1 bg-neutral-100 rounded-full">
                <span className="text-sm font-bold text-black">{action.count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {actions.length === 0 && (
        <p className="text-sm text-neutral-500 text-center py-4">
          Geen acties nodig
        </p>
      )}
    </div>
  );
}

function ActivityHeatmapCard({ heatmap }) {
  const getIntensityColor = (intensity) => {
    if (intensity === 0) return 'bg-neutral-100';
    if (intensity < 0.25) return 'bg-neutral-200';
    if (intensity < 0.5) return 'bg-neutral-400';
    if (intensity < 0.75) return 'bg-neutral-600';
    return 'bg-black';
  };

  const days = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

  return (
    <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none min-h-[260px]">
      <h3 className="text-base font-bold text-black mb-2">Activiteit heatmap</h3>
      <p className="text-xs text-neutral-600 mb-4">Reply activiteit · laatste 7 dagen</p>

      <div className="space-y-2">
        {days.map((day, dayIndex) => (
          <div key={day} className="flex items-center gap-3">
            <div className="w-8 text-sm text-neutral-600">{day}</div>
            <div className="flex-1 flex gap-1">
              {Array.from({ length: 7 }).map((_, index) => {
                const level = heatmap[dayIndex % 4]?.[index] || 0;
                return (
                  <div
                    key={`${day}-${index}`}
                    className={`h-3 rounded-sm transition-all duration-300 ${getIntensityColor(level)}`}
                    style={{ width: '100%', minWidth: '8px' }}
                  />
                );
              })}
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
    </div>
  );
}