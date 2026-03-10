import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { RetentionPolicy, Client, Product } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const RetentionPolicies = () => {

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [policies, setPolicies] = useState<RetentionPolicy[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);

  const [clientId, setClientId] = useState("");
  const [productId, setProductId] = useState("");
  const [retentionDays, setRetentionDays] = useState("");
  const [updatedBy, setUpdatedBy] = useState("");

  const loadData = async () => {

    setIsLoading(true);

    try {

      const [policyData, clientData, productData] = await Promise.all([
        api.getRetentionPolicies(),
        api.getClients(),
        api.getProducts()
      ]);

      setPolicies(policyData);
      setClients(clientData);
      setProducts(productData);

    } catch (err) {

      console.error(err);

    } finally {

      setIsLoading(false);

    }

  };

  useEffect(() => {
    loadData();
  }, []);

  const resetForm = () => {

    setClientId("");
    setProductId("");
    setRetentionDays("");
    setUpdatedBy("");
    setEditingPolicyId(null);

  };

  const handleSubmit = async () => {

    if (!clientId) {
      alert("Please select a client");
      return;
    }

    if (!productId) {
      alert("Please select a product");
      return;
    }

    if (!retentionDays) {
      alert("Please enter retention days");
      return;
    }

    if (Number(retentionDays) <= 0) {
      alert("Retention days must be greater than 0");
      return;
    }

    if (!updatedBy) {
      alert("Please enter who updated the policy");
      return;
    }

    try {

      if (editingPolicyId) {

        await api.updatePolicy(editingPolicyId, {
          client_id: clientId,
          product_id: productId,
          retention_days: Number(retentionDays),
          last_updated_by: updatedBy
        });

      } else {

        await api.createRetentionPolicy({
          client_id: clientId,
          product_id: productId,
          retention_days: Number(retentionDays),
          last_updated_by: updatedBy
        });

      }

      resetForm();
      setIsModalOpen(false);
      loadData();

    } catch (err: any) {

      console.error(err);
      alert(err?.message || "Failed to create retention policy");

    }

  };

  const handleEdit = (policy: RetentionPolicy) => {

    setEditingPolicyId(policy.id);
    setClientId(policy.clientId);
    setProductId(policy.productId);
    setRetentionDays(policy.retentionPeriod.replace(" days",""));
    setUpdatedBy(policy.lastUpdatedBy);

    setIsModalOpen(true);

  };

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = async () => {

    if (!deleteTargetId) return;

    try {

      await api.deletePolicy(deleteTargetId);
      setDeleteTargetId(null);
      loadData();

    } catch (err) {

      console.error(err);

    }

  };

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Retention Policies
          </h1>
          <p className="text-slate-500 mt-1">
            Define how long client data is retained.
          </p>
        </div>

        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={18} className="mr-2" />
          Add Policy
        </Button>

      </div>

      <Card className="p-0">

        <Table<RetentionPolicy>

          isLoading={isLoading}

          columns={[

            { header: 'Policy ID', accessor: 'id' },

            {
              header: 'Client',
              accessor: (item) => {

                const client = clients.find(c => c.client_id === item.clientId);

                return client
                  ? `${client.name} (${client.client_id})`
                  : item.clientId;

              }
            },

            {
              header: 'Product',
              accessor: (item) => {

                const product = products.find(p => p.product_id === item.productId);

                return product
                  ? `${product.name} (${product.product_id})`
                  : item.productId;

              }
            },

            {
              header: 'Retention',
              accessor: (item) => (
                <Badge variant="info">
                  {item.retentionPeriod}
                </Badge>
              )
            },

            {
              header: 'Last Updated',
              accessor: (item) =>
                new Date(item.lastUpdatedAt).toLocaleDateString()
            },

            {
              header: 'Updated By',
              accessor: 'lastUpdatedBy'
            },

            {
              header: 'Actions',
              accessor: (item) => (

                <div className="flex gap-2">

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit2 size={16} />
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>

                </div>

              )
            }

          ]}

          data={policies}

        />

      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPolicyId ? "Edit Policy" : "Create Retention Policy"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              {editingPolicyId ? "Update Policy" : "Create Policy"}
            </Button>
          </>
        }
      >

        <div className="space-y-4">

          <div>

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Client
            </label>

            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
            >

              <option value="">Select Client</option>

              {clients.map((client) => (

                <option key={client.id} value={client.client_id}>
                  {client.name} [{client.client_id}]
                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Product
            </label>

            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
            >

              <option value="">Select Product</option>

              {products.map((product) => (

                <option key={product.id} value={product.product_id}>
                  {product.name} [{product.product_id}]
                </option>

              ))}

            </select>

          </div>

          <div>

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Retention Days
            </label>

            <input
              type="number"
              value={retentionDays}
              onChange={(e) => setRetentionDays(e.target.value)}
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
            />

          </div>

          <div>

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Last Updated By
            </label>

            <input
              type="text"
              value={updatedBy}
              onChange={(e) => setUpdatedBy(e.target.value)}
              placeholder="e.g. admin@tartan.com"
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
            />

          </div>

        </div>

      </Modal>

      <Modal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Policy"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteTargetId(null)}>
              Cancel
            </Button>

            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </>
        }
      >

        <p className="text-sm text-slate-600">
          Are you sure you want to delete this retention policy?  
          This action cannot be undone.
        </p>

      </Modal>

    </div>
  );
};