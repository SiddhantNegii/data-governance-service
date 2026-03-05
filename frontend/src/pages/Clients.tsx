import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { Client } from '../types';
import { Plus, Search, Filter, Download, Info } from 'lucide-react';
import { cn } from '../lib/utils';

export const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getClients()
      .then((data) => setClients(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Client Directory</h1>
          <p className="text-slate-500 mt-1">Manage client data retention configurations and purge schedules.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download size={18} className="mr-2" /> Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={18} className="mr-2" /> Add Client
          </Button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Clients', value: '1,284', color: 'slate' },
          { label: 'Active Policies', value: '4,812', color: 'blue' },
          { label: 'Purged This Month', value: '12.4 TB', color: 'emerald' },
          { label: 'Failed Tasks', value: '3', color: 'rose' },
        ].map((stat, idx) => (
          <Card key={idx} className="p-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p
              className={cn(
                "text-2xl font-black mt-1",
                stat.color === 'blue'
                  ? "text-[#137fec]"
                  : stat.color === 'emerald'
                  ? "text-emerald-500"
                  : stat.color === 'rose'
                  ? "text-rose-500"
                  : "text-slate-900"
              )}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Search & Filters */}
      <Card className="p-0">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by name, ID or product..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#137fec]/20"
              />
            </div>
            <Button variant="outline" size="md">
              <Filter size={16} className="mr-2" /> Filters
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Sort by:</span>
            <select className="text-sm font-bold text-slate-700 bg-transparent border-none focus:ring-0 cursor-pointer">
              <option>Last Purge Date</option>
              <option>Client Name</option>
              <option>Retention Policies</option>
            </select>
          </div>
        </div>

        <Table<Client>
          isLoading={isLoading}
          columns={[
            {
              header: "Client Name",
              accessor: (item) => (
                <div>
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-slate-500">{item.client_id}</p>
                </div>
              )
            },
            {
              header: "Created",
              accessor: (item) => new Date(item.created_at).toLocaleDateString()
            },
          ]}
          data={clients}
        />
      </Card>

      {/* Help Banner */}
      <div className="bg-[#137fec]/5 rounded-2xl p-8 border border-[#137fec]/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="size-14 bg-[#137fec] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#137fec]/30">
            <Info size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-900">Need help with Governance Policies?</h4>
            <p className="text-slate-600 mt-1 max-w-xl">
              Our documentation provides comprehensive guides on setting up retention periods and purge schedules for your clients.
            </p>
          </div>
        </div>
        <Button variant="secondary" className="bg-white border border-slate-200 hover:shadow-md transition-all whitespace-nowrap px-8">
          View Documentation
        </Button>
      </div>

      {/* Add Client Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Client"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Create Client</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client Name</label>
            <input
              type="text"
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-[#137fec]"
              placeholder="e.g. Acme Corp"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client ID</label>
            <input
              type="text"
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-[#137fec]"
              placeholder="e.g. CLI-12345"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enabled Products</label>
            <div className="grid grid-cols-2 gap-2">
              {['Hypersync', 'Hyperverify', 'Hyperapps', 'FinData', 'Vault', 'Insight'].map(p => (
                <label key={p} className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input type="checkbox" className="rounded text-[#137fec] focus:ring-[#137fec]" />
                  <span className="text-sm font-medium">{p}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};