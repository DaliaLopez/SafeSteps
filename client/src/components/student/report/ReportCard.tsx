import { MapPin, PenLine, AlertTriangle, FileText, Clock, Calendar} from "lucide-react";
import { ReportStatus, Problem, DangerLevel} from "../../../types/student.types";

import type { ReportDTO } from "../../../types/student.types";

const PROBLEM_LABELS: Record<Problem, string> = {
    [Problem.OBSTACLE]: "Obstáculo",
    [Problem.DAMAGED_STAIRS]: "Escaleras dañadas",
    [Problem.SLIPPERY_RAMP]: "Rampa resbaladiza",
    [Problem.BROKEN_ELEVATOR]: "Ascensor averiado",
    [Problem.BLOCKED_PATH]: "Camino bloqueado",
};

const DANGER_LABELS: Record<DangerLevel, string> = {
    [DangerLevel.LOW]: "Bajo",
    [DangerLevel.MEDIUM]: "Medio",
    [DangerLevel.HIGH]: "Alto",
};

export const ReportCard = ({ report }: { report: ReportDTO }) => {
    const statusStyles = {
        [ReportStatus.PENDING]:
            "bg-[#DCEBFF] text-[#2563EB]",
        [ReportStatus.APPROVED]:
            "bg-[#DCFCE7] text-[#15803D]",
        [ReportStatus.REJECTED]:
            "bg-[#FEE2E2] text-[#B91C1C]",
        [ReportStatus.RESOLVED]:
            "bg-gray-100 text-gray-600",
    };

    return (
        <div className="bg-white rounded-2xl px-5 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] mx-4 mb-5">

            <div className="flex flex-col gap-5">

                <div className="flex items-start gap-3">

                    <div className="w-8 h-8 rounded-[50px] bg-[#EEF4FF] flex items-center justify-center shrink-0">
                        <MapPin size={18} className="text-[#296BFF]" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <span className="text-[#8A94A6] text-[13px] font-medium">
                            Ubicación
                        </span>

                        <span className="text-[15px] leading-5 font-semibold text-[#1E293B]">
                            {report.location_name || "Ubicación no identificada"}
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-3">

                    <div className="w-8 h-8 rounded-[50px] bg-[#F6EEFF] flex items-center justify-center shrink-0">
                        <PenLine size={18} className="text-[#C026FF]" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <span className="text-[#8A94A6] text-[13px] font-medium">
                            Tipo de problema
                        </span>

                        <span className="text-[14px] leading-5font-medium text-[#364153]">
                            {PROBLEM_LABELS[report.problem_type]}
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-3">

                    <div className="w-8 h-8 rounded-[50px] bg-[#FFF4E8] flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} className="text-[#FF6B00]" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <span className="text-[#8A94A6] text-[13px] font-medium">
                            Nivel de riesgo
                        </span>

                        <span className="text-[14px] leading-5 text-[#364153]">
                            {DANGER_LABELS[report.danger_level]}
                        </span>
                    </div>
                </div>

                <div className="flex items-start gap-3">

                    <div className="w-8 h-8 rounded-[50px] bg-[#F3F4F6] flex items-center justify-center shrink-0">
                        <FileText size={18} className="text-[#9CA3AF]" />
                    </div>

                    <div className="flex flex-col gap-0.5 flex-1">
                        <span className="text-[#8A94A6] text-[13px] font-medium">
                            Descripción
                        </span>

                        <p className="text-[14px] leading-5.5 text-[#4B5563] wrap-break-word">
                            {report.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-[#ECECEC] my-5" />

            <div className="flex items-center justify-between gap-2">

                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-semibold ${statusStyles[report.status]}`}
                >
                    <Clock size={14} />

                    <span className="capitalize">
                        {report.status.toLowerCase()}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-[#8A94A6]">
                    <Calendar size={14} />

                    <span className="text-[12px]">
                        {new Date(report.created_at).toLocaleDateString(
                            "es-ES",
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            }
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
};