import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfileHeader = ({ title }: { title: string }) => {
    const navigate = useNavigate();
    return (
        <header className="px-8 pt-8 py-6 flex items-center gap-4">
            <button 
                onClick={() => navigate('/admin/dashboard')} 
                className="p-3 bg-white rounded-full shadow-sm active:scale-90 transition-transform"
            >
                <ArrowLeft size={22} className="text-gray-800" />
            </button>
            <h2 className="text-2xl font-bold text-[#1E293B]">{title}</h2>
        </header>
    );
};
