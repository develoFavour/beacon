"use client";

import React from "react";
import { Sidebar, DashboardNavContent } from "@/components/dashboard/sidebar";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
} from "@/components/ui/sheet";

type DashboardNavContextValue = {
	openMobileNav: () => void;
};

const DashboardNavContext = React.createContext<DashboardNavContextValue>({
	openMobileNav: () => undefined,
});

export function useDashboardNav() {
	return React.useContext(DashboardNavContext);
}

export function DashboardShell({
	role,
	userName,
	children,
}: {
	role: string;
	userName: string;
	children: React.ReactNode;
}) {
	const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

	return (
		<DashboardNavContext.Provider
			value={{ openMobileNav: () => setMobileNavOpen(true) }}
		>
			<div className="min-h-screen flex bg-background font-sans">
				<Sidebar role={role} userName={userName} />
				<Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
					<SheetContent
						side="left"
						showCloseButton={false}
						className="w-[min(86vw,320px)] max-w-[320px] gap-0 border-zinc-800 bg-primary p-0 text-primary-foreground lg:hidden"
					>
						<SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
						<SheetDescription className="sr-only">
							Open dashboard pages and account actions.
						</SheetDescription>
						<DashboardNavContent
							role={role}
							userName={userName}
							variant="mobile"
							onNavigate={() => setMobileNavOpen(false)}
						/>
					</SheetContent>
				</Sheet>
				<main className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden">
					{children}
				</main>
			</div>
		</DashboardNavContext.Provider>
	);
}
