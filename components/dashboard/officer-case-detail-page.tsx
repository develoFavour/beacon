"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
	ArrowLeft,
	Building,
	Calendar,
	CheckCircle2,
	ClipboardCheck,
	Hammer,
	MapPin,
	Shield,
	ShieldAlert,
	UserPlus,
} from "lucide-react";
import { Topbar } from "@/components/dashboard/topbar";
import { ReportDetailSkeleton } from "@/components/dashboard/dashboard-skeletons";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { CaseTimeline } from "@/components/dashboard/case-timeline";
import { EmptyState } from "@/components/dashboard/empty-state";
import { EvidencePreview, reportEvidenceItems } from "@/components/dashboard/evidence-preview";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ReportService } from "@/lib/services/report.service";
import type { OfficerRoleConfig } from "@/lib/constants/officer-role.const";
import { buildOfficerNewReportHref } from "@/lib/constants/officer-role.const";
import type {
	CaseUpdate,
	CrimeReport,
	ReportStatus,
	UserRole,
} from "@/lib/types";

const ROLE_LABELS: Partial<Record<UserRole, string>> = {
	cso: "CSO",
	dean: "Dean",
	warden: "Warden",
};

const WARDEN_FOLLOW_UPS = [
	{
		title: "Room / Block Inspection",
		icon: Building,
		details:
			"Warden inspected the hostel location and documented the room/block condition, visible damage, and immediate safety concerns.",
	},
	{
		title: "Occupant Contact",
		icon: ClipboardCheck,
		details:
			"Warden contacted the involved occupants or roommates and recorded their residential account of the incident.",
	},
	{
		title: "Damage / Repair Follow-up",
		icon: Hammer,
		details:
			"Warden escalated hostel damage or facility repair needs for maintenance follow-up and residential safety tracking.",
	},
];

export function OfficerCaseDetailPage({
	caseId,
	config,
}: {
	caseId: string;
	config: OfficerRoleConfig;
}) {
	const [report, setReport] = useState<CrimeReport | null>(null);
	const [timeline, setTimeline] = useState<CaseUpdate[]>([]);
	const [updateText, setUpdateText] = useState("");
	const [statusNote, setStatusNote] = useState("");
	const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(
		"under-investigation",
	);
	const [selectedRole, setSelectedRole] = useState<UserRole>(
		config.addableRoles[0],
	);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const availableRoles = useMemo(() => {
		const involved = new Set(report?.involvedRoles ?? []);
		return config.addableRoles.filter((role) => !involved.has(role));
	}, [config.addableRoles, report?.involvedRoles]);
	const statusOptions = useMemo(
		() => getStatusOptions(report?.status),
		[report?.status],
	);

	useEffect(() => {
		let mounted = true;
		async function loadCase() {
			try {
				const [reportResponse, updatesResponse] = await Promise.all([
					ReportService.getReportDetails(caseId),
					ReportService.getCaseUpdates(caseId),
				]);
				if (!mounted) return;
				setReport(reportResponse.data ?? null);
				if (reportResponse.data?.status)
					setSelectedStatus(reportResponse.data.status);
				setTimeline(updatesResponse.data ?? []);
			} catch (error: any) {
				toast.error("Unable to load case", {
					description: error?.message || "Please try again.",
				});
			} finally {
				if (mounted) setIsLoading(false);
			}
		}
		loadCase();
		return () => {
			mounted = false;
		};
	}, [caseId]);

	const postUpdate = async (updateDetails: string, newStatus?: string) => {
		if (!report) return;
		setIsSubmitting(true);
		try {
			const response = await ReportService.addCaseUpdate(report.id, {
				updateDetails,
				newStatus,
			});
			if (response.data)
				setTimeline((prev) => [...prev, response.data as CaseUpdate]);
			const fresh = await ReportService.getReportDetails(report.id);
			setReport(fresh.data ?? report);
			setSelectedStatus(fresh.data?.status ?? selectedStatus);
			toast.success(response.message || "Case updated");
		} catch (error: any) {
			toast.error("Case update failed", {
				description: error?.message || "Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleActivateCase = () => {
		void postUpdate(
			`${config.label} opened this report as an active case.`,
			"under-investigation",
		);
	};

	const handleReopenCase = () => {
		void postUpdate(
			`${config.label} reopened this closed case for further review.`,
			"under-investigation",
		);
	};

	const handleAddFinding = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!updateText.trim()) return;
		await postUpdate(updateText.trim());
		setUpdateText("");
	};

	const handleWardenFollowUp = async (title: string, details: string) => {
		await postUpdate(`${title}: ${details}`);
	};

	const handleStatusChange = async (event: React.FormEvent) => {
		event.preventDefault();
		if (!report || selectedStatus === report.status || !statusNote.trim())
			return;
		await postUpdate(statusNote.trim(), selectedStatus);
		setStatusNote("");
	};

	const handleAddRole = async () => {
		if (!report) return;
		setIsSubmitting(true);
		try {
			const response = await ReportService.addCaseInvolvement(
				report.id,
				selectedRole,
			);
			const [freshReport, freshUpdates] = await Promise.all([
				ReportService.getReportDetails(report.id),
				ReportService.getCaseUpdates(report.id),
			]);
			setReport(freshReport.data ?? report);
			setTimeline(freshUpdates.data ?? timeline);
			toast.success(response.message || "Added to case");
		} catch (error: any) {
			toast.error("Could not add role", {
				description: error?.message || "Please try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return (
			<>
				<Topbar title={`Case ${caseId}`} subtitle="Loading case details." />
				<ReportDetailSkeleton />
			</>
		);
	}

	if (!report) {
		return (
			<>
				<Topbar
					title="Case Not Found"
					subtitle="We could not load this case."
				/>
				<div className="p-6 md:p-8 max-w-3xl mx-auto w-full">
					<div className="bg-card border border-border rounded-2xl">
						<EmptyState
							title="Unable to load case"
							description="This case may not exist or you may not have access."
						/>
					</div>
				</div>
			</>
		);
	}

	const canAddFinding = report.status === "under-investigation";
	const canUseStatusPanel =
		report.status !== "pending" && report.status !== "closed";
	const canAddAuthority = !report.involvedRoles?.includes(config.role);
	const evidence = reportEvidenceItems(report);

	return (
		<>
			<Topbar
				title={`Manage Case ${report.id}`}
				subtitle="Review evidence, add findings, and involve other authorities."
			/>

			<div className="p-6 md:p-8 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
				<div className="flex-1 flex flex-col gap-6">
					<Link
						href={config.casesHref}
						className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground w-fit transition-colors group"
					>
						<ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
						Back to {config.casesTitle}
					</Link>

					<div className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xs">
						{report.status === "pending" && (
							<div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
								<div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-xs">
									<ShieldAlert className="w-4 h-4" />
									This case must be active before findings can be added.
								</div>
								<button
									onClick={handleActivateCase}
									disabled={isSubmitting}
									className="px-4 py-2 bg-primary text-primary-foreground font-extrabold rounded-lg text-[11px] hover:opacity-90 transition-opacity disabled:opacity-50"
								>
									Mark Active
								</button>
							</div>
						)}

						<div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground">
									<Shield className="w-4 h-4 text-accent" />
									Incident Type
								</div>
								<h2 className="text-2xl font-black tracking-tight text-foreground">
									{report.crimeType}
								</h2>
								<div className="text-xs font-bold text-muted-foreground">
									Reported by:{" "}
									<span className="text-foreground">
										{report.reporterName || "Unknown reporter"}
									</span>
								</div>
							</div>
							<StatusBadge status={report.status} size="md" />
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<InfoPill
								icon={MapPin}
								label="Location"
								value={report.location}
							/>
							<InfoPill
								icon={Calendar}
								label="Date / Time"
								value={`${report.dateOfIncident} at ${report.timeOfIncident}`}
							/>
						</div>

						<section className="flex flex-col gap-3">
							<h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
								Detailed Description
							</h3>
							<p className="text-sm font-semibold text-muted-foreground leading-relaxed whitespace-pre-wrap">
								{report.description}
							</p>
						</section>

						{evidence.length > 0 && (
							<section className="flex flex-col gap-3">
								<h3 className="text-sm font-extrabold text-foreground border-b border-border pb-2">
									Evidence
								</h3>
								<div className="flex flex-col gap-4">
									{evidence.map((item) => (
										<EvidencePreview key={item.id} evidence={item} />
									))}
								</div>
							</section>
						)}
					</div>
				</div>

				<aside className="w-full lg:w-[430px] flex flex-col gap-6">
					{canUseStatusPanel && (
						<div className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
							<h3 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
								<ShieldAlert className="w-4 h-4 text-accent" />
								Update Case Status
							</h3>
							<form
								onSubmit={handleStatusChange}
								className="flex flex-col gap-3"
							>
								<Select
									value={selectedStatus}
									onValueChange={(value) =>
										setSelectedStatus(value as ReportStatus)
									}
									disabled={isSubmitting}
								>
									<SelectTrigger className="w-full rounded-xl bg-background border-border text-xs font-bold">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((status) => (
											<SelectItem key={status.value} value={status.value}>
												{status.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<textarea
									required
									rows={3}
									placeholder="Add a note explaining this status change..."
									value={statusNote}
									disabled={isSubmitting || selectedStatus === report.status}
									onChange={(e) => setStatusNote(e.target.value)}
									className="w-full bg-background border border-border text-foreground py-3 px-4 rounded-xl text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors resize-none disabled:opacity-60"
								/>
								<button
									type="submit"
									disabled={
										isSubmitting ||
										selectedStatus === report.status ||
										!statusNote.trim()
									}
									className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:opacity-95 transition-opacity disabled:opacity-50"
								>
									Save Status Change
								</button>
							</form>
						</div>
					)}

					{report.status === "closed" && (
						<div className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
							<h3 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
								<ShieldAlert className="w-4 h-4 text-accent" />
								Closed Case
							</h3>
							<p className="text-xs font-semibold text-muted-foreground leading-relaxed">
								This case must be reopened before any further status changes or
								findings can be added.
							</p>
							<button
								onClick={handleReopenCase}
								disabled={isSubmitting}
								className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:opacity-95 transition-opacity disabled:opacity-50"
							>
								Reopen Case
							</button>
							<Link
								href={buildOfficerNewReportHref(config.role, report.id)}
								className="w-full py-2.5 bg-background border border-border text-foreground font-bold rounded-xl text-xs hover:bg-muted transition-colors text-center"
							>
								Write Formal Report
							</Link>
						</div>
					)}

					<div className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
						<h3 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
							<CheckCircle2 className="w-4 h-4 text-accent" />
							Add {config.label} Finding
						</h3>
						<form onSubmit={handleAddFinding} className="flex flex-col gap-3">
							<textarea
								required
								rows={3}
								placeholder={
									canAddFinding
										? "Enter case findings..."
										: "Mark the case active before adding findings."
								}
								value={updateText}
								disabled={!canAddFinding || isSubmitting}
								onChange={(e) => setUpdateText(e.target.value)}
								className="w-full bg-background border border-border text-foreground py-3 px-4 rounded-xl text-xs font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors resize-none disabled:opacity-60"
							/>
							<button
								type="submit"
								disabled={!canAddFinding || !updateText.trim() || isSubmitting}
								className="w-full py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:opacity-95 transition-opacity disabled:opacity-50"
							>
								Post Finding
							</button>
						</form>
					</div>

					{config.role === "warden" && (
						<div className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
							<h3 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
								<Building className="w-4 h-4 text-accent" />
								Residential Follow-up
							</h3>
							<div className="grid grid-cols-1 gap-2.5">
								{WARDEN_FOLLOW_UPS.map((item) => {
									const Icon = item.icon;
									return (
										<button
											key={item.title}
											type="button"
											onClick={() => handleWardenFollowUp(item.title, item.details)}
											disabled={!canAddFinding || isSubmitting}
											className="w-full rounded-xl border border-border bg-background p-3 text-left hover:bg-muted transition-colors disabled:opacity-50 disabled:hover:bg-background"
										>
											<span className="flex items-center gap-2 text-xs font-extrabold text-foreground">
												<Icon className="w-4 h-4 text-muted-foreground" />
												{item.title}
											</span>
										</button>
									);
								})}
							</div>
						</div>
					)}

					{canAddAuthority && (
						<div className="bg-card border border-border rounded-2xl p-5 shadow-2xs flex flex-col gap-4">
							<h3 className="text-sm font-extrabold tracking-tight text-foreground flex items-center gap-2">
								<UserPlus className="w-4 h-4 text-accent" />
								Add Authority
							</h3>
							<div className="flex gap-2">
								<Select
									value={selectedRole}
									onValueChange={(value) => setSelectedRole(value as UserRole)}
									disabled={availableRoles.length === 0 || isSubmitting}
								>
									<SelectTrigger className="flex-1 rounded-xl bg-background border-border text-xs font-bold">
										<SelectValue placeholder="Select authority" />
									</SelectTrigger>
									<SelectContent>
										{availableRoles.map((role) => (
											<SelectItem key={role} value={role}>
												{ROLE_LABELS[role] || role}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<button
									onClick={handleAddRole}
									disabled={availableRoles.length === 0 || isSubmitting}
									className="px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs disabled:opacity-50"
								>
									Add
								</button>
							</div>
						</div>
					)}

					<div className="flex flex-col gap-4">
						<h3 className="text-sm font-extrabold tracking-tight text-foreground bg-card border border-border rounded-2xl p-4 shadow-2xs">
							Case Timeline
						</h3>
						<div className="p-2">
							<CaseTimeline updates={timeline} />
						</div>
					</div>
				</aside>
			</div>
		</>
	);
}

function InfoPill({
	icon: Icon,
	label,
	value,
}: {
	icon: React.ComponentType<{ className?: string }>;
	label: string;
	value: string;
}) {
	return (
		<div className="flex items-center gap-3 p-4 rounded-2xl bg-background border border-border">
			<div className="h-10 w-10 rounded-full bg-accent/15 text-foreground flex items-center justify-center shrink-0">
				<Icon className="w-5 h-5" />
			</div>
			<div className="min-w-0">
				<p className="text-[10px] font-bold text-muted-foreground uppercase">
					{label}
				</p>
				<p className="text-sm font-extrabold text-foreground truncate">
					{value}
				</p>
			</div>
		</div>
	);
}

function getStatusOptions(
	current?: ReportStatus,
): Array<{ label: string; value: ReportStatus }> {
	if (current === "under-investigation") {
		return [
			{ label: "Under Investigation", value: "under-investigation" },
			{ label: "Resolved", value: "resolved" },
			{ label: "Closed", value: "closed" },
		];
	}
	if (current === "resolved") {
		return [
			{ label: "Resolved", value: "resolved" },
			{ label: "Under Investigation", value: "under-investigation" },
			{ label: "Closed", value: "closed" },
		];
	}
	return [];
}
