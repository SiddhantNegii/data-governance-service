import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  ShieldCheck, 
  FileText, 
  Zap, 
  Settings,
  ShieldAlert
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'clients', label: 'Clients', icon: Users, path: '/clients' },
  { id: 'products', label: 'Products', icon: Box, path: '/products' },
  { id: 'policies', label: 'Retention Policies', icon: ShieldCheck, path: '/policies' },
  { id: 'logs', label: 'Purge Logs', icon: FileText, path: '/logs' },
  { id: 'manual', label: 'Manual Purge', icon: Zap, path: '/manual' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export const COLORS = {
  primary: '#137fec',
  success: '#10b981',
  error: '#f43f5e',
  warning: '#f59e0b',
  info: '#3b82f6',
  background: '#f6f7f8',
  card: '#ffffff',
  text: '#0f172a',
  muted: '#64748b',
};