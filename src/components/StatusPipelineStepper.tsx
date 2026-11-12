import React from 'react';
import { BatchStatus } from '../types/drc';
import {
  FileEdit,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  User,
} from 'lucide-react';

interface StatusPipelineStepperProps {
  status: BatchStatus;
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string | null;
  approvedBy?: string | null;
  operatorName?: string;
  rejectionNote?: string | null;
}

export const StatusPipelineStepper: React.FC<StatusPipelineStepperProps> = ({
  status,
  createdAt,
  updatedAt,
  approvedAt,
  approvedBy,
  operatorName,
  rejectionNote,
}) => {
  // Steps definition:
  // Step 1: Penyediaan Data (Draft)
  // Step 2: Semakan Makmal (Pending Approval)
  // Step 3: Pengesahan & Kelulusan (Approved / Rejected)

  const isStep1Done = true; // Always created
  const isStep2Active = status === 'Pending Approval';
  const isStep2Done = status === 'Approved' || status === 'Rejected';
  const isStep3Approved = status === 'Approved';
  const isStep3Rejected = status === 'Rejected';

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
        <span>Aliran Kitaran Hayat Dokumen (Status Pipeline)</span>
        <span className="text-slate-400 font-mono text-[10px]">Audit Trail LGM</span>
      </div>

      <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-2">
        {/* Step 1: Draft / Data Entry */}
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold transition-all ${
              status === 'Draft'
                ? 'bg-slate-700 text-white ring-4 ring-slate-200 shadow'
                : 'bg-emerald-600 text-white shadow-xs'
            }`}
          >
            {status === 'Draft' ? (
              <FileEdit className="w-4 h-4" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">1. Penyediaan Batch</span>
              {status === 'Draft' && (
                <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-1.5 py-0.2 rounded">
                  Sedang Aktif
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Oleh: <strong className="text-slate-700">{operatorName || 'Staf Makmal'}</strong>
            </div>
            {createdAt && (
              <div className="text-[10px] text-slate-400">
                {new Date(createdAt).toLocaleDateString('ms-MY')}
              </div>
            )}
          </div>
        </div>

        {/* Connector 1 -> 2 */}
        <div className="hidden md:flex items-center text-slate-300 px-2">
          <ArrowRight className="w-4 h-4" />
        </div>

        {/* Step 2: Semakan Makmal (Pending Approval) */}
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold transition-all ${
              isStep2Active
                ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-200 shadow animate-pulse'
                : isStep2Done
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            {isStep2Done ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : isStep2Active ? (
              <Clock className="w-4 h-4" />
            ) : (
              <span className="text-xs font-mono">2</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">2. Semakan Supervisor</span>
              {isStep2Active && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded border border-amber-300">
                  Menunggu Kelulusan
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Semakan ketepatan angka timbangan &amp; formula DRC
            </div>
          </div>
        </div>

        {/* Connector 2 -> 3 */}
        <div className="hidden md:flex items-center text-slate-300 px-2">
          <ArrowRight className="w-4 h-4" />
        </div>

        {/* Step 3: Keputusan Kelulusan */}
        <div className="flex items-start gap-3 flex-1">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold transition-all ${
              isStep3Approved
                ? 'bg-emerald-700 text-white ring-4 ring-emerald-200 shadow'
                : isStep3Rejected
                ? 'bg-rose-600 text-white ring-4 ring-rose-200 shadow'
                : 'bg-slate-200 text-slate-400'
            }`}
          >
            {isStep3Approved ? (
              <ShieldCheck className="w-4 h-4" />
            ) : isStep3Rejected ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <span className="text-xs font-mono">3</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-xs font-bold ${
                  isStep3Approved
                    ? 'text-emerald-800'
                    : isStep3Rejected
                    ? 'text-rose-800'
                    : 'text-slate-900'
                }`}
              >
                {isStep3Approved
                  ? '3. Diluluskan (Approved)'
                  : isStep3Rejected
                  ? '3. Ditolak (Rejected)'
                  : '3. Perakuan Rasmi'}
              </span>
            </div>

            {isStep3Approved && (
              <div className="text-[11px] text-slate-500 mt-0.5">
                Diluluskan:{' '}
                <strong className="text-slate-800">
                  {approvedBy || 'Supervisor Makmal'}
                </strong>
                {approvedAt && (
                  <div className="text-[10px] text-emerald-700 font-mono">
                    {new Date(approvedAt).toLocaleString('ms-MY')}
                  </div>
                )}
              </div>
            )}

            {isStep3Rejected && (
              <div className="text-[11px] text-rose-700 mt-0.5 font-medium">
                Ditolak untuk pembetulan semula oleh Staf Makmal
              </div>
            )}

            {!isStep3Approved && !isStep3Rejected && (
              <div className="text-[11px] text-slate-400 mt-0.5">
                Laporan rasmi dijana selepas kelulusan
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
