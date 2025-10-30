import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

export default function StatsCard({ title, value, icon: Icon, description, trend, color = 'blue' }: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`${colorClasses[color]} rounded-md p-3`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
        {description && (
          <div className="mt-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        )}
        {trend && (
          <div className="mt-3">
            <span className={`text-sm font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend.value >= 0 ? '+' : ''}{trend.value}%
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">{trend.label}</span>
          </div>
        )}
      </div>
    </div>
  );
}
