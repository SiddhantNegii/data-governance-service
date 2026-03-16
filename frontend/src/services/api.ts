import { DashboardStats, Client, Product, RetentionPolicy, PurgeLog } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
async function handleResponse(res: Response) {

  if (!res.ok) {

    let message = "Operation failed";

    try {

      const data = await res.json();

      if (data?.detail) {
        message = data.detail;
      }

    } catch {

      const text = await res.text();

      if (text) {
        message = text;
      }

    }

    throw new Error(message);

  }

  return res.json();

}

export const api = {

  // -------------------------
  // Clients
  // -------------------------

  getClients: async (): Promise<Client[]> => {

    const res = await fetch(`${BASE_URL}/clients/`);
    const data = await handleResponse(res);

    return data.map((c: any) => ({
      id: c.id,
      client_id: c.client_id,
      name: c.name,
      created_at: c.created_at
    }));

  },

  createClient: async (data: { client_id: string; name: string }) => {

    const res = await fetch(`${BASE_URL}/clients/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return handleResponse(res);

  },

  updateClient: async (id: string, data: { client_id: string; name: string }) => {

    const res = await fetch(`${BASE_URL}/clients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return handleResponse(res);

  },

  deleteClient: async (id: string) => {

    const res = await fetch(`${BASE_URL}/clients/${id}`, {
      method: "DELETE"
    });

    return handleResponse(res);

  },

  // -------------------------
  // Products
  // -------------------------

  getProducts: async (): Promise<Product[]> => {

    const res = await fetch(`${BASE_URL}/products/`);
    const data = await handleResponse(res);

    return data.map((p: any) => ({
      id: p.id,
      product_id: p.product_id,
      name: p.name,
      description: p.description,
      created_at: p.created_at
    }));

  },

  createProduct: async (data: { product_id: string; name: string; description?: string }) => {

    const res = await fetch(`${BASE_URL}/products/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return handleResponse(res);

  },

  updateProduct: async (id: string, data: {
    product_id: string
    name: string
    description?: string
  }) => {

    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return handleResponse(res);

  },

  deleteProduct: async (id: string) => {

    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "DELETE"
    });

    return handleResponse(res);

  },

  // -------------------------
  // Retention Policies
  // -------------------------

  getRetentionPolicies: async (): Promise<RetentionPolicy[]> => {

    const res = await fetch(`${BASE_URL}/policies/`);
    const data = await handleResponse(res);

    return data.map((p: any) => ({
      id: p.id,
      clientId: p.client_id,
      productId: p.product_id,
      retentionPeriod: `${p.retention_days} days`,
      lastUpdatedBy: p.last_updated_by,
      lastUpdatedAt: p.last_updated_at
    }));

  },

  createRetentionPolicy: async (data: {
    client_id: string;
    product_id: string;
    retention_days: number;
    last_updated_by: string;
  }) => {

    const res = await fetch(`${BASE_URL}/policies/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return handleResponse(res);

  },

  updatePolicy: async (policyId: string, data: {
    client_id: string
    product_id: string
    retention_days: number
    last_updated_by: string
  }) => {

    const res = await fetch(`${BASE_URL}/policies/${policyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return handleResponse(res);

  },

  deletePolicy: async (policyId: string) => {

    const res = await fetch(`${BASE_URL}/policies/${policyId}`, {
      method: "DELETE"
    });

    return handleResponse(res);

  },

  // -------------------------
  // Purge Logs
  // -------------------------

  getPurgeLogs: async (): Promise<PurgeLog[]> => {

    const res = await fetch(`${BASE_URL}/purge-logs/`);
    const data = await handleResponse(res);

    return data.map((l: any) => ({
      id: l.id,
      timestamp: l.timestamp,
      retentionPolicyId: l.retention_policy_id,
      client: l.client_id,
      product: l.product_id,
      actionType: l.action_type,
      status: l.status
    }));

  },

  // -------------------------
  // Dashboard Stats (temporary)
  // -------------------------

  getStats: async (): Promise<DashboardStats> => {

    return {
      totalClients: 0,
      totalProducts: 0,
      activePolicies: 0,
      purgeJobsToday: 0,
      clientGrowth: "+0%",
      productGrowth: "+0%",
      policyGrowth: "+0%",
      jobGrowth: "+0%"
    };

  }

};