'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { AccessLog } from '@/lib/types';

const AUTHORIZED_UID = 'f77c7551';

interface AccessLogWithId {
  id: string;
  log: AccessLog;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<AccessLogWithId[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Sort by most recent first
      logsList.sort((a, b) => parseInt(b.log.timestamp) - parseInt(a.log.timestamp));

      setLogs(logsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return 'bg-green-100 text-green-800';
      case 'LOGOUT':
        return 'bg-blue-100 text-blue-800';
      case 'DENIED':
        return 'bg-red-100 text-red-800';
      case 'AUTO_POWEROFF':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Access Logs</h1>

      {/* Logs Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event ID</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                  No logs found
                </td>
              </tr>
            ) : (
              logs.map(({ id, log }) => (
                <tr key={id}>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">#{log.timestamp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Total events: {logs.length}
      </div>
    </div>
  );
}
