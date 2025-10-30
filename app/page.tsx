'use client';

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';
import { UserData, Session } from '@/lib/types';

const AUTHORIZED_UID = 'f77c7551'; // Your RFID card UID

export default function Dashboard() {
  const [isActive, setIsActive] = useState(false);
  const [power, setPower] = useState(0);
  const [current, setCurrent] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [sessionCount, setSessionCount] = useState(0);
  const [activeSessionCount, setActiveSessionCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<number>(0);
  const [recentSessions, setRecentSessions] = useState<Array<{ id: string; session: Session }>>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const userRef = ref(database, `users/${AUTHORIZED_UID}`);

    const unsubscribe = onValue(userRef, (snapshot) => {
      const data: UserData = snapshot.val();

      if (data) {
        let totalSessions = 0;
        let activeSessions = 0;
        let totalEnergy = 0;
        let hasActive = false;
        const sessions: Array<{ id: string; session: Session }> = [];

        if (data.sessions) {
          Object.entries(data.sessions).forEach(([id, session]) => {
            totalSessions++;
            sessions.push({ id, session });
            if (session.status === 'active') {
              hasActive = true;
              activeSessions++;
            }
            if (session.energyUsed) totalEnergy += session.energyUsed;
          });
        }

        // Sort by most recent
        sessions.sort((a, b) => b.session.startTime - a.session.startTime);
        setRecentSessions(sessions.slice(0, 3));

        setIsActive(hasActive);
        setSessionCount(totalSessions);
        setActiveSessionCount(activeSessions);
        setEnergy(totalEnergy);
        setPower(data.currentStatus?.power || 0);
        setCurrent(data.currentStatus?.current || 0);
        setLastUpdate(data.currentStatus?.lastUpdate || 0);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formatTime = (timestamp: number) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTimeDiff = (timestamp: number) => {
    if (!timestamp) return 'Never';
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-medium">Loading Dashboard...</p>
          <p className="text-gray-500 mt-2 text-sm">Connecting to Firebase</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Smart Lab Management</h1>
                <p className="text-gray-600 text-sm">Real-Time Energy Monitoring System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-900 font-semibold text-lg">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-gray-600 text-sm">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Status Banner */}
        <div className={`rounded-lg p-6 mb-8 shadow-md border-2 transition-all duration-300 ${
          isActive
            ? 'bg-green-50 border-green-300'
            : 'bg-gray-100 border-gray-300'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`relative h-16 w-16 rounded-full flex items-center justify-center ${
                isActive ? 'bg-green-100' : 'bg-gray-200'
              }`}>
                {isActive && (
                  <div className="absolute h-16 w-16 rounded-full bg-green-300 animate-ping opacity-30"></div>
                )}
                <div className={`h-8 w-8 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${isActive ? 'text-green-700' : 'text-gray-700'}`}>
                  {isActive ? 'SYSTEM OPERATIONAL' : 'SYSTEM STANDBY'}
                </h2>
                <p className="text-gray-600 text-sm">
                  Last Update: {getTimeDiff(lastUpdate)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-gray-600 text-sm mb-1">Active Sessions</div>
              <div className={`text-4xl font-bold ${isActive ? 'text-green-600' : 'text-gray-400'}`}>
                {activeSessionCount}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Power Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="h-7 w-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="text-blue-600 text-xs font-semibold bg-blue-50 px-2 py-1 rounded">LIVE</div>
            </div>
            <div className="text-gray-600 text-sm font-medium mb-1">Current Power</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{power.toFixed(2)}</div>
            <div className="text-blue-600 text-sm font-medium">Watts</div>
          </div>

          {/* Current Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="h-7 w-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div className="text-purple-600 text-xs font-semibold bg-purple-50 px-2 py-1 rounded">LIVE</div>
            </div>
            <div className="text-gray-600 text-sm font-medium mb-1">Current Draw</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{current.toFixed(2)}</div>
            <div className="text-purple-600 text-sm font-medium">Amperes</div>
          </div>

          {/* Energy Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="h-7 w-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-yellow-600 text-xs font-semibold bg-yellow-50 px-2 py-1 rounded">TOTAL</div>
            </div>
            <div className="text-gray-600 text-sm font-medium mb-1">Energy Consumed</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{energy.toFixed(2)}</div>
            <div className="text-yellow-600 text-sm font-medium">Watt-hours</div>
          </div>

          {/* Sessions Card */}
          <div className="bg-white rounded-lg p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="h-7 w-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded">ALL TIME</div>
            </div>
            <div className="text-gray-600 text-sm font-medium mb-1">Total Sessions</div>
            <div className="text-4xl font-bold text-gray-900 mb-1">{sessionCount}</div>
            <div className="text-green-600 text-sm font-medium">Recorded</div>
          </div>
        </div>

        {/* Recent Activity & System Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h3>
            </div>
            <div className="p-6">
              {recentSessions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-600 font-medium">No sessions recorded yet</p>
                  <p className="text-gray-500 text-sm mt-1">Activity will appear here once sessions begin</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentSessions.map(({ id, session }) => (
                    <div key={id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            session.status === 'active' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-200 border-2 border-gray-400'
                          }`}>
                            <span className={`font-bold text-sm ${session.status === 'active' ? 'text-green-700' : 'text-gray-700'}`}>
                              {session.userName?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-gray-900 font-semibold">{session.userName || 'Unknown User'}</div>
                            <div className="text-gray-500 text-xs">{formatDate(session.startTime)} at {formatTime(session.startTime)}</div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          session.status === 'active'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-gray-200 text-gray-700 border border-gray-300'
                        }`}>
                          {session.status === 'active' ? '● Active' : 'Completed'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-200">
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Energy Used</div>
                          <div className="text-gray-900 font-semibold">{(session.energyUsed || 0).toFixed(2)} Wh</div>
                        </div>
                        <div>
                          <div className="text-gray-500 text-xs mb-1">Duration</div>
                          <div className="text-gray-900 font-semibold">
                            {session.duration ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s` : 'Ongoing'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System Information */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <svg className="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                System Info
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider font-semibold">Device Status</div>
                <div className={`text-lg font-bold ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
                  {isActive ? 'Connected' : 'Standby'}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider font-semibold">RFID Monitor</div>
                <div className="text-gray-900 font-mono text-sm font-semibold">{AUTHORIZED_UID}</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-gray-500 text-xs mb-2 uppercase tracking-wider font-semibold">Last Sync</div>
                <div className="text-gray-900 text-sm font-semibold">{formatTime(lastUpdate)}</div>
                <div className="text-gray-500 text-xs mt-1">{getTimeDiff(lastUpdate)}</div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-blue-700 text-xs mb-2 uppercase tracking-wider font-semibold">System Health</div>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '95%'}}></div>
                  </div>
                  <span className="text-green-600 font-bold text-sm">95%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            <p>Smart Lab Management System v1.0 | Powered by ESP32 & Firebase</p>
            <p className="mt-1 text-gray-400">Real-time monitoring and analytics</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
