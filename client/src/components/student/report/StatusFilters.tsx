import { ReportStatus } from '../../../types/student.types';

interface StatusFiltersProps {
    activeTab: ReportStatus;
    onTabChange: (status: ReportStatus) => void;
}

export const StatusFilters = ({
    activeTab,
    onTabChange,
}: StatusFiltersProps) => {

    const tabs = [
        { label: 'Aprobados', value: ReportStatus.APPROVED },
        { label: 'Pendientes', value: ReportStatus.PENDING },
        { label: 'Rechazados', value: ReportStatus.REJECTED },
    ];

    return (
        <div className="mx-4 mb-5">

            <div className="flex gap-2 px-4 w-full">

                {tabs.map((tab) => (

                    <button
                        key={tab.value}
                        onClick={() => onTabChange(tab.value)}
                        className={`
                            flex-1
                            h-9
                            rounded-2xl
                            text-[12px]
                            font-semibold
                            transition-all
                            shadow-sm
                            border
                            
                            ${activeTab === tab.value
                                ? 'bg-[#296BFF] text-white border-[#296BFF]'
                                : 'bg-white text-[#6B7280] border-[#ECECEC]'
                            }
                        `}
                    >
                        {tab.label}
                    </button>

                ))}

            </div>

        </div>
    );
};