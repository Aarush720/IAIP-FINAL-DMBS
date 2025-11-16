import React, { ReactNode } from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, change, changeType }) => {
  const changeColor = changeType === 'increase' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-stone-800/50 p-6 rounded-lg border border-stone-200 dark:border-stone-700/50 transition-all duration-300 hover:border-[#CF5256]/50 hover:shadow-lg hover:shadow-[#CF5256]/10">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">{title}</p>
          <p className="text-3xl font-bold font-heading text-stone-900 dark:text-[#FAF4F4] mt-1">{value}</p>
        </div>
        <div className="text-[#CF5256] bg-[#CF5256]/10 p-3 rounded-full">
          {icon}
        </div>
      </div>
      {change && (
        <p className={`text-xs mt-4 ${changeColor}`}>
          {changeType === 'increase' ? '▲' : '▼'} {change} from last term
        </p>
      )}
    </div>
  );
};

export default KpiCard;