export interface Client {
  id: string;
  client_id: string;
  name: string;
  created_at: string;
}

export interface Product {
  id: string;
  product_id: string;
  name: string;
  description?: string;
  created_at: string;
}

export interface RetentionPolicy {
  id: string;
  clientId: string;
  productId: string;
  retentionPeriod: string;
  lastUpdatedBy: string;
  lastUpdatedAt: string;
}

export interface PurgeLog {
  id: string;
  timestamp: string;
  retentionPolicyId: string;
  client: string;
  product: string;
  actionType: string;
  status: string;
}

export interface DashboardStats {
  totalClients: number;
  totalProducts: number;
  activePolicies: number;
  purgeJobsToday: number;
  clientGrowth: string;
  productGrowth: string;
  policyGrowth: string;
  jobGrowth: string;
}