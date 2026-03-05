import { DashboardStats, Client, Product, RetentionPolicy, PurgeJob, PurgeLog } from '../types';

// Mock API Service
export const api = {
  getStats: async (): Promise<DashboardStats> => {
    return {
      totalClients: 1284,
      totalProducts: 452,
      activePolicies: 86,
      purgeJobsToday: 12,
      clientGrowth: '+2.5%',
      productGrowth: '-1.2%',
      policyGrowth: '+5.0%',
      jobGrowth: '+8.4%',
    };
  },

  getClients: async (): Promise<Client[]> => {
    return [
      { id: 'CLI-90124-B', name: 'Acme Corp', productsEnabled: ['FinData', 'Vault'], retentionPolicies: 12, lastPurgeDate: '2023-10-24', status: 'Successful' },
      { id: 'CLI-11045-A', name: 'Global Solutions', productsEnabled: ['FinData', 'Insight'], retentionPolicies: 8, lastPurgeDate: '2023-11-02', status: 'Processing' },
      { id: 'CLI-77239-C', name: 'NextGen Tech', productsEnabled: ['Vault'], retentionPolicies: 4, lastPurgeDate: '2023-10-15', status: 'Completed' },
      { id: 'CLI-44021-X', name: 'Summit Trading', productsEnabled: ['FinData', 'Vault', 'Insight'], retentionPolicies: 32, lastPurgeDate: '2023-11-01', status: 'Failed' },
    ];
  },

  getProducts: async (): Promise<Product[]> => {
    return [
      { id: 'PROD-001', name: 'Hypersync', description: 'Data synchronization engine', activeClients: 842 },
      { id: 'PROD-002', name: 'Hyperverify', description: 'Real-time identity verification', activeClients: 312 },
      { id: 'PROD-003', name: 'Hyperapps', description: 'Custom application platform', activeClients: 130 },
    ];
  },

  getRetentionPolicies: async (): Promise<RetentionPolicy[]> => {
    return [
      { id: 'POL-99201', clientId: 'ASTRA_CORP_01', productId: 'LEDGER_MAIN', retentionPeriod: '30 Days', lastUpdated: '2023-10-24' },
      { id: 'POL-99205', clientId: 'NEXUS_GLOB', productId: 'ANALYTICS_V2', retentionPeriod: 'Never Purge', lastUpdated: '2023-11-12' },
      { id: 'POL-99212', clientId: 'VELVET_SYS', productId: 'VAULT_ARCH', retentionPeriod: '7 Years', lastUpdated: '2023-12-01' },
      { id: 'POL-99342', clientId: 'ZENITH_LLC', productId: 'CORE_LEDGER', retentionPeriod: '90 Days', lastUpdated: '2024-01-15' },
    ];
  },

  getPurgeJobs: async (): Promise<PurgeJob[]> => {
    return [
      { id: '#PRG-98421', client: 'Global Finance Corp', product: 'CRM Platform', triggerType: 'Manual', rowsDeleted: 842019, executionTime: 'Oct 24, 14:20:01', duration: '--', status: 'Running' },
      { id: '#PRG-98418', client: 'TechNova Inc', product: 'ERP System', triggerType: 'Scheduled', rowsDeleted: 1240500, executionTime: 'Oct 24, 12:00:00', duration: '12m 45s', status: 'Success', logs: ['Initializing...', 'Authenticating...', 'Policy applied...', 'Scan complete...', 'Deleting...', 'Success!'] },
      { id: '#PRG-98415', client: 'AeroDynamics LLC', product: 'Logistics Hub', triggerType: 'Scheduled', rowsDeleted: 0, executionTime: 'Oct 24, 08:30:15', duration: '1m 12s', status: 'Failed' },
      { id: '#PRG-98412', client: 'Wellness Direct', product: 'Health Portal', triggerType: 'Manual', rowsDeleted: 241922, executionTime: 'Oct 23, 22:15:00', duration: '4m 30s', status: 'Success' },
    ];
  },

  getPurgeLogs: async (): Promise<PurgeLog[]> => {
    return [
      { timestamp: '2023-11-20 14:30:05', client: 'Apex Dynamics', product: 'Core Engine', actionType: 'Auto Purge', rowsDeleted: 124502, status: 'Success', notes: 'Completed normally' },
      { timestamp: '2023-11-20 13:15:12', client: 'Summit Solutions', product: 'User CRM', actionType: 'Manual', rowsDeleted: 5109233, status: 'Success', notes: 'Triggered by admin' },
      { timestamp: '2023-11-20 11:05:45', client: 'Global Reach Inc', product: 'Auth Logs', actionType: 'Auto Purge', rowsDeleted: 0, status: 'Failed', notes: 'Connection timeout' },
    ];
  },

  triggerManualPurge: async (data: any): Promise<{ success: boolean; message: string }> => {
    console.log('Triggering manual purge with:', data);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, message: 'Purge job initiated successfully' }), 1000);
    });
  }
};
