import { DashboardStats, Client, Product, RetentionPolicy, PurgeJob, PurgeLog } from '../types';

const BASE_URL = "http://localhost:8000";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status} ${text}`);
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
      lastUpdated: p.updated_at
    }));

  },

  createRetentionPolicy: async (data: {
    client_id: string;
    product_id: string;
    retention_days: number;
  }) => {

    const res = await fetch(`${BASE_URL}/policies/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return handleResponse(res);

  },

  // -------------------------
  // Purge Jobs
  // -------------------------

  getPurgeJobs: async (): Promise<PurgeJob[]> => {

    const res = await fetch(`${BASE_URL}/purge-jobs/`);
    const data = await handleResponse(res);

    return data.map((j: any) => ({
      id: j.id,
      client: j.client_id,
      product: j.product_id,
      triggerType: j.trigger_type,
      rowsDeleted: j.rows_deleted,
      executionTime: j.execution_time,
      duration: j.duration,
      status: j.status
    }));

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
      client: l.client_id,
      product: l.product_id,
      actionType: l.action_type,
      rowsDeleted: l.rows_deleted,
      status: l.status,
      notes: l.notes
    }));

  },

  // -------------------------
  // Manual Purge
  // -------------------------

  triggerManualPurge: async (data: any) => {

    const res = await fetch(`${BASE_URL}/purge-jobs/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    return handleResponse(res);

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