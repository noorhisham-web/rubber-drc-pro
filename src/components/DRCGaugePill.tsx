import React from 'react';
import { RubberType } from '../types/drc';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export interface DRCQualityInfo {
  status: 'normal' | 'low' | 'high' | 'extreme';
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  minNormal: number;
  maxNormal: number;
  description: string;
  percentPosition: number; // 0 - 100 for gauge visualization
}

export function getDRCQualityInfo(rubberType: RubberType, drc: number): DRCQualityInfo {
  let minNormal = 28;
  let maxNormal = 42;
  let minScale = 10;
  let maxScale = 60;

  if (rubberType === 'Cup Lump') {
    minNormal = 50;
    maxNormal = 65;
    minScale = 30;
    maxScale = 80;
  } else if (rubberType === 'Unribbed Sheet') {
    minNormal = 65;
    maxNormal = 78;
    minScale = 45;
    maxScale = 90;
  } else if (rubberType === 'Lain-lain') {
    minNormal = 30;
    maxNormal = 60;
    minScale = 15;
    maxScale = 85;
  }

  // Calculate percentage position along scale [minScale, maxScale]
  const clamped = Math.max(minScale, Math.min(maxScale, drc));
  const percentPosition = Math.round(((clamped - minScale) / (maxScale - minScale)) * 100);

  if (drc < minNormal * 0.7 || drc > maxNormal * 1.35) {
    return {
      status: 'extreme',
      label: drc < minNormal ? 'Ekstrem Rendah' : 'Ekstrem Tinggi',
      badgeBg: 'bg-rose-100',
      badgeText: 'text-rose-800',
      badgeBorder: 'border-rose-300',
      dotColor: 'bg-rose-500',
      minNormal,
      maxNormal,
      description: `Nilai ${drc.toFixed(2)}% sangat luar biasa untuk ${rubberType} (Piawai: ${minNormal}%–${maxNormal}%). Sila timbang semula!`,
      percentPosition,
    };
  }

  if (drc < minNormal) {
    return {
      status: 'low',
      label: 'Rendah (Cair)',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      badgeBorder: 'border-amber-300',
      dotColor: 'bg-amber-500',
      minNormal,
      maxNormal,
      description: `Bawah julat standard ${rubberType} (${minNormal}%–${maxNormal}%). Kemungkinan kandungan air/serum tinggi.`,
      percentPosition,
    };
  }

  if (drc > maxNormal) {
    return {
      status: 'high',
      label: 'Tinggi',
      badgeBg: 'bg-orange-100',
      badgeText: 'text-orange-800',
      badgeBorder: 'border-orange-300',
      dotColor: 'bg-orange-500',
      minNormal,
      maxNormal,
      description: `Melebihi julat biasa ${rubberType} (${minNormal}%–${maxNormal}%). Pastikan pengeringan sempurna.`,
      percentPosition,
    };
  }

  return {
    status: 'normal',
    label: 'Normal (Piawai)',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-300',
    dotColor: 'bg-emerald-500',
    minNormal,
    maxNormal,
    description: `Dalam piawaian standard ${rubberType} (${minNormal}%–${maxNormal}%).`,
    percentPosition,
  };
}

interface DRCGaugePillProps {
  drc: number | null;
  rubberType: RubberType;
  showGaugeBar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const DRCGaugePill: React.FC<DRCGaugePillProps> = ({
  drc,
  rubberType,
  showGaugeBar = true,
  size = 'md',
}) => {
  if (drc === null || isNaN(drc) || drc <= 0) {
    return <span className="text-slate-300 font-mono text-xs">—</span>;
  }

  const quality = getDRCQualityInfo(rubberType, drc);

  return (
    <div
      className="inline-flex flex-col items-end gap-1 group relative cursor-help"
      title={`${quality.description}`}
    >
      {/* DRC Number & Quality Badge */}
      <div className="flex items-center gap-1.5">
        <span
          className={`font-mono font-bold tracking-tight ${
            size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
          } ${
            quality.status === 'normal'
              ? 'text-emerald-900'
              : quality.status === 'extreme'
              ? 'text-rose-900'
              : 'text-amber-900'
          }`}
        >
          {drc.toFixed(2)}%
        </span>

        <span
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold border ${quality.badgeBg} ${quality.badgeText} ${quality.badgeBorder}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${quality.dotColor} shrink-0`}></span>
          <span>{quality.label}</span>
        </span>
      </div>

      {/* Visual Micro Gauge Bar */}
      {showGaugeBar && (
        <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden relative shadow-inner">
          {/* Target normal zone highlighted in green */}
          <div
            className="absolute top-0 bottom-0 bg-emerald-300/80"
            style={{
              left: `${Math.max(10, Math.min(85, ((quality.minNormal - 10) / 70) * 100))}%`,
              width: `${Math.max(20, Math.min(60, ((quality.maxNormal - quality.minNormal) / 70) * 100))}%`,
            }}
          ></div>
          {/* Current reading indicator pin */}
          <div
            className={`absolute top-0 bottom-0 w-2 -ml-1 rounded-full ${quality.dotColor} ring-1 ring-white shadow`}
            style={{ left: `${quality.percentPosition}%` }}
          ></div>
        </div>
      )}

      {/* Hover Info Tooltip */}
      <div className="hidden group-hover:block absolute z-50 right-0 top-full mt-1.5 w-52 p-2 bg-slate-900 text-white text-[11px] rounded-xl shadow-xl pointer-events-none border border-slate-700 animate-in fade-in">
        <div className="font-bold flex items-center justify-between pb-1 border-b border-slate-700">
          <span>{rubberType}</span>
          <span className="text-emerald-300 font-mono">
            {quality.minNormal}% – {quality.maxNormal}%
          </span>
        </div>
        <p className="mt-1 text-slate-300 leading-tight">{quality.description}</p>
      </div>
    </div>
  );
};
