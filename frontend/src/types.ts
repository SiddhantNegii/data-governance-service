export interface Client {
  id: string;
  name: string;
  productsEnabled: string[];
  retentionPolicies: number;
  lastPurgeDate: string;
  status: 'Successful' | 'Processing' | 'Completed' | 'Failed';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  activeClients: number;
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
  triggerType: 'Manual' | 'Scheduled';
  rowsDeleted: number;
  executionTime: string;
  duration: string;
  status: 'Success' | 'Running' | 'Failed';
  logs?: string[];
}

export interface PurgeLog {
  timestamp: string;
  client: string;
  product: string;
  actionType: string;
  rowsDeleted: number;
  status: 'Success' | 'Failed' | 'Warning';
  notes: string;
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
