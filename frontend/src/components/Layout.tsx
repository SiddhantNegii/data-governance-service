import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout = ({ children, activeTab, setActiveTab }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-[#f6f7f8] overflow-hidden">

      {/* Sidebar */}

      <aside className="w-64 bg-[#101922] text-white flex flex-col shrink-0">

        <div className="p-6 flex items-center gap-3">

          <div className="bg-[#137fec] p-2 rounded-lg">
            <ShieldCheck size={24} />
          </div>

          <div>
            <h1 className="font-bold text-lg tracking-tight">Tartan Data</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              Governance Service
            </p>
          </div>

        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">

          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Main Menu
          </p>

          {NAV_ITEMS.map((item) => (

            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium',
                activeTab === item.id
                  ? 'bg-[#137fec] text-white shadow-lg shadow-[#137fec]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >

              <item.icon size={18} />

              {item.label}

            </button>

          ))}

        </nav>

      </aside>

      {/* Main */}

      <div className="flex-1 flex flex-col overflow-hidden">

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-end px-8">

          <button className="px-4 py-2 bg-[#137fec] text-white rounded-lg text-sm font-bold">
            Tartan Admin
          </button>

        </header>

        <main className="flex-1 overflow-y-auto p-8">

          <div className="max-w-7xl mx-auto">

            {children}

          </div>

        </main>

      </div>

    </div>
  );
};