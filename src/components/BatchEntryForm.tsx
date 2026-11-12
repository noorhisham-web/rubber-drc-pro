import React, { useState, useEffect, useRef } from 'react';
import { DRCBatch, DRCSample, RubberType } from '../types/drc';
import {
  calculateDRC,
  calculateBatchSummary,
  validateBatchSamples,
  RowValidationError,
} from '../utils/drcCalculations';
import {
  Plus,
  Trash2,
  AlertTriangle,
  Send,
  Save,
  ArrowLeft,
  Check,
  Info,
  Calendar,
  User,
  Hash,
  Sparkles,
  Scale,
  SlidersHorizontal,
} from 'lucide-react';
import { DRCGaugePill } from './DRCGaugePill';

interface BatchEntryFormProps {
  initialBatch?: DRCBatch | null;
  knownSuppliers: string[];
  suggestedBatchCode: string;
  onSaveDraft: (batch: DRCBatch) => void;
  onSubmitForApproval: (batch: DRCBatch, isResubmit: boolean) => void;
  onCancel: () => void;
}

interface EditableRow {
  id: string;
  sampleNo: string;
  supplierName: string;
  rubberType: RubberType;
  wetWeight: string;
  dryWeight: string;
}

export const BatchEntryForm: React.FC<BatchEntryFormProps> = ({
  initialBatch,
  knownSuppliers,
  suggestedBatchCode,
  onSaveDraft,
  onSubmitForApproval,
  onCancel,
}) => {
  const isEditing = Boolean(initialBatch);
  const isResubmitting = initialBatch?.status === 'Rejected';

  const [batchCode, setBatchCode] = useState(initialBatch?.batchCode || suggestedBatchCode);
  const [testDate, setTestDate] = useState(
    initialBatch?.testDate || new Date().toISOString().split('T')[0]
  );
  const [operatorName, setOperatorName] = useState(
    initialBatch?.operatorName || 'Siti Aminah binti Yusof (Staf Makmal)'
  );

  // Convert initial samples to editable rows
  const [rows, setRows] = useState<EditableRow[]>(() => {
    if (initialBatch && initialBatch.samples.length > 0) {
      return initialBatch.samples.map((s) => ({
        id: s.id,
        sampleNo: s.sampleNo,
        supplierName: s.supplierName,
        rubberType: s.rubberType,
        wetWeight: s.wetWeight.toString(),
        dryWeight: s.dryWeight.toString(),
      }));
    }
    // Default initial 5 blank rows
    return Array.from({ length: 5 }, (_, i) => ({
      id: `row-${Date.now()}-${i}`,
      sampleNo: `SMP-${String(i + 1).padStart(2, '0')}`,
      supplierName: '',
      rubberType: 'Latex' as RubberType,
      wetWeight: '',
      dryWeight: '',
    }));
  });

  const [errors, setErrors] = useState<RowValidationError[]>([]);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Auto-Tare Weight Calculator State (UX Enhancement #4)
  const [useTareMode, setUseTareMode] = useState<boolean>(false);
  const [tarePreset, setTarePreset] = useState<'aluminium' | 'petri' | 'bowl' | 'custom'>('aluminium');
  const [tareWetWeight, setTareWetWeight] = useState<number>(10.0);
  const [tareDryWeight, setTareDryWeight] = useState<number>(10.0);
  const [isLinkedTare, setIsLinkedTare] = useState<boolean>(true);

  const handleSelectPreset = (preset: 'aluminium' | 'petri' | 'bowl' | 'custom') => {
    setTarePreset(preset);
    if (preset === 'aluminium') {
      setTareWetWeight(10.0);
      setTareDryWeight(10.0);
    } else if (preset === 'petri') {
      setTareWetWeight(18.5);
      setTareDryWeight(18.5);
    } else if (preset === 'bowl') {
      setTareWetWeight(12.0);
      setTareDryWeight(12.0);
    }
  };

  const effectiveTareWet = useTareMode ? Math.max(0, tareWetWeight || 0) : 0;
  const effectiveTareDry = useTareMode
    ? Math.max(0, (isLinkedTare ? tareWetWeight : tareDryWeight) || 0)
    : 0;

  // Helper to compute net weights for any row given raw input strings
  const computeRowNetWeights = (rawWet: string, rawDry: string) => {
    const grossWet = parseFloat(rawWet);
    const grossDry = parseFloat(rawDry);

    const hasWet = !isNaN(grossWet) && rawWet.trim() !== '';
    const hasDry = !isNaN(grossDry) && rawDry.trim() !== '';

    const isWetBelowTare = hasWet && useTareMode && grossWet <= effectiveTareWet;
    const isDryBelowTare = hasDry && useTareMode && grossDry <= effectiveTareDry;

    const netWet = hasWet
      ? Math.max(0, Math.round((grossWet - effectiveTareWet) * 100) / 100)
      : 0;
    const netDry = hasDry
      ? Math.max(0, Math.round((grossDry - effectiveTareDry) * 100) / 100)
      : 0;

    return {
      grossWet: hasWet ? grossWet : 0,
      grossDry: hasDry ? grossDry : 0,
      netWet,
      netDry,
      hasWet,
      hasDry,
      isWetBelowTare,
      isDryBelowTare,
    };
  };

  // Add 1 row
  const handleAddOneRow = () => {
    const nextIdx = rows.length + 1;
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sampleNo: `SMP-${String(nextIdx).padStart(2, '0')}`,
        supplierName: '',
        rubberType: 'Latex',
        wetWeight: '',
        dryWeight: '',
      },
    ]);
  };

  // Add 5 rows
  const handleAddFiveRows = () => {
    const startIdx = rows.length + 1;
    const newRows: EditableRow[] = Array.from({ length: 5 }, (_, i) => ({
      id: `row-${Date.now()}-${startIdx + i}-${Math.random().toString(36).substring(2, 6)}`,
      sampleNo: `SMP-${String(startIdx + i).padStart(2, '0')}`,
      supplierName: '',
      rubberType: 'Latex',
      wetWeight: '',
      dryWeight: '',
    }));
    setRows((prev) => [...prev, ...newRows]);
  };

  // Delete row (minimum 1)
  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) {
      alert('Sekurang-kurangnya 1 baris sampel mesti kekal dalam jadual.');
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRowChange = (id: string, field: keyof EditableRow, value: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  // Real-time calculation summary of currently filled rows (computed on Net weights)
  const liveSummary = React.useMemo(() => {
    const tempSamples: DRCSample[] = [];
    rows.forEach((r) => {
      const calc = computeRowNetWeights(r.wetWeight, r.dryWeight);
      if (
        calc.hasWet &&
        calc.hasDry &&
        !calc.isWetBelowTare &&
        !calc.isDryBelowTare &&
        calc.netWet > 0 &&
        calc.netDry > 0 &&
        calc.netDry <= calc.netWet
      ) {
        tempSamples.push({
          id: r.id,
          sampleNo: r.sampleNo,
          supplierName: r.supplierName,
          rubberType: r.rubberType,
          wetWeight: calc.netWet,
          dryWeight: calc.netDry,
          drcPercent: calculateDRC(calc.netWet, calc.netDry) || 0,
        });
      }
    });
    return calculateBatchSummary(tempSamples);
  }, [rows, useTareMode, effectiveTareWet, effectiveTareDry]);

  const totalGrossWet = React.useMemo(() => {
    return rows.reduce((acc, r) => {
      const v = parseFloat(r.wetWeight);
      return acc + (isNaN(v) ? 0 : v);
    }, 0);
  }, [rows]);

  const totalGrossDry = React.useMemo(() => {
    return rows.reduce((acc, r) => {
      const v = parseFloat(r.dryWeight);
      return acc + (isNaN(v) ? 0 : v);
    }, 0);
  }, [rows]);

  // Handle Save as Draft
  const handleSaveDraft = () => {
    setGeneralError(null);
    if (!batchCode.trim()) {
      setGeneralError('Sila masukkan No. Batch / Kod Lot.');
      return;
    }

    // Convert rows to DRCSample using Net weights
    const samples: DRCSample[] = rows
      .filter((r) => r.sampleNo.trim() || r.supplierName.trim() || r.wetWeight || r.dryWeight)
      .map((r, idx) => {
        const calc = computeRowNetWeights(r.wetWeight, r.dryWeight);
        return {
          id: r.id || `s-${idx}`,
          sampleNo: r.sampleNo.trim() || `SMP-${idx + 1}`,
          supplierName: r.supplierName.trim() || '-',
          rubberType: r.rubberType,
          wetWeight: calc.netWet,
          dryWeight: calc.netDry,
          drcPercent: calculateDRC(calc.netWet, calc.netDry) || 0,
        };
      });

    const now = new Date().toISOString();
    const batchData: DRCBatch = {
      id: initialBatch?.id || `batch-${Date.now()}`,
      batchCode: batchCode.trim(),
      testDate,
      operatorName: operatorName.trim() || 'Staf Makmal',
      status: 'Draft',
      rejectionNote: initialBatch?.rejectionNote || null,
      createdAt: initialBatch?.createdAt || now,
      updatedAt: now,
      approvedAt: null,
      approvedBy: null,
      samples,
    };

    onSaveDraft(batchData);
  };

  // Handle Submit for Approval
  const handleSubmit = () => {
    setSubmitAttempted(true);
    setGeneralError(null);

    if (!batchCode.trim()) {
      setGeneralError('No. Batch diperlukan.');
      return;
    }
    if (!testDate) {
      setGeneralError('Tarikh Ujian diperlukan.');
      return;
    }

    // Map rows using calculated Net weights for validation
    const mappedRowsForValidation = rows.map((r) => {
      const calc = computeRowNetWeights(r.wetWeight, r.dryWeight);
      return {
        id: r.id,
        sampleNo: r.sampleNo,
        supplierName: r.supplierName,
        rubberType: r.rubberType,
        wetWeight: calc.hasWet ? (calc.isWetBelowTare ? 0 : calc.netWet) : '',
        dryWeight: calc.hasDry ? (calc.isDryBelowTare ? 0 : calc.netDry) : '',
      };
    });

    // Validate rows according to BR-01, BR-02, BR-05
    const validation = validateBatchSamples(mappedRowsForValidation);

    // If tare mode is active, check tare violations
    if (useTareMode) {
      rows.forEach((r, idx) => {
        const calc = computeRowNetWeights(r.wetWeight, r.dryWeight);
        if (calc.isWetBelowTare) {
          validation.errors.push({
            rowIdx: idx,
            field: 'wetWeight',
            message: `Timbangan kasar mesti melebihi berat bekas (${effectiveTareWet}g)`,
          });
        }
        if (calc.isDryBelowTare) {
          validation.errors.push({
            rowIdx: idx,
            field: 'dryWeight',
            message: `Timbangan kasar kering mesti melebihi berat bekas (${effectiveTareDry}g)`,
          });
        }
      });
    }

    setErrors(validation.errors);

    if (validation.errors.length > 0) {
      setGeneralError(
        `Terdapat ${validation.errors.length} ralat pada jadual sampel. Sila periksa sel yang ditandakan merah sebelum menghantar.`
      );
      return;
    }

    if (validation.validSamples.length === 0) {
      setGeneralError('Sila masukkan sekurang-kurangnya 1 sampel yang lengkap sebelum menghantar.');
      return;
    }

    const now = new Date().toISOString();
    const batchData: DRCBatch = {
      id: initialBatch?.id || `batch-${Date.now()}`,
      batchCode: batchCode.trim(),
      testDate,
      operatorName: operatorName.trim() || 'Staf Makmal',
      status: 'Pending Approval',
      rejectionNote: null, // cleared upon resubmission
      createdAt: initialBatch?.createdAt || now,
      updatedAt: now,
      approvedAt: null,
      approvedBy: null,
      samples: validation.validSamples,
    };

    onSubmitForApproval(batchData, isResubmitting);
  };

  // Helper to check if a specific cell has an error
  const getCellError = (rowIdx: number, field: string) => {
    if (!submitAttempted) return null;
    return errors.find((e) => e.rowIdx === rowIdx && e.field === field)?.message || null;
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in">
      {/* Top action bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Senarai
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            <Save className="w-4 h-4" />
            Simpan Draft
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
            {isResubmitting ? 'Hantar Semula (Resubmit)' : 'Hantar untuk Kelulusan'}
          </button>
        </div>
      </div>

      {/* If this batch was rejected by Supervisor, show prominent alert banner */}
      {isResubmitting && initialBatch?.rejectionNote && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-5 text-rose-900 shadow-sm animate-in shake">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                Catatan Penolakan oleh Supervisor:
              </div>
              <p className="text-sm font-semibold mt-1 text-rose-950">
                &ldquo;{initialBatch.rejectionNote}&rdquo;
              </p>
              <div className="text-xs text-rose-700 mt-2">
                Sila betulkan angka timbangan atau maklumat sampel yang dinyatakan di atas, kemudian klik butang <strong>&ldquo;Hantar Semula (Resubmit)&rdquo;</strong> untuk disemak kembali oleh Supervisor.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Batch Metadata Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Hash className="w-4 h-4 text-emerald-700" />
          Maklumat Kumpulan Sampel (Batch Header)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Batch Code */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              No. Batch / Kod Lot <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                placeholder="cth: BATCH-20261112-01"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Dijana automatik mengikut tarikh hari ini.</p>
          </div>

          {/* Test Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tarikh Ujian Makmal <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Tarikh sampel getah ditimbang dan dikeringkan.</p>
          </div>

          {/* Operator Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nama Operator / Staf Makmal
            </label>
            <div className="relative">
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                placeholder="Nama staf bertugas"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Pegawai yang mengendalikan pengujian ini.</p>
          </div>
        </div>
      </div>

      {/* Datalist for autocomplete supplier names */}
      <datalist id="supplier-suggestions">
        {knownSuppliers.map((name, i) => (
          <option key={i} value={name} />
        ))}
      </datalist>

      {/* Auto-Tare Weight Calculator Panel (UX Enhancement #4) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Kalkulator Tolak Berat Bekas (Auto-Tare Weight Mode)
                </h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                  Ciri Makmal Pintar
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Masukkan bacaan timbangan kasar terus daripada alat penimbang tanpa perlu kalkulator manual.
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="text-xs font-semibold text-slate-600">
              {useTareMode ? 'Mod Bekas Aktif' : 'Nyahaktif'}
            </span>
            <button
              type="button"
              onClick={() => setUseTareMode(!useTareMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                useTareMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  useTareMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Detailed Tare Settings when Mode is Active */}
        {useTareMode && (
          <div className="mt-4 pt-4 border-t border-slate-200 animate-in fade-in space-y-3">
            {/* Presets */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                Pilihan Jenis Bekas:
              </span>
              <button
                type="button"
                onClick={() => handleSelectPreset('aluminium')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  tarePreset === 'aluminium'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Piring Aluminium (10.00g)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('petri')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  tarePreset === 'petri'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Piring Petri Kaca (18.50g)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('bowl')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  tarePreset === 'bowl'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Mangkuk Dehidrasi (12.00g)
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('custom')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  tarePreset === 'custom'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tersuai (Custom)
              </button>
            </div>

            {/* Custom Inputs */}
            <div className="flex items-center flex-wrap gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <label className="font-semibold text-slate-700">
                  {isLinkedTare ? 'Berat Bekas Tetap (Tare):' : 'Bekas Basah:'}
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={tareWetWeight}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value) || 0;
                      setTareWetWeight(v);
                      if (isLinkedTare) setTareDryWeight(v);
                      setTarePreset('custom');
                    }}
                    className="w-20 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-slate-800 text-right bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="ml-1 text-slate-500 font-medium">g</span>
                </div>
              </div>

              {!isLinkedTare && (
                <div className="flex items-center gap-2">
                  <label className="font-semibold text-slate-700">Bekas Kering:</label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={tareDryWeight}
                      onChange={(e) => {
                        setTareDryWeight(parseFloat(e.target.value) || 0);
                        setTarePreset('custom');
                      }}
                      className="w-20 px-2 py-1 rounded-lg border border-slate-300 font-mono font-bold text-slate-800 text-right bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="ml-1 text-slate-500 font-medium">g</span>
                  </div>
                </div>
              )}

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={isLinkedTare}
                  onChange={(e) => {
                    setIsLinkedTare(e.target.checked);
                    if (e.target.checked) setTareDryWeight(tareWetWeight);
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Gunakan berat bekas yang sama untuk basah &amp; kering</span>
              </label>

              <div className="text-[11px] text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-md ml-auto font-medium">
                Formula Bersih: <strong>Berat Bersih = Timbangan Kasar - {effectiveTareWet.toFixed(2)}g</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Entry Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Jadual Kemasukan Pukal (Bulk Batch Entry)
            </h3>
            <p className="text-xs text-slate-500">
              Gunakan kekunci <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-mono font-bold">Tab</kbd> untuk berpindah antara sel dengan pantas. Pengiraan DRC dipaparkan serta-merta.
            </p>
          </div>

          {/* Quick Add Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddOneRow}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold border border-emerald-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              +1 Baris
            </button>
            <button
              type="button"
              onClick={handleAddFiveRows}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              +5 Baris Sekaligus
            </button>
          </div>
        </div>

        {/* Visual Standard Quality Baseline Legend */}
        <div className="px-4 py-2 bg-emerald-950 text-white text-[11px] flex items-center justify-between flex-wrap gap-2 border-b border-emerald-800">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Piawaian Julat Normal DRC (LGM):</span>
          </div>
          <div className="flex items-center gap-3 text-slate-200 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <strong>Latex:</strong> 28% – 42%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <strong>Cup Lump:</strong> 50% – 65%
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <strong>Unribbed Sheet:</strong> 65% – 78%
            </span>
            <span className="text-emerald-400 text-[10px] hidden sm:inline">
              (Tolok visual automatik dipaparkan pada setiap baris)
            </span>
          </div>
        </div>

        {/* The Interactive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3 w-36">
                  No. Sampel / Lot <span className="text-rose-500">*</span>
                </th>
                <th className="py-2.5 px-3 min-w-[190px]">
                  Nama Pembekal / Ladang <span className="text-rose-500">*</span>
                </th>
                <th className="py-2.5 px-3 w-36">
                  Jenis Getah <span className="text-rose-500">*</span>
                </th>
                <th className="py-2.5 px-3 w-32 text-right">
                  <div>Berat Basah (g) <span className="text-rose-500">*</span></div>
                  {useTareMode && (
                    <div className="text-[10px] text-emerald-700 lowercase font-normal tracking-normal">
                      [Kasar - {effectiveTareWet.toFixed(2)}g]
                    </div>
                  )}
                </th>
                <th className="py-2.5 px-3 w-32 text-right">
                  <div>Berat Kering (g) <span className="text-rose-500">*</span></div>
                  {useTareMode && (
                    <div className="text-[10px] text-emerald-700 lowercase font-normal tracking-normal">
                      [Kasar - {effectiveTareDry.toFixed(2)}g]
                    </div>
                  )}
                </th>
                <th className="py-2.5 px-3 min-w-[150px] text-right">
                  DRC (%) &amp; Tolok Kualiti
                </th>
                <th className="py-2.5 px-3 w-12 text-center">Padam</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, idx) => {
                const sampleNoErr = getCellError(idx, 'sampleNo');
                const supplierErr = getCellError(idx, 'supplierName');
                const wetErr = getCellError(idx, 'wetWeight');
                const dryErr = getCellError(idx, 'dryWeight');

                const calc = computeRowNetWeights(row.wetWeight, row.dryWeight);
                const isDryExceeded =
                  calc.hasWet &&
                  calc.hasDry &&
                  !calc.isWetBelowTare &&
                  !calc.isDryBelowTare &&
                  calc.netDry > calc.netWet;
                const drc =
                  calc.netWet > 0 && calc.netDry > 0 && calc.netDry <= calc.netWet
                    ? calculateDRC(calc.netWet, calc.netDry)
                    : null;

                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isDryExceeded ||
                      sampleNoErr ||
                      supplierErr ||
                      wetErr ||
                      dryErr ||
                      calc.isWetBelowTare ||
                      calc.isDryBelowTare
                        ? 'bg-rose-50/30'
                        : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-2 px-3 text-center font-mono text-slate-400 font-medium">
                      {idx + 1}
                    </td>

                    {/* No. Sampel / Lot */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.sampleNo}
                        onChange={(e) => handleRowChange(row.id, 'sampleNo', e.target.value)}
                        placeholder={`SMP-${String(idx + 1).padStart(2, '0')}`}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          sampleNoErr
                            ? 'border-rose-400 bg-rose-50/50 text-rose-900 ring-1 ring-rose-300'
                            : 'border-slate-200 text-slate-800'
                        }`}
                      />
                      {sampleNoErr && (
                        <div className="text-[10px] text-rose-600 mt-0.5 leading-tight">{sampleNoErr}</div>
                      )}
                    </td>

                    {/* Nama Pembekal / Ladang */}
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        list="supplier-suggestions"
                        value={row.supplierName}
                        onChange={(e) => handleRowChange(row.id, 'supplierName', e.target.value)}
                        placeholder="Cth: Pak Mat Kampung Changkat"
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          supplierErr
                            ? 'border-rose-400 bg-rose-50/50 text-rose-900 ring-1 ring-rose-300'
                            : 'border-slate-200 text-slate-800'
                        }`}
                      />
                      {supplierErr && (
                        <div className="text-[10px] text-rose-600 mt-0.5 leading-tight">{supplierErr}</div>
                      )}
                    </td>

                    {/* Jenis Getah */}
                    <td className="py-2 px-3">
                      <select
                        value={row.rubberType}
                        onChange={(e) =>
                          handleRowChange(row.id, 'rubberType', e.target.value as RubberType)
                        }
                        className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700 bg-white"
                      >
                        <option value="Latex">Latex</option>
                        <option value="Cup Lump">Cup Lump</option>
                        <option value="Unribbed Sheet">Unribbed Sheet</option>
                        <option value="Lain-lain">Lain-lain</option>
                      </select>
                    </td>

                    {/* Berat Basah (g) */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={row.wetWeight}
                        onChange={(e) => handleRowChange(row.id, 'wetWeight', e.target.value)}
                        placeholder="0.00"
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          wetErr || calc.isWetBelowTare
                            ? 'border-rose-400 bg-rose-50/50 text-rose-900 ring-1 ring-rose-300'
                            : 'border-slate-200 text-slate-800'
                        }`}
                      />
                      {useTareMode && calc.hasWet && !calc.isWetBelowTare && (
                        <div className="text-[10px] text-emerald-700 font-mono font-semibold mt-0.5 text-right">
                          Bersih: {calc.netWet.toFixed(2)}g
                        </div>
                      )}
                      {calc.isWetBelowTare && (
                        <div className="text-[10px] text-rose-600 font-semibold mt-0.5 text-right leading-tight">
                          Timbangan ≤ Bekas ({effectiveTareWet}g)
                        </div>
                      )}
                      {wetErr && !calc.isWetBelowTare && (
                        <div className="text-[10px] text-rose-600 mt-0.5 text-right leading-tight">
                          {wetErr}
                        </div>
                      )}
                    </td>

                    {/* Berat Kering (g) */}
                    <td className="py-2 px-3 text-right">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={row.dryWeight}
                        onChange={(e) => handleRowChange(row.id, 'dryWeight', e.target.value)}
                        placeholder="0.00"
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-xs font-mono text-right focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                          isDryExceeded || dryErr || calc.isDryBelowTare
                            ? 'border-rose-400 bg-rose-50/50 text-rose-900 ring-1 ring-rose-300'
                            : 'border-slate-200 text-slate-800'
                        }`}
                      />
                      {useTareMode && calc.hasDry && !calc.isDryBelowTare && (
                        <div className="text-[10px] text-emerald-700 font-mono font-semibold mt-0.5 text-right">
                          Bersih: {calc.netDry.toFixed(2)}g
                        </div>
                      )}
                      {calc.isDryBelowTare && (
                        <div className="text-[10px] text-rose-600 font-semibold mt-0.5 text-right leading-tight">
                          Timbangan ≤ Bekas ({effectiveTareDry}g)
                        </div>
                      )}
                      {isDryExceeded && (
                        <div className="text-[10px] text-rose-600 font-semibold mt-0.5 text-right leading-tight">
                          Ralat: Kering &gt; Basah
                        </div>
                      )}
                      {!isDryExceeded && dryErr && !calc.isDryBelowTare && (
                        <div className="text-[10px] text-rose-600 mt-0.5 text-right leading-tight">
                          {dryErr}
                        </div>
                      )}
                    </td>

                    {/* DRC (%) Auto Calculated with Visual Quality Gauge */}
                    <td className="py-2 px-3 text-right whitespace-nowrap">
                      {isDryExceeded ? (
                        <span className="text-rose-600 bg-rose-100 border border-rose-300 font-mono font-bold px-2 py-0.5 rounded text-[11px] inline-block">
                          Ralat: Kering &gt; Basah
                        </span>
                      ) : (
                        <DRCGaugePill
                          drc={drc}
                          rubberType={row.rubberType}
                          size="sm"
                          showGaugeBar={true}
                        />
                      )}
                    </td>

                    {/* Delete row */}
                    <td className="py-2 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        disabled={rows.length <= 1}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Padam Baris Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Table Live Summary Footer */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-semibold text-slate-800 text-xs">
              <tr>
                <td colSpan={4} className="py-3 px-3 text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>Jumlah Sampel Sah:</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                      {liveSummary.totalSamples} daripada {rows.length}
                    </span>
                    {useTareMode && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                        Ditapis Tolak Bekas ({effectiveTareWet}g)
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {useTareMode ? (
                    <div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        Kasar: {totalGrossWet.toFixed(2)}g
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        Bersih: {liveSummary.totalWetWeight.toFixed(2)} g
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] text-slate-400 font-normal">Jumlah Basah</div>
                      {liveSummary.totalWetWeight.toFixed(2)} g
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  {useTareMode ? (
                    <div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        Kasar: {totalGrossDry.toFixed(2)}g
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        Bersih: {liveSummary.totalDryWeight.toFixed(2)} g
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[10px] text-slate-400 font-normal">Jumlah Kering</div>
                      {liveSummary.totalDryWeight.toFixed(2)} g
                    </div>
                  )}
                </td>
                <td className="py-3 px-3 text-right font-mono">
                  <div className="text-[10px] text-slate-400 font-normal">Purata DRC</div>
                  <span className="text-emerald-800 font-bold text-sm bg-emerald-100 px-2 py-0.5 rounded">
                    {liveSummary.avgDRC.toFixed(2)}%
                  </span>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* General validation error banner */}
      {generalError && (
        <div className="bg-rose-50 border border-rose-300 rounded-xl p-4 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{generalError}</span>
        </div>
      )}

      {/* Action Bar Bottom */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800"
        >
          Batalkan perubahan
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            Simpan Draft
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            {isResubmitting ? 'Hantar Semula (Resubmit)' : 'Hantar untuk Kelulusan'}
          </button>
        </div>
      </div>
    </div>
  );
};
