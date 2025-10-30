'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, Activity, FileText, Zap } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Real-time Monitor', href: '/monitor', icon: Activity },
  { name: 'Sessions', href: '/sessions', icon: History },
  { name: 'Access Logs', href: '/logs', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-gray-900 border-b border-gray-700">
          <Zap className="h-8 w-8 text-yellow-400" />
          <span className="ml-2 text-white font-bold text-lg">Smart Lab</span>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${
                      isActive
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-3 flex-shrink-0 h-6 w-6
                      ${isActive ? 'text-yellow-400' : 'text-gray-400 group-hover:text-gray-300'}
                    `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div>
                <div className="inline-block h-9 w-9 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-white font-semibold">KSP</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">KSP Electronics</p>
                <p className="text-xs font-medium text-gray-400">Admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
