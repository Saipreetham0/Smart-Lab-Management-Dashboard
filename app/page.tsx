'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { UserData, Session } from '@/lib/types';

const AUTHORIZED_UID = 'f77c7551';

interface SessionWithId {
  id: string;
  session: Session;
}

export default function Dashboard() {
  const [power, setPower] = useState(0);
  const [current, setCurrent] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [sessions, setSessions] = useState<SessionWithId[]>([]);
  const [latestSession, setLatestSession] = useState<SessionWithId | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRef = ref(database, `users/${AUTHORIZED_UID}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data: UserData = snapshot.val();

      if (data) {
        let totalSessions = 0;
        let totalEnergy = 0;
        const sessionsList: SessionWithId[] = [];

        if (data.sessions) {
          Object.entries(data.sessions).forEach(([id, session]) => {
            totalSessions++;
            sessionsList.push({ id, session });
            if (session.energyUsed) totalEnergy += session.energyUsed;
          });
        }

        // Sort by serial number (session ID) - highest number is most recent
        sessionsList.sort((a, b) => parseInt(b.id) - parseInt(a.id));

        // Get the latest session (highest serial number)
        const latest = sessionsList.length > 0 ? sessionsList[0] : null;

        setSessionCount(totalSessions);
        setEnergy(totalEnergy);
        setSessions(sessionsList);
        setLatestSession(latest);
        setPower(data.currentStatus?.power || 0);
        setCurrent(data.currentStatus?.current || 0);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Smart Lab Dashboard</h1>
        <p className="text-gray-600 mt-1">Real-time Energy Monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Power */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-sm text-gray-600 mb-2">Power</div>
          <div className="text-3xl font-bold text-gray-900">{power.toFixed(1)} W</div>
        </div>

        {/* Current */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-sm text-gray-600 mb-2">Current</div>
          <div className="text-3xl font-bold text-gray-900">{current.toFixed(2)} A</div>
        </div>

        {/* Total Energy */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-sm text-gray-600 mb-2">Total Energy</div>
          <div className="text-3xl font-bold text-gray-900">{energy.toFixed(2)} Wh</div>
        </div>

        {/* Sessions */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="text-sm text-gray-600 mb-2">Sessions</div>
          <div className="text-3xl font-bold text-gray-900">{sessionCount}</div>
        </div>
      </div>

      {/* Latest Session */}
      {latestSession && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Latest Session</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Session #</div>
              <div className="text-xl font-bold text-gray-900">{latestSession.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">User</div>
              <div className="text-xl font-bold text-gray-900">{latestSession.session.userName}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Duration</div>
              <div className="text-xl font-bold text-gray-900">
                {latestSession.session.duration
                  ? `${Math.floor(latestSession.session.duration / 60)}m ${latestSession.session.duration % 60}s`
                  : '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Energy</div>
              <div className="text-xl font-bold text-gray-900">
                {latestSession.session.energyUsed
                  ? `${latestSession.session.energyUsed.toFixed(2)} Wh`
                  : '0 Wh'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sessions List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">All Sessions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Session ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Energy</th>
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
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#{id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{session.userName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {session.duration ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {session.energyUsed ? `${session.energyUsed.toFixed(2)} Wh` : '0 Wh'}
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
