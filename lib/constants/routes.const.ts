export const APP_ROUTES = {
	HOME: "/",
	LOGIN: "/login",
	REGISTER: "/register",
	FORGOT_PASSWORD: "/forgot-password",
	RESET_PASSWORD: "/reset-password",

	// Student
	STUDENT_DASHBOARD: "/student",
	STUDENT_REPORTS: "/student/reports",
	STUDENT_NEW_REPORT: "/student/reports/new",
	STUDENT_REPORT_DETAIL: (id: string) => `/student/reports/${id}`,
	STUDENT_PROFILE: "/student/profile",

	// CSO
	CSO_DASHBOARD: "/cso",
	CSO_CASES: "/cso/cases",
	CSO_CASE_DETAIL: (id: string) => `/cso/cases/${id}`,
	CSO_REPORTS: "/cso/reports",
	CSO_NEW_REPORT: (caseId: string) => `/cso/reports/new?caseId=${caseId}`,
	CSO_REPORT_DETAIL: (id: string) => `/cso/reports/${id}`,
	CSO_ANALYTICS: "/cso/analytics",

	// Warden
	WARDEN_DASHBOARD: "/warden",
	WARDEN_CASES: "/warden/cases",
	WARDEN_CASE_DETAIL: (id: string) => `/warden/cases/${id}`,
	WARDEN_REPORTS: "/warden/reports",
	WARDEN_NEW_REPORT: (caseId: string) => `/warden/reports/new?caseId=${caseId}`,
	WARDEN_REPORT_DETAIL: (id: string) => `/warden/reports/${id}`,

	// Dean
	DEAN_DASHBOARD: "/dean",
	DEAN_CASES: "/dean/cases",
	DEAN_CASE_DETAIL: (id: string) => `/dean/cases/${id}`,
	DEAN_HEARINGS: "/dean/hearings",
	DEAN_NEW_HEARING: "/dean/hearings/new",
	DEAN_HEARING_DETAIL: (id: string) => `/dean/hearings/${id}`,
	DEAN_REPORTS: "/dean/reports",
	DEAN_NEW_REPORT: (caseId: string) => `/dean/reports/new?caseId=${caseId}`,
	DEAN_REPORT_DETAIL: (id: string) => `/dean/reports/${id}`,

	// Admin
	ADMIN_DASHBOARD: "/admin",
	ADMIN_VERIFICATIONS: "/admin/verifications",
	ADMIN_USERS: "/admin/users",
	ADMIN_CASES: "/admin/cases",
	ADMIN_CASE_DETAIL: (id: string) => `/admin/cases/${id}`,
	ADMIN_ACTIVITY: "/admin/activity",
} as const;

export type AppRoute = string;

export type RouteRole =
	| "student"
	| "staff"
	| "cso"
	| "warden"
	| "dean"
	| "admin";

export const AUTH_ROUTES = [
	APP_ROUTES.LOGIN,
	APP_ROUTES.REGISTER,
	APP_ROUTES.FORGOT_PASSWORD,
	APP_ROUTES.RESET_PASSWORD,
] as const;

export const PROTECTED_ROUTE_PREFIXES = [
	APP_ROUTES.STUDENT_DASHBOARD,
	APP_ROUTES.CSO_DASHBOARD,
	APP_ROUTES.WARDEN_DASHBOARD,
	APP_ROUTES.DEAN_DASHBOARD,
	APP_ROUTES.ADMIN_DASHBOARD,
] as const;

export const ROLE_HOME_ROUTES: Record<RouteRole, string> = {
	student: APP_ROUTES.STUDENT_DASHBOARD,
	staff: APP_ROUTES.STUDENT_DASHBOARD,
	cso: APP_ROUTES.CSO_DASHBOARD,
	warden: APP_ROUTES.WARDEN_DASHBOARD,
	dean: APP_ROUTES.DEAN_DASHBOARD,
	admin: APP_ROUTES.ADMIN_DASHBOARD,
};

export const ROUTE_ROLE_PREFIXES: Record<string, RouteRole[]> = {
	[APP_ROUTES.STUDENT_DASHBOARD]: ["student", "staff"],
	[APP_ROUTES.CSO_DASHBOARD]: ["cso", "admin"],
	[APP_ROUTES.WARDEN_DASHBOARD]: ["warden", "admin"],
	[APP_ROUTES.DEAN_DASHBOARD]: ["dean", "admin"],
	[APP_ROUTES.ADMIN_DASHBOARD]: ["admin"],
};

export function isAuthRoute(pathname: string) {
	return AUTH_ROUTES.some((route) => pathname === route);
}

export function isProtectedRoute(pathname: string) {
	return PROTECTED_ROUTE_PREFIXES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

export function allowedRolesForPath(pathname: string) {
	const matchedPrefix = Object.keys(ROUTE_ROLE_PREFIXES)
		.sort((a, b) => b.length - a.length)
		.find((route) => pathname === route || pathname.startsWith(`${route}/`));

	return matchedPrefix ? ROUTE_ROLE_PREFIXES[matchedPrefix] : null;
}
