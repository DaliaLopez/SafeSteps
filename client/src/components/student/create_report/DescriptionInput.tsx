interface Props {
    value: string;
    onChange: (val: string) => void;
}

export const DescriptionInput = ({ value, onChange }: Props) => {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-2 mb-4">
                <h3>Descripción</h3>
            </div>
            <textarea
                className="w-full p-5 bg-[#F7F7F5] rounded-2xl text-xs border-none min-h-35 focus:ring-0 placeholder-gray-400 outline-none"
                placeholder="Describe el problema que encontraste..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};