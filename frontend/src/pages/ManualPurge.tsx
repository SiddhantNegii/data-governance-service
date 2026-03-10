import React, { useState } from 'react';
import { Card, Button } from '../components/UI';
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

      // Map frontend fields -> backend schema
      const payload = {
        client_id: formData.client,
        product_id: formData.product,
        trigger_type: "Manual"
      };

      await api.triggerManualPurge(payload);

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
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Manual Data Purge Control
        </h1>

        <p className="text-slate-500 mt-2 leading-relaxed">
          Configure and execute manual data deletion tasks. This action is destructive and irreversible.
          Please ensure all selections are verified before proceeding.
        </p>
        <div className="p-4 mt-4 bg-red-50 border border-red-200 rounded-xl flex gap-4">

        <div className="p-2 bg-red-100 rounded-lg text-red-600 shrink-0">
          <AlertTriangle size={24} />
        </div>

        <div>
          <h4 className="text-sm font-bold text-red-900">
            Manual Purge Disabled
          </h4>

          <p className="text-xs text-red-700 mt-1 leading-relaxed">
            Manual purge functionality is currently disabled. This page uses dummy values and does not trigger any real purge operations.
          </p>
        </div>

      </div>
      </div>

      {/* Safety Notice */}

      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-4">

        <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
          <AlertTriangle size={24} />
        </div>

        <div>
          <h4 className="text-sm font-bold text-amber-900">
            Safety Notice
          </h4>

          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            All manual purges are logged in the Global Audit Trail. Once initiated, a purge cannot be canceled or rolled back.
          </p>
        </div>

      </div>


      {/* Form */}

      <Card title="Purge Configuration">

        <form className="space-y-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2">

              <label className="text-sm font-bold text-slate-700 block">
                Client Selection
              </label>

              <select
                className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-[#137fec]/20"
                value={formData.client}
                onChange={(e) =>
                  setFormData({ ...formData, client: e.target.value })
                }
              >

                <option value="">Select Client...</option>

                <option value="CLI001">Acme Corporation</option>

                <option value="CLI002">Global Industries</option>

                <option value="CLI003">Tartan Logistics</option>

              </select>

            </div>


            <div className="space-y-2">

              <label className="text-sm font-bold text-slate-700 block">
                Product Line
              </label>

              <select
                className="w-full bg-slate-50 border-slate-200 rounded-lg text-sm px-4 py-2.5 focus:ring-2 focus:ring-[#137fec]/20"
                value={formData.product}
                onChange={(e) =>
                  setFormData({ ...formData, product: e.target.value })
                }
              >

                <option value="">Select Product...</option>

                <option value="PROD001">Core Banking</option>

                <option value="PROD002">Identity Vault</option>

                <option value="PROD003">Legacy Payments</option>

              </select>

            </div>

          </div>


          {/* Purge Type */}

          <div className="space-y-4">

            <label className="text-sm font-bold text-slate-700 block">
              Purge Type
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {['expired', 'full'].map((type) => (

                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, purgeType: type })
                  }
                  className={cn(
                    "relative flex items-start p-4 text-left rounded-xl border-2 transition-all",
                    formData.purgeType === type
                      ? "border-[#137fec] bg-[#137fec]/5"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  )}
                >

                  <div className="ml-3">

                    <span className="block font-bold text-sm text-slate-900">

                      {type === "expired"
                        ? "Purge Expired Data"
                        : "Purge Full Dataset"}

                    </span>

                    <span className="block text-xs text-slate-500 mt-1">

                      {type === "expired"
                        ? "Deletes records past retention period."
                        : "Force delete all records regardless of retention."}

                    </span>

                  </div>

                </button>

              ))}

            </div>

          </div>


          {/* Execute */}

          <div className="pt-8 border-t border-slate-100 flex items-center justify-between">

            <div className="flex items-center gap-2 text-slate-400">

              <Lock size={14} />

              <span className="text-xs font-medium">

                Requires MFA Authorization

              </span>

            </div>

            <Button
              type="button"
              onClick={() => setIsConfirmModalOpen(true)}
              disabled={!formData.client || !formData.product}
            >

              <Zap size={18} className="mr-2" />

              Execute Purge

            </Button>

          </div>

        </form>

      </Card>


      {/* Confirm Modal */}

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>
              Cancel
            </Button>

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

          <h3 className="text-xl font-bold text-slate-900">
            Are you absolutely sure?
          </h3>

          <p className="text-slate-500 mt-2 text-sm">
            Type <b>CONFIRM</b> to execute the purge job.
          </p>

          <input
            type="text"
            className="w-full mt-4 bg-white border-slate-200 rounded-lg text-sm px-3 py-2.5 focus:ring-2 focus:ring-rose-500/20"
            placeholder="CONFIRM"
            value={formData.confirmText}
            onChange={(e) =>
              setFormData({ ...formData, confirmText: e.target.value })
            }
          />

        </div>

      </Modal>


      {/* Success */}

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

          <h3 className="text-xl font-bold text-slate-900">
            Job Successfully Triggered
          </h3>

          <p className="text-slate-500 mt-2 text-sm">
            The manual purge job has been queued. Monitor it in the Purge Jobs page.
          </p>

        </div>

      </Modal>

    </div>
  );
};