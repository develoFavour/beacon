"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
	ArrowLeft,
	ArrowRight,
	CheckCircle2,
	Info,
	Lock,
	Mail,
	Phone,
	UploadCloud,
	User,
} from "lucide-react";
import { toast } from "sonner";
import { APP_ROUTES } from "@/lib/constants/routes.const";
import { AuthService } from "@/lib/services/auth.service";
import { UploadService } from "@/lib/services/upload.service";

export default function RegisterPage() {
	const [step, setStep] = useState(1);
	const [fullName, setFullName] = useState("");
	const [matricNumber, setMatricNumber] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [idCardFile, setIdCardFile] = useState<File | null>(null);
	const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
	const [registrationStatus, setRegistrationStatus] = useState<
		"active" | "pending_verification" | "rejected"
	>("pending_verification");
	const [registrationNotes, setRegistrationNotes] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			const message = "Student ID card file must not exceed 5MB.";
			setErrorMessage(message);
			toast.error("File too large", {
				description: message,
			});
			return;
		}

		setErrorMessage("");
		setIdCardFile(file);
		setIdCardPreview(URL.createObjectURL(file));
		toast.success("ID card selected", {
			description: `${file.name} is ready for upload.`,
		});
	};

	const handleNextStep = (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage("");

		if (!fullName || !matricNumber || !email || !phone || password.length < 8) {
			const message =
				"Please complete all fields. Password must be at least 8 characters.";
			setErrorMessage(message);
			toast.error("Check your registration details", {
				description: message,
			});
			return;
		}

		setStep(2);
		toast.info("Next step: upload your Student ID", {
			description:
				"Your matric number will be submitted with the uploaded ID card for admin review.",
		});
	};

	const handleRegisterSubmit = async () => {
		if (!idCardFile) {
			const message =
				"Please upload your physical Student ID card to continue registration.";
			setErrorMessage(message);
			toast.error("Student ID required", {
				description: message,
			});
			return;
		}

		setIsLoading(true);
		setErrorMessage("");
		const toastID = toast.loading("Uploading Student ID", {
			description: "Sending your file securely to our system.",
		});

		try {
			const uploadResponse = await UploadService.uploadIDCard(idCardFile);
			const idCardUrl = uploadResponse.data?.secureUrl;

			if (!idCardUrl) {
				throw new Error("Upload completed without returning a Cloudinary URL.");
			}

			toast.loading("Creating your account", {
				id: toastID,
				description:
					"Your registration details are being sent to our system for review.",
			});

			const registerResponse = await AuthService.register({
				fullName,
				matricNumber,
				email,
				phone,
				password,
				role: "student",
				idCardUrl,
				ocrText: uploadResponse.data?.ocrText || "",
			});

			setRegistrationStatus(
				registerResponse.data?.status || "pending_verification",
			);
			setRegistrationNotes(registerResponse.data?.registrationNotes || "");
			setStep(3);
			toast.success(registerResponse.message || "Registration submitted", {
				id: toastID,
				description:
					registerResponse.data?.status === "active"
						? "Account Verified. You can sign in now."
						: "Your account is pending administrative verification.",
			});
		} catch (error: any) {
			const message =
				error?.message || "Unable to complete registration. Please try again.";
			setErrorMessage(message);
			toast.error("Registration failed", {
				id: toastID,
				description: message,
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="max-w-md w-full flex flex-col gap-8 font-sans">
			{step === 1 && (
				<div className="flex flex-col gap-6">
					<div className="flex flex-col gap-2">
						<h1 className="text-3xl font-black tracking-tight text-foreground">
							Student Registration
						</h1>
						<p className="text-sm font-semibold text-muted-foreground">
							Fill in your official university credentials to start.
						</p>
					</div>

					<form onSubmit={handleNextStep} className="flex flex-col gap-4">
						{errorMessage && (
							<div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold p-3.5 rounded-xl">
								{errorMessage}
							</div>
						)}

						<FormInput
							label="Official Full Name"
							icon={User}
							type="text"
							placeholder="Enter name matching your ID card"
							value={fullName}
							onChange={setFullName}
						/>
						<FormInput
							label="Matriculation Number"
							icon={User}
							type="text"
							placeholder="e.g. U2018/3510091"
							value={matricNumber}
							onChange={setMatricNumber}
						/>
						<FormInput
							label="Campus Email Address"
							icon={Mail}
							type="email"
							placeholder="username@student.campus.edu"
							value={email}
							onChange={setEmail}
						/>
						<FormInput
							label="Phone Number"
							icon={Phone}
							type="tel"
							placeholder="e.g. +234 812 345 6789"
							value={phone}
							onChange={setPhone}
						/>
						<FormInput
							label="Create Password"
							icon={Lock}
							type="password"
							placeholder="Minimum 8 characters"
							value={password}
							onChange={setPassword}
						/>

						<button
							type="submit"
							className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full text-sm hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
						>
							Continue to ID Upload
							<ArrowRight className="w-4 h-4 text-accent" />
						</button>
					</form>

					<div className="text-center text-xs font-bold text-muted-foreground">
						Already registered?{" "}
						<Link
							href={APP_ROUTES.LOGIN}
							className="text-primary hover:underline transition-colors"
						>
							Sign in to your portal
						</Link>
					</div>
				</div>
			)}

			{step === 2 && (
				<div className="flex flex-col gap-6">
					<div className="flex items-center gap-3">
						<button
							onClick={() => setStep(1)}
							className="p-2 border border-border hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
						>
							<ArrowLeft className="w-4 h-4" />
						</button>
						<div>
							<h1 className="text-2xl font-black tracking-tight text-foreground">
								Upload Student ID
							</h1>
							<p className="text-xs font-semibold text-muted-foreground">
								Attach your physical school ID for admin verification.
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-5">
						<div className="bg-card border-2 border-dashed border-border hover:border-foreground rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center transition-colors relative cursor-pointer min-h-[220px]">
							<input
								type="file"
								accept="image/*,.pdf"
								onChange={handleFileChange}
								className="absolute inset-0 opacity-0 cursor-pointer"
							/>
							{idCardPreview && idCardFile?.type.startsWith("image/") ? (
								<div className="relative w-full h-[180px] rounded-xl overflow-hidden">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={idCardPreview}
										alt="Student ID Preview"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-black/40 flex items-center justify-center">
										<span className="px-4 py-2 bg-background border border-border rounded-full text-xs font-bold text-foreground">
											Change File
										</span>
									</div>
								</div>
							) : idCardFile ? (
								<div className="flex flex-col items-center gap-3">
									<div className="h-12 w-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
										<UploadCloud className="w-6 h-6 text-foreground" />
									</div>
									<div>
										<p className="text-sm font-bold text-foreground">
											{idCardFile.name}
										</p>
										<p className="text-[11px] font-semibold text-muted-foreground mt-1">
											Click to change selected file
										</p>
									</div>
								</div>
							) : (
								<>
									<div className="h-12 w-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
										<UploadCloud className="w-6 h-6 text-foreground" />
									</div>
									<div>
										<p className="text-sm font-bold text-foreground">
											Click to upload Student ID
										</p>
										<p className="text-[11px] font-semibold text-muted-foreground mt-1">
											PNG, JPG, WEBP, or PDF. Max 5MB.
										</p>
									</div>
								</>
							)}
						</div>

						<div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-3">
							<Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
							<p className="text-xs font-medium text-muted-foreground leading-relaxed">
								Your ID card is required for review.
							</p>
						</div>

						{errorMessage && (
							<div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold p-3.5 rounded-xl">
								{errorMessage}
							</div>
						)}

						<button
							onClick={handleRegisterSubmit}
							disabled={isLoading || !idCardFile}
							className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full text-sm hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
						>
							{isLoading
								? "Uploading ID & Creating Account..."
								: "Submit Registration"}
							<ArrowRight className="w-4 h-4 text-accent" />
						</button>
					</div>
				</div>
			)}

			{step === 3 && (
				<div className="bg-card border border-border rounded-3xl p-8 flex flex-col items-center gap-6 shadow-2xs text-center">
					<div className="h-16 w-16 rounded-full bg-accent/20 text-accent flex items-center justify-center">
						<CheckCircle2 className="w-10 h-10 text-foreground animate-bounce" />
					</div>

					<div className="flex flex-col gap-2">
						<h2 className="text-2xl font-black tracking-tight text-foreground">
							Registration Submitted
						</h2>
						<p className="text-sm font-semibold text-muted-foreground leading-relaxed">
							{registrationStatus === "active"
								? "Your Student ID card was uploaded and OCR matched your submitted name and matric number. Your account is active."
								: "Your account has been created and your Student ID card was attached successfully. An administrator will verify your account before login is enabled."}
						</p>
					</div>

					<div className="w-full bg-background border border-border rounded-2xl p-4 text-left flex flex-col gap-2.5 text-xs font-semibold">
						<div className="flex justify-between border-b border-border/60 pb-1.5">
							<span className="text-muted-foreground">Verification State:</span>
							<span
								className={
									registrationStatus === "active"
										? "text-emerald-600 font-bold uppercase tracking-wider"
										: "text-amber-600 font-bold uppercase tracking-wider"
								}
							>
								{registrationStatus === "active"
									? "AUTO_VERIFIED"
									: "PENDING_ADMIN"}
							</span>
						</div>
						<div className="flex justify-between border-b border-border/60 pb-1.5">
							<span className="text-muted-foreground">Registered Student:</span>
							<span className="text-foreground">{fullName}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-muted-foreground">Matric Number:</span>
							<span className="text-foreground">{matricNumber}</span>
						</div>
					</div>

					{registrationNotes && (
						<div className="w-full bg-card border border-border rounded-2xl p-4 text-left text-[11px] font-semibold text-muted-foreground leading-relaxed">
							{registrationNotes}
						</div>
					)}

					<Link
						href={APP_ROUTES.LOGIN}
						className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full text-sm hover:opacity-95 shadow-sm text-center cursor-pointer"
					>
						Return to Login
					</Link>
				</div>
			)}
		</div>
	);
}

function FormInput({
	label,
	icon: Icon,
	type,
	placeholder,
	value,
	onChange,
}: {
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	type: string;
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
				{label}
			</label>
			<div className="relative">
				<span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
					<Icon className="w-4 h-4" />
				</span>
				<input
					type={type}
					required
					placeholder={placeholder}
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-full bg-card border border-border text-foreground py-3.5 pl-11 pr-4 rounded-xl text-sm font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
				/>
			</div>
		</div>
	);
}
