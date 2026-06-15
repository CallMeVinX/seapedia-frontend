import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import HeroPanel from "@/components/auth/HeroPanel";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col bg-white w-full min-h-screen relative">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      <main className="flex flex-1 items-center bg-seapedia-bg px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:items-stretch">
          <AuthCard>
            <LoginForm />
          </AuthCard>
          <HeroPanel />
        </div>
      </main>
    </div>
  );
}
