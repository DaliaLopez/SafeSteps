import { Volume2 } from 'lucide-react';

export const VolumeControl = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => (

    <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#1E293B] font-semibold">
            <div className="p-2 bg-[#F0F7FF] rounded-lg">
                <Volume2 size={20} className="text-[#296BFF]" />
            </div>

            <span>Volumen</span>

        </div>
        
        <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#296BFF]"
        />
    </div>

);