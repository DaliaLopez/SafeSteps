export const SpeedSelector = ({ selected, onSelect }: { selected: string, onSelect: (s: string) => void }) => (
    <div className="space-y-4">
        <span className="text-[#1E293B] font-semibold block ml-1">Velocidad de voz</span>
        <div className="grid grid-cols-3 gap-3">
            {['Lenta', 'Normal', 'Rápida'].map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={`py-4 rounded-2xl font-semibold text-xs transition-all active:scale-95 ${selected === option
                            ? 'bg-[#296BFF] text-white shadow-lg shadow-blue-100'
                            : 'bg-[#F1F5F9] text-[#64748B]'
                        }`}
                >
                    {option}
                </button>
            ))}
        </div>
    </div>
);