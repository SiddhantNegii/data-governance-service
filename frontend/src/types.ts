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
  client_id: string;
  product_id: string;
  retention_days: number;
  created_at: string;
  updated_at: string;
}

export interface PurgeJob {
  id: string;
  client_id: string;
  product_id: string;
  trigger_type: string;
  rows_deleted: number;
  execution_time: string;
  duration?: string;
  status: string;
}

export interface PurgeLog {
  id: string;
  timestamp: string;
  client_id: string;
  product_id: string;
  action_type: string;
  rows_deleted: number;
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
