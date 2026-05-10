import { VibrateIcon } from 'lucide-react';

export const VibrationToggle = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between transition-all">
        <div className="flex items-center gap-4">
            <div className="p-2 bg-[#F0F7FF] rounded-lg text-[#296BFF]">
                <VibrateIcon size={24} />
            </div>
            <span className="text-[#1E293B] font-bold text-lg">Activar vibración</span>
        </div>
        <button
            onClick={onToggle}
            className={`w-14 h-8 rounded-full transition-colors relative ${active ? 'bg-[#296BFF]' : 'bg-gray-200'}`}
        >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${active ? 'left-7' : 'left-1'}`} />
        </button>
    </div>
);