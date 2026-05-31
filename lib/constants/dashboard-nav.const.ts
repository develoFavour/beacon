import {
	LayoutDashboard,
	FileText,
	FilePlus,
	User,
	Building,
	GraduationCap,
	CalendarDays,
	Users,
	ShieldCheck,
	ListChecks,
	Activity,
} from "lucide-react";
import { APP_ROUTES } from "./routes.const";
import type { LucideIcon } from "lucide-react";

export type UserRole = "student" | "cso" | "warden" | "dean" | "admin";

export interface NavItemConfig {
	title: string;
	path: string;
	icon: LucideIcon;
	roles: UserRole[];
}

export const DASHBOARD_NAV: NavItemConfig[] = [
	// Student Specific
	{
		title: "Overview",
		path: APP_ROUTES.STUDENT_DASHBOARD,
		icon: LayoutDashboard,
		roles: ["student"],
	},
	{
		title: "My Reports",
		path: APP_ROUTES.STUDENT_REPORTS,
		icon: FileText,
		roles: ["student"],
	},
	{
		title: "File Report",
		path: APP_ROUTES.STUDENT_NEW_REPORT,
		icon: FilePlus,
		roles: ["student"],
	},
	// {
	// 	title: "My Profile",
	// 	path: APP_ROUTES.STUDENT_PROFILE,
	// 	icon: User,
	// 	roles: ["student"],
	// },

	// CSO Specific
	{
		title: "Overview",
		path: APP_ROUTES.CSO_DASHBOARD,
		icon: LayoutDashboard,
		roles: ["cso"],
	},
	{
		title: "Security Cases",
		path: APP_ROUTES.CSO_CASES,
		icon: FileText,
		roles: ["cso"],
	},
	{
		title: "My Reports",
		path: APP_ROUTES.CSO_REPORTS,
		icon: FileText,
		roles: ["cso"],
	},

	// Warden Specific
	{
		title: "Hostel Overview",
		path: APP_ROUTES.WARDEN_DASHBOARD,
		icon: Building,
		roles: ["warden"],
	},
	{
		title: "Hostel Cases",
		path: APP_ROUTES.WARDEN_CASES,
		icon: FileText,
		roles: ["warden"],
	},
	{
		title: "My Reports",
		path: APP_ROUTES.WARDEN_REPORTS,
		icon: FileText,
		roles: ["warden"],
	},

	// Dean Specific
	{
		title: "Overview",
		path: APP_ROUTES.DEAN_DASHBOARD,
		icon: GraduationCap,
		roles: ["dean"],
	},
	{
		title: "Conduct Cases",
		path: APP_ROUTES.DEAN_CASES,
		icon: FileText,
		roles: ["dean"],
	},
	{
		title: "Hearings",
		path: APP_ROUTES.DEAN_HEARINGS,
		icon: CalendarDays,
		roles: ["dean"],
	},
	{
		title: "My Reports",
		path: APP_ROUTES.DEAN_REPORTS,
		icon: FileText,
		roles: ["dean"],
	},

	// Admin Specific
	{
		title: "Overview",
		path: APP_ROUTES.ADMIN_DASHBOARD,
		icon: LayoutDashboard,
		roles: ["admin"],
	},
	{
		title: "Verifications",
		path: APP_ROUTES.ADMIN_VERIFICATIONS,
		icon: ShieldCheck,
		roles: ["admin"],
	},
	{
		title: "Users",
		path: APP_ROUTES.ADMIN_USERS,
		icon: Users,
		roles: ["admin"],
	},
	{
		title: "Cases",
		path: APP_ROUTES.ADMIN_CASES,
		icon: ListChecks,
		roles: ["admin"],
	},
	{
		title: "Activity",
		path: APP_ROUTES.ADMIN_ACTIVITY,
		icon: Activity,
		roles: ["admin"],
	},
];
