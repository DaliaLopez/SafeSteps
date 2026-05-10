import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    color: string;
    shadow: string;
}

export const StatCard = ({ label, value, icon: Icon, color, shadow }: StatCardProps) => (
    <div className={`${color} p-5 rounded-2xl text-white flex flex-col items-center gap-2 shadow-lg ${shadow} border border-white/10`}>
        <div className="bg-white/20 p-2 rounded-xl">
            <Icon size={20} />
        </div>
        <span className="text-2xl font-black">{value}</span>
        <span className="text-xs text-center leading-tight">
            {label}
        </span>
    </div>
);