import { Suspense } from "react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200"></div>}>
        <Navbar />
      </Suspense>
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </>
  );
}
