import React, { useEffect, useState } from 'react';
import { Card } from '../components/UI';
import { api } from '../services/api';
import { Users, Box, ShieldCheck, History } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export const Dashboard = () => {

  const [stats, setStats] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);

  const fetchDashboard = async () => {

    try {

      const [clients, products, policies, logs] = await Promise.all([
        api.getClients(),
        api.getProducts(),
        api.getRetentionPolicies(),
        api.getPurgeLogs()
      ]);

      const today = new Date().toDateString();

      const jobsToday = logs.filter(
        (l:any) => new Date(l.timestamp).toDateString() === today
      ).length;

      setStats({
        totalClients: clients.length,
        totalProducts: products.length,
        activePolicies: policies.length,
        purgeJobsToday: jobsToday
      });

      const dayCounts:any = {};

      logs.forEach((log:any) => {

        const day = new Date(log.timestamp)
          .toLocaleDateString("en-US",{ weekday:'short' });

        dayCounts[day] = (dayCounts[day] || 0) + 1;

      });

      setTimelineData(
        Object.entries(dayCounts).map(([name,value]) => ({
          name,
          value
        }))
      );

      const productCounts:any = {};

      logs.forEach((log:any) => {

        productCounts[log.product] =
          (productCounts[log.product] || 0) + 1;

      });

      setProductData(
        Object.entries(productCounts).map(([name,value]) => ({
          name,
          value
        }))
      );

    } catch (err) {
      console.error(err);
    }

  };

  useEffect(() => {

    fetchDashboard();

    const interval = setInterval(() => {
      fetchDashboard();
    }, 2000); // auto refresh

    return () => clearInterval(interval);

  }, []);

  if(!stats) return null;

  const statCards = [
    { label:'Total Clients', value:stats.totalClients, icon:Users },
    { label:'Total Products', value:stats.totalProducts, icon:Box },
    { label:'Active Policies', value:stats.activePolicies, icon:ShieldCheck },
    { label:'Purge Jobs Today', value:stats.purgeJobsToday, icon:History }
  ];

  return (
    <div className="space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {statCards.map((stat,idx)=>(
          <Card key={idx}>

            <div className="flex items-center justify-between mb-3">

              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>

              <stat.icon size={20}/>

            </div>

            <h3 className="text-3xl font-black text-slate-900">
              {stat.value}
            </h3>

          </Card>
        ))}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card title="Purge Activity Timeline">

          <div className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">

              <AreaChart data={timelineData}>

                <CartesianGrid strokeDasharray="3 3" vertical={false} />

                <XAxis dataKey="name"/>

                <Tooltip/>

                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#137fec"
                  strokeWidth={3}
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </Card>

        <Card title="Data Deleted by Product">

          <div className="h-[300px]">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart data={productData}>

                <CartesianGrid strokeDasharray="3 3" vertical={false}/>

                <XAxis dataKey="name"/>

                <Tooltip/>

                <Bar dataKey="value" fill="#137fec" radius={[6,6,0,0]}/>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </Card>

      </div>

    </div>
  );
};