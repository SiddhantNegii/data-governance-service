import React, { useEffect, useState } from 'react';
import { Card, Button } from '../components/UI';
import { Table } from '../components/Table';
import { Modal } from '../components/Modal';
import { api } from '../services/api';
import { Product } from '../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const Products = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [productId, setProductId] = useState("");
  const [description, setDescription] = useState("");

  const loadProducts = async () => {

    setIsLoading(true);

    try {

      const data = await api.getProducts();
      setProducts(data);

    } catch (err) {

      console.error(err);

    } finally {

      setIsLoading(false);

    }

  };

  useEffect(() => {
    loadProducts();
  }, []);

  const resetForm = () => {

    setName("");
    setProductId("");
    setDescription("");
    setEditingProductId(null);

  };

  const handleSubmit = async () => {

    if (!name || !productId) return;

    try {

      if (editingProductId) {

        await api.updateProduct(editingProductId, {
          name,
          product_id: productId,
          description
        });

      } else {

        await api.createProduct({
          name,
          product_id: productId,
          description
        });

      }

      resetForm();
      setIsModalOpen(false);
      loadProducts();

    } catch (err) {

      console.error(err);
      alert(err.message);
    }

  };

  const handleEdit = (product: Product) => {

    setEditingProductId(product.id);
    setName(product.name);
    setProductId(product.product_id);
    setDescription(product.description || "");

    setIsModalOpen(true);

  };

  const confirmDelete = async () => {

    if (!deleteTargetId) return;

    try {

      await api.deleteProduct(deleteTargetId);

      setDeleteTargetId(null);
      loadProducts();

    } catch (err) {

      console.error(err);

    }

  };

  return (
    <div className="space-y-8">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Product Management
          </h1>

          <p className="text-slate-500 mt-1">
            Configure governance across product lines.
          </p>

        </div>

        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={18} className="mr-2" />
          Add Product
        </Button>

      </div>

      <Card className="p-0">

        <Table<Product>

          isLoading={isLoading}

          columns={[

            { header: 'Product Name', accessor: 'name' },

            { header: 'Product ID', accessor: 'product_id' },

            { header: 'Description', accessor: 'description' },

            {
              header: 'Created',
              accessor: (item) =>
                new Date(item.created_at).toLocaleDateString()
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
                    onClick={() => setDeleteTargetId(item.id)}
                  >
                    <Trash2 size={16} />
                  </Button>

                </div>

              )
            }

          ]}

          data={products}

        />

      </Card>

      {/* CREATE / EDIT MODAL */}

      <Modal

        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProductId ? "Edit Product" : "Add Product"}

        footer={

          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSubmit}>
              {editingProductId ? "Update Product" : "Create Product"}
            </Button>

          </>

        }

      >

        <div className="space-y-4">

          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
          />

          <input
            placeholder="Product ID"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-slate-50 border-slate-200 rounded-lg px-3 py-2 text-sm"
          />

        </div>

      </Modal>

      {/* DELETE MODAL */}

      <Modal

        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        title="Delete Product"

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
          Are you sure you want to delete this product?
        </p>

      </Modal>

    </div>
  );

};