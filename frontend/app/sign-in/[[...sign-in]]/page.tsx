import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-dvh bg-[var(--background)] flex flex-col justify-center items-center p-4">
      <div className="mb-6 flex flex-col items-center text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] mb-4">
          <ArrowLeft className="size-3.5" />
          <span>Back to AAVYA Home</span>
        </Link>
        <div className="size-10 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-display font-bold text-lg mb-2 shadow-sm">
          A
        </div>
        <h1 className="text-2xl font-bold font-display text-[var(--foreground)]">
          Welcome to AAVYA
        </h1>
        <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-sm">
          Sign in to access your confidential assessment history, clinical reports, or physician consultation hub.
        </p>
      </div>

      <div className="clay-card-flat p-2 sm:p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-lg">
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
