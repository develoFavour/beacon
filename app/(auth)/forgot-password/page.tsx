'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import { APP_ROUTES } from '@/lib/constants/routes.const';
import { AuthService } from '@/lib/services/auth.service';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      await AuthService.forgotPassword({ email });
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (error: any) {
      setIsLoading(false);
      setErrorMessage(error?.message || 'Unable to request a reset link. Please try again.');
    }
  };

  return (
    <div className="max-w-md w-full flex flex-col gap-6 relative overflow-hidden font-sans">
      
      {/* Back Button */}
      <div className="flex justify-between items-center">
        <Link 
          href={APP_ROUTES.LOGIN} 
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Sign-in
        </Link>
      </div>

      {!isSubmitted ? (
        <>
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Recover Password
            </h1>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              Enter your registered campus email address. We will email you a secure link to reset your security credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errorMessage && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold p-3.5 rounded-xl">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Campus Email Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                </span>
                <input 
                  type="email"
                  required
                  placeholder="student@campus.edu or admin@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-card border border-border text-foreground py-3.5 pl-11 pr-4 rounded-xl text-sm font-semibold placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed">
                Note: Email dispatches are routed through Brevo's transactional email API for password recovery delivery.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-full text-sm hover:opacity-95 shadow-sm transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Requesting Link...' : 'Email Reset Link'}
              <ArrowRight className="w-4 h-4 text-accent" />
            </button>
          </form>
        </>
      ) : (
        /* Submission Outcome Screen */
        <div className="flex flex-col items-center gap-5 text-center py-4">
          <div className="h-14 w-14 rounded-full bg-accent/20 text-accent flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-foreground" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-black tracking-tight text-foreground">
              Recovery Link Dispatched
            </h2>
            <p className="text-xs font-semibold text-muted-foreground leading-relaxed">
              If the email <strong className="text-foreground">{email}</strong> matches an account, a password recovery message is on its way.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-4 text-[11px] font-semibold text-muted-foreground leading-relaxed text-left w-full">
            <strong>Didn't get the email?</strong> Check your junk/spam folder or try resubmitting after waiting 2 minutes.
          </div>

          <Link href={APP_ROUTES.LOGIN} className="text-xs font-bold text-primary hover:underline">
            Return to sign-in
          </Link>
        </div>
      )}

    </div>
  );
}
