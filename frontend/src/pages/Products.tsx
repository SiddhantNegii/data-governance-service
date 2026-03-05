import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from '../components/UI';
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Product Management</h1>
          <p className="text-slate-500 mt-1">Configure and monitor data governance across different product lines.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 text-[#137fec] rounded-xl">
                  <Box size={24} />
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-rose-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
              <p className="text-sm text-slate-500 mt-1 h-10 line-clamp-2">{product.description}</p>
              
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Clients</p>
                  <p className="text-xl font-black text-slate-900">{product.activeClients.toLocaleString()}</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="All Products" className="p-0">
        <Table<Product>
          isLoading={isLoading}
          columns={[
            { header: 'Product Name', accessor: 'name', className: 'font-bold' },
            { header: 'Product ID', accessor: 'id', className: 'font-mono text-xs' },
            { header: 'Description', accessor: 'description', className: 'text-slate-500 max-w-xs truncate' },
            { header: 'Active Clients', accessor: (item) => item.activeClients.toLocaleString(), className: 'font-bold' },
            { 
              header: 'Actions', 
              className: 'text-right',
              accessor: () => (
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ) 
            },
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
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsModalOpen(false)}>Create Product</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</label>
            <input type="text" className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-[#137fec]" placeholder="e.g. Hypersync" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
            <textarea className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-[#137fec]" placeholder="Product description..." rows={3}></textarea>
          </div>
        </div>
      </Modal>
    </div>
  );
};
