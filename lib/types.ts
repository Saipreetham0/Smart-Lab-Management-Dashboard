export interface AccessLog {
  action: string;
  timestamp: string;
  userName: string;
}

export interface Session {
  startTime: number;
  endTime?: number;
  duration?: number;
  userName: string;
  energyUsed?: number;
  status: 'active' | 'completed';
  endReason?: string;
}

export interface CurrentStatus {
  current: number;
  power: number;
  status: string;
  lastUpdate: number;
}

export interface UserData {
  accessLog?: Record<string, AccessLog>;
  sessions?: Record<string, Session>;
  currentStatus?: CurrentStatus;
}

export interface DashboardStats {
  totalSessions: number;
  activeSessions: number;
  totalEnergyUsed: number;
  currentPower: number;
  currentCurrent: number;
  lastActivity: number;
}
