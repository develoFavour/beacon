"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { LogOut, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_ROUTES } from "@/lib/constants/routes.const";
import { DASHBOARD_NAV, UserRole } from "@/lib/constants/dashboard-nav.const";

interface SidebarProps {
	role: string;
	userName: string;
}

export function Sidebar({ role, userName }: SidebarProps) {
	return (
		<aside className="hidden lg:flex flex-col w-[260px] bg-primary text-primary-foreground h-screen sticky top-0 shrink-0">
			<DashboardNavContent role={role} userName={userName} variant="desktop" />
		</aside>
	);
}

export function DashboardNavContent({
	role,
	userName,
	variant = "desktop",
	onNavigate,
}: SidebarProps & {
	variant?: "desktop" | "mobile";
	onNavigate?: () => void;
}) {
	const pathname = usePathname();
	const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);
	const [isLoggingOut, setIsLoggingOut] = React.useState(false);
	const isMobile = variant === "mobile";

	const navItems = DASHBOARD_NAV.filter((item) =>
		item.roles.includes(role as UserRole),
	);
	const activePath = navItems
		.filter(
			(item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
		)
		.sort((a, b) => b.path.length - a.path.length)[0]?.path;

	const handleLogout = async () => {
		setIsLoggingOut(true);
		const toastID = toast.loading("Signing out");
		try {
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Logout failed");
			}
			toast.success("Signed out successfully", { id: toastID });
			window.location.href = APP_ROUTES.LOGIN;
		} catch {
			toast.error("Could not sign out", {
				id: toastID,
				description: "Please try again.",
			});
			setIsLoggingOut(false);
			setShowLogoutConfirm(false);
		}
	};

	return (
		<>
			<div className="p-6 pb-4">
				<Link
					href={APP_ROUTES.HOME}
					onClick={onNavigate}
					className="flex items-center gap-3"
				>
					<div className="bg-zinc-900 border border-zinc-800 p-2 rounded-xl flex items-center justify-center">
						<ShieldAlert className="w-5 h-5 text-accent" />
					</div>
					<div>
						<span className="text-base font-extrabold tracking-tight text-white leading-none block">
							BEACON
						</span>
						<span className="text-[9px] font-mono tracking-[0.18em] text-zinc-500 uppercase mt-0.5 block">
							Hallmark University
						</span>
					</div>
				</Link>
			</div>

			<nav
				className={cn(
					"flex-1 px-3 py-2 flex flex-col gap-1 overflow-y-auto",
					isMobile && "min-h-0",
				)}
			>
				{navItems.map((item) => {
					const isActive = activePath === item.path;
					return (
						<Link
							key={item.path}
							href={item.path}
							onClick={onNavigate}
							className={cn(
								"flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-colors",
								isActive
									? "bg-accent text-accent-foreground"
									: "text-zinc-400 hover:text-white hover:bg-zinc-800/60",
							)}
						>
							<item.icon className="w-[18px] h-[18px]" />
							{item.title}
						</Link>
					);
				})}
			</nav>

			<div className="p-4 border-t border-zinc-800">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3 min-w-0">
						<div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-black text-accent shrink-0">
							{userName.charAt(0).toUpperCase()}
						</div>
						<div className="min-w-0">
							<p className="text-xs font-bold text-white truncate">{userName}</p>
							<p className="text-[10px] font-semibold text-zinc-500 capitalize">
								{role}
							</p>
						</div>
					</div>
					<button
						onClick={() => setShowLogoutConfirm(true)}
						className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-white transition-colors cursor-pointer"
						title="Sign out"
					>
						<LogOut className="w-4 h-4" />
					</button>
				</div>
			</div>

			{showLogoutConfirm && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
					<div className="w-full max-w-sm rounded-2xl border border-border bg-card p-5 shadow-xl">
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="text-sm font-extrabold text-foreground">
									Sign out?
								</h2>
								<p className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
									You will need to sign in again to access your dashboard.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setShowLogoutConfirm(false)}
								disabled={isLoggingOut}
								className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
								aria-label="Close logout confirmation"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
						<div className="mt-5 flex justify-end gap-2">
							<button
								type="button"
								onClick={() => setShowLogoutConfirm(false)}
								disabled={isLoggingOut}
								className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold text-foreground hover:bg-muted disabled:opacity-50"
							>
								Cancel
							</button>
							<button
								type="button"
								onClick={handleLogout}
								disabled={isLoggingOut}
								className="rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:opacity-95 disabled:opacity-50"
							>
								{isLoggingOut ? "Signing out..." : "Sign out"}
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
