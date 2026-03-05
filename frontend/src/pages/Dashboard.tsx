import React, { useEffect, useState } from 'react';
import { Card, Badge } from '../components/UI';
import { Table } from '../components/Table';
import { api } from '../services/api';
import { DashboardStats, PurgeLog } from '../types';
import { 
  Users, 
  Box, 
  ShieldCheck, 
  History, 
  TrendingUp, 
  TrendingDown,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const timelineData = [
  { name: 'MON', value: 1.2 },
  { name: 'TUE', value: 1.8 },
  { name: 'WED', value: 1.5 },
  { name: 'THU', value: 2.1 },
  { name: 'FRI', value: 1.4 },
  { name: 'SAT', value: 2.4 },
  { name: 'SUN', value: 1.9 },
];

const productData = [
  { name: 'CORE', value: 850, color: '#137fec' },
  { name: 'CRM', value: 420, color: '#3b82f6' },
  { name: 'LOGS', value: 280, color: '#60a5fa' },
  { name: 'ANLYT', value: 610, color: '#93c5fd' },
];

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<PurgeLog[]>([]);

  useEffect(() => {
    api.getStats().then(setStats);
    api.getPurgeLogs().then(setRecentActivity);
  }, []);

  if (!stats) return null;

  const statCards = [
    { label: 'Total Clients', value: stats.totalClients, growth: stats.clientGrowth, icon: Users, color: 'blue' },
    { label: 'Total Products', value: stats.totalProducts, growth: stats.productGrowth, icon: Box, color: 'orange' },
    { label: 'Active Policies', value: stats.activePolicies, growth: stats.policyGrowth, icon: ShieldCheck, color: 'indigo' },
    { label: 'Purge Jobs Today', value: stats.purgeJobsToday, growth: stats.jobGrowth, icon: History, color: 'purple' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="p-0">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                <div className={cn(
                  "p-2 rounded-lg",
                  stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                  stat.color === 'orange' ? "bg-orange-50 text-orange-600" :
                  stat.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
                  "bg-purple-50 text-purple-600"
                )}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <h4 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value.toLocaleString()}</h4>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                  stat.growth.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                )}>
                  {stat.growth.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.growth}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">vs last month</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="Purge Activity Timeline" 
          subtitle="Total rows deleted per day"
          headerAction={<div className="text-2xl font-black text-[#137fec]">2.4M <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full ml-2">+12%</span></div>}
        >
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#137fec" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#137fec" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#137fec" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card 
          title="Data Deleted by Product" 
          subtitle="Storage reclaimed this period"
          headerAction={<div className="text-2xl font-black text-slate-900">850 GB <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-full ml-2">+5%</span></div>}
        >
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card 
        title="Recent Purge Activity" 
        headerAction={
          <button className="text-sm font-bold text-[#137fec] flex items-center gap-1 hover:underline">
            View all activity <ArrowRight size={16} />
          </button>
        }
      >
        <Table<PurgeLog>
          columns={[
            { header: 'Timestamp', accessor: 'timestamp', className: 'font-mono text-xs' },
            { header: 'Client', accessor: 'client', className: 'font-bold' },
            { header: 'Product', accessor: 'product', className: 'text-slate-500' },
            { 
              header: 'Action Type', 
              accessor: (item) => (
                <Badge variant={item.actionType === 'Manual' ? 'warning' : 'info'}>
                  {item.actionType}
                </Badge>
              ) 
            },
            { header: 'Rows Deleted', accessor: (item) => item.rowsDeleted.toLocaleString(), className: 'font-bold' },
            { 
              header: 'Status', 
              accessor: (item) => (
                <div className="flex items-center gap-2">
                  <div className={cn("size-1.5 rounded-full", item.status === 'Success' ? "bg-emerald-500" : "bg-rose-500")} />
                  <span className={cn("font-bold", item.status === 'Success' ? "text-emerald-600" : "text-rose-600")}>
                    {item.status}
                  </span>
                </div>
              ) 
            },
          ]}
          data={recentActivity}
        />
      </Card>
    </div>
  );
};

import { cn } from '../lib/utils';
