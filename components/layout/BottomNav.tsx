'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Truck, History } from 'lucide-react';

const DRIVER_NAVIGATION = [
  { name: 'Cari Pekerjaan', href: '/driver/jobs', icon: Search },
  { name: 'Tugas Aktif', href: '/driver/tasks', icon: Truck },
  { name: 'Riwayat', href: '/driver/history', icon: History },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-slate-200">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto font-medium">
        {DRIVER_NAVIGATION.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-slate-50 group transition-colors"
            >
              <item.icon 
                className={`w-6 h-6 mb-1 ${isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-blue-600'}`} 
              />
              <span className={`text-xs ${isActive ? 'text-blue-600 font-semibold' : 'text-slate-500 group-hover:text-blue-600'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
