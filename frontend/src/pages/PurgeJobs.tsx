import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { PurgeJob } from '../types';
import { 
  Download, 
  Play, 
  History, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ChevronRight,
  Terminal,
  Clock,
  Copy,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PurgeJobs = () => {
  const [jobs, setJobs] = useState<PurgeJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<PurgeJob | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getPurgeJobs().then((data) => {
      setJobs(data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 text-4xl font-black leading-tight tracking-tight">Purge Jobs Monitor</h1>
          <p className="text-slate-500 text-base font-normal">Manage and monitor data retention execution across all enterprise clients.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={18} className="mr-2" /> Export Logs
          </Button>
          <Button>
            <Play size={18} className="mr-2" /> Manual Trigger
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Jobs (24h)', value: '142', icon: History, color: 'blue' },
          { label: 'Success Rate', value: '98.2%', icon: CheckCircle2, color: 'emerald' },
          { label: 'Active Runs', value: '3', icon: Loader2, color: 'blue', animate: true },
          { label: 'Rows Deleted', value: '4.2M', icon: History, color: 'slate' },
        ].map((stat, idx) => (
          <Card key={idx} className={cn("p-6", stat.animate && "border-l-4 border-l-[#137fec]")}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <stat.icon className={cn(
                "size-5",
                stat.color === 'blue' ? "text-[#137fec]" :
                stat.color === 'emerald' ? "text-emerald-500" :
                "text-slate-400",
                stat.animate && "animate-spin"
              )} />
            </div>
            <p className="text-slate-900 text-3xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Jobs Table */}
      <Card className="p-0">
        <div className="p-4 border-b border-slate-100 flex gap-2">
          <Button variant="primary" size="sm">All Statuses</Button>
          <Button variant="ghost" size="sm" className="text-slate-600">
            <div className="size-2 rounded-full bg-emerald-500 mr-2" /> Success
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600">
            <div className="size-2 rounded-full bg-rose-500 mr-2" /> Failed
          </Button>
          <Button variant="ghost" size="sm" className="text-slate-600">
            <div className="size-2 rounded-full bg-[#137fec] mr-2 animate-pulse" /> Running
          </Button>
        </div>
        <Table<PurgeJob>
          isLoading={isLoading}
          onRowClick={setSelectedJob}
          columns={[
            { header: 'Job ID', accessor: 'id', className: 'font-mono text-[#137fec] font-medium' },
            { header: 'Client', accessor: 'client', className: 'font-bold' },
            { header: 'Product', accessor: 'product', className: 'text-slate-500' },
            { 
              header: 'Trigger', 
              accessor: (item) => (
                <Badge variant={item.triggerType === 'Manual' ? 'neutral' : 'info'}>
                  {item.triggerType}
                </Badge>
              ) 
            },
            { header: 'Rows Deleted', accessor: (item) => item.rowsDeleted.toLocaleString(), className: 'text-right font-bold' },
            { header: 'Execution Time', accessor: 'executionTime', className: 'text-slate-500' },
            { header: 'Duration', accessor: 'duration', className: 'text-slate-500' },
            { 
              header: 'Status', 
              accessor: (item) => (
                <Badge variant={item.status === 'Success' ? 'success' : item.status === 'Running' ? 'info' : 'error'}>
                  <div className={cn("size-1.5 rounded-full mr-2", 
                    item.status === 'Success' ? "bg-emerald-500" : 
                    item.status === 'Running' ? "bg-[#137fec] animate-pulse" : 
                    "bg-rose-500"
                  )} />
                  {item.status}
                </Badge>
              ) 
            },
            { 
              header: '', 
              accessor: () => <ChevronRight size={18} className="text-slate-300" />,
              className: 'text-right'
            }
          ]}
          data={jobs}
        />
      </Card>

      {/* Details Panel Overlay */}
      <AnimatePresence>
        {selectedJob && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[480px] bg-white shadow-2xl border-l border-slate-200 z-[70] flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={selectedJob.status === 'Success' ? 'success' : 'info'}>
                      {selectedJob.status}
                    </Badge>
                    <h2 className="text-xl font-bold text-slate-900">Job {selectedJob.id}</h2>
                  </div>
                  <p className="text-sm text-slate-500">{selectedJob.client} • {selectedJob.product}</p>
                </div>
                <button 
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Records Scanned</p>
                    <p className="text-2xl font-bold text-slate-900">12,450,912</p>
                  </div>
                  <div className="p-4 rounded-xl bg-[#137fec]/5 border border-[#137fec]/10">
                    <p className="text-[10px] font-bold text-[#137fec] uppercase tracking-widest mb-1">Records Deleted</p>
                    <p className="text-2xl font-bold text-[#137fec]">{selectedJob.rowsDeleted.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" /> Execution Timeline
                  </h3>
                  <div className="space-y-3 pl-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Start Time</span>
                      <span className="font-medium">{selectedJob.executionTime}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">End Time</span>
                      <span className="font-medium">Oct 24, 12:12:45.892 UTC</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Total Duration</span>
                      <span className="font-medium text-emerald-600">{selectedJob.duration || '12 minutes 45 seconds'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Terminal size={16} className="text-slate-400" /> Execution Logs
                    </h3>
                    <button className="text-xs text-[#137fec] font-bold hover:underline flex items-center gap-1">
                      <Copy size={12} /> Copy All
                    </button>
                  </div>
                  <div className="bg-slate-900 rounded-lg p-4 font-mono text-[10px] text-slate-300 h-64 overflow-y-auto space-y-1">
                    {selectedJob.logs?.map((log, i) => (
                      <p key={i}><span className="text-slate-500">[12:00:0{i}]</span> <span className="text-emerald-400">INFO:</span> {log}</p>
                    )) || (
                      <p className="text-slate-500 italic">No logs available for this job.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex gap-3">
                <Button className="flex-1">Download Report</Button>
                <Button variant="outline" className="flex-1">Rerun Job</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

import { cn } from '../lib/utils';
