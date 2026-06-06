import type { ReactNode } from "react";
import {
  LayoutDashboardIcon,
  UsersIcon,
  Building2Icon,
  BriefcaseBusinessIcon,
  MessageSquareTextIcon,
  CalendarCheckIcon,
  BarChart3Icon,
  GitBranchIcon,
  BrainIcon,
  PlugIcon,
  SettingsIcon,
  HelpCircleIcon,
  ActivityIcon,
} from "lucide-react";

export type SidebarNavItem = {
  title: string;
  path?: string;
  icon?: ReactNode;
  isActive?: boolean;
  subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
  label?: string;
  items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
  {
    label: "MENU",
    items: [
      {
        title: "Dashboard",
        path: "#/dashboard",
        icon: <LayoutDashboardIcon />,
        isActive: true,
      },
      {
        title: "Leads",
        path: "#/leads",
        icon: <UsersIcon />,
      },
      {
        title: "Bedrijven",
        path: "#/companies",
        icon: <Building2Icon />,
      },
      {
        title: "Vacatures",
        path: "#/vacancies",
        icon: <BriefcaseBusinessIcon />,
      },
      {
        title: "Gesprekken",
        path: "#/conversations",
        icon: <MessageSquareTextIcon />,
      },
      {
        title: "Follow-ups",
        path: "#/followups",
        icon: <CalendarCheckIcon />,
      },
    ],
  },
  {
    label: "DATABASE",
    items: [
      {
        title: "Analytics",
        path: "#/analytics",
        icon: <BarChart3Icon />,
      },
      {
        title: "Pipeline",
        path: "#/pipeline",
        icon: <GitBranchIcon />,
      },
      {
        title: "Agent Brain",
        path: "#/brain",
        icon: <BrainIcon />,
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Integraties",
        path: "#/integrations",
        icon: <PlugIcon />,
      },
      {
        title: "Instellingen",
        path: "#/settings",
        icon: <SettingsIcon />,
      },
    ],
  },
];

export const footerNavLinks: SidebarNavItem[] = [
  {
    title: "Help Center",
    path: "#/help",
    icon: <HelpCircleIcon />,
  },
  {
    title: "System status",
    path: "#/status",
    icon: <ActivityIcon />,
  },
];

export const navLinks: SidebarNavItem[] = [
  ...navGroups.flatMap((group) =>
    group.items.flatMap((item) =>
      item.subItems?.length ? [item, ...item.subItems] : [item]
    )
  ),
  ...footerNavLinks,
];
