import React, { useState } from 'react';
import { DRCBatch, UserRole } from '../types/drc';
import { StatusBadge } from './StatusBadge';
import { calculateBatchSummary } from '../utils/drcCalculations';
import { exportBatchToCSV } from '../utils/exportHelpers';
import {
  X,
  FileSpreadsheet,
  Printer,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Calendar,
  User,
  Hash,
  Scale,
  Percent,
  Layers,
  Send,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { DRCGaugePill, getDRCQualityInfo } from './DRCGaugePill';
import { StatusPipelineStepper } from './StatusPipelineStepper';

interface BatchDetailModalProps {
  batch: DRCBatch | null;
  activeRole: UserRole;
  onClose: () => void;
  onEdit: (batch: DRCBatch) => void;
  onPrint: (batch: DRCBatch) => void;
  onApprove: (batch: DRCBatch, supervisorNotes?: string) => void;
  onReject: (batch: DRCBatch, rejectionNote: string) => void;
}

export const BatchDetailModal: React.FC<BatchDetailModalProps> = ({
  batch,
  activeRole,
  onClose,
  onEdit,
  onPrint,
  onApprove,
  onReject,
}) => {
  if (!batch) return null;

  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approvalNote, setApprovalNote] = useState('');
  const [rejectionNote, setRejectionNote] = useState('');
  const [rejectError, setRejectError] = useState<string | null>(null);

  const summary = calculateBatchSummary(batch.samples);
  const isPending = batch.status === 'Pending Approval';
  const isRejected = batch.status === 'Rejected';
  const isApproved = batch.status === 'Approved';
  const isDraft = batch.status === 'Draft';

  // Quality analytics & outlier detection for Supervisor and Officers
  const qualityAnalyses = batch.samples.map((s) => ({
    sample: s,
    quality: getDRCQualityInfo(s.rubberType, s.drcPercent),
  }));
  const outlierSamples = qualityAnalyses.filter(
    (qa) => qa.quality.status !== 'normal'
  );
  const isAllStandard = outlierSamples.length === 0 && batch.samples.length > 0;

  const handleConfirmApprove = () => {
    onApprove(batch, approvalNote.trim() || undefined);
    setShowApproveDialog(false);
  };

  const handleConfirmReject = () => {
    const trimmed = rejectionNote.trim();
    if (!trimmed || trimmed.length < 5) {
      setRejectError('Catatan pembetulan adalah wajib (minimum 5 aksara) mengikut syarat BR-04.');
      return;
    }
    setRejectError(null);
    onReject(batch, trimmed);
    setShowRejectDialog(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-mono font-bold text-sm shadow-xs">
              DRC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 font-mono tracking-tight">
                  {batch.batchCode}
                </h2>
                <StatusBadge status={batch.status} size="sm" />
              </div>
              <p className="text-xs text-slate-500">
                Tarikh Ujian: <span className="font-semibold text-slate-700">{batch.testDate}</span> • Operator: <span className="font-semibold text-slate-700">{batch.operatorName || 'Staf Makmal'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportBatchToCSV(batch)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              title="Eksport ke CSV (Excel)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Eksport CSV</span>
            </button>

            <button
              onClick={() => onPrint(batch)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
              title="Cetak Sijil / Laporan PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Visual Status Pipeline Stepper */}
          <StatusPipelineStepper
            status={batch.status}
            createdAt={batch.createdAt}
            updatedAt={batch.updatedAt}
            approvedAt={batch.approvedAt}
            approvedBy={batch.approvedBy}
            operatorName={batch.operatorName}
            rejectionNote={batch.rejectionNote}
          />

          {/* Rejection Alert if Rejected */}
          {isRejected && batch.rejectionNote && (
            <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 text-rose-900 flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-700">
                  Batch Ditolak — Arahan Pembetulan Supervisor:
                </div>
                <p className="text-sm font-semibold mt-1 text-rose-950">
                  &ldquo;{batch.rejectionNote}&rdquo;
                </p>
                {activeRole === 'Staf Makmal' && (
                  <div className="mt-3">
                    <button
                      onClick={() => onEdit(batch)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors shadow-xs"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      Buka Mod Suntingan untuk Betulkan &amp; Resubmit
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Supervisor Approval Action Callout (Only when role is Supervisor & status is Pending Approval) */}
          {activeRole === 'Supervisor' && isPending && (
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-emerald-50 border-2 border-amber-300 rounded-2xl p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1 text-xs font-bold uppercase text-amber-800 tracking-wider">
                    <Clock className="w-3.5 h-3.5" />
                    Tindakan Semakan Supervisor Diperlukan
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    Sahkan ketepatan timbangan sampel sebelum kelulusan rasmi
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Jika terdapat keraguan atau ralat, tolak batch berserta catatan. Jika data tepat, luluskan untuk dihantar kepada Pegawai.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                  <button
                    onClick={() => setShowRejectDialog(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition-colors"
                  >
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Reject Batch
                  </button>
                  <button
                    onClick={() => setShowApproveDialog(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Batch
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Approved Info Banner */}
          {isApproved && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-900 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold">Telah Diluluskan oleh: </span>
                  <span>{batch.approvedBy || 'Supervisor Makmal'}</span>
                  {batch.approvedAt && (
                    <span className="text-emerald-700 ml-1">
                      pada {new Date(batch.approvedAt).toLocaleString('ms-MY')}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[11px] font-semibold bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
                Audit Terkunci (Read-Only)
              </span>
            </div>
          )}

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Bil. Sampel
              </div>
              <div className="text-xl font-extrabold text-slate-900 mt-1">
                {summary.totalSamples}
              </div>
              <div className="text-[10px] text-slate-400">Unit sampel getah</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Jumlah Berat Basah
              </div>
              <div className="text-xl font-extrabold font-mono text-slate-900 mt-1">
                {summary.totalWetWeight.toFixed(2)} g
              </div>
              <div className="text-[10px] text-slate-400">Timbangan sebelum kering</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-center">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Jumlah Berat Kering
              </div>
              <div className="text-xl font-extrabold font-mono text-slate-900 mt-1">
                {summary.totalDryWeight.toFixed(2)} g
              </div>
              <div className="text-[10px] text-slate-400">Selepas dehidrasi ketuhar</div>
            </div>

            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-center">
              <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                Purata DRC Batch
              </div>
              <div className="text-2xl font-black font-mono text-emerald-900 mt-0.5">
                {summary.avgDRC.toFixed(2)}%
              </div>
              <div className="text-[10px] text-emerald-700">
                Min: {summary.minDRC.toFixed(1)}% | Max: {summary.maxDRC.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Quality Assessment Notice Banner */}
          <div
            className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between flex-wrap gap-2 ${
              isAllStandard
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2">
              {isAllStandard ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
              <div>
                <span className="font-bold">
                  {isAllStandard
                    ? 'Semua sampel dalam julat piawai industri:'
                    : `Perhatian Semakan: Terdapat ${outlierSamples.length} sampel luar julat piawai biasa:`}
                </span>{' '}
                <span>
                  {isAllStandard
                    ? 'Latex (28%–42%), Cup Lump (50%–65%), Unribbed Sheet (65%–78%).'
                    : 'Disyorkan untuk Supervisor menyemak bacaan bertanda Rendah atau Ekstrem sebelum meluluskan.'}
                </span>
              </div>
            </div>

            {!isAllStandard && (
              <span className="bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded-md text-[11px]">
                {outlierSamples.length} Anomali Dikesan
              </span>
            )}
          </div>

          {/* Full Samples Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100/70 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Jadual Butiran Setiap Sampel ({batch.samples.length} baris)
              </span>
              <span className="text-[11px] text-slate-500">
                Formula: DRC (%) = (Kering ÷ Basah) × 100
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12">#</th>
                    <th className="py-2.5 px-3">No. Sampel / Lot</th>
                    <th className="py-2.5 px-3">Nama Pembekal / Ladang</th>
                    <th className="py-2.5 px-3">Jenis Getah</th>
                    <th className="py-2.5 px-3 text-right">Berat Basah (g)</th>
                    <th className="py-2.5 px-3 text-right">Berat Kering (g)</th>
                    <th className="py-2.5 px-3 min-w-[150px] text-right">DRC (%) &amp; Tolok Kualiti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {batch.samples.map((s, idx) => (
                    <tr key={s.id || idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {s.sampleNo}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {s.supplierName}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                          {s.rubberType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {s.wetWeight.toFixed(2)} g
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {s.dryWeight.toFixed(2)} g
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <DRCGaugePill
                          drc={s.drcPercent}
                          rubberType={s.rubberType}
                          size="sm"
                          showGaugeBar={true}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Metadata Info */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-500 space-y-1">
            <div className="font-bold text-slate-700 mb-1">Audit Trail &amp; Rekod Sistem:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                Dicipta pada:{' '}
                <span className="text-slate-800 font-medium">
                  {new Date(batch.createdAt).toLocaleString('ms-MY')}
                </span>
              </div>
              <div>
                Kemaskini terakhir:{' '}
                <span className="text-slate-800 font-medium">
                  {new Date(batch.updatedAt).toLocaleString('ms-MY')}
                </span>
              </div>
              <div>
                Status semasa:{' '}
                <span className="text-slate-800 font-medium">{batch.status}</span>
              </div>
              {batch.approvedBy && (
                <div>
                  Pegawai Pelulus:{' '}
                  <span className="text-slate-800 font-medium">{batch.approvedBy}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {activeRole === 'Staf Makmal' && (isDraft || isRejected) && (
              <button
                onClick={() => onEdit(batch)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Edit className="w-3.5 h-3.5" />
                {isRejected ? 'Betulkan Batch (Resubmit)' : 'Sunting Draft'}
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>

      {/* Confirmation Modal: Approve */}
      {showApproveDialog && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-emerald-700 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Luluskan Batch {batch.batchCode}?
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Status batch akan bertukar kepada <strong>Approved</strong> dan dikunci daripada sebarang perubahan (BR-03). Satu laporan rasmi akan dijana dan disimulasikan penghantarannya melalui email kepada Pegawai (AC-03).
            </p>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Catatan Kelulusan (Pilihan):
              </label>
              <textarea
                rows={2}
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                placeholder="cth: Data timbangan telah disemak dan mematuhi julat standard DRC."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-800"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowApproveDialog(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmApprove}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
              >
                Sahkan &amp; Luluskan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Reject (Mandatory Note as per FR-004 & BR-04) */}
      {showRejectDialog && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-700 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <XCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Tolak Batch {batch.batchCode}?
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Batch akan ditukar status kepada <strong>Rejected</strong> dan dipulangkan kepada Staf Makmal untuk pembetulan. Berdasarkan syarat <strong>BR-04</strong>, anda <strong>wajib</strong> mengisi catatan sebab penolakan.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-rose-700 mb-1">
                Catatan Pembetulan (Wajib, min 5 aksara) <span className="text-rose-500">*</span>:
              </label>
              <textarea
                rows={3}
                value={rejectionNote}
                onChange={(e) => {
                  setRejectionNote(e.target.value);
                  if (rejectError) setRejectError(null);
                }}
                placeholder="cth: Sampel SMP-04 berat kering tidak munasabah (DRC 95%), sila timbang semula dan pastikan pengeringan sempurna."
                className="w-full p-2.5 rounded-xl border border-rose-300 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 bg-rose-50/20"
              />
              {rejectError && (
                <div className="text-[11px] text-rose-600 mt-1 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {rejectError}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectError(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-sm"
              >
                Tolak Batch Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
