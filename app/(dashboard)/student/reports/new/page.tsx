"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Topbar } from "@/components/dashboard/topbar";
import {
	ShieldAlert,
	MapPin,
	AlignLeft,
	Calendar,
	Clock,
	Upload,
	ArrowRight,
	Info,
} from "lucide-react";
import { APP_ROUTES } from "@/lib/constants/routes.const";
import { ReportService } from "@/lib/services/report.service";
import { UploadService } from "@/lib/services/upload.service";

const CRIME_TYPES = [
	"Theft / Robbery",
	"Assault / Physical Altercation",
	"Vandalism / Property Damage",
	"Harassment / Cyberbullying",
	"Substance Abuse / Contraband",
	"Other / Uncategorized",
];
const EVIDENCE_MAX_SIZE = 25 * 1024 * 1024;

export default function NewReportPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
	const [formData, setFormData] = useState({
		crimeType: "",
		location: "",
		dateOfIncident: "",
		timeOfIncident: "",
		description: "",
		isHostelIncident: false,
		isAnonymous: false,
	});

	const handleEvidenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > EVIDENCE_MAX_SIZE) {
			toast.error("Evidence file is too large", {
				description: "Please upload a file that is 25MB or smaller.",
			});
			return;
		}

		setEvidenceFile(file);
		toast.success("Evidence selected", {
			description: `${file.name} will be attached to the report.`,
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			!formData.crimeType ||
			!formData.location ||
			!formData.dateOfIncident ||
			!formData.timeOfIncident ||
			!formData.description
		) {
			toast.error("Complete the report form", {
				description:
					"Incident type, location, date, time, and description are required.",
			});
			return;
		}

		setIsSubmitting(true);
		const toastID = toast.loading("Submitting report", {
			description: evidenceFile
				? "Uploading evidence before creating your case."
				: "Creating your case record.",
		});

		try {
			let evidenceUrl = "";
			const evidence = [];
			if (evidenceFile) {
				const uploadResponse = await UploadService.uploadFile(
					evidenceFile,
					"report-evidence",
				);
				const uploadedEvidence = uploadResponse.data;
				evidenceUrl = uploadedEvidence?.secureUrl || "";

				if (uploadedEvidence?.secureUrl) {
					evidence.push({
						fileUrl: uploadedEvidence.secureUrl,
						publicId: uploadedEvidence.publicId,
						resourceType: uploadedEvidence.resourceType,
						format: uploadedEvidence.format,
						bytes: uploadedEvidence.bytes,
					});
				}

				toast.loading("Creating report", {
					id: toastID,
					description: "Evidence uploaded. Saving your incident report now.",
				});
			}

			const response = await ReportService.createReport({
				...formData,
				evidenceUrl,
				evidence,
			});

			const reportID = response.data?.id;
			toast.success(response.message || "Report submitted successfully", {
				id: toastID,
				description: "Your report is now available in your case tracker.",
			});

			router.push(
				reportID
					? APP_ROUTES.STUDENT_REPORT_DETAIL(reportID)
					: APP_ROUTES.STUDENT_REPORTS,
			);
			router.refresh();
		} catch (error: any) {
			toast.error("Report submission failed", {
				id: toastID,
				description:
					error?.message || "Please check your details and try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Topbar
				title="File New Report"
				subtitle="Submit a formal incident report to campus authorities."
			/>

			<div className="p-6 md:p-8 max-w-3xl mx-auto w-full">
				<div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-2xs">
					<div className="bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 p-4 rounded-xl flex items-start gap-3 mb-8">
						<Info className="w-5 h-5 shrink-0 mt-0.5" />
						<p className="text-xs font-semibold leading-relaxed">
							Your report will be routed based on incident type and location.
							Residential welfare, room, occupancy, or hostel damage reports are
							visible to the Warden. Serious security or conduct incidents are
							routed to the relevant authority.
						</p>
					</div>

					<form onSubmit={handleSubmit} className="flex flex-col gap-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
									Incident Type
								</label>
								<div className="relative">
									<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
										<ShieldAlert className="w-4 h-4" />
									</span>
									<select
										required
										value={formData.crimeType}
										onChange={(e) =>
											setFormData({ ...formData, crimeType: e.target.value })
										}
										className="w-full bg-background border border-border text-foreground py-3 pl-10 pr-4 rounded-xl text-sm font-semibold appearance-none focus:outline-none focus:border-foreground transition-colors"
									>
										<option value="" disabled>
											Select category...
										</option>
										{CRIME_TYPES.map((type) => (
											<option key={type} value={type}>
												{type}
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
									Specific Location
								</label>
								<div className="relative">
									<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
										<MapPin className="w-4 h-4" />
									</span>
									<input
										type="text"
										required
										placeholder="e.g. Block A Hostel, Room 204"
										value={formData.location}
										onChange={(e) =>
											setFormData({ ...formData, location: e.target.value })
										}
										className="w-full bg-background border border-border text-foreground py-3 pl-10 pr-4 rounded-xl text-sm font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
									/>
								</div>
							</div>
						</div>
						<label className="flex items-center gap-3 bg-background border border-border rounded-xl p-4 cursor-pointer">
							<input
								type="checkbox"
								checked={formData.isHostelIncident}
								onChange={(e) =>
									setFormData({
										...formData,
										isHostelIncident: e.target.checked,
									})
								}
								className="h-4 w-4 accent-current"
							/>
							<span className="text-xs font-bold text-foreground">
								This incident happened in or around a hostel/residential hall
							</span>
						</label>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
									Date of Incident
								</label>
								<div className="relative">
									<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
										<Calendar className="w-4 h-4" />
									</span>
									<input
										type="date"
										required
										value={formData.dateOfIncident}
										onChange={(e) =>
											setFormData({
												...formData,
												dateOfIncident: e.target.value,
											})
										}
										className="w-full bg-background border border-border text-foreground py-3 pl-10 pr-4 rounded-xl text-sm font-semibold focus:outline-none focus:border-foreground transition-colors"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-1.5">
								<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
									Time (Approximate)
								</label>
								<div className="relative">
									<span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
										<Clock className="w-4 h-4" />
									</span>
									<input
										type="time"
										required
										value={formData.timeOfIncident}
										onChange={(e) =>
											setFormData({
												...formData,
												timeOfIncident: e.target.value,
											})
										}
										className="w-full bg-background border border-border text-foreground py-3 pl-10 pr-4 rounded-xl text-sm font-semibold focus:outline-none focus:border-foreground transition-colors"
									/>
								</div>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
								Detailed Description
							</label>
							<div className="relative">
								<span className="absolute left-3.5 top-3.5 text-muted-foreground">
									<AlignLeft className="w-4 h-4" />
								</span>
								<textarea
									required
									rows={5}
									placeholder="Describe exactly what happened. Include any identifiable details of persons involved if known."
									value={formData.description}
									onChange={(e) =>
										setFormData({ ...formData, description: e.target.value })
									}
									className="w-full bg-background border border-border text-foreground py-3 pl-10 pr-4 rounded-xl text-sm font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors resize-none"
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1.5">
							<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
								Evidence (Optional)
							</label>
							<div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-3 bg-background hover:bg-muted/50 transition-colors cursor-pointer group relative">
								<input
									type="file"
									accept="image/*,video/mp4,video/quicktime,video/webm,.pdf"
									onChange={handleEvidenceChange}
									className="absolute inset-0 opacity-0 cursor-pointer"
								/>
								<div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
									<Upload className="w-5 h-5" />
								</div>
								<div className="text-center">
									<p className="text-sm font-bold text-foreground">
										{evidenceFile
											? evidenceFile.name
											: "Click to upload evidence"}
									</p>
									<p className="text-[10px] font-semibold text-muted-foreground mt-0.5">
										Images, video, or PDF up to 25MB
									</p>
								</div>
							</div>
						</div>

						<label className="flex items-start gap-3 bg-background border border-border rounded-xl p-4 cursor-pointer">
							<input
								type="checkbox"
								checked={formData.isAnonymous}
								onChange={(e) =>
									setFormData({ ...formData, isAnonymous: e.target.checked })
								}
								className="mt-0.5 h-4 w-4 accent-current"
							/>
							<span className="flex flex-col gap-1">
								<span className="text-xs font-bold text-foreground">
									Submit this report anonymously
								</span>
								<span className="text-[11px] font-semibold text-muted-foreground">
									Your account is still linked internally, but CSO/Warden/Dean
									will see Anonymous Student.
								</span>
							</span>
						</label>

						<hr className="border-border my-2" />

						<div className="flex justify-end gap-3">
							<button
								type="button"
								onClick={() => router.back()}
								className="px-6 py-3 rounded-full text-xs font-bold text-muted-foreground hover:bg-muted transition-colors"
							>
								Cancel
							</button>
							<button
								type="submit"
								disabled={isSubmitting}
								className="px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full text-sm hover:opacity-95 shadow-sm transition-all flex items-center gap-2 disabled:opacity-70"
							>
								{isSubmitting
									? "Submitting Report..."
									: "Submit Official Report"}
								{!isSubmitting && (
									<ArrowRight className="w-4 h-4 text-accent" />
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
}
