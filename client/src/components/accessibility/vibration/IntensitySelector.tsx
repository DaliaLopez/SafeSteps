export const IntensitySelector = ({ selected, onSelect }: { selected: string, onSelect: (s: string) => void }) => {
    const options = ['Suave', 'Media', 'Fuerte'];

    return (
        <div className="space-y-6 gap-2">
            <span className="text-[#1E293B] font-semibold ml-1 text-normal">Intensidad</span>
            <div className="flex flex-col gap-3 mt-4">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSelect(option)}
                        className={`w-full py-3 rounded-2xl font-medium text-sm text-left px-8 transition-all active:scale-[0.98] ${selected === option
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