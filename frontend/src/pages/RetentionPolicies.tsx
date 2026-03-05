import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { RetentionPolicy } from '../types';
import { Plus, Edit2 } from 'lucide-react';

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

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Retention Policies
          </h1>
          <p className="text-slate-500 mt-1">
            Automated lifecycle rules for enterprise data.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Policy
        </Button>

      </div>

      <Card className="p-0">

        <Table<RetentionPolicy>

          isLoading={isLoading}

          columns={[

            {
              header: 'Policy ID',
              accessor: 'id',
              className: 'font-bold text-[#137fec]'
            },

            {
              header: 'Client ID',
              accessor: 'clientId'
            },

            {
              header: 'Product ID',
              accessor: 'productId'
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
                new Date(item.lastUpdated).toLocaleDateString()
            },

            {
              header: 'Actions',
              className: 'text-right',
              accessor: () => (

                <Button variant="ghost" size="icon">
                  <Edit2 size={16} />
                </Button>

              )
            }

          ]}

          data={policies}

        />

      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Policy"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>

            <Button onClick={() => setIsModalOpen(false)}>
              Create Policy
            </Button>
          </>
        }
      >

        <div className="space-y-4">

          <input
            placeholder="Client ID"
            className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
          />

          <input
            placeholder="Product ID"
            className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
          />

          <input
            placeholder="Retention Days"
            className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
          />

        </div>

      </Modal>

    </div>

  );

};