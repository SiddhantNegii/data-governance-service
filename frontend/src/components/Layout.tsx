import React from 'react';
import { NAV_ITEMS } from '../constants';
import { ShieldCheck, Search, Bell, Menu } from 'lucide-react';
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
            <h1 className="font-bold text-lg leading-tight tracking-tight">Tartan Data</h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Governance Service</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Main Menu</p>
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

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl">
            <div className="size-10 rounded-full bg-[#137fec]/20 flex items-center justify-center border border-[#137fec]/30 overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/a/ACg8ocL_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X_X=s96-c" 
                alt="User" 
                className="size-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/admin/100/100';
                }}
              />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">Admin User</p>
              <p className="text-[10px] text-slate-500 truncate">Governance Lead</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-slate-100 border-none rounded-lg py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-[#137fec]/20 focus:bg-white transition-all"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Production Environment</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <button className="flex items-center gap-2 px-4 py-2 bg-[#137fec] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#137fec]/90 transition-all">
              Tartan Admin
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
