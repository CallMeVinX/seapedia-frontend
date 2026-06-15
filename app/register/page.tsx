import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex flex-col bg-white w-full min-h-screen relative">
      <div className="absolute top-6 left-6 z-10">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      <main className="flex flex-1 items-center justify-center bg-seapedia-bg px-4 py-10 sm:px-6">
        <AuthCard className="w-full max-w-md">
          <RegisterForm />
        </AuthCard>
      </main>
    </div>
  );
}
