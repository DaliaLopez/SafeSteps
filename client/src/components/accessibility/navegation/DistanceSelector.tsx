export const DistanceSelector = ({ selected, onSelect }: { selected: string, onSelect: (s: string) => void }) => {
    const options = ['3 metros', '5 metros', '10 metros'];
    return (
        <div className="space-y-4">
            <span className="text-[#364153] font-bold block ml-1 text-lg">Distancia de alerta</span>
            <div className="flex flex-col gap-3">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSelect(option)}
                        className={`w-full py-5 rounded-3xl font-bold text-left px-8 transition-all active:scale-[0.98] ${selected === option
                                ? 'bg-[#296BFF] text-white shadow-lg shadow-blue-100'
                                : 'bg-white text-[#1E293B] shadow-sm border border-gray-50'
                            }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};