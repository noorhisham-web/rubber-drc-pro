import React from 'react';
import { DRCBatch } from '../types/drc';
import { calculateBatchSummary } from '../utils/drcCalculations';

interface PrintViewProps {
  batch: DRCBatch | null;
}

export const PrintView: React.FC<PrintViewProps> = ({ batch }) => {
  if (!batch) return null;

  const summary = calculateBatchSummary(batch.samples);

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans text-xs">
      {/* Official Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-wider text-black">
              PUSAT PENGUMPULAN &amp; MAKMAL ANALISIS GETAH
            </h1>
            <p className="text-xs text-gray-700 mt-0.5">
              LEMBAGA GETAH MALAYSIA (LGM) — CAWANGAN OPERASI MAKMAL KAWALAN MUTU
            </p>
            <p className="text-[11px] text-gray-600">
              Dokumen ini ialah perakuan rasmi keputusan ujian peratusan kandungan getah kering (Dry Rubber Content).
            </p>
          </div>
          <div className="text-right">
            <div className="border border-black px-3 py-1 font-mono font-bold text-sm inline-block">
              {batch.batchCode}
            </div>
            <div className="text-[10px] text-gray-500 mt-1">
              Dicetak pada: {new Date().toLocaleString('ms-MY')}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Title */}
      <div className="text-center my-4">
        <h2 className="text-base font-extrabold uppercase tracking-wide underline">
          SIJIL KEPUTUSAN ANALISIS DRY RUBBER CONTENT (DRC)
        </h2>
        <div className="text-xs font-semibold text-gray-800 mt-1">
          Status Perakuan: <span className="uppercase font-bold">{batch.status}</span>
        </div>
      </div>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4 border border-gray-400 p-3 mb-6 bg-gray-50/50">
        <div>
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="font-semibold text-gray-600 py-0.5 w-36">No. Batch / Lot:</td>
                <td className="font-bold font-mono">{batch.batchCode}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-600 py-0.5">Tarikh Ujian:</td>
                <td className="font-semibold">{batch.testDate}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-600 py-0.5">Disediakan Oleh:</td>
                <td>{batch.operatorName || 'Staf Makmal'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <table className="w-full text-xs">
            <tbody>
              <tr>
                <td className="font-semibold text-gray-600 py-0.5 w-36">Pegawai Pelulus:</td>
                <td className="font-semibold">{batch.approvedBy || 'Belum diluluskan'}</td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-600 py-0.5">Tarikh Kelulusan:</td>
                <td>
                  {batch.approvedAt
                    ? new Date(batch.approvedAt).toLocaleString('ms-MY')
                    : '—'}
                </td>
              </tr>
              <tr>
                <td className="font-semibold text-gray-600 py-0.5">Bilangan Sampel:</td>
                <td className="font-bold">{summary.totalSamples} sampel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Box */}
      <div className="mb-6 border border-black p-3 bg-gray-100">
        <div className="font-bold text-xs uppercase mb-2 border-b border-gray-400 pb-1">
          Ringkasan Ujian Makmal
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-[10px] text-gray-600 uppercase">Jumlah Basah</div>
            <div className="font-bold font-mono text-sm">{summary.totalWetWeight.toFixed(2)} g</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-600 uppercase">Jumlah Kering</div>
            <div className="font-bold font-mono text-sm">{summary.totalDryWeight.toFixed(2)} g</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-600 uppercase">Julat DRC (Min - Max)</div>
            <div className="font-bold font-mono text-xs">
              {summary.minDRC.toFixed(2)}% - {summary.maxDRC.toFixed(2)}%
            </div>
          </div>
          <div>
            <div className="text-[10px] text-gray-600 uppercase font-bold">PURATA DRC BATCH</div>
            <div className="font-extrabold font-mono text-base text-black underline">
              {summary.avgDRC.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Samples Table */}
      <div className="mb-8">
        <div className="font-bold text-xs uppercase mb-2">
          Jadual Pengiraan Penuh Sampel Getah
        </div>
        <table className="w-full text-left text-xs border border-collapse border-black">
          <thead>
            <tr className="bg-gray-200 border-b border-black text-[11px] uppercase font-bold">
              <th className="border border-black p-1.5 text-center w-8">Bil</th>
              <th className="border border-black p-1.5">No. Sampel / Lot</th>
              <th className="border border-black p-1.5">Nama Pembekal / Ladang</th>
              <th className="border border-black p-1.5">Jenis Getah</th>
              <th className="border border-black p-1.5 text-right">Berat Basah (g)</th>
              <th className="border border-black p-1.5 text-right">Berat Kering (g)</th>
              <th className="border border-black p-1.5 text-right">DRC (%)</th>
            </tr>
          </thead>
          <tbody>
            {batch.samples.map((s, idx) => (
              <tr key={s.id || idx} className="border-b border-gray-400">
                <td className="border border-black p-1.5 text-center font-mono">{idx + 1}</td>
                <td className="border border-black p-1.5 font-mono font-bold">{s.sampleNo}</td>
                <td className="border border-black p-1.5">{s.supplierName}</td>
                <td className="border border-black p-1.5">{s.rubberType}</td>
                <td className="border border-black p-1.5 text-right font-mono">
                  {s.wetWeight.toFixed(2)}
                </td>
                <td className="border border-black p-1.5 text-right font-mono">
                  {s.dryWeight.toFixed(2)}
                </td>
                <td className="border border-black p-1.5 text-right font-mono font-bold">
                  {s.drcPercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-bold border-t-2 border-black">
              <td colSpan={4} className="border border-black p-1.5 text-right">
                Jumlah Keseluruhan &amp; Purata:
              </td>
              <td className="border border-black p-1.5 text-right font-mono">
                {summary.totalWetWeight.toFixed(2)} g
              </td>
              <td className="border border-black p-1.5 text-right font-mono">
                {summary.totalDryWeight.toFixed(2)} g
              </td>
              <td className="border border-black p-1.5 text-right font-mono text-sm underline">
                {summary.avgDRC.toFixed(2)}%
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Signature & Endorsement Block */}
      <div className="grid grid-cols-3 gap-6 pt-8 mt-12 border-t border-gray-300">
        <div className="text-center">
          <div className="h-16 border-b border-gray-400 mb-2"></div>
          <div className="font-bold text-xs uppercase">{batch.operatorName || 'Staf Makmal'}</div>
          <div className="text-[11px] text-gray-500">Disediakan Oleh (Juruanalisis Makmal)</div>
        </div>

        <div className="text-center">
          <div className="h-16 border-b border-gray-400 mb-2"></div>
          <div className="font-bold text-xs uppercase">{batch.approvedBy || 'Supervisor Makmal'}</div>
          <div className="text-[11px] text-gray-500">Disemak &amp; Diluluskan Oleh (Penyelia)</div>
        </div>

        <div className="text-center">
          <div className="h-16 border-b border-gray-400 mb-2"></div>
          <div className="font-bold text-xs uppercase">Pegawai Pengurusan Mutu</div>
          <div className="text-[11px] text-gray-500">Diterima &amp; Diarkibkan</div>
        </div>
      </div>
    </div>
  );
};
