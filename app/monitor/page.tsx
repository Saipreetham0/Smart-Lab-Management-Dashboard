'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { CurrentStatus } from '@/lib/types';
import { Activity, Zap, TrendingUp, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AUTHORIZED_UID = 'f77c7551';

interface DataPoint {
  time: string;
  current: number;
  power: number;
}

export default function MonitorPage() {
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus | null>(null);
  const [historicalData, setHistoricalData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const statusRef = ref(database, `users/${AUTHORIZED_UID}/currentStatus`);

    const unsubscribe = onValue(statusRef, (snapshot) => {
      const data: CurrentStatus = snapshot.val();

      if (data) {
        setCurrentStatus(data);

        // Add to historical data for chart
        const now = new Date();
        const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

        setHistoricalData((prev) => {
          const newData = [
            ...prev,
            {
              time: timeStr,
              current: data.current || 0,
              power: data.power || 0,
            },
          ];

          // Keep only last 20 data points
          return newData.slice(-20);
        });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  const isActive = currentStatus?.status === 'active';

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Real-time Monitor</h1>

      {/* Live Status Banner */}
      <div className={`rounded-lg p-6 mb-8 ${isActive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'}`}>
        <div className="flex items-center">
          <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'} mr-3`}></div>
          <h2 className={`text-lg font-medium ${isActive ? 'text-green-900 dark:text-green-100' : 'text-gray-900 dark:text-gray-100'}`}>
            {isActive ? 'System is Active' : 'System is Idle'}
          </h2>
        </div>
        {currentStatus?.lastUpdate && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Last update: {new Date(currentStatus.lastUpdate).toLocaleString()}
          </p>
        )}
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-500 rounded-md p-3">
                  <Activity className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Current (I)</dt>
                  <dd className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentStatus?.current.toFixed(3) || '0.000'}
                    <span className="text-xl ml-1">A</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-yellow-500 rounded-md p-3">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Power (P)</dt>
                  <dd className="text-3xl font-bold text-gray-900 dark:text-white">
                    {currentStatus?.power.toFixed(2) || '0.00'}
                    <span className="text-xl ml-1">W</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-purple-500 rounded-md p-3">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Voltage</dt>
                  <dd className="text-3xl font-bold text-gray-900 dark:text-white">
                    12.0<span className="text-xl ml-1">V</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Current Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.375rem'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="current" stroke="#3B82F6" strokeWidth={2} dot={false} name="Current (A)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Power Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Power Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.375rem'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Line type="monotone" dataKey="power" stroke="#EAB308" strokeWidth={2} dot={false} name="Power (W)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Formula Reference */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mt-8">
        <div className="flex items-start">
          <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400 mt-1" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">Power Calculation</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p className="font-mono">P = V × I</p>
              <p className="mt-1">Power (W) = Voltage (V) × Current (A)</p>
              <p className="mt-1">Using 12V DC motor voltage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
