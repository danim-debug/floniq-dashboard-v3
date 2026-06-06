import { mockBrevoContacts } from '../data/mockBrevoContacts';

// 1. Active leads filter
export const getActiveLeads = () => {
  return mockBrevoContacts.filter(lead =>
    !lead.DO_NOT_CONTACT &&
    !lead.UNSUBSCRIBED &&
    lead.DEAL_STATUS !== 'won' &&
    lead.DEAL_STATUS !== 'lost' &&
    lead.DEAL_STATUS !== 'not_interested'
  );
};

// 2. Hot leads filter
export const getHotLeads = () => {
  return mockBrevoContacts.filter(lead =>
    lead.LEAD_QUALITY === 'hot' ||
    lead.LEAD_SCORE >= 70 ||
    lead.URGENCY === 'high' ||
    lead.REPLY_CATEGORY === 'interested' ||
    lead.MEETING_REQUESTED
  );
};

// 3. Action needed filter
export const getActionNeeded = () => {
  return mockBrevoContacts.filter(lead =>
    lead.ESCALATED_TO_DANI ||
    lead.NEEDS_CALENDAR ||
    (lead.MEETING_REQUESTED && !lead.MEETING_SCHEDULED) ||
    lead.RISK_LEVEL === 'high' ||
    lead.NEEDS_RESEARCH
  );
};

// 4. Customer count
export const getCustomerCount = () => {
  return mockBrevoContacts.filter(lead => lead.DEAL_STATUS === 'won').length;
};

// 5. Mailflow stopped filter
export const getMailflowStopped = () => {
  return mockBrevoContacts.filter(lead =>
    lead.REPLY_RECEIVED ||
    lead.UNSUBSCRIBED ||
    lead.DO_NOT_CONTACT ||
    lead.DEAL_STATUS === 'won' ||
    lead.DEAL_STATUS === 'lost' ||
    lead.DEAL_STATUS === 'not_interested'
  );
};

// 6. Meeting needs planning
export const getMeetingNeedsPlanning = () => {
  return mockBrevoContacts.filter(lead =>
    lead.MEETING_REQUESTED && !lead.MEETING_SCHEDULED
  );
};

// 7. Highlighted lead calculation
export const getHighlightedLead = () => {
  const leadsWithScores = mockBrevoContacts.map(lead => {
    let score = lead.LEAD_SCORE || 0;

    if (lead.MEETING_REQUESTED) score += 50;
    if (lead.REPLY_CATEGORY === 'interested') score += 40;
    if (lead.ESCALATED_TO_DANI) score += 30;
    if (lead.LEAD_QUALITY === 'hot') score += 20;

    return { ...lead, calculatedScore: score };
  });

  return leadsWithScores.reduce((highest, current) =>
    current.calculatedScore > highest.calculatedScore ? current : highest
  );
};

// 8. Average lead quality
export const getAverageLeadScore = () => {
  const activeLeads = getActiveLeads();
  if (activeLeads.length === 0) return 0;

  const totalScore = activeLeads.reduce((sum, lead) => sum + (lead.LEAD_SCORE || 0), 0);
  return Math.round(totalScore / activeLeads.length);
};

// 9. Outreach this week
export const getOutreachThisWeek = () => {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return mockBrevoContacts.filter(lead => {
    if (!lead.LAST_CONTACT_DATE) return false;
    const contactDate = new Date(lead.LAST_CONTACT_DATE);
    return contactDate >= oneWeekAgo;
  });
};

// 10. Mailflow funnel data
export const getMailflowFunnel = () => {
  const totalLeads = mockBrevoContacts.length;
  const mail1 = mockBrevoContacts.filter(l => l.EMAIL_STEP >= 1).length;
  const mail2 = mockBrevoContacts.filter(l => l.EMAIL_STEP >= 2).length;
  const mail3 = mockBrevoContacts.filter(l => l.EMAIL_STEP >= 3).length;
  const replies = mockBrevoContacts.filter(l => l.REPLY_RECEIVED).length;
  const meetings = mockBrevoContacts.filter(l => l.MEETING_REQUESTED).length;
  const customers = mockBrevoContacts.filter(l => l.DEAL_STATUS === 'won').length;

  return [
    { step: 'Nieuwe leads', count: totalLeads, percentage: 100 },
    { step: 'Mail 1', count: mail1, percentage: Math.round((mail1 / totalLeads) * 100) },
    { step: 'Mail 2', count: mail2, percentage: Math.round((mail2 / totalLeads) * 100) },
    { step: 'Mail 3', count: mail3, percentage: Math.round((mail3 / totalLeads) * 100) },
    { step: 'Reply', count: replies, percentage: Math.round((replies / totalLeads) * 100) },
    { step: 'Meeting', count: meetings, percentage: Math.round((meetings / totalLeads) * 100) },
    { step: 'Klant', count: customers, percentage: Math.round((customers / totalLeads) * 100) }
  ];
};

// 11. Reply categories
export const getReplyCategories = () => {
  const categories = {};

  mockBrevoContacts.forEach(lead => {
    if (lead.REPLY_CATEGORY) {
      categories[lead.REPLY_CATEGORY] = (categories[lead.REPLY_CATEGORY] || 0) + 1;
    }
  });

  return Object.entries(categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
};

// 12. Quick actions
export const getQuickActions = () => {
  const repliesToReview = mockBrevoContacts.filter(l =>
    l.REPLY_RECEIVED && !l.AUTO_REPLIED && l.RISK_LEVEL !== 'high'
  ).length;

  const meetingsToPlan = getMeetingNeedsPlanning().length;
  const needsResearch = mockBrevoContacts.filter(l => l.NEEDS_RESEARCH).length;
  const riskReplies = mockBrevoContacts.filter(l =>
    l.REPLY_RECEIVED && l.RISK_LEVEL === 'high'
  ).length;

  return [
    { action: 'Replies beoordelen', count: repliesToReview, icon: 'MessageSquare' },
    { action: 'Meetings plannen', count: meetingsToPlan, icon: 'Calendar' },
    { action: 'Research missen', count: needsResearch, icon: 'Search' },
    { action: 'Risico replies', count: riskReplies, icon: 'AlertCircle' }
  ];
};

// 13. Activity heatmap data (last 7 days)
export const getActivityHeatmap = () => {
  const days = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
  const activityData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const dayStart = new Date(date.setHours(0, 0, 0, 0));
    const dayEnd = new Date(date.setHours(23, 59, 59, 999));

    const activityCount = mockBrevoContacts.filter(lead => {
      if (!lead.REPLY_DATE) return false;
      const replyDate = new Date(lead.REPLY_DATE);
      return replyDate >= dayStart && replyDate <= dayEnd;
    }).length;

    activityData.push({
      day: days[date.getDay()],
      date: date.toISOString().split('T')[0],
      count: activityCount,
      intensity: Math.min(activityCount / 5, 1) // Normalize to 0-1
    });
  }

  return activityData;
};

// 14. Outreach summary
export const getOutreachSummary = () => {
  const thisWeekLeads = getOutreachThisWeek();

  return {
    totalLeads: getActiveLeads().length,
    emailsSent: thisWeekLeads.length,
    replies: mockBrevoContacts.filter(l => l.REPLY_RECEIVED && !l.AUTO_REPLIED).length,
    hotLeads: getHotLeads().length,
    meetings: mockBrevoContacts.filter(l => l.MEETING_REQUESTED).length,
    focus: 'bouw en installatie'
  };
};