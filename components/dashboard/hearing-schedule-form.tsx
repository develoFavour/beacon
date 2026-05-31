"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { APP_ROUTES } from "@/lib/constants/routes.const";
import { HearingService } from "@/lib/services/hearing.service";

const CHARGES = [
	"Academic Misconduct / Cheating",
	"Harassment / Cyberbullying",
	"Substance Abuse / Contraband",
	"Vandalism / Property Damage",
	"Other Misconduct Charge",
];

export function HearingScheduleForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		setIsSubmitting(true);
		const toastID = toast.loading("Scheduling hearing");

		try {
			const response = await HearingService.create({
				studentName: formData.get("studentName"),
				studentIdentifier: formData.get("studentIdentifier"),
				charge: formData.get("charge"),
				hearingDate: formData.get("hearingDate"),
				hearingTime: formData.get("hearingTime"),
				location: formData.get("location"),
				status: formData.get("status"),
				notes: formData.get("notes"),
			});
			toast.success(response.message || "Hearing scheduled", { id: toastID });
			router.push(APP_ROUTES.DEAN_HEARINGS);
			router.refresh();
		} catch (error: any) {
			toast.error("Could not schedule hearing", {
				id: toastID,
				description:
					error?.message || "Please check the hearing details and try again.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-card border border-border rounded-3xl p-5 shadow-2xs flex flex-col gap-4"
		>
			<div>
				<h2 className="text-sm font-extrabold text-foreground">
					Schedule Panel Meeting
				</h2>
				<p className="text-xs font-semibold text-muted-foreground mt-1">
					Create a new disciplinary hearing or panel meeting.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Field name="studentName" label="Student Name" placeholder="John Aku" />
				<Field
					name="studentIdentifier"
					label="Matric / Student ID"
					placeholder="e.g. HU20220064"
				/>
			</div>

			<label className="flex flex-col gap-1.5">
				<span className="text-[10px] font-bold text-muted-foreground uppercase">
					Charge
				</span>
				<select
					name="charge"
					className="bg-background border border-border text-foreground py-3 px-4 rounded-xl text-sm font-semibold"
				>
					{CHARGES.map((charge) => (
						<option key={charge} value={charge}>
							{charge}
						</option>
					))}
				</select>
			</label>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Field name="hearingDate" label="Date" type="date" />
				<Field name="hearingTime" label="Time" placeholder="10:00 AM" />
				<label className="flex flex-col gap-1.5">
					<span className="text-[10px] font-bold text-muted-foreground uppercase">
						Status
					</span>
					<select
						name="status"
						defaultValue="scheduled"
						className="bg-background border border-border text-foreground py-3 px-4 rounded-xl text-sm font-semibold"
					>
						<option value="scheduled">Scheduled</option>
						<option value="pending_evidence">Pending Evidence</option>
					</select>
				</label>
			</div>

			<Field
				name="location"
				label="Location"
				placeholder="e.g. Senate Hearing Room B"
			/>

			<label className="flex flex-col gap-1.5">
				<span className="text-[10px] font-bold text-muted-foreground uppercase">
					Notes
				</span>
				<textarea
					name="notes"
					rows={3}
					placeholder="Optional hearing context..."
					className="bg-background border border-border text-foreground py-3 px-4 rounded-xl text-sm font-semibold resize-none"
				/>
			</label>

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2"
			>
				<CalendarPlus className="w-4 h-4 text-accent" />
				{isSubmitting ? "Scheduling..." : "Schedule Hearing"}
			</button>
		</form>
	);
}

function Field({
	name,
	label,
	placeholder,
	type = "text",
}: {
	name: string;
	label: string;
	placeholder?: string;
	type?: string;
}) {
	return (
		<label className="flex flex-col gap-1.5">
			<span className="text-[10px] font-bold text-muted-foreground uppercase">
				{label}
			</span>
			<input
				name={name}
				type={type}
				required
				placeholder={placeholder}
				className="bg-background border border-border text-foreground py-3 px-4 rounded-xl text-sm font-semibold"
			/>
		</label>
	);
}
