import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import AuthCard from "@/components/auth/AuthCard";
import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center bg-seapedia-bg px-4 py-10 sm:px-6">
        <AuthCard className="w-full max-w-md">
          <RegisterForm />
        </AuthCard>
      </main>

      <SiteFooter />
    </div>
  );
}
