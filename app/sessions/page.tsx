'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Session } from '@/lib/types';
import { Clock, Zap, Calendar, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AUTHORIZED_UID = 'f77c7551';

interface SessionWithId {
  id: string;
  session: Session;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const sessionsRef = ref(database, `users/${AUTHORIZED_UID}/sessions`);

    const unsubscribe = onValue(sessionsRef, (snapshot) => {
      const data = snapshot.val();
      const sessionsList: SessionWithId[] = [];

      if (data) {
        Object.entries(data).forEach(([id, session]) => {
          sessionsList.push({ id, session: session as Session });
        });
      }

      // Sort by start time (most recent first)
      sessionsList.sort((a, b) => b.session.startTime - a.session.startTime);

      setSessions(sessionsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filter === 'all') return true;
    return s.session.status === filter;
  });

  // Calculate statistics
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter((s) => s.session.status === 'active').length;
  const completedSessions = sessions.filter((s) => s.session.status === 'completed').length;
  const totalEnergy = sessions.reduce((sum, s) => sum + (s.session.energyUsed || 0), 0);
  const avgDuration = sessions.filter((s) => s.session.duration).reduce((sum, s) => sum + (s.session.duration || 0), 0) / completedSessions || 0;

  // Prepare chart data
  const energyByDay = sessions.reduce((acc: Record<string, number>, s) => {
    const date = new Date(s.session.startTime).toLocaleDateString();
    acc[date] = (acc[date] || 0) + (s.session.energyUsed || 0);
    return acc;
  }, {});

  const energyChartData = Object.entries(energyByDay)
    .map(([date, energy]) => ({ date, energy }))
    .slice(0, 7)
    .reverse();

  const statusData = [
    { name: 'Active', value: activeSessions, color: '#10B981' },
    { name: 'Completed', value: completedSessions, color: '#6B7280' },
  ];

  const endReasonData = sessions
    .filter((s) => s.session.endReason)
    .reduce((acc: Record<string, number>, s) => {
      const reason = s.session.endReason || 'unknown';
      acc[reason] = (acc[reason] || 0) + 1;
      return acc;
    }, {});

  const endReasonChartData = Object.entries(endReasonData).map(([name, value]) => ({ name, value }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Session History</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Clock className="h-10 w-10 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <TrendingUp className="h-10 w-10 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{activeSessions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Zap className="h-10 w-10 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Energy</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalEnergy.toFixed(2)} Wh</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <Calendar className="h-10 w-10 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Duration</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{Math.floor(avgDuration / 60)}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-8">
        {/* Energy Usage Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Energy Usage by Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={energyChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.375rem',
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Legend />
              <Bar dataKey="energy" fill="#EAB308" name="Energy (Wh)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Session Status Pie Chart */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Session Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setFilter('all')}
              className={`${
                filter === 'all'
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              All Sessions ({totalSessions})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`${
                filter === 'active'
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Active ({activeSessions})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`${
                filter === 'completed'
                  ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Completed ({completedSessions})
            </button>
          </nav>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Start Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  End Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Energy Used
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  End Reason
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No sessions found
                  </td>
                </tr>
              ) : (
                filteredSessions.map(({ id, session }) => (
                  <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {session.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(session.startTime).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {session.endTime ? new Date(session.endTime).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {session.duration ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {session.energyUsed ? `${session.energyUsed.toFixed(2)} Wh` : '0 Wh'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          session.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {session.endReason ? session.endReason.replace(/_/g, ' ') : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
