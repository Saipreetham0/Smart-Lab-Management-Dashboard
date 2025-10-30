'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AccessLog } from '@/lib/types';
import { Search, Filter, CheckCircle, XCircle, LogOut, LogIn, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AUTHORIZED_UID = 'f77c7551';

interface AccessLogWithId {
  id: string;
  log: AccessLog;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AccessLogWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  useEffect(() => {
    const logsRef = ref(database, `users/${AUTHORIZED_UID}/accessLog`);

    const unsubscribe = onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      const logsList: AccessLogWithId[] = [];

      if (data) {
        Object.entries(data).forEach(([id, log]) => {
          logsList.push({ id, log: log as AccessLog });
        });
      }

      // Sort by timestamp (most recent first)
      logsList.sort((a, b) => parseInt(b.log.timestamp) - parseInt(a.log.timestamp));

      setLogs(logsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAction === 'all' || log.log.action === filterAction;
    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const totalLogs = logs.length;
  const loginCount = logs.filter((l) => l.log.action === 'LOGIN').length;
  const logoutCount = logs.filter((l) => l.log.action === 'LOGOUT').length;
  const deniedCount = logs.filter((l) => l.log.action === 'DENIED').length;
  const autoPoweroffCount = logs.filter((l) => l.log.action === 'AUTO_POWEROFF').length;

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return <LogIn className="h-5 w-5 text-green-500" />;
      case 'LOGOUT':
        return <LogOut className="h-5 w-5 text-blue-500" />;
      case 'DENIED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'AUTO_POWEROFF':
        return <Shield className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    const colors: Record<string, string> = {
      LOGIN: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      LOGOUT: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      DENIED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      AUTO_POWEROFF: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[action] || 'bg-gray-100 text-gray-800'}`}>
        {action.replace(/_/g, ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Access Logs</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-gray-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalLogs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <LogIn className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Logins</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{loginCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <LogOut className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Logouts</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{logoutCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Denied</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{deniedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Shield className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Auto Off</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{autoPoweroffCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              placeholder="Search by user or action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="all">All Actions</option>
              <option value="LOGIN">Login</option>
              <option value="LOGOUT">Logout</option>
              <option value="DENIED">Denied</option>
              <option value="AUTO_POWEROFF">Auto Power Off</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Time Ago
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No logs found
                  </td>
                </tr>
              ) : (
                filteredLogs.map(({ id, log }) => (
                  <tr key={id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <div className="ml-3">{getActionBadge(log.action)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {log.userName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(parseInt(log.timestamp)).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(parseInt(log.timestamp), { addSuffix: true })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredLogs.length} of {totalLogs} total access events
        </p>
      </div>
    </div>
  );
}
