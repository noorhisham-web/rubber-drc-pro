import React from 'react';
import { BatchStatus } from '../types/drc';
import { Clock, AlertCircle, CheckCircle2, XCircle, FileEdit } from 'lucide-react';

interface StatusBadgeProps {
  status: BatchStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  }[size];

  switch (status) {
    case 'Draft':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-slate-100 text-slate-700 border border-slate-300 font-medium ${sizeClasses}`}
        >
          <FileEdit className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Draft
        </span>
      );
    case 'Pending Approval':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-amber-50 text-amber-800 border border-amber-300 font-medium ${sizeClasses}`}
        >
          <Clock className={size === 'sm' ? 'w-3 h-3 animate-spin' : 'w-3.5 h-3.5'} />
          Menunggu Kelulusan
        </span>
      );
    case 'Rejected':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-rose-50 text-rose-800 border border-rose-300 font-medium ${sizeClasses}`}
        >
          <XCircle className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Ditolak (Rejected)
        </span>
      );
    case 'Approved':
      return (
        <span
          className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium ${sizeClasses}`}
        >
          <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          Diluluskan (Approved)
        </span>
      );
    default:
      return null;
  }
};
