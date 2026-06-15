import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import AuthCard from "@/components/auth/AuthCard";
import HeroPanel from "@/components/auth/HeroPanel";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex flex-1 items-center bg-seapedia-bg px-4 py-10 sm:px-6 lg:py-16">
        <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:items-stretch">
          <AuthCard>
            <LoginForm />
          </AuthCard>
          <HeroPanel />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
