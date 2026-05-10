import { Problem } from '../../../types/student.types';

interface Props {
    value: Problem;
    onChange: (val: Problem) => void;
}

export const ProblemTypeSelector = ({ value, onChange }: Props) => {
    const options = [
        { label: 'Obstáculo', value: Problem.OBSTACLE },
        { label: 'Escaleras dañadas', value: Problem.DAMAGED_STAIRS },
        { label: 'Rampa resbaladiza', value: Problem.SLIPPERY_RAMP },
        { label: 'Ascensor averiado', value: Problem.BROKEN_ELEVATOR },
        { label: 'Camino bloqueado', value: Problem.BLOCKED_PATH },
    ];

    return (
        <div className="card bg-white p-6 rounded-3xl">
            <div className="flex items-center gap-2 mb-2">
                <h3>Tipo de problema</h3>
            </div>
            <div className="flex flex-col gap-3">
                {options.map((opt) => (
                    <label
                        key={opt.value}
                        className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${value === opt.value ? 'bg-gray-50 ring-1 ring-gray-200' : 'bg-[#F7F7F5]'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${value === opt.value ? 'border-blue-500' : 'border-gray-300'
                                }`}>
                                {value === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                            </div>
                            <span className="text-xs text-[#364153]">{opt.label}</span>
                        </div>
                        {value === opt.value}
                        <input type="radio" className="hidden" checked={value === opt.value} onChange={() => onChange(opt.value)} />
                    </label>
                ))}
            </div>
        </div>
    );
};