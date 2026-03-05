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
  lastUpdated: string;
}

export interface PurgeJob {
  id: string;
  client: string;
  product: string;
  triggerType: string;
  rowsDeleted: number;
  executionTime: string;
  duration?: string;
  status: string;
}

export interface PurgeLog {
  id: string;
  timestamp: string;
  client: string;
  product: string;
  actionType: string;
  rowsDeleted: number;
  status: string;
  notes?: string;
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