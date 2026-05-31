'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft, ArrowRight, CheckCircle2, Info } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import { AuthService } from '@/lib/services/auth.service';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password !== confirmPassword) {
      setErrorMessage('Please check that your passwords match.');
      return;
    }

    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
      setErrorMessage('This reset link is missing a token. Please request a new password reset email.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      await AuthService.resetPassword({ token, newPassword: password });
      setIsLoading(false);
      setIsSuccess(true);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error?.message || 'Unable to reset password. Please request a new reset link.');
    }
  };

  return (
    <div className="max-w-md w-full flex flex-col gap-6 font-sans">
      
      {/* Back Button */}
      <div className="flex justify-between items-center">
        <Link 
          href={APP_ROUTES.LOGIN} 
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Cancel Reset
        </Link>
      </div>

      {!isSuccess ? (
        <>
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Set New Password
            </h1>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              Choose a strong security password. Avoid reusing old passwords for maximum safety compliance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-card border border-border text-foreground py-3.5 pl-11 pr-4 rounded-xl text-sm font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Lock className="w-4 h-4" />
                </span>
                <input 
                  type="password"
                  required
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-card border border-border text-foreground py-3.5 pl-11 pr-4 rounded-xl text-sm font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full text-sm hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Resetting Password...' : 'Save New Password'}
              <ArrowRight className="w-4 h-4 text-accent" />
            </button>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center gap-5 text-center py-4">
          <div className="h-14 w-14 rounded-full bg-accent/20 text-accent flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-foreground" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Password Saved Successfully!
            </h2>
            <p className="text-xs font-semibold text-muted-foreground">
              Your new portal security password has been securely updated. You can now login.
            </p>
          </div>

          <Link
            href={APP_ROUTES.LOGIN}
            className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full text-sm hover:opacity-95 text-center flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            Sign Into Portal
            <ArrowRight className="w-4 h-4 text-accent" />
          </Link>
        </div>
      )}

    </div>
  );
}
