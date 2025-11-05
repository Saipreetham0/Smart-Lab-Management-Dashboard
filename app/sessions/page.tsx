'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { Session } from '@/lib/types';

const AUTHORIZED_UID = 'f77c7551';

interface SessionWithId {
  id: string;
  session: Session;
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionWithId[]>([]);
  const [loading, setLoading] = useState(true);

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

      // Sort by most recent first
      sessionsList.sort((a, b) => b.session.startTime - a.session.startTime);

      setSessions(sessionsList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const totalEnergy = sessions.reduce((sum, s) => sum + (s.session.energyUsed || 0), 0);
  const activeSessions = sessions.filter((s) => s.session.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sessions</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Total Sessions</div>
          <div className="text-2xl font-bold text-gray-900">{sessions.length}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">{activeSessions}</div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="text-sm text-gray-600">Total Energy</div>
          <div className="text-2xl font-bold text-gray-900">{totalEnergy.toFixed(2)} Wh</div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Energy</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No sessions found
                </td>
              </tr>
            ) : (
              sessions.map(({ id, session }) => (
                <tr key={id}>
                  <td className="px-6 py-4 text-sm text-gray-900">{session.userName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {session.duration ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {session.energyUsed ? `${session.energyUsed.toFixed(2)} Wh` : '0 Wh'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      session.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
