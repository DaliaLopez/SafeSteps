import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  label: string;
  icon: React.ReactNode;
  path: string;
}

export const MenuOption = ({ label, icon, path }: Props) => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(path)}
      className="w-full bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-gray-50 active:scale-[0.98] transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="text-blue-600 bg-blue-50 p-2 rounded-xl">
          {icon}
        </div>
        <span className="font-bold text-[#1E293B] text-sm">{label}</span>
      </div>
      <ChevronRight size={18} className="text-gray-300" />
    </button>
    
  );
};