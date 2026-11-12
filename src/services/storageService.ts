import { DRCBatch, SimulatedEmail } from '../types/drc';
import { calculateBatchSummary } from '../utils/drcCalculations';

const BATCHES_STORAGE_KEY = 'rubber_drc_batches_v1';
const EMAILS_STORAGE_KEY = 'rubber_drc_emails_v1';
const CURRENT_ROLE_KEY = 'rubber_drc_active_role_v1';

export const INITIAL_BATCHES: DRCBatch[] = [
  {
    id: 'batch-001',
    batchCode: 'BATCH-20261111-01',
    testDate: '2026-11-11',
    operatorName: 'Siti Aminah binti Yusof (Staf Makmal)',
    status: 'Approved',
    rejectionNote: null,
    createdAt: '2026-11-11T09:15:00.000Z',
    updatedAt: '2026-11-11T16:30:00.000Z',
    approvedAt: '2026-11-11T16:30:00.000Z',
    approvedBy: 'En. Razak bin Othman (Supervisor Makmal)',
    samples: [
      {
        id: 's-101',
        sampleNo: 'SMP-01',
        supplierName: 'Pak Mat Kampung Changkat',
        rubberType: 'Latex',
        wetWeight: 150.0,
        dryWeight: 54.0,
        drcPercent: 36.0,
      },
      {
        id: 's-102',
        sampleNo: 'SMP-02',
        supplierName: 'Ladang Getah Ulu Bernam',
        rubberType: 'Cup Lump',
        wetWeight: 200.0,
        dryWeight: 110.0,
        drcPercent: 55.0,
      },
      {
        id: 's-103',
        sampleNo: 'SMP-03',
        supplierName: 'Koperasi Pekebun Raub',
        rubberType: 'Latex',
        wetWeight: 125.5,
        dryWeight: 43.8,
        drcPercent: 34.9,
      },
      {
        id: 's-104',
        sampleNo: 'SMP-04',
        supplierName: 'Estet Seri Menanti',
        rubberType: 'Unribbed Sheet',
        wetWeight: 180.0,
        dryWeight: 126.0,
        drcPercent: 70.0,
      },
      {
        id: 's-105',
        sampleNo: 'SMP-05',
        supplierName: 'Ah Kow Rubber Trading',
        rubberType: 'Latex',
        wetWeight: 140.0,
        dryWeight: 49.7,
        drcPercent: 35.5,
      },
      {
        id: 's-106',
        sampleNo: 'SMP-06',
        supplierName: 'Pusat Kumpul Simpang Pertang',
        rubberType: 'Cup Lump',
        wetWeight: 210.0,
        dryWeight: 115.5,
        drcPercent: 55.0,
      },
    ],
  },
  {
    id: 'batch-002',
    batchCode: 'BATCH-20261112-01',
    testDate: '2026-11-12',
    operatorName: 'Siti Aminah binti Yusof (Staf Makmal)',
    status: 'Pending Approval',
    rejectionNote: null,
    createdAt: '2026-11-12T08:30:00.000Z',
    updatedAt: '2026-11-12T10:15:00.000Z',
    approvedAt: null,
    approvedBy: null,
    samples: [
      {
        id: 's-201',
        sampleNo: 'SMP-11',
        supplierName: 'Ladang Getah Ulu Bernam',
        rubberType: 'Latex',
        wetWeight: 160.0,
        dryWeight: 56.8,
        drcPercent: 35.5,
      },
      {
        id: 's-202',
        sampleNo: 'SMP-12',
        supplierName: 'Pak Mat Kampung Changkat',
        rubberType: 'Latex',
        wetWeight: 155.0,
        dryWeight: 54.25,
        drcPercent: 35.0,
      },
      {
        id: 's-203',
        sampleNo: 'SMP-13',
        supplierName: 'Koperasi Pekebun Raub',
        rubberType: 'Cup Lump',
        wetWeight: 220.0,
        dryWeight: 121.0,
        drcPercent: 55.0,
      },
      {
        id: 's-204',
        sampleNo: 'SMP-14',
        supplierName: 'Haji Sulaiman Bidor',
        rubberType: 'Latex',
        wetWeight: 145.0,
        dryWeight: 51.5,
        drcPercent: 35.52,
      },
      {
        id: 's-205',
        sampleNo: 'SMP-15',
        supplierName: 'Estet Lembah Beringin',
        rubberType: 'Cup Lump',
        wetWeight: 190.0,
        dryWeight: 106.4,
        drcPercent: 56.0,
      },
    ],
  },
  {
    id: 'batch-003',
    batchCode: 'BATCH-20261110-02',
    testDate: '2026-11-10',
    operatorName: 'Muhammad Faizal (Staf Makmal)',
    status: 'Rejected',
    rejectionNote:
      'Sampel SMP-23 bacaan berat kering 145.00g terlalu tinggi bagi susu getah Latex 150.00g (DRC 96.67%). Sila timbang semula dan pastikan sampel telah dikeringkan sepenuhnya mengikut SOP.',
    createdAt: '2026-11-10T11:00:00.000Z',
    updatedAt: '2026-11-10T15:20:00.000Z',
    approvedAt: null,
    approvedBy: null,
    samples: [
      {
        id: 's-301',
        sampleNo: 'SMP-21',
        supplierName: 'Pak Mat Kampung Changkat',
        rubberType: 'Latex',
        wetWeight: 150.0,
        dryWeight: 52.5,
        drcPercent: 35.0,
      },
      {
        id: 's-302',
        sampleNo: 'SMP-22',
        supplierName: 'Koperasi Pekebun Raub',
        rubberType: 'Latex',
        wetWeight: 140.0,
        dryWeight: 49.0,
        drcPercent: 35.0,
      },
      {
        id: 's-303',
        sampleNo: 'SMP-23',
        supplierName: 'Ladang Temerloh Jaya',
        rubberType: 'Latex',
        wetWeight: 150.0,
        dryWeight: 145.0,
        drcPercent: 96.67,
      },
      {
        id: 's-304',
        sampleNo: 'SMP-24',
        supplierName: 'Estet Seri Menanti',
        rubberType: 'Cup Lump',
        wetWeight: 200.0,
        dryWeight: 108.0,
        drcPercent: 54.0,
      },
    ],
  },
];

export const INITIAL_EMAILS: SimulatedEmail[] = [
  {
    id: 'email-001',
    batchId: 'batch-001',
    batchCode: 'BATCH-20261111-01',
    recipientRole: 'Pegawai',
    recipientEmail: 'pegawai.kawalan@lgm.gov.my',
    senderName: 'Sistem RubberDRC Pro',
    subject: '[Laporan Rasmi DRC] BATCH-20261111-01 Telah Diluluskan',
    sentAt: '2026-11-11T16:30:05.000Z',
    triggerAction: 'APPROVE',
    read: false,
    summarySnapshot: {
      batchCode: 'BATCH-20261111-01',
      testDate: '2026-11-11',
      operatorName: 'Siti Aminah binti Yusof (Staf Makmal)',
      status: 'Approved',
      approvedBy: 'En. Razak bin Othman (Supervisor Makmal)',
      approvedAt: '2026-11-11T16:30:00.000Z',
      ...calculateBatchSummary(INITIAL_BATCHES[0].samples),
      samples: INITIAL_BATCHES[0].samples,
    },
  },
  {
    id: 'email-002',
    batchId: 'batch-002',
    batchCode: 'BATCH-20261112-01',
    recipientRole: 'Supervisor',
    recipientEmail: 'supervisor.makmal@lgm.gov.my',
    senderName: 'Siti Aminah binti Yusof (Staf Makmal)',
    subject: '[Tindakan Kelulusan] Batch Baharu BATCH-20261112-01 Menunggu Semakan',
    sentAt: '2026-11-12T10:15:02.000Z',
    triggerAction: 'SUBMIT',
    read: false,
    summarySnapshot: {
      batchCode: 'BATCH-20261112-01',
      testDate: '2026-11-12',
      operatorName: 'Siti Aminah binti Yusof (Staf Makmal)',
      status: 'Pending Approval',
      ...calculateBatchSummary(INITIAL_BATCHES[1].samples),
      samples: INITIAL_BATCHES[1].samples,
    },
  },
  {
    id: 'email-003',
    batchId: 'batch-003',
    batchCode: 'BATCH-20261110-02',
    recipientRole: 'Staf Makmal',
    recipientEmail: 'faizal.makmal@lgm.gov.my',
    senderName: 'En. Razak bin Othman (Supervisor Makmal)',
    subject: '[Perhatian: Batch Ditolak] BATCH-20261110-02 Memerlukan Pembetulan Semula',
    sentAt: '2026-11-10T15:20:00.000Z',
    triggerAction: 'REJECT',
    read: true,
    summarySnapshot: {
      batchCode: 'BATCH-20261110-02',
      testDate: '2026-11-10',
      operatorName: 'Muhammad Faizal (Staf Makmal)',
      status: 'Rejected',
      rejectionNote:
        'Sampel SMP-23 bacaan berat kering 145.00g terlalu tinggi bagi susu getah Latex 150.00g (DRC 96.67%). Sila timbang semula dan pastikan sampel telah dikeringkan sepenuhnya mengikut SOP.',
      ...calculateBatchSummary(INITIAL_BATCHES[2].samples),
      samples: INITIAL_BATCHES[2].samples,
    },
  },
];

class StorageService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public getBatches(): DRCBatch[] {
    if (!this.isBrowser()) return INITIAL_BATCHES;
    try {
      const data = localStorage.getItem(BATCHES_STORAGE_KEY);
      if (!data) {
        this.saveBatches(INITIAL_BATCHES);
        return INITIAL_BATCHES;
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading batches from localStorage:', err);
      return INITIAL_BATCHES;
    }
  }

  public getBatchById(id: string): DRCBatch | null {
    const batches = this.getBatches();
    return batches.find((b) => b.id === id) || null;
  }

  public saveBatches(batches: DRCBatch[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(BATCHES_STORAGE_KEY, JSON.stringify(batches));
    } catch (err) {
      console.error('Error saving batches to localStorage:', err);
    }
  }

  public createBatch(batch: DRCBatch): DRCBatch {
    const batches = this.getBatches();
    const updated = [batch, ...batches];
    this.saveBatches(updated);
    return batch;
  }

  public updateBatch(batch: DRCBatch): DRCBatch {
    const batches = this.getBatches();
    const index = batches.findIndex((b) => b.id === batch.id);
    if (index >= 0) {
      batches[index] = { ...batch, updatedAt: new Date().toISOString() };
      this.saveBatches(batches);
      return batches[index];
    } else {
      return this.createBatch(batch);
    }
  }

  public deleteBatch(id: string): boolean {
    const batches = this.getBatches();
    const filtered = batches.filter((b) => b.id !== id);
    if (filtered.length !== batches.length) {
      this.saveBatches(filtered);
      return true;
    }
    return false;
  }

  public getAllKnownSuppliers(): string[] {
    const batches = this.getBatches();
    const suppliers = new Set<string>();
    batches.forEach((b) => {
      b.samples.forEach((s) => {
        if (s.supplierName && s.supplierName.trim()) {
          suppliers.add(s.supplierName.trim());
        }
      });
    });
    return Array.from(suppliers);
  }

  public resetToDemoData(): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(BATCHES_STORAGE_KEY, JSON.stringify(INITIAL_BATCHES));
    localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(INITIAL_EMAILS));
  }

  public getActiveRole(): string {
    if (!this.isBrowser()) return 'Staf Makmal';
    return localStorage.getItem(CURRENT_ROLE_KEY) || 'Staf Makmal';
  }

  public setActiveRole(role: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(CURRENT_ROLE_KEY, role);
  }
}

export const storageService = new StorageService();
