export const ToggleSetting = ({ label, active, onToggle }: { label: string, active: boolean, onToggle: () => void }) => (
    <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 flex items-center justify-between transition-all">
        <span className="text-[#1E293B] font-semibold ml-2">{label}</span>
        <button
            onClick={onToggle}
            className={`w-14 h-8 rounded-full transition-colors relative ${active ? 'bg-[#296BFF]' : 'bg-gray-200'}`}
        >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${active ? 'left-7' : 'left-1'}`} />
        </button>
    </div>
);