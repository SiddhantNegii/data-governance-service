import React, { useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { AlertTriangle, Zap, Lock, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const ManualPurge = () => {
  const [formData, setFormData] = useState({
    client: '',
    product: '',
    purgeType: 'expired',
    confirmText: '',
  });
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExecute = async () => {
    if (formData.confirmText !== 'CONFIRM') return;
    
    setIsSubmitting(true);
    try {
      await api.triggerManualPurge(formData);
      setIsConfirmModalOpen(false);
      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manual Data Purge Control</h1>
        <p className="text-slate-500 mt-2 leading-relaxed">
          Configure and execute manual data deletion tasks. This action is destructive and irreversible. 
          Please ensure all selections are verified before proceeding.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-4">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-amber-900">Safety Notice</h4>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            All manual purges are logged in the Global Audit Trail. Once initiated, a purge cannot be canceled or rolled back.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card title="Purge Configuration">
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Client Selection</label>
              <select 
                className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-[#137fec]/20"
                value={formData.client}
                onChange={(e) => setFormData({...formData, client: e.target.value})}
              >
                <option value="">Select Client...</option>
                <option value="acme">Acme Corporation</option>
                <option value="global">Global Industries</option>
                <option value="tartan">Tartan Logistics</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 block">Product Line</label>
              <select 
                className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-[#137fec]/20"
                value={formData.product}
                onChange={(e) => setFormData({...formData, product: e.target.value})}
              >
                <option value="">Select Product...</option>
                <option value="banking">Core Banking</option>
                <option value="vault">Identity Vault</option>
                <option value="payments">Legacy Payments</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 block">Purge Type</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, purgeType: 'expired'})}
                className={cn(
                  "relative flex items-start p-4 text-left rounded-xl border-2 transition-all",
                  formData.purgeType === 'expired' 
                    ? "border-[#137fec] bg-[#137fec]/5" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className={cn(
                  "size-4 rounded-full border-2 mt-1 shrink-0",
                  formData.purgeType === 'expired' ? "border-[#137fec] bg-[#137fec]" : "border-slate-300"
                )}>
                  {formData.purgeType === 'expired' && <div className="size-full rounded-full border-2 border-white" />}
                </div>
                <div className="ml-3">
                  <span className="block font-bold text-sm text-slate-900">Purge Expired Data</span>
                  <span className="block text-xs text-slate-500 mt-1">Deletes records that have exceeded the predefined retention policy period.</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({...formData, purgeType: 'full'})}
                className={cn(
                  "relative flex items-start p-4 text-left rounded-xl border-2 transition-all",
                  formData.purgeType === 'full' 
                    ? "border-[#137fec] bg-[#137fec]/5" 
                    : "border-slate-100 bg-white hover:border-slate-200"
                )}
              >
                <div className={cn(
                  "size-4 rounded-full border-2 mt-1 shrink-0",
                  formData.purgeType === 'full' ? "border-[#137fec] bg-[#137fec]" : "border-slate-300"
                )}>
                  {formData.purgeType === 'full' && <div className="size-full rounded-full border-2 border-white" />}
                </div>
                <div className="ml-3">
                  <span className="block font-bold text-sm text-slate-900">Purge Full Dataset</span>
                  <span className="block text-xs text-slate-500 mt-1">Force delete all records for the selected scope regardless of retention status.</span>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400">
              <Lock size={14} />
              <span className="text-xs font-medium">Requires MFA Authorization</span>
            </div>
            <div className="flex gap-3">
              <Button variant="ghost" type="button">Cancel</Button>
              <Button 
                type="button" 
                onClick={() => setIsConfirmModalOpen(true)}
                disabled={!formData.client || !formData.product}
              >
                <Zap size={18} className="mr-2" /> Execute Purge
              </Button>
            </div>
          </div>
        </form>
      </Card>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
            <Button 
              variant="danger" 
              onClick={handleExecute}
              isLoading={isSubmitting}
              disabled={formData.confirmText !== 'CONFIRM'}
            >
              Purge Data Now
            </Button>
          </>
        }
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Are you absolutely sure?</h3>
          <p className="text-slate-500 mt-2 text-sm">
            You are about to permanently purge records for <span className="font-bold text-slate-900">{formData.client}</span>. 
            This action cannot be undone and will be logged in the audit trail.
          </p>
          <div className="mt-6 bg-slate-50 p-4 rounded-xl text-left border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase tracking-widest">
              Please type "CONFIRM" to proceed
            </label>
            <input 
              type="text" 
              className="w-full bg-white border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-rose-500/20"
              placeholder="CONFIRM"
              value={formData.confirmText}
              onChange={(e) => setFormData({...formData, confirmText: e.target.value})}
            />
          </div>
        </div>
      </Modal>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Purge Initiated"
        footer={<Button onClick={() => setIsSuccessModalOpen(false)}>Close</Button>}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Job Successfully Triggered</h3>
          <p className="text-slate-500 mt-2 text-sm">
            The manual purge job has been queued for execution. You can monitor its progress in the Purge Jobs page.
          </p>
        </div>
      </Modal>
    </div>
  );
};
