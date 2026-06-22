import { ReactNode } from 'react';
import { TopNavbar } from './TopNavbar';
import { Footer } from '@/components/ui/Footer';

export const GuestBuyerLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <TopNavbar />
      <main className="flex-grow flex flex-col w-full bg-slate-50">
        {children}
      </main>
      <Footer />
    </>
  );
};
