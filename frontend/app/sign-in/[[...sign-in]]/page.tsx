import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-dvh bg-transparent flex flex-col justify-center items-center p-4">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] mb-4">
          <ArrowLeft className="size-3.5" />
          <span>Back to AAVYA Home</span>
        </Link>
        <span className="font-display font-bold text-3xl tracking-tight text-[var(--foreground)] mb-1">
          AAVYA
        </span>
        <h1 className="text-xl font-bold font-display text-[var(--foreground)]">
          Welcome Back
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm">
          Sign in to access your confidential assessment history, clinical reports, or physician consultation hub.
        </p>
      </div>

      <div className="clay-card p-3 sm:p-5 rounded-2xl border border-[rgba(255,235,226,0.6)]">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboard"
        />
      </div>

      <div className="mt-6 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
        <ShieldCheck className="size-3.5 text-[var(--leaf)]" />
        <span>End-to-End Encrypted Patient & Clinician Portal</span>
      </div>
    </div>
  );
}
