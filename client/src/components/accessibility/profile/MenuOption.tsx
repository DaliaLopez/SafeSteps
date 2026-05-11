import { useNavigate } from "react-router-dom";

interface MenuOptionProps {
    label: string;
    icon: React.ReactNode;
    path: string;
}

export const MenuOption = ({ label, icon, path }: MenuOptionProps) => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(path)}
            className="w-full bg-white p-3 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 active:scale-[0.98] transition-all"
        >
            <div className="flex items-center gap-3">
                <div className="p-3 bg-[#F0F7FF] rounded-3xl text-[#296BFF]">
                    {icon}
                </div>
                <span className="font-bold text-[#1E293B]">{label}</span>
            </div>
        </button>
    );
};