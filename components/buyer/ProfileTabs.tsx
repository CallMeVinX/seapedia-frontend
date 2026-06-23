import React from 'react';
import { User, MapPin, Wallet } from 'lucide-react';

type ProfileTab = 'personal' | 'address' | 'wallet';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

const TABS: { key: ProfileTab; label: string; icon: React.ElementType }[] = [
  { key: 'personal', label: 'Informasi Personal', icon: User },
  { key: 'address',  label: 'Manajemen Alamat',   icon: MapPin },
  { key: 'wallet',   label: 'Dompet',             icon: Wallet },
];

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              isActive
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
