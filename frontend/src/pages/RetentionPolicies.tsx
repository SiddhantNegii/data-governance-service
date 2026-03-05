import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { RetentionPolicy } from '../types';
import { Plus, Filter, Download, Edit2, ChevronLeft, ChevronRight } from 'lucide-react';

export const RetentionPolicies = () => {
  const [policies, setPolicies] = useState<RetentionPolicy[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getRetentionPolicies().then((data) => {
      setPolicies(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Data Retention Policies</h1>
          <p className="text-slate-500 mt-1">Automated lifecycle rules for enterprise data management across all clients.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" /> Add Policy
        </Button>
      </div>

      {/* Filters & Controls */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select className="bg-slate-50 border-slate-200 rounded-lg text-sm px-4 py-2 focus:ring-[#137fec] focus:border-[#137fec]">
              <option>All Clients</option>
              <option>Astra Corp</option>
              <option>Nexus Global</option>
              <option>Velvet Systems</option>
            </select>
            <select className="bg-slate-50 border-slate-200 rounded-lg text-sm px-4 py-2 focus:ring-[#137fec] focus:border-[#137fec]">
              <option>All Products</option>
              <option>Core Ledger</option>
              <option>User Analytics</option>
              <option>Archive Vault</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Filter size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400">
              <Download size={20} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Policies Table */}
      <Card className="p-0">
        <Table<RetentionPolicy>
          isLoading={isLoading}
          columns={[
            { header: 'Policy ID', accessor: 'id', className: 'font-bold text-[#137fec]' },
            { header: 'Client ID', accessor: 'clientId', className: 'font-medium' },
            { header: 'Product ID', accessor: 'productId', className: 'text-slate-500' },
            { 
              header: 'Retention Period', 
              accessor: (item) => {
                const isNever = item.retentionPeriod === 'Never Purge';
                const isLong = item.retentionPeriod.includes('Years');
                return (
                  <Badge variant={isNever ? 'neutral' : isLong ? 'success' : 'warning'}>
                    {item.retentionPeriod}
                  </Badge>
                );
              }
            },
            { header: 'Last Updated', accessor: 'lastUpdated', className: 'text-slate-500' },
            { 
              header: 'Actions', 
              className: 'text-right',
              accessor: () => (
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#137fec]">
                  <Edit2 size={16} />
                </Button>
              ) 
            },
          ]}
          data={policies}
        />
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing {policies.length} of 128 policies</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            <Button variant="primary" size="sm">
              Next <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Add Policy Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Add New Policy"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Create Policy</Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client</label>
              <select className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-[#137fec]">
                <option>Select Client...</option>
                <option>Astra Corp</option>
                <option>Nexus Global</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product</label>
              <select className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-[#137fec]">
                <option>Select Product...</option>
                <option>Core Ledger</option>
                <option>Archive Vault</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Retention Period</label>
              <input type="text" className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-[#137fec]" placeholder="e.g. 30 days" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Policy Type</label>
              <select className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-[#137fec]">
                <option>Standard Purge</option>
                <option>Legal Hold</option>
                <option>Archival Only</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Notes</label>
            <textarea className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-[#137fec]" placeholder="Additional policy details..." rows={3}></textarea>
          </div>
        </div>
      </Modal>
    </div>
  );
};
