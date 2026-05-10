interface UserCardProps {
    name?: string;
    email?: string;
    role?: string;
}

export const UserCard = ({ name, email, role }: UserCardProps) => (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex items-center gap-4">
        <div className="w-15 h-15 bg-[#296BFF] rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-100 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
        </div>
        <div className="overflow-hidden">
            <h3 className="mb-1 truncate">{name || 'Usuario'}</h3>
            <p className="text-gray-400 text-sm mb-3 truncate">{email}</p>
            <span className="px-4 py-1 bg-[#E0EBFF] text-[#2563EB] rounded-full text-xs">
                {role || 'Comunidad'}
            </span>
        </div>
    </div>
);