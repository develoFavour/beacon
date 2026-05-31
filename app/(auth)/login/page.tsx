"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, Info, ArrowRight } from "lucide-react";
import {
	APP_ROUTES,
	ROLE_HOME_ROUTES,
	type RouteRole,
} from "@/lib/constants/routes.const";
import { AuthService } from "@/lib/services/auth.service";

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleLoginSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email || !password) {
			const message = "Please enter both your email address and password.";
			setErrorMessage(message);
			toast.error("Missing login details", { description: message });
			return;
		}

		setIsLoading(true);
		setErrorMessage("");
		const toastID = toast.loading("Verifying session");

		try {
			const response = await AuthService.login({ email, password });
			const role = response.data?.user.role as RouteRole | undefined;
			const nextPath = new URLSearchParams(window.location.search).get("next");

			setIsLoading(false);
			toast.success(response.message || "Signed in successfully", {
				id: toastID,
			});
			router.push(
				nextPath ||
					(role ? ROLE_HOME_ROUTES[role] : APP_ROUTES.STUDENT_DASHBOARD),
			);
			router.refresh();
		} catch (error: any) {
			setIsLoading(false);
			const message =
				error?.message ||
				"Unable to sign in. Please check your credentials and try again.";
			setErrorMessage(message);
			toast.error("Login failed", {
				id: toastID,
				description: message,
			});
		}
	};

	return (
		<div className="max-w-md w-full flex flex-col gap-8 font-sans">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-black tracking-tight text-foreground">
					Portal Sign-In
				</h1>
				<p className="text-sm font-semibold text-muted-foreground">
					Please enter your campus credentials to access the safety network.
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleLoginSubmit} className="flex flex-col gap-5">
				{errorMessage && (
					<div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2.5">
						<Info className="w-4 h-4 shrink-0 mt-0.5" />
						<span>{errorMessage}</span>
					</div>
				)}

				<div className="flex flex-col gap-1.5">
					<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
						Email Address
					</label>
					<div className="relative">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
							<Mail className="w-4 h-4" />
						</span>
						<input
							type="email"
							placeholder="e.g. student@campus.edu"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full bg-card border border-border text-foreground py-3.5 pl-11 pr-4 rounded-xl text-sm font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
						/>
					</div>
				</div>

				<div className="flex flex-col gap-1.5">
					<div className="flex justify-between items-center">
						<label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
							Password
						</label>
						<Link
							href={APP_ROUTES.FORGOT_PASSWORD}
							className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors hover:underline"
						>
							Forgot Password?
						</Link>
					</div>
					<div className="relative">
						<span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
							<Lock className="w-4 h-4" />
						</span>
						<input
							type={showPassword ? "text" : "password"}
							placeholder="Enter your security password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full bg-card border border-border text-foreground py-3.5 pl-11 pr-12 rounded-xl text-sm font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
						>
							{showPassword ? (
								<EyeOff className="w-4 h-4" />
							) : (
								<Eye className="w-4 h-4" />
							)}
						</button>
					</div>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full text-sm hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-70"
				>
					{isLoading ? "Verifying Session..." : "Sign Into Portal"}
					<ArrowRight className="w-4 h-4 text-accent" />
				</button>
			</form>

			{/* Footnotes */}
			<div className="text-center text-xs font-bold text-muted-foreground">
				New student?{" "}
				<Link
					href={APP_ROUTES.REGISTER}
					className="text-primary hover:underline transition-all"
				>
					Register account
				</Link>
			</div>
		</div>
	);
}
