"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { APP_ROUTES } from "@/lib/constants/routes.const";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex items-stretch bg-background font-sans">
			{/* Visual Identity Side Banner (Unified for DRY Auth flows) */}
			<div className="hidden lg:flex lg:w-5/12 bg-primary text-primary-foreground p-12 flex-col justify-between relative overflow-hidden shrink-0">
				{/* Subtle decorative grid background */}
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--color-accent)_0%,transparent_60%)] opacity-10 pointer-events-none"></div>
				<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

				{/* Branding Logo */}
				<div className="flex items-center gap-3 relative z-10">
					<Link href={APP_ROUTES.HOME} className="flex items-center gap-3">
						<div className="bg-zinc-900 border border-zinc-800 text-primary-foreground p-2.5 rounded-2xl flex items-center justify-center">
							<ShieldAlert className="w-6 h-6 text-accent" />
						</div>
						<div>
							<span className="text-xl font-bold tracking-tight text-white block leading-none">
								BEACON
							</span>
							<span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase block mt-1">
								Hallmark University
							</span>
						</div>
					</Link>
				</div>

				{/* Unified High-Impact Portal Message */}
				<div className="flex flex-col gap-6 max-w-sm relative z-10 my-auto">
					<h2 className="text-4xl font-extrabold leading-[1.08] tracking-tight text-white">
						Securing Our Campus, Together.
					</h2>
					<p className="text-zinc-400 text-sm font-semibold leading-relaxed">
						Centralized safety connection connecting higher institution students
						with the Chief Security Officer, Hall Wardens, and Student Affairs
						in real-time.
					</p>

					<div className="flex flex-col gap-3.5 border-t border-zinc-800 pt-6 mt-2">
						<div className="flex items-start gap-3">
							<span className="h-5 w-5 rounded-full bg-accent/15 text-accent flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
								✓
							</span>
							<div>
								<p className="text-xs text-zinc-200 font-bold leading-none">
									Smart Automatic Routing
								</p>
								<p className="text-[10px] text-zinc-500 font-medium mt-1">
									Hostel incidents route to Wardens, misconduct to Deans.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<span className="h-5 w-5 rounded-full bg-accent/15 text-accent flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
								✓
							</span>
							<div>
								<p className="text-xs text-zinc-200 font-bold leading-none">
									Cloudinary Google OCR
								</p>
								<p className="text-[10px] text-zinc-500 font-medium mt-1">
									Automated student verification via physical card scanning.
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<span className="h-5 w-5 rounded-full bg-accent/15 text-accent flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
								✓
							</span>
							<div>
								<p className="text-xs text-zinc-200 font-bold leading-none">
									Chronological Audit Trails
								</p>
								<p className="text-[10px] text-zinc-500 font-medium mt-1">
									Transparent case timelines containing real-time comments.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer info */}
				<p className="text-xs font-bold text-zinc-600 relative z-10">
					&copy; {new Date().getFullYear()} Beacon Safety Portal. All rights
					reserved.
				</p>
			</div>

			{/* Forms Panel (Renders the child form page dynamically) */}
			<div className="flex-1 flex flex-col justify-center items-center px-6 md:px-12 py-12 overflow-y-auto">
				{children}
			</div>
		</div>
	);
}
