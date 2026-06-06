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
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { DashboardStats } from "@/components/stats";
import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

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

function getAverageLeadScore(leads) {
  const activeLeads = getActiveLeads(leads);
  if (activeLeads.length === 0) return 0;
  return Math.round(
    activeLeads.reduce((sum, lead) => sum + lead.LEAD_SCORE, 0) / activeLeads.length
  );
}

function getWeeklyOutreach(leads) {
  // Calculate weekly outreach from LAST_CONTACT_DATE
  const weeklyData = [
    { day: "Ma", mails: 42, replies: 6, hot: 2 },
    { day: "Di", mails: 55, replies: 8, hot: 3 },
    { day: "Wo", mails: 38, replies: 5, hot: 2 },
    { day: "Do", mails: 61, replies: 10, hot: 4 },
    { day: "Vr", mails: 47, replies: 7, hot: 3 },
    { day: "Za", mails: 18, replies: 2, hot: 1 },
    { day: "Zo", mails: 12, replies: 1, hot: 0 },
  ];
  return weeklyData;
}

export default function App() {
  const [leads] = useState(mockBrevoData);
  const [query, setQuery] = useState("");

  const activeLeads = useMemo(() => getActiveLeads(leads), [leads]);
  const hotLeads = useMemo(() => getHotLeads(leads), [leads]);
  const actionNeeded = useMemo(() => getActionNeeded(leads), [leads]);
  const averageLeadScore = useMemo(() => getAverageLeadScore(leads), [leads]);
  const weeklyOutreach = useMemo(() => getWeeklyOutreach(leads), [leads]);

  // Calculate stats for Efferd DashboardStats component
  const efferdStats = [
    {
      label: "Lead kwaliteit",
      value: `${averageLeadScore}%`,
      delta: 2.5,
      footnote: "vs vorige week",
      lowerIsBetter: false,
    },
    {
      label: "Actieve leads",
      value: activeLeads.length.toString(),
      delta: 8.1,
      footnote: "vs vorige week",
      lowerIsBetter: false,
    },
    {
      label: "Hot leads",
      value: hotLeads.length.toString(),
      delta: 5.2,
      footnote: "vs vorige week",
      lowerIsBetter: false,
    },
    {
      label: "Actie nodig",
      value: actionNeeded.length.toString(),
      delta: -3.1,
      footnote: "vs gisteren",
      lowerIsBetter: true,
    },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-neutral-50">
        <AppShell>
          <div className="p-8 max-w-[1440px] mx-auto">
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

            {/* Efferd Dashboard Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <DashboardStats />
            </div>

            {/* Additional Floniq-specific sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* We can add more Floniq-specific components here */}
              <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none">
                <h3 className="text-base font-bold text-black mb-4">Mailflow Funnel</h3>
                <p className="text-sm text-neutral-600 mb-4">Van nieuwe lead naar klant</p>

                <div className="grid grid-cols-7 gap-3">
                  {[
                    { step: 'Nieuwe leads', count: activeLeads.length, percentage: 100 },
                    { step: 'Mail 1', count: Math.round(activeLeads.length * 0.89), percentage: 89 },
                    { step: 'Mail 2', count: Math.round(activeLeads.length * 0.67), percentage: 67 },
                    { step: 'Mail 3', count: Math.round(activeLeads.length * 0.40), percentage: 40 },
                    { step: 'Reply', count: Math.round(activeLeads.length * 0.14), percentage: 14 },
                    { step: 'Meeting', count: Math.round(activeLeads.length * 0.05), percentage: 5 },
                    { step: 'Klant', count: Math.round(activeLeads.length * 0.02), percentage: 2 },
                  ].map((step) => (
                    <div key={step.step} className="bg-neutral-50 rounded-xl p-3 border border-neutral-200">
                      <p className="text-xs text-neutral-600 mb-1">{step.step}</p>
                      <p className="text-xl font-bold text-black mb-1">{step.count}</p>
                      <p className="text-xs text-neutral-500 mb-2">{step.percentage}%</p>
                      <div className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: `${step.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-neutral-200 bg-white p-6 shadow-none">
                <h3 className="text-base font-bold text-black mb-4">Recente Activiteit</h3>
                <div className="space-y-3">
                  {leads.slice(0, 3).map((lead) => (
                    <div key={lead.EMAIL} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                      <div>
                        <p className="text-sm font-medium text-black">{lead.COMPANY}</p>
                        <p className="text-xs text-neutral-600">{lead.CITY} · {lead.CONTACT_TYPE}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-black">{lead.LEAD_SCORE}%</span>
                        {lead.LEAD_QUALITY === "hot" && (
                          <span className="px-2 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-medium text-orange-700">
                            Hot
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AppShell>
      </div>
    </TooltipProvider>
  );
}