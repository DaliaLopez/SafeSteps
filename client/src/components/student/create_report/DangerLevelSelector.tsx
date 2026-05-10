import { DangerLevel } from '../../../types/student.types';

interface Props {
    value: DangerLevel;
    onChange: (val: DangerLevel) => void;
}

export const DangerLevelSelector = ({ value, onChange }: Props) => {
    const levels = [
        { id: DangerLevel.HIGH, label: 'Alto', color: 'text-red-500' },
        { id: DangerLevel.MEDIUM, label: 'Medio', color: 'text-orange-500' },
        { id: DangerLevel.LOW, label: 'Bajo', color: 'text-green-500' }
    ];

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-2 mb-2">
                <h3>Nivel de riesgo</h3>
            </div>
            <div className="flex flex-col gap-3">
                {levels.map((lvl) => (
                    <label
                        key={lvl.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${value === lvl.id ? 'bg-gray-50 ring-1 ring-gray-200' : 'bg-[#F7F7F5]'
                            }`}
                    >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === lvl.id ? 'border-blue-500' : 'border-gray-300'
                            }`}>
                            {value === lvl.id && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                        </div>
                        <span className={`text-xs font-normal ${lvl.color}`}>{lvl.label}</span>
                        <input
                            type="radio"
                            className="hidden"
                            checked={value === lvl.id}
                            onChange={() => onChange(lvl.id)}
                        />
                    </label>
                ))}
            </div>
        </div>
    );
};