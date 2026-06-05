import { CheckCircle2 } from "lucide-react";
import { ReportCard } from "../student/report/ReportCard";

import type { ReportDTO } from "../../types/student.types";

interface AdminReportCardProps {
  report: ReportDTO;
  onResolve: (id: string) => void;
}

export default function AdminReportCard({
  report,
  onResolve,
}: AdminReportCardProps) {
  
  return (

    <div>
      <ReportCard report={report} />

      <div className="px-4 -mt-2 mb-5">
        <button
          onClick={() => onResolve(report.id)}
          className="w-full bg-[#DCFCE7] hover:bg-[#BBF7D0] text-[#15803D] font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 size={18} />

          <span>Alerta solucionada</span>
        </button>
      </div>
    </div>

  );
}