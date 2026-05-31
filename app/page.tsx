"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
	ShieldAlert,
	ArrowRight,
	ArrowUpRight,
	FileText,
	Activity,
	UserCheck,
	Mail,
	Shield,
	Clock,
	Eye,
	Building2,
	Users,
	BarChart3,
	Zap,
	Lock,
	Fingerprint,
} from "lucide-react";
import { APP_ROUTES } from "@/lib/constants/routes.const";

const HALLMARK_ADDRESS =
	"Km 65, Sagamu-Ore Expressway, Ijebu-Itele, Ogun State";
const HALLMARK_EMAIL = "registrar@hallmarkuniversity.edu.ng";

const STATS = [
	{ value: "24/7", label: "Active Monitoring", icon: Clock },
	{ value: "< 2min", label: "Average Response", icon: Zap },
	{ value: "100%", label: "Report Tracking", icon: Eye },
	{ value: "3", label: "Admin Authorities", icon: Users },
];

const ROLES = [
	{
		title: "Chief Security Officer",
		shortName: "CSO",
		description:
			"Campus-wide security visibility, incident review, and coordinated response across Hallmark University.",
		scope: "Security Reports",
		accent: "bg-foreground text-background",
	},
	{
		title: "Hall Warden",
		shortName: "HW",
		description:
			"Hostel safety management, residential welfare follow-up, and room or facility incident tracking.",
		scope: "Hostel Incidents",
		accent: "bg-accent text-accent-foreground",
	},
	{
		title: "Dean of Student Affairs",
		shortName: "DSA",
		description:
			"Student welfare oversight, misconduct review, hearing scheduling, and disciplinary case records.",
		scope: "Misconduct Cases",
		accent: "bg-zinc-200 text-foreground",
	},
];

const STEPS = [
	{
		number: "01",
		title: "Register & Verify",
		description:
			"Create your student account and upload your physical ID card. Our Cloudinary OCR engine auto-verifies your name and matric number in seconds.",
		icon: Fingerprint,
	},
	{
		number: "02",
		title: "Report an Incident",
		description:
			"Submit an incident through a guided form - select the crime type, pin the Hallmark location, describe what happened, and attach evidence if available.",
		icon: FileText,
	},
	{
		number: "03",
		title: "Smart Auto-Routing",
		description:
			"Your report is dispatched to the right Hallmark authority. Hostel welfare issues go to the Warden, misconduct goes to the Dean, and security cases go to the CSO.",
		icon: Activity,
	},
	{
		number: "04",
		title: "Track Your Case",
		description:
			"Follow your report on a visual timeline. See exactly when officers review, investigate, and resolve your case - full transparency.",
		icon: Eye,
	},
];

export default function LandingPage() {
	return (
		<div className="min-h-screen flex flex-col bg-background text-foreground font-sans">
			{/* ─────────────────── NAVBAR ─────────────────── */}
			<header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/60">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-3 md:py-4 flex justify-between items-center gap-3">
					<div className="flex items-center gap-2.5 min-w-0">
						<div className="bg-zinc-900 border border-zinc-800 text-primary-foreground p-2.5 rounded-2xl flex items-center justify-center">
							<ShieldAlert className="w-6 h-6 text-accent" />
						</div>
						<div className="min-w-0">
							<span className="text-base sm:text-lg font-extrabold tracking-tight text-foreground leading-none">
								BEACON
							</span>
							<span className="text-[8px] sm:text-[9px] block uppercase tracking-[0.18em] sm:tracking-[0.2em] text-muted-foreground font-bold mt-0.5 truncate">
								Hallmark University
							</span>
						</div>
					</div>

					<nav className="hidden md:flex items-center gap-8 text-[13px] font-bold text-muted-foreground">
						<a
							href="#how-it-works"
							className="hover:text-foreground transition-colors"
						>
							How it works
						</a>
						<a
							href="#authorities"
							className="hover:text-foreground transition-colors"
						>
							Authorities
						</a>
						<a
							href="#features"
							className="hover:text-foreground transition-colors"
						>
							Features
						</a>
					</nav>

					<div className="flex items-center gap-3">
						<Link
							href={APP_ROUTES.LOGIN}
							className="px-5 py-2.5 rounded-full text-[13px] font-bold border border-border hover:bg-muted transition-all hidden sm:inline-flex"
						>
							Sign In
						</Link>
						<Link
							href={APP_ROUTES.REGISTER}
							className="px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-[13px] font-bold bg-primary text-primary-foreground hover:opacity-95 transition-all flex items-center gap-2 shrink-0"
						>
							Get Started
							<ArrowRight className="w-3.5 h-3.5 text-accent" />
						</Link>
					</div>
				</div>
			</header>

			<main className="flex-1">
				{/* ─────────────────── HERO ─────────────────── */}
				<section className="relative overflow-hidden border-b border-border/60">
					<Image
						src="/hallmark_university.jpg"
						alt="Hallmark University campus"
						fill
						priority
						sizes="100vw"
						className="object-cover opacity-100"
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-background/78 via-background/28 to-background/52"></div>
					<div className="absolute inset-0 bg-gradient-to-r from-background/42 via-transparent to-background/42"></div>
					<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-14 sm:pt-16 md:pt-24 pb-14 sm:pb-16 md:pb-24">
						<div className="flex flex-col items-center text-center max-w-4xl mx-auto gap-6 md:gap-8">
							{/* Pill badge */}
							<div className="inline-flex items-center gap-2.5 bg-card border border-border py-2 px-5 rounded-full text-xs font-bold shadow-2xs">
								<span className="flex h-2 w-2 relative">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
								</span>
								<span className="text-muted-foreground">
									Hallmark University campus safety portal
								</span>
							</div>

							{/* Display heading */}
							<h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-[1.05] md:leading-[1.02] text-foreground">
								Your Campus{" "}
								<span className="relative inline-block">
									Safety
									<span className="absolute -bottom-1 left-0 right-0 h-3 bg-accent/30 -skew-x-3 rounded-sm"></span>
								</span>
								<br className="hidden md:block" /> Starts Here.
							</h1>

							{/* Description */}
							<p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl font-semibold leading-relaxed">
								A centralized digital safety portal for Hallmark University -
								connecting students with the Chief Security Officer, Hall
								Wardens, and Dean of Student Affairs in real-time.
							</p>

							{/* CTA Group */}
							<div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-2 w-full sm:w-auto">
								<Link
									href={APP_ROUTES.REGISTER}
									className="w-full sm:w-auto px-8 py-4 rounded-full text-[15px] font-bold bg-primary text-primary-foreground hover:opacity-95 flex items-center justify-center gap-2.5 group transition-all shadow-md"
								>
									Create Student Account
									<ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-0.5 transition-transform" />
								</Link>
								<Link
									href={APP_ROUTES.LOGIN}
									className="w-full sm:w-auto px-8 py-4 rounded-full text-[15px] font-bold bg-card border border-border hover:bg-muted flex items-center justify-center gap-2.5 transition-all"
								>
									<Lock className="w-4 h-4 text-muted-foreground" />
									Officer Sign-In
								</Link>
							</div>
						</div>
					</div>
				</section>

				{/* ─────────────────── HOW IT WORKS ─────────────────── */}
				{/* Live Stats Bar */}
				<section className="bg-background border-b border-border">
					<div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-10">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
							{STATS.map((stat) => (
								<div
									key={stat.label}
									className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 shadow-2xs"
								>
									<div className="h-9 w-9 rounded-xl bg-accent/15 flex items-center justify-center">
										<stat.icon className="w-4.5 h-4.5 text-foreground" />
									</div>
									<div>
										<p className="text-2xl font-black tracking-tight text-foreground">
											{stat.value}
										</p>
										<p className="text-[11px] font-bold text-muted-foreground mt-0.5">
											{stat.label}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section id="how-it-works" className="bg-card border-y border-border">
					<div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
						<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
							<div>
								<p className="text-[11px] font-black uppercase tracking-[0.2em] text-accent mb-3">
									Process
								</p>
								<h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-[1.08]">
									Report to Resolution
									<br className="hidden md:block" /> in Four Steps.
								</h2>
							</div>
							<p className="text-sm font-semibold text-muted-foreground max-w-md leading-relaxed">
								No paperwork, no physical visits. Submit a report from anywhere,
								and your campus authorities are instantly notified.
							</p>
						</div>

						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
							{STEPS.map((step) => (
								<div
									key={step.number}
									className="bg-background border border-border rounded-2xl p-6 flex flex-col gap-5 group hover:border-foreground/20 transition-colors relative"
								>
									<div className="flex items-center justify-between">
										<span className="text-[11px] font-black text-muted-foreground/40 tracking-wider">
											{step.number}
										</span>
										<div className="h-10 w-10 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-colors">
											<step.icon className="w-5 h-5 text-foreground" />
										</div>
									</div>
									<div>
										<h3 className="text-base font-extrabold text-foreground mb-2">
											{step.title}
										</h3>
										<p className="text-xs font-semibold text-muted-foreground leading-relaxed">
											{step.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* ─────────────────── AUTHORITY ROLES ─────────────────── */}
				<section
					id="authorities"
					className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24"
				>
					<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 md:mb-16">
						<div>
							<p className="text-[11px] font-black uppercase tracking-[0.2em] text-accent mb-3">
								Authorities
							</p>
							<h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-[1.08]">
								Three Offices,
								<br className="hidden md:block" /> One Platform.
							</h2>
						</div>
						<p className="text-sm font-semibold text-muted-foreground max-w-md leading-relaxed">
							Every incident reaches the right authority automatically,
							eliminating the delays caused by manual paper-routing between
							departments.
						</p>
					</div>

					<div className="grid md:grid-cols-3 gap-6">
						{ROLES.map((role) => (
							<div
								key={role.shortName}
								className="bg-card border border-border rounded-2xl p-7 flex flex-col gap-5 shadow-2xs hover:shadow-sm transition-shadow"
							>
								<div className="flex items-center justify-between">
									<div
										className={`h-11 w-11 rounded-xl ${role.accent} flex items-center justify-center text-xs font-black`}
									>
										{role.shortName}
									</div>
									<span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider bg-background border border-border px-3 py-1 rounded-full">
										{role.scope}
									</span>
								</div>
								<div>
									<h3 className="text-lg font-extrabold text-foreground mb-2">
										{role.title}
									</h3>
									<p className="text-xs font-semibold text-muted-foreground leading-relaxed">
										{role.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</section>

				{/* ─────────────────── FEATURE BENTO GRID ─────────────────── */}
				<section id="features" className="bg-card border-y border-border">
					<div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
						<div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
							<p className="text-[11px] font-black uppercase tracking-[0.2em] text-accent mb-3">
								Features
							</p>
							<h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-[1.08]">
								Built for Transparency & Speed.
							</h2>
							<p className="text-sm font-semibold text-muted-foreground mt-4 leading-relaxed">
								Every feature is designed to eliminate the bottlenecks of
								traditional manual crime reporting systems.
							</p>
						</div>

						{/* Bento-style grid */}
						<div className="grid md:grid-cols-12 gap-5">
							{/* Large card */}
							<div className="md:col-span-7 bg-primary text-primary-foreground rounded-2xl p-8 md:p-10 flex flex-col justify-between gap-8 relative overflow-hidden">
								<div className="absolute -top-12 -right-12 w-40 h-40 bg-zinc-800 rounded-full opacity-30 pointer-events-none"></div>
								<div className="flex flex-col gap-3 relative z-10">
									<div className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 text-accent flex items-center justify-center">
										<Activity className="w-5 h-5" />
									</div>
									<h3 className="text-xl font-extrabold">
										Smart Incident Routing
									</h3>
									<p className="text-zinc-400 text-sm font-semibold leading-relaxed max-w-sm">
										Reports are automatically classified and dispatched based on
										their type and location - hostel incidents go to the Warden,
										behavioral misconduct goes to the Dean, and the CSO monitors
										all campus-wide activity.
									</p>
								</div>
								<div className="flex gap-2 flex-wrap relative z-10">
									<span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-bold rounded-full">
										Hostel to Warden
									</span>
									<span className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-bold rounded-full">
										Misconduct to Dean
									</span>
									<span className="px-3 py-1.5 bg-accent text-accent-foreground text-[10px] font-bold rounded-full">
										Security to CSO
									</span>
								</div>
							</div>

							{/* Right stack */}
							<div className="md:col-span-5 flex flex-col gap-5">
								<div className="bg-background border border-border rounded-2xl p-6 flex flex-col gap-3 flex-1">
									<div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
										<UserCheck className="w-5 h-5" />
									</div>
									<h3 className="text-base font-extrabold text-foreground">
										Cloudinary OCR Verification
									</h3>
									<p className="text-xs font-semibold text-muted-foreground leading-relaxed">
										Students upload their ID cards during registration. Google
										Cloud OCR extracts the printed text and auto-matches it
										against the submitted name and matric number.
									</p>
								</div>
								<div className="bg-background border border-border rounded-2xl p-6 flex flex-col gap-3 flex-1">
									<div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
										<BarChart3 className="w-5 h-5" />
									</div>
									<h3 className="text-base font-extrabold text-foreground">
										Visual Case Timelines
									</h3>
									<p className="text-xs font-semibold text-muted-foreground leading-relaxed">
										Every report has a transparent audit trail - students can
										see every officer review, investigation note, and status
										change on an interactive timeline.
									</p>
								</div>
							</div>

							{/* Bottom row */}
							<div className="md:col-span-4 bg-background border border-border rounded-2xl p-6 flex flex-col gap-3">
								<div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
									<Shield className="w-5 h-5" />
								</div>
								<h3 className="text-base font-extrabold text-foreground">
									Role-Based Access
								</h3>
								<p className="text-xs font-semibold text-muted-foreground leading-relaxed">
									Each user sees only what they need to see. Students track
									their cases, while officers see dashboards tailored to their
									specific responsibilities.
								</p>
							</div>
							<div className="md:col-span-4 bg-background border border-border rounded-2xl p-6 flex flex-col gap-3">
								<div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
									<Zap className="w-5 h-5" />
								</div>
								<h3 className="text-base font-extrabold text-foreground">
									Instant Email Alerts
								</h3>
								<p className="text-xs font-semibold text-muted-foreground leading-relaxed">
									When a report is filed, the relevant authorities receive
									immediate email notifications via Brevo SMTP - no delays, no
									lost messages.
								</p>
							</div>
							<div className="md:col-span-4 bg-background border border-border rounded-2xl p-6 flex flex-col gap-3">
								<div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
									<Building2 className="w-5 h-5" />
								</div>
								<h3 className="text-base font-extrabold text-foreground">
									Centralized Records
								</h3>
								<p className="text-xs font-semibold text-muted-foreground leading-relaxed">
									All reports, updates, and investigation logs are stored in a
									secure PostgreSQL database - replacing scattered paper files
									and disorganized logbooks.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* ─────────────────── EMERGENCY BANNER ─────────────────── */}
				<section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
					<div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
						<Image
							src="/hallmark_university.jpg"
							alt="Hallmark University campus environment"
							fill
							sizes="(min-width: 768px) 1184px, 100vw"
							className="object-cover opacity-45"
						/>
						<div className="absolute inset-0 bg-primary/68 pointer-events-none"></div>
						<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,var(--color-accent)_0%,transparent_50%)] opacity-10 pointer-events-none"></div>

						<div className="flex flex-col gap-3 relative z-10 max-w-lg">
							<div className="flex items-center gap-2">
								<ShieldAlert className="w-5 h-5 text-accent animate-pulse" />
								<span className="text-[11px] font-black uppercase tracking-[0.15em] text-accent">
									Emergency Dispatch
								</span>
							</div>
							<h3 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
								Are you facing an active, in-progress threat on campus?
							</h3>
							<p className="text-zinc-400 text-sm font-semibold leading-relaxed">
								Use Beacon for formal incident records, and contact Hallmark
								University through its official channels when a matter needs
								immediate institutional attention.
							</p>
						</div>

						<a
							href={`mailto:${HALLMARK_EMAIL}`}
							className="w-full md:w-auto min-w-0 px-5 sm:px-8 py-4 rounded-full bg-accent text-accent-foreground font-extrabold text-sm md:text-base hover:opacity-90 flex items-center justify-center gap-3 transition-all shrink-0 relative z-10"
						>
							<Mail className="w-5 h-5" />
							<span className="truncate">{HALLMARK_EMAIL}</span>
						</a>
					</div>
				</section>

				{/* ─────────────────── FINAL CTA ─────────────────── */}
				<section className="border-t border-border bg-card">
					<div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
						<div className="text-center max-w-2xl mx-auto flex flex-col gap-6 items-center">
							<h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-[1.08]">
								Ready to make your campus safer?
							</h2>
							<p className="text-sm font-semibold text-muted-foreground leading-relaxed">
								Join the Beacon safety network. Create your student account in
								under two minutes and start reporting incidents securely.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 mt-2">
								<Link
									href={APP_ROUTES.REGISTER}
									className="px-8 py-4 rounded-full text-[15px] font-bold bg-primary text-primary-foreground hover:opacity-95 flex items-center justify-center gap-2.5 group transition-all"
								>
									Create Your Account
									<ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-0.5 transition-transform" />
								</Link>
								<Link
									href={APP_ROUTES.LOGIN}
									className="px-8 py-4 rounded-full text-[15px] font-bold border border-border bg-background hover:bg-muted flex items-center justify-center gap-2 transition-all"
								>
									Sign In
									<ArrowUpRight className="w-4 h-4 text-muted-foreground" />
								</Link>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* ─────────────────── FOOTER ─────────────────── */}
			<footer className="border-t border-border bg-background">
				<div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-muted-foreground">
					<div className="flex items-center gap-2">
						<Image
							src="/hallmark-logo.png"
							alt="Hallmark University logo"
							width={64}
							height={18}
							className="h-auto w-14"
						/>
						<span>
							&copy; {new Date().getFullYear()} Beacon Safety Portal for
							Hallmark University.
						</span>
					</div>
					<div className="flex items-center gap-6">
						<span className="hidden lg:inline text-muted-foreground/80">
							{HALLMARK_ADDRESS}
						</span>
						<a href="#" className="hover:text-foreground transition-colors">
							Privacy Policy
						</a>
						<a href="#" className="hover:text-foreground transition-colors">
							Security Standards
						</a>
						<a href="#" className="hover:text-foreground transition-colors">
							Contact
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
