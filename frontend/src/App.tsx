import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Clients } from './pages/Clients';
import { Products } from './pages/Products';
import { RetentionPolicies } from './pages/RetentionPolicies';
import { PurgeJobs } from './pages/PurgeJobs';
import { PurgeLogs } from './pages/PurgeLogs';
import { ManualPurge } from './pages/ManualPurge';
import { Card } from './components/UI';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <Clients />;
      case 'products':
        return <Products />;
      case 'policies':
        return <RetentionPolicies />;
      case 'jobs':
        return <PurgeJobs />;
      case 'logs':
        return <PurgeLogs />;
      case 'manual':
        return <ManualPurge />;
      case 'settings':
        return (
          <div className="space-y-8">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
            <Card title="System Configuration">
              <p className="text-slate-500">System-wide settings and configuration options will be available here.</p>
            </Card>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}
