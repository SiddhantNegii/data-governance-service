import { DashboardStats, Client, Product, RetentionPolicy, PurgeJob, PurgeLog } from '../types';

const BASE_URL = "http://localhost:8000";

export const api = {

  // -------------------------
  // Clients
  // -------------------------
  getClients: async (): Promise<Client[]> => {
    const res = await fetch(`${BASE_URL}/clients`);
    return res.json();
  },

  createClient: async (data: { client_id: string; name: string }) => {
    const res = await fetch(`${BASE_URL}/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return res.json();
  },

  // -------------------------
  // Products
  // -------------------------
  getProducts: async (): Promise<Product[]> => {
    const res = await fetch(`${BASE_URL}/products`);
    return res.json();
  },

  createProduct: async (data: { product_id: string; name: string; description?: string }) => {
    const res = await fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return res.json();
  },

  // -------------------------
  // Retention Policies
  // -------------------------
  getRetentionPolicies: async (): Promise<RetentionPolicy[]> => {
    const res = await fetch(`${BASE_URL}/policies`);
    return res.json();
  },

  createRetentionPolicy: async (data: {
    client_id: string;
    product_id: string;
    retention_days: number;
  }) => {
    const res = await fetch(`${BASE_URL}/policies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return res.json();
  },

  // -------------------------
  // Purge Jobs
  // -------------------------
  getPurgeJobs: async (): Promise<PurgeJob[]> => {
    const res = await fetch(`${BASE_URL}/purge-jobs`);
    return res.json();
  },

  // -------------------------
  // Purge Logs
  // -------------------------
  getPurgeLogs: async (): Promise<PurgeLog[]> => {
    const res = await fetch(`${BASE_URL}/purge-logs`);
    return res.json();
  },

  // -------------------------
  // Manual Purge
  // -------------------------
  triggerManualPurge: async (data: any): Promise<{ success: boolean; message: string }> => {
    const res = await fetch(`${BASE_URL}/purge-jobs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    return res.json();
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