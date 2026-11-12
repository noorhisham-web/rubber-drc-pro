import { DRCSample, DRCBatch } from '../types/drc';

/**
 * Calculates DRC percentage according to standard formula:
 * DRC (%) = (Berat Kering / Berat Basah) * 100
 */
export function calculateDRC(wetWeight: number, dryWeight: number): number | null {
  if (isNaN(wetWeight) || isNaN(dryWeight) || wetWeight <= 0 || dryWeight <= 0) {
    return null;
  }
  const val = (dryWeight / wetWeight) * 100;
  return Math.round(val * 100) / 100;
}

export interface BatchSummary {
  totalSamples: number;
  totalWetWeight: number;
  totalDryWeight: number;
  avgDRC: number;
  minDRC: number;
  maxDRC: number;
}

export function calculateBatchSummary(samples: DRCSample[]): BatchSummary {
  const validSamples = samples.filter(
    (s) => s.wetWeight > 0 && s.dryWeight > 0 && s.dryWeight <= s.wetWeight
  );

  if (validSamples.length === 0) {
    return {
      totalSamples: 0,
      totalWetWeight: 0,
      totalDryWeight: 0,
      avgDRC: 0,
      minDRC: 0,
      maxDRC: 0,
    };
  }

  const totalWetWeight = validSamples.reduce((sum, s) => sum + s.wetWeight, 0);
  const totalDryWeight = validSamples.reduce((sum, s) => sum + s.dryWeight, 0);
  
  // Mean of individual DRC percentages
  const drcList = validSamples.map((s) => s.drcPercent);
  const sumDRC = drcList.reduce((acc, v) => acc + v, 0);
  const avgDRC = Math.round((sumDRC / validSamples.length) * 100) / 100;
  const minDRC = Math.min(...drcList);
  const maxDRC = Math.max(...drcList);

  return {
    totalSamples: validSamples.length,
    totalWetWeight: Math.round(totalWetWeight * 100) / 100,
    totalDryWeight: Math.round(totalDryWeight * 100) / 100,
    avgDRC,
    minDRC,
    maxDRC,
  };
}

export interface RowValidationError {
  rowIdx: number;
  field: 'sampleNo' | 'supplierName' | 'rubberType' | 'wetWeight' | 'dryWeight';
  message: string;
}

/**
 * Validates a list of samples against business rules:
 * - BR-01: dryWeight <= wetWeight, both > 0
 * - BR-02: sampleNo unique within batch
 * - BR-05: ignores completely empty rows, blocks partially filled rows
 */
export function validateBatchSamples(
  samples: Array<{
    id?: string;
    sampleNo: string;
    supplierName: string;
    rubberType: string;
    wetWeight: string | number;
    dryWeight: string | number;
  }>
): {
  validSamples: DRCSample[];
  errors: RowValidationError[];
  hasEmptyIgnored: boolean;
} {
  const errors: RowValidationError[] = [];
  const validSamples: DRCSample[] = [];
  const seenSampleNos = new Set<string>();
  let hasEmptyIgnored = false;

  samples.forEach((row, idx) => {
    const sNo = (row.sampleNo || '').trim();
    const sup = (row.supplierName || '').trim();
    const rType = (row.rubberType || '').trim();
    const rawWet = row.wetWeight;
    const rawDry = row.dryWeight;

    const isEmpty =
      !sNo &&
      !sup &&
      (!rawWet || rawWet === '' || rawWet === 0) &&
      (!rawDry || rawDry === '' || rawDry === 0);

    if (isEmpty) {
      hasEmptyIgnored = true;
      return; // ignore completely empty row as per BR-05
    }

    // Check if partially filled
    if (!sNo) {
      errors.push({
        rowIdx: idx,
        field: 'sampleNo',
        message: 'No. Sampel / Lot diperlukan',
      });
    } else {
      const normalizedNo = sNo.toUpperCase();
      if (seenSampleNos.has(normalizedNo)) {
        errors.push({
          rowIdx: idx,
          field: 'sampleNo',
          message: `No. Sampel "${sNo}" telah wujud dalam batch ini (BR-02: Pendua dilarang)`,
        });
      } else {
        seenSampleNos.add(normalizedNo);
      }
    }

    if (!sup) {
      errors.push({
        rowIdx: idx,
        field: 'supplierName',
        message: 'Nama Pembekal / Ladang diperlukan',
      });
    }

    const wetVal = typeof rawWet === 'number' ? rawWet : parseFloat(String(rawWet));
    const dryVal = typeof rawDry === 'number' ? rawDry : parseFloat(String(rawDry));

    if (isNaN(wetVal) || wetVal <= 0) {
      errors.push({
        rowIdx: idx,
        field: 'wetWeight',
        message: 'Berat Basah mestilah nombor positif (> 0)',
      });
    }

    if (isNaN(dryVal) || dryVal <= 0) {
      errors.push({
        rowIdx: idx,
        field: 'dryWeight',
        message: 'Berat Kering mestilah nombor positif (> 0)',
      });
    } else if (!isNaN(wetVal) && dryVal > wetVal) {
      // BR-01
      errors.push({
        rowIdx: idx,
        field: 'dryWeight',
        message: 'Ralat BR-01: Berat Kering tidak boleh melebihi Berat Basah',
      });
    }

    if (
      sNo &&
      sup &&
      !isNaN(wetVal) &&
      wetVal > 0 &&
      !isNaN(dryVal) &&
      dryVal > 0 &&
      dryVal <= wetVal &&
      !seenSampleNos.has(sNo.toUpperCase() + '__DUPLICATE_FAILED')
    ) {
      const drc = calculateDRC(wetVal, dryVal) || 0;
      validSamples.push({
        id: row.id || `sample-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sampleNo: sNo,
        supplierName: sup,
        rubberType: (rType as any) || 'Latex',
        wetWeight: Math.round(wetVal * 100) / 100,
        dryWeight: Math.round(dryVal * 100) / 100,
        drcPercent: drc,
      });
    }
  });

  return { validSamples, errors, hasEmptyIgnored };
}

/**
 * Generates automated next batch code: BATCH-YYYYMMDD-01
 */
export function generateBatchCode(existingBatches: DRCBatch[]): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const datePrefix = `BATCH-${year}${month}${day}-`;

  const todaysBatches = existingBatches.filter((b) => b.batchCode?.startsWith(datePrefix));
  let maxSeq = 0;
  todaysBatches.forEach((b) => {
    const parts = b.batchCode.split('-');
    if (parts.length >= 3) {
      const seq = parseInt(parts[2], 10);
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq;
      }
    }
  });

  const nextSeq = String(maxSeq + 1).padStart(2, '0');
  return `${datePrefix}${nextSeq}`;
}
