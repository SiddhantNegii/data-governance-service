import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { Client } from '../types';
import { Plus, Edit2, Trash2, Download } from 'lucide-react';

export const Clients = () => {

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");

  const loadClients = async () => {

    setIsLoading(true);

    try {

      const data = await api.getClients();
      setClients(data);

    } catch (err) {

      console.error(err);

    } finally {

      setIsLoading(false);

    }

  };

  useEffect(() => {
    loadClients();
  }, []);

  const resetForm = () => {
    setName("");
    setClientId("");
    setEditingClientId(null);
  };

  const handleSubmit = async () => {

    if (!name || !clientId) return;

    try {

      if (editingClientId) {

        await api.updateClient(editingClientId, {
          name,
          client_id: clientId
        });

      } else {

        await api.createClient({
          name,
          client_id: clientId
        });

      }

      resetForm();
      setIsModalOpen(false);
      loadClients();

    } catch (err) {

      console.error(err);
      alert(err.message);
    }

  };

  const handleEdit = (client: Client) => {

    setEditingClientId(client.id);
    setName(client.name);
    setClientId(client.client_id);

    setIsModalOpen(true);

  };

  const confirmDelete = async () => {

    if (!deleteTargetId) return;

    try {

      await api.deleteClient(deleteTargetId);

      setDeleteTargetId(null);
      loadClients();

    } catch (err) {

      console.error(err);

    }

  };

  return (
    <div className="space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Client Directory
          </h1>

          <p className="text-slate-500 mt-1">
            Manage client data retention configurations and purge schedules.
          </p>

        </div>

        <div className="flex items-center gap-3">

          <Button variant="outline">
            <Download size={18} className="mr-2" /> Export
          </Button>

          <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
            <Plus size={18} className="mr-2" /> Add Client
          </Button>

        </div>

      </div>

      <Card className="p-0">

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
              accessor: (item) =>
                new Date(item.created_at).toLocaleDateString()
            },

            {
              header: "Actions",
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
                    onClick={() => setDeleteTargetId(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>

                </div>

              )
            }

          ]}

          data={clients}

        />

      </Card>

      {/* CREATE / EDIT MODAL */}

      <Modal

        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingClientId ? "Edit Client" : "Add Client"}

        footer={

          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              {editingClientId ? "Update Client" : "Create Client"}
            </Button>

          </>

        }

      >

        <div className="space-y-4">

          <div>

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Client Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
            />

          </div>

          <div>

            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Client ID
            </label>

            <input
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
            />

          </div>

        </div>

      </Modal>

      {/* DELETE MODAL */}

      <Modal

        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Client"

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
          Are you sure you want to delete this client?
        </p>

      </Modal>

    </div>
  );

};