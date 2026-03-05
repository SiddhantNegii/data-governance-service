import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { Product } from '../types';
import { Plus, Edit2, Trash2, Box } from 'lucide-react';

export const Products = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    api.getProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });

  }, []);

  return (
    <div className="space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Product Management
          </h1>
          <p className="text-slate-500 mt-1">
            Configure and monitor governance across product lines.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" />
          Add Product
        </Button>
      </div>

      <Card title="All Products" className="p-0">

        <Table<Product>

          isLoading={isLoading}

          columns={[

            {
              header: 'Product Name',
              accessor: 'name',
              className: 'font-bold'
            },

            {
              header: 'Product ID',
              accessor: 'product_id',
              className: 'font-mono text-xs'
            },

            {
              header: 'Description',
              accessor: 'description',
              className: 'text-slate-500 max-w-xs truncate'
            },

            {
              header: 'Created',
              accessor: (item) => new Date(item.created_at).toLocaleDateString()
            },

            {
              header: 'Actions',
              className: 'text-right',
              accessor: () => (
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon">
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 size={16} />
                  </Button>
                </div>
              )
            }

          ]}

          data={products}

        />

      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Product"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>

            <Button onClick={() => setIsModalOpen(false)}>
              Create Product
            </Button>
          </>
        }
      >

        <div className="space-y-4">

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Product Name
            </label>

            <input
              type="text"
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Description
            </label>

            <textarea
              rows={3}
              className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
            />
          </div>

        </div>

      </Modal>

    </div>
  );

};