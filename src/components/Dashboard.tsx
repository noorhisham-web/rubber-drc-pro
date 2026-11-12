import React, { useState, useMemo } from 'react';
import { DRCBatch, BatchStatus, UserRole } from '../types/drc';
import { StatusBadge } from './StatusBadge';
import { calculateBatchSummary } from '../utils/drcCalculations';
import { exportBatchToCSV } from '../utils/exportHelpers';
import {
  Search,
  Filter,
  PlusCircle,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  Percent,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { getDRCQualityInfo } from './DRCGaugePill';

interface DashboardProps {
  batches: DRCBatch[];
  activeRole: UserRole;
  onViewBatch: (batch: DRCBatch) => void;
  onEditBatch: (batch: DRCBatch) => void;
  onDeleteBatch: (id: string) => void;
  onCreateNewBatch: () => void;
  onPrintBatch: (batch: DRCBatch) => void;
  onQuickApprove?: (batch: DRCBatch) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  batches,
  activeRole,
  onViewBatch,
  onEditBatch,
  onDeleteBatch,
  onCreateNewBatch,
  onPrintBatch,
  onQuickApprove,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Calculate high-level stats
  const stats = useMemo(() => {
    const totalBatches = batches.length;
    const pendingBatches = batches.filter((b) => b.status === 'Pending Approval').length;
    const approvedBatches = batches.filter((b) => b.status === 'Approved').length;
    const rejectedBatches = batches.filter((b) => b.status === 'Rejected').length;
    const draftBatches = batches.filter((b) => b.status === 'Draft').length;

    // Overall average DRC across all approved & valid samples
    let totalSamplesCount = 0;
    let sumDrc = 0;
    batches.forEach((b) => {
      b.samples.forEach((s) => {
        if (s.drcPercent > 0) {
          sumDrc += s.drcPercent;
          totalSamplesCount += 1;
        }
      });
    });

    const avgOverallDRC =
      totalSamplesCount > 0 ? (sumDrc / totalSamplesCount).toFixed(2) : '0.00';

    return {
      totalBatches,
      pendingBatches,
      approvedBatches,
      rejectedBatches,
      draftBatches,
      avgOverallDRC,
      totalSamplesCount,
    };
  }, [batches]);

  // Filtered batches
  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      // Status filter
      if (statusFilter !== 'ALL' && b.status !== statusFilter) {
        return false;
      }

      // Date range filter
      if (dateFrom && b.testDate < dateFrom) {
        return false;
      }
      if (dateTo && b.testDate > dateTo) {
        return false;
      }

      // Search keyword filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const codeMatch = b.batchCode.toLowerCase().includes(query);
        const operatorMatch = (b.operatorName || '').toLowerCase().includes(query);
        const supplierMatch = b.samples.some((s) =>
          s.supplierName.toLowerCase().includes(query)
        );
        const sampleNoMatch = b.samples.some((s) =>
          s.sampleNo.toLowerCase().includes(query)
        );

        if (!codeMatch && !operatorMatch && !supplierMatch && !sampleNoMatch) {
          return false;
        }
      }

      return true;
    });
  }, [batches, statusFilter, dateFrom, dateTo, searchQuery]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || statusFilter !== 'ALL' || dateFrom !== '' || dateTo !== '';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Context according to active role */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-200 text-xs font-semibold mb-2 border border-emerald-500/30">
              <span>Peranan Anda:</span>
              <span className="text-white font-bold">{activeRole}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Papan Pemuka Ujian Dry Rubber Content
            </h1>
            <p className="text-emerald-100 text-sm mt-1 max-w-2xl">
              {activeRole === 'Staf Makmal' &&
                'Kemasukan data timbangan berat basah & kering secara pukal dengan formula pengiraan DRC automatik dan aliran semakan.'}
              {activeRole === 'Supervisor' &&
                'Semak integriti bacaan timbangan sampel, sahkan peratusan DRC dan buat keputusan Approve atau Reject dengan catatan.'}
              {activeRole === 'Pegawai' &&
                'Pantau laporan DRC yang diluluskan untuk rekod penerimaan getah, arkib pengesahan makmal dan muat turun CSV/PDF.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            {activeRole === 'Staf Makmal' && (
              <button
                onClick={onCreateNewBatch}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow hover:bg-emerald-50 active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700" />
                Cipta Batch Baharu
              </button>
            )}
            {activeRole === 'Supervisor' && stats.pendingBatches > 0 && (
              <button
                onClick={() => setStatusFilter('Pending Approval')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-sm shadow hover:bg-amber-300 active:scale-95 transition-all"
              >
                <Clock className="w-4 h-4" />
                Tapis {stats.pendingBatches} Menunggu Kelulusan
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Batches */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Jumlah Batch</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.totalBatches}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {stats.totalSamplesCount} sampel getah direkod
          </div>
        </div>

        {/* Pending Approval */}
        <div
          onClick={() => setStatusFilter('Pending Approval')}
          className={`cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border transition-all ${
            stats.pendingBatches > 0
              ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400 ring-1 ring-amber-200'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-amber-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Menunggu Kelulusan</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-800">
            {stats.pendingBatches}
          </div>
          <div className="text-xs text-amber-600 mt-1 font-medium">
            {stats.pendingBatches > 0 ? 'Tindakan Supervisor diperlukan' : 'Tiada tunggakan'}
          </div>
        </div>

        {/* Approved */}
        <div
          onClick={() => setStatusFilter('Approved')}
          className="cursor-pointer bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all"
        >
          <div className="flex items-center justify-between text-emerald-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Diluluskan (Approved)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-800">
            {stats.approvedBatches}
          </div>
          <div className="text-xs text-emerald-600 mt-1 font-medium">Laporan rasmi sedia dieksport</div>
        </div>

        {/* Average DRC Overall */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-teal-700 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Purata DRC Keseluruhan</span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-900">
            {stats.avgOverallDRC}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Standard industri: 30% - 65%
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No. Batch, Pembekal, atau No. Sampel..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800 placeholder-slate-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[170px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium text-slate-700 cursor-pointer"
              >
                <option value="ALL">Semua Status ({batches.length})</option>
                <option value="Pending Approval">Menunggu Kelulusan ({stats.pendingBatches})</option>
                <option value="Approved">Diluluskan ({stats.approvedBatches})</option>
                <option value="Rejected">Ditolak ({stats.rejectedBatches})</option>
                <option value="Draft">Draft ({stats.draftBatches})</option>
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Date Range Inputs */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Dari:</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
              />
              <span className="text-slate-300">|</span>
              <span>Hingga:</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-transparent text-xs text-slate-700 focus:outline-none cursor-pointer"
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
                title="Set Semula Tapisan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Set Semula</span>
              </button>
            )}
          </div>
        </div>

        {/* Active role filter hints */}
        {activeRole === 'Pegawai' && statusFilter !== 'Approved' && (
          <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span>💡 <strong>Tip Pegawai:</strong> Anda boleh menapis kepada status</span>
            <button
              onClick={() => setStatusFilter('Approved')}
              className="text-emerald-700 font-semibold underline hover:text-emerald-800"
            >
              Diluluskan (Approved)
            </button>
            <span>untuk menyemak dan memuat turun laporan rasmi sahaja.</span>
          </div>
        )}
      </div>

      {/* Batch List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="font-bold text-slate-900 text-base">Senarai Batch Ujian Getah</h2>
            <p className="text-xs text-slate-500">
              Menunjukkan {filteredBatches.length} daripada {batches.length} batch rekod
            </p>
          </div>
          {activeRole === 'Staf Makmal' && (
            <button
              onClick={onCreateNewBatch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              + Batch Baharu
            </button>
          )}
        </div>

        {filteredBatches.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              Tiada rekod batch ditemui untuk kriteria tapisan ini
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Sila cuba ubah kata kunci carian, kosongkan tarikh, atau set semula pilihan status.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Set Semula Tapisan
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">No. Batch</th>
                    <th className="py-3 px-4">Tarikh Ujian</th>
                    <th className="py-3 px-4">Sampel / Pembekal Utama</th>
                    <th className="py-3 px-4 text-right">Berat Basah (g)</th>
                    <th className="py-3 px-4 text-right">Berat Kering (g)</th>
                    <th className="py-3 px-4 text-right">Purata DRC (%)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBatches.map((batch) => {
                    const summary = calculateBatchSummary(batch.samples);
                    const isPending = batch.status === 'Pending Approval';
                    const isRejected = batch.status === 'Rejected';
                    const isDraft = batch.status === 'Draft';
                    const isApproved = batch.status === 'Approved';

                    // Check if any sample has outlier or extreme values
                    const hasOutlier = batch.samples.some((s) => {
                      const q = getDRCQualityInfo(s.rubberType, s.drcPercent);
                      return q.status === 'extreme' || q.status === 'low';
                    });

                    return (
                      <tr
                        key={batch.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Batch Code & Operator */}
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => onViewBatch(batch)}
                            className="font-bold text-slate-900 group-hover:text-emerald-700 text-left flex items-center gap-1 hover:underline"
                          >
                            <span>{batch.batchCode}</span>
                          </button>
                          <div className="text-[11px] text-slate-400 truncate max-w-[160px]">
                            {batch.operatorName || 'Staf Makmal'}
                          </div>
                        </td>

                        {/* Test Date */}
                        <td className="py-3.5 px-4 font-medium text-slate-600 whitespace-nowrap">
                          {batch.testDate}
                        </td>

                        {/* Sample Count & Suppliers preview */}
                        <td className="py-3.5 px-4 max-w-[220px]">
                          <div className="font-semibold text-slate-800">
                            {batch.samples.length} Sampel
                          </div>
                          <div className="text-[11px] text-slate-500 truncate" title={batch.samples.map(s => s.supplierName).join(', ')}>
                            {batch.samples.length > 0
                              ? batch.samples.map((s) => s.supplierName).filter(Boolean).slice(0, 2).join(', ') +
                                (batch.samples.length > 2 ? ' ...' : '')
                              : 'Tiada sampel'}
                          </div>
                        </td>

                        {/* Wet Weight */}
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700 whitespace-nowrap">
                          {summary.totalWetWeight.toFixed(2)} g
                        </td>

                        {/* Dry Weight */}
                        <td className="py-3.5 px-4 text-right font-mono font-medium text-slate-700 whitespace-nowrap">
                          {summary.totalDryWeight.toFixed(2)} g
                        </td>

                        {/* DRC % & Outlier indicator */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex flex-col items-end gap-0.5">
                            <span
                              className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                                summary.avgDRC >= 30 && summary.avgDRC <= 65
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {summary.avgDRC.toFixed(2)}%
                            </span>
                            {hasOutlier && (
                              <span
                                className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5"
                                title="Batch ini mengandungi sampel luar julat piawai"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Ada anomali
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <StatusBadge status={batch.status} size="sm" />
                          {isRejected && batch.rejectionNote && (
                            <div className="text-[10px] text-rose-600 mt-0.5 truncate max-w-[130px] mx-auto" title={batch.rejectionNote}>
                              Perlu pembetulan
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* View Details */}
                            <button
                              onClick={() => onViewBatch(batch)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                              title="Lihat Butiran & Laporan"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* Supervisor quick action on Pending */}
                            {activeRole === 'Supervisor' && isPending && (
                              <button
                                onClick={() => onViewBatch(batch)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors shadow-xs"
                                title="Semak dan buat keputusan Approve/Reject"
                              >
                                Semak
                              </button>
                            )}

                            {/* Edit (Staf only if Draft or Rejected) */}
                            {activeRole === 'Staf Makmal' && (isDraft || isRejected) && (
                              <button
                                onClick={() => onEditBatch(batch)}
                                className="p-1.5 rounded-lg text-amber-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                                title={isRejected ? 'Betulkan Batch yang Ditolak (Resubmit)' : 'Sunting Draft'}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                            )}

                            {/* Export CSV */}
                            <button
                              onClick={() => exportBatchToCSV(batch)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                              title="Eksport ke CSV (Excel)"
                            >
                              <FileSpreadsheet className="w-4 h-4" />
                            </button>

                            {/* Print / PDF */}
                            <button
                              onClick={() => onPrintBatch(batch)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              title="Cetak / Simpan PDF"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            {/* Delete (Staf only if Draft) */}
                            {activeRole === 'Staf Makmal' && isDraft && (
                              <button
                                onClick={() => onDeleteBatch(batch.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                                title="Padam Draft"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Responsive Cards (< 768px as per PRD Section 9 for 360px+ screens) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredBatches.map((batch) => {
                const summary = calculateBatchSummary(batch.samples);
                const isPending = batch.status === 'Pending Approval';
                const isRejected = batch.status === 'Rejected';
                const isDraft = batch.status === 'Draft';

                return (
                  <div key={batch.id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <button
                          onClick={() => onViewBatch(batch)}
                          className="font-bold text-slate-900 text-sm text-left hover:text-emerald-700 flex items-center gap-1"
                        >
                          {batch.batchCode}
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        </button>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{batch.testDate}</span>
                          <span>•</span>
                          <span>{batch.samples.length} Sampel</span>
                        </div>
                      </div>
                      <StatusBadge status={batch.status} size="sm" />
                    </div>

                    {/* Rejection note notice */}
                    {isRejected && batch.rejectionNote && (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-xs text-rose-800 flex items-start gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-600" />
                        <div>
                          <strong>Catatan Supervisor:</strong> {batch.rejectionNote}
                        </div>
                      </div>
                    )}

                    {/* Metric chips */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl text-center">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Basah</div>
                        <div className="text-xs font-mono font-bold text-slate-700">
                          {summary.totalWetWeight.toFixed(1)}g
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Kering</div>
                        <div className="text-xs font-mono font-bold text-slate-700">
                          {summary.totalDryWeight.toFixed(1)}g
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Purata DRC</div>
                        <div className="text-xs font-mono font-bold text-emerald-800">
                          {summary.avgDRC.toFixed(2)}%
                        </div>
                      </div>
                    </div>

                    {/* Action buttons on mobile */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => onViewBatch(batch)}
                        className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Lihat Butiran
                      </button>

                      <div className="flex items-center gap-2">
                        {activeRole === 'Supervisor' && isPending && (
                          <button
                            onClick={() => onViewBatch(batch)}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs"
                          >
                            Semak Kelulusan
                          </button>
                        )}

                        {activeRole === 'Staf Makmal' && (isDraft || isRejected) && (
                          <button
                            onClick={() => onEditBatch(batch)}
                            className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold"
                          >
                            {isRejected ? 'Betulkan' : 'Edit'}
                          </button>
                        )}

                        <button
                          onClick={() => exportBatchToCSV(batch)}
                          className="p-1.5 rounded-lg text-slate-600 bg-slate-100 hover:bg-slate-200"
                          title="Eksport CSV"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
