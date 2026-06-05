import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: number | string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export const StatCard = ({ label, value, icon: Icon, colorClass, bgClass }: Props) => (

  <div className="bg-white p-4 rounded-3xl flex flex-col items-center gap-1 shadow-sm border border-gray-50">
    <div className={`p-2 rounded-2xl ${bgClass} mb-1`}>
      <Icon size={20} className={colorClass} />
    </div>
    <span className="text-xl font-black text-[#1E293B]">{value}</span>
    <span className="text-xs text-center text-gray-600 px-2">
      {label}
    </span>
  </div>
  
);