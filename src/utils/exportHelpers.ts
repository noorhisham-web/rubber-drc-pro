import { DRCBatch } from '../types/drc';
import { calculateBatchSummary } from './drcCalculations';

/**
 * Exports batch data to CSV file with UTF-8 BOM encoding for seamless Microsoft Excel compatibility.
 */
export function exportBatchToCSV(batch: DRCBatch): void {
  const summary = calculateBatchSummary(batch.samples);

  const rows: string[][] = [];

  // Metadata headers
  rows.push(['LAPORAN RASMI PENGUJIAN DRY RUBBER CONTENT (DRC) - RUBBERDRC PRO']);
  rows.push(['Pusat Pengumpulan & Makmal Analisis Getah']);
  rows.push([]);
  rows.push(['No. Batch / Lot', batch.batchCode]);
  rows.push(['Tarikh Ujian', batch.testDate]);
  rows.push(['Status Batch', batch.status]);
  rows.push(['Operator / Staf Makmal', batch.operatorName || '-']);
  rows.push(['Tarikh Rekod Dibuat', new Date(batch.createdAt).toLocaleString('ms-MY')]);
  rows.push(['Diluluskan Oleh', batch.approvedBy || '-']);
  rows.push(['Tarikh Kelulusan', batch.approvedAt ? new Date(batch.approvedAt).toLocaleString('ms-MY') : '-']);
  if (batch.rejectionNote) {
    rows.push(['Catatan Supervisor (Penolakan)', `"${batch.rejectionNote.replace(/"/g, '""')}"`]);
  }
  rows.push([]);

  // Summary row
  rows.push(['RINGKASAN KESELURUHAN BATCH']);
  rows.push(['Jumlah Sampel', summary.totalSamples.toString()]);
  rows.push(['Jumlah Berat Basah (g)', summary.totalWetWeight.toFixed(2)]);
  rows.push(['Jumlah Berat Kering (g)', summary.totalDryWeight.toFixed(2)]);
  rows.push(['Purata DRC (%)', `${summary.avgDRC.toFixed(2)}%`]);
  rows.push(['DRC Minimum (%)', `${summary.minDRC.toFixed(2)}%`]);
  rows.push(['DRC Maksimum (%)', `${summary.maxDRC.toFixed(2)}%`]);
  rows.push([]);

  // Sample Table Header
  rows.push([
    'Bil',
    'No. Sampel / Lot',
    'Nama Pembekal / Ladang',
    'Jenis Getah',
    'Berat Basah (g)',
    'Berat Kering (g)',
    'DRC (%)',
  ]);

  // Sample rows
  batch.samples.forEach((sample, idx) => {
    rows.push([
      (idx + 1).toString(),
      `"${sample.sampleNo.replace(/"/g, '""')}"`,
      `"${sample.supplierName.replace(/"/g, '""')}"`,
      sample.rubberType,
      sample.wetWeight.toFixed(2),
      sample.dryWeight.toFixed(2),
      sample.drcPercent.toFixed(2),
    ]);
  });

  // Convert to CSV string with comma separation
  const csvContent = rows.map((r) => r.join(',')).join('\r\n');

  // Prepend UTF-8 BOM (\uFEFF)
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanCode = batch.batchCode.replace(/[^a-zA-Z0-9-_]/g, '_');
  link.setAttribute('download', `RubberDRC_${cleanCode}_${batch.testDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
