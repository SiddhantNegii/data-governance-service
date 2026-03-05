import React, { useEffect, useState } from 'react';
import { Card, Badge } from '../components/UI';
import { Table } from '../components/Table';
import { api } from '../services/api';
import { PurgeLog } from '../types';
import { Search, Filter, Download } from 'lucide-react';
import { cn } from '../lib/utils';

export const PurgeLogs = () => {
  const [logs, setLogs] = useState<PurgeLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getPurgeLogs().then((data) => {
      setLogs(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Purge Audit Logs</h1>
        <p className="text-slate-500 mt-1">Comprehensive audit trail of all data deletion operations across the system.</p>
      </div>

      <Card className="p-0">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search logs by client, product or action..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#137fec]/20"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-lg text-sm hover:bg-slate-100 transition-colors">
              <Filter size={16} /> Filters
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Download size={16} /> Export CSV
          </button>
        </div>

        <Table<PurgeLog>
          isLoading={isLoading}
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
                <Badge variant={item.status === 'Success' ? 'success' : 'error'}>
                  {item.status}
                </Badge>
              ) 
            },
            { header: 'Notes', accessor: 'notes', className: 'text-slate-500 text-xs max-w-xs truncate' },
          ]}
          data={logs}
        />
      </Card>
    </div>
  );
};
