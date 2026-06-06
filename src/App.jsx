import { useMemo, useState, useEffect } from "react";

// Mock data - later te vervangen door echte Brevo API
const mockLeads = [
  {
    id: 1,
    company: "Kracht Recruitment",
    contact: "jan",
    role: "werkgever",
    email: "jan@krachtrecruitment.nl",
    phone: "0113-000000",
    sector: "Metselaar",
    location: "Kapelle",
    need: "Metselaar gezocht",
    stage: "Afspraak",
    source: "Indeed",
    sourceUrl: "",
    objection: "",
    lastAction: "Ik zag dat jullie actief zoeken naar metselaars in Zeeland.",
    nextAction: "Stap 3 · interested reply",
    urgency: "Hoog",
    service: "full-service",
    people: 3,
    start: "Niet bekend",
    housing: "Onbekend",
    score: 82,
    updated: "2026-06-06",
    researchDone: "Ja",
    lastReply: "Stuur maar eens wat informatie over de tarieven.",
    status: "active",
    leadQuality: "hot",
  },
  {
    id: 2,
    company: "Bouwbedrijf De Vries",
    contact: "maria",
    role: "werkgever",
    email: "maria@bouwbedrijf.nl",
    phone: "010-000000",
    sector: "Timmerman",
    location: "Rotterdam",
    need: "Timmerman gezocht",
    stage: "Warm",
    source: "LinkedIn",
    sourceUrl: "",
    objection: "",
    lastAction: "Ik zag jullie zoektocht naar ervaren timmerlieden.",
    nextAction: "Stap 2 · interested",
    urgency: "Middel",
    service: "full-service",
    people: 2,
    start: "ASAP",
    housing: "Onbekend",
    score: 78,
    updated: "2026-06-05",
    researchDone: "Ja",
    lastReply: "Wij zijn geïnteresseerd in een gesprek.",
    status: "active",
    leadQuality: "hot",
  },
  {
    id: 3,
    company: "Installatiebedrijf Van den Berg",
    contact: "peter",
    role: "werkgever",
    email: "info@installatiebedrijf.nl",
    phone: "030-000000",
    sector: "Loodgieter",
    location: "Utrecht",
    need: "Loodgieter gezocht",
    stage: "Nieuw",
    source: "Google",
    sourceUrl: "",
    objection: "",
    lastAction: "Ik zag jullie vacature voor loodgieters.",
    nextAction: "Stap 1 · mail verstuurd",
    urgency: "Laag",
    service: "matching",
    people: 1,
    start: "Niet bekend",
    housing: "Onbekend",
    score: 65,
    updated: "2026-06-04",
    researchDone: "Ja",
    lastReply: "",
    status: "active",
    leadQuality: "warm",
  },
  {
    id: 4,
    company: "Bouw Concurrent",
    contact: "sarah",
    role: "werkgever",
    email: "sarah@bouwconcurrent.nl",
    phone: "020-000000",
    sector: "Stukadoor",
    location: "Amsterdam",
    need: "Stukadoor gezocht - direct beschikbaar",
    stage: "Hot",
    source: "website",
    sourceUrl: "",
    objection: "",
    lastAction: "Ik zie dat jullie zoektocht naar stukadoors dringend is.",
    nextAction: "Stap 4 · pricing question",
    urgency: "Hoog",
    service: "full-service",
    people: 4,
    start: "Direct",
    housing: "Onbekend",
    score: 91,
    updated: "2026-06-06",
    researchDone: "Ja",
    lastReply: "Wanneer kunnen jullie starten?",
    status: "active",
    leadQuality: "hot",
  },
  {
    id: 5,
    company: "Technical Solutions",
    contact: "john",
    role: "werkgever",
    email: "john@technicalsolutions.nl",
    phone: "040-000000",
    sector: "Lasser",
    location: "Eindhoven",
    need: "Lasser gezocht",
    stage: "Koud",
    source: "Indeed",
    sourceUrl: "",
    objection: "Geen behoefte",
    lastAction: "Ik zag jullie vacature voor lassers.",
    nextAction: "Stap 2 · not interested",
    urgency: "Laag",
    service: "contracting",
    people: 0,
    start: "Niet bekend",
    housing: "Onbekend",
    score: 45,
    updated: "2026-06-03",
    researchDone: "Ja",
    lastReply: "Wij hebben op dit moment geen behoefte, graag niet meer mailen.",
    status: "inactive",
    leadQuality: "cold",
  },
];

const weeklyOutreach = [
  { day: "Ma", mails: 42, replies: 6, hot: 2 },
  { day: "Di", mails: 55, replies: 8, hot: 3 },
  { day: "Wo", mails: 38, replies: 5, hot: 2 },
  { day: "Do", mails: 61, replies: 10, hot: 4 },
  { day: "Vr", mails: 47, replies: 7, hot: 3 },
  { day: "Za", mails: 18, replies: 2, hot: 1 },
  { day: "Zo", mails: 12, replies: 1, hot: 0 },
];

const pipelineByStage = [
  { label: "Nieuw", value: 38 },
  { label: "Warm", value: 26 },
  { label: "Hot", value: 11 },
  { label: "Afspraak", value: 7 },
];

const replyCategories = [
  { label: "Interested", value: 8 },
  { label: "Pricing question", value: 4 },
  { label: "Not interested", value: 3 },
  { label: "Auto reply", value: 2 },
  { label: "Wrong person", value: 1 },
];

const quickActions = [
  { label: "Replies beoordelen", count: 5 },
  { label: "Meetings plannen", count: 3 },
  { label: "Research missen", count: 12 },
  { label: "Risico replies", count: 4 },
];

const heatmap = [
  [1, 0, 2, 1, 0, 2, 1],
  [0, 1, 3, 2, 1, 0, 2],
  [1, 0, 1, 0, 2, 3, 1],
  [0, 2, 1, 3, 0, 1, 0],
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function maxValue(items, key) {
  return Math.max(...items.map((item) => Number(item[key]) || 0), 1);
}

function calculateStats(leads) {
  if (!leads.length) {
    return { active: 0, hot: 0, calls: 0, avg: 0, people: 0, warm: 0 };
  }

  return {
    active: leads.length,
    hot: leads.filter((lead) => lead.stage === "Hot").length,
    calls: leads.filter((lead) => lead.stage === "Afspraak").length,
    warm: leads.filter((lead) => lead.stage === "Warm").length,
    avg: Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length),
    people: leads.reduce((sum, lead) => sum + lead.people, 0),
  };
}

function getStageClass(stage) {
  if (stage === "Hot") return "border-black bg-black text-white";
  if (stage === "Warm") return "border-[#a8a8a8] bg-[#eeeeee] text-black";
  if (stage === "Afspraak") return "border-black bg-white text-black";
  if (stage === "Nieuw") return "border-[#dddddd] bg-[#f7f7f7] text-[#555555]";
  return "border-[#e4e4e4] bg-[#f3f3f3] text-[#777777]";
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leads, setLeads] = useState(mockLeads);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("Alle");

  const stats = useMemo(() => calculateStats(leads), [leads]);
  const maxOutreach = maxValue(weeklyOutreach, "mails");
  const maxPipeline = maxValue(pipelineByStage, "value");
  const maxCategories = maxValue(replyCategories, "value");

  const filteredLeads = leads.filter((lead) => {
    const normalizedQuery = query.trim().toLowerCase();
    const text = [lead.company, lead.contact, lead.role, lead.email, lead.sector, lead.location, lead.need]
      .join(" ")
      .toLowerCase();
    const matchesSearch = !normalizedQuery || text.includes(normalizedQuery);
    const matchesStage = stage === "Alle" || lead.stage === stage;
    return matchesSearch && matchesStage;
  });

  const highlightedLead = leads.find((lead) => lead.stage === "Afspraak") || leads[0];

  return (
    <div className="min-h-screen bg-[#f6f6f6] text-black">
      <div className="flex min-h-screen">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="min-w-0 flex-1 lg:pl-[250px]">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Page Header */}
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-[34px] font-medium tracking-tight sm:text-[42px]">Dashboard</h1>
                  <p className="mt-1 max-w-3xl text-sm leading-6 text-[#666666]">
                    Floniq werkgever-agent: leads, vacatures, replies, afspraken en follow-ups.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="px-4 py-2.5 text-sm font-medium border border-black bg-white hover:bg-[#f2f2f2] rounded-lg transition">
                    Export report
                  </button>
                  <button className="px-4 py-2.5 text-sm font-medium border border-black bg-black text-white hover:bg-[#222222] rounded-lg transition">
                    Nieuwe lead
                  </button>
                </div>
              </div>

              {/* Metric Cards Row */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Lead Quality Card */}
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-5">
                      <DonutProgress value={stats.avg} />
                      <div>
                        <div className="text-sm text-[#666666]">Lead kwaliteit</div>
                        <div className="mt-2 text-[34px] font-semibold leading-none">{stats.avg}%</div>
                        <div className="mt-3 text-sm text-[#666666]">Gemiddelde leadscore</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Outreach Card */}
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5">
                  <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
                    <StatMiniChart />
                    <div>
                      <div className="text-sm text-[#666666]">Outreach deze week</div>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="text-[34px] font-semibold leading-none">273</div>
                        <span className="bg-[#e7f1e7] text-[#4f8b58] rounded-full px-3 py-1 text-xs font-semibold">↗ 12%</span>
                      </div>
                      <div className="mt-3 text-sm text-[#666666]">Verstuurde mails</div>
                    </div>
                  </div>
                </div>

                {/* Action Needed Card */}
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-[#666666]">Actie nodig</div>
                      <div className="mt-2 text-[34px] font-semibold leading-none">7</div>
                      <div className="mt-3 text-sm text-[#666666]">Opvolgingen voor Dani</div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-2">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-red-600">3</p>
                      <p className="text-xs text-red-700 mt-1">Escalated</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-orange-600">2</p>
                      <p className="text-xs text-orange-700 mt-1">Meetings</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 text-center">
                      <p className="text-lg font-bold text-yellow-600">2</p>
                      <p className="text-xs text-yellow-700 mt-1">Risico</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Mailflow Funnel */}
              <section className="rounded-2xl border border-[#e8e8e8] bg-white p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-black">Mailflow funnel</h2>
                  <p className="text-sm text-[#666666] mt-1">Van nieuwe lead naar klant</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {[
                    { step: 'Nieuwe leads', count: 126, percentage: 100 },
                    { step: 'Mail 1', count: 112, percentage: 89 },
                    { step: 'Mail 2', count: 84, percentage: 67 },
                    { step: 'Mail 3', count: 51, percentage: 40 },
                    { step: 'Reply', count: 18, percentage: 14 },
                    { step: 'Meeting', count: 6, percentage: 5 },
                    { step: 'Klant', count: 2, percentage: 2 },
                  ].map((item) => (
                    <div key={item.step} className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                      <p className="text-xs text-neutral-600 mb-2">{item.step}</p>
                      <p className="text-2xl font-bold text-black mb-2">{item.count}</p>
                      <p className="text-xs text-neutral-500">{item.percentage}%</p>
                      <div className="mt-3 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black rounded-full transition-all duration-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Summary Cards */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Outreach Summary */}
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6">
                  <div className="mb-4">
                    <p className="text-3xl font-bold text-black">126 leads</p>
                    <p className="text-sm text-[#666666] mt-1">
                      Deze week · focus op bouw en installatie
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Mails', count: 273, icon: '📧' },
                      { label: 'Replies', count: 39, icon: '💬' },
                      { label: 'Hot leads', count: 11, icon: '🔥' },
                      { label: 'Meetings', count: 6, icon: '📅' },
                    ].map((metric) => {
                      const maxCount = 273;
                      const percentage = (metric.count / maxCount) * 100;
                      return (
                        <div key={metric.label} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-lg">{metric.icon}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
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

                {/* Highlighted Lead */}
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-black to-neutral-700 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-white">
                        {highlightedLead.company.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold text-black truncate">{highlightedLead.company}</h3>
                          {highlightedLead.leadQuality === "hot" && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 border border-orange-200 rounded-full">
                              <span className="text-xs font-medium text-orange-700">🔥 Hot lead</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <span>{highlightedLead.location}</span>
                          <span>·</span>
                          <span>{highlightedLead.role}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-neutral-600">Lead score</p>
                          <span className="text-2xl font-bold text-black">{highlightedLead.score}%</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-black rounded-full"
                            style={{ width: `${highlightedLead.score}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg">
                          <span className="text-sm font-medium text-black">
                            {highlightedLead.nextAction}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Bottom Cards */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                {/* Reply Categories */}
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6">
                  <h3 className="text-base font-bold text-black mb-4">Reply categorieën</h3>
                  <div className="space-y-3">
                    {replyCategories.map((category) => (
                      <div key={category.label} className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-black capitalize">
                              {category.label.toLowerCase()}
                            </p>
                            <p className="text-sm font-bold text-black">{category.value}</p>
                          </div>
                          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-black rounded-full transition-all duration-500"
                              style={{ width: `${(category.value / maxCategories) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6">
                  <h3 className="text-base font-bold text-black mb-4">Quick actions</h3>
                  <div className="space-y-2">
                    {quickActions.map((action) => (
                      <button
                        key={action.label}
                        className="w-full flex items-center gap-3 p-3 hover:bg-neutral-50 rounded-xl transition-colors text-left"
                      >
                        <div className="w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-sm">⚡</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-black">{action.label}</p>
                        </div>
                        <div className="px-3 py-1 bg-neutral-100 rounded-full">
                          <span className="text-sm font-bold text-black">{action.count}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Activity Heatmap */}
                <div className="rounded-2xl border border-[#e8e8e8] bg-white p-6">
                  <h3 className="text-base font-bold text-black mb-2">Activiteit heatmap</h3>
                  <p className="text-xs text-neutral-600 mb-4">Reply activiteit · laatste 7 dagen</p>
                  <div className="space-y-2">
                    {["Ma", "Di", "Wo", "Do", "Vr", "Za", "Zo"].map((day, dayIndex) => (
                      <div key={day} className="flex items-center gap-3">
                        <div className="w-8 text-sm text-neutral-600">{day}</div>
                        <div className="flex-1 flex gap-1">
                          {heatmap[dayIndex % 4]?.map((level, cellIndex) => {
                            const colors = ["bg-neutral-100", "bg-neutral-200", "bg-neutral-600", "bg-black"];
                            return (
                              <div
                                key={`${day}-${cellIndex}`}
                                className={`h-3 rounded-sm ${colors[level] || colors[0]}`}
                                style={{ width: '100%', minWidth: '8px' }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-200">
                    <span className="text-xs text-neutral-600">Activiteit:</span>
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-neutral-100 rounded-sm" />
                      <div className="w-3 h-3 bg-neutral-200 rounded-sm" />
                      <div className="w-3 h-3 bg-neutral-600 rounded-sm" />
                      <div className="w-3 h-3 bg-black rounded-sm" />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function DonutProgress({ value = 64 }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = 42;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (safeValue / 100) * circumference;

  return (
    <div className="relative flex h-[110px] w-[110px] shrink-0 items-center justify-center">
      <svg height="110" width="110" className="-rotate-90">
        <circle stroke="#e5e5e5" fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx="55" cy="55" />
        <circle
          stroke="black"
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="butt"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx="55"
          cy="55"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-xl font-semibold">{safeValue}%</div>
      </div>
    </div>
  );
}

function StatMiniChart() {
  const points = "0,40 25,28 50,44 75,22 100,30 125,16 150,26";
  return (
    <div className="h-16 w-full min-w-[160px]">
      <svg viewBox="0 0 150 50" className="h-full w-full">
        {[20, 45, 70, 95, 120].map((x) => (
          <line key={x} x1={x} y1="5" x2={x} y2="48" stroke="#d8d8d8" strokeDasharray="3 3" strokeWidth="1" />
        ))}
        <polyline fill="none" stroke="black" strokeWidth="2" points={points} />
      </svg>
    </div>
  );
}

function Sidebar({ open, onClose }) {
  const menuSections = [
    {
      title: "Menu",
      items: [
        { id: "dashboard", label: "Dashboard", icon: "📊" },
        { id: "leads", label: "Leads", icon: "👥" },
        { id: "companies", label: "Bedrijven", icon: "🏢" },
        { id: "vacancies", label: "Vacatures", icon: "💼" },
        { id: "conversations", label: "Gesprekken", icon: "💬" },
        { id: "tasks", label: "Follow-ups", icon: "✓" },
      ],
    },
    {
      title: "Database",
      items: [
        { id: "analytics", label: "Analytics", icon: "📈" },
        { id: "pipeline", label: "Pipeline", icon: "🎯" },
        { id: "brain", label: "Agent Brain", icon: "🧠" },
      ],
    },
    {
      title: "Systeem",
      items: [
        { id: "integrations", label: "Integraties", icon: "🔗" },
        { id: "settings", label: "Instellingen", icon: "⚙" },
      ],
    },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-[250px] flex-col border-r border-[#e5e5e5] bg-[#f8f8f8] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between px-7 py-6">
          <button className="text-[32px] font-semibold tracking-tight">
            Floniq
          </button>
          <button className="rounded-lg p-2 hover:bg-[#eeeeee] lg:hidden" onClick={onClose}>
            <span className="text-xl">×</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto border-t border-[#ececec] py-4">
          {menuSections.map((section) => (
            <div key={section.title} className="px-4 py-3">
              {section.title !== "Menu" && (
                <div className="mb-3 px-2 text-xs font-medium uppercase tracking-wide text-[#888888]">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#666666] hover:bg-[#f3f3f3] transition"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#ececec] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white px-3 py-3 ring-1 ring-[#ececec]">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-black text-sm font-semibold text-white">
              D
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Dani Meertens</div>
              <div className="truncate text-xs text-[#777777]">Founder · Floniq</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function Topbar({ onMenuClick }) {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between border-b border-[#e8e8e8] bg-[#f6f6f6]/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3 lg:gap-4">
        <button className="rounded-lg border border-[#dddddd] bg-white p-2 lg:hidden" onClick={onMenuClick}>
          <span className="text-lg">☰</span>
        </button>

        <div className="hidden h-6 w-6 items-center justify-center rounded bg-[#ececec] text-[#999999] lg:flex">
          ‹
        </div>

        <div className="hidden h-11 w-[360px] items-center gap-3 rounded-lg border border-[#dcdcdc] bg-white px-4 md:flex">
          <span className="text-lg">🔍</span>
          <input
            placeholder="Zoek lead, bedrijf of vacature"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[#aaaaaa]"
          />
        </div>

        <div className="min-w-0 md:hidden">
          <div className="truncate text-sm font-semibold">Dashboard</div>
          <div className="text-xs text-[#777777]">Floniq dashboard</div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
        <button className="hidden text-sm text-[#555555] hover:text-black sm:block">
          Agent Brain
        </button>
        <button className="hidden text-sm text-[#555555] hover:text-black sm:block">
          Help
        </button>
        <button className="rounded-lg border border-[#dddddd] bg-white p-2">
          <span className="text-lg">🔔</span>
        </button>
        <div className="flex items-center gap-2 text-sm">
          <div className="hidden font-semibold sm:block">Dani</div>
          <span className="text-lg">›</span>
        </div>
      </div>
    </div>
  );
}