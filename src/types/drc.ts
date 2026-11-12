export type RubberType = 'Latex' | 'Cup Lump' | 'Unribbed Sheet' | 'Lain-lain';

export type BatchStatus = 'Draft' | 'Pending Approval' | 'Rejected' | 'Approved';

export type UserRole = 'Staf Makmal' | 'Supervisor' | 'Pegawai';

export interface DRCSample {
  id: string;
  sampleNo: string;
  supplierName: string;
  rubberType: RubberType;
  wetWeight: number; // in grams
  dryWeight: number; // in grams
  drcPercent: number; // percentage (2 decimals)
}

export interface DRCBatch {
  id: string;
  batchCode: string;
  testDate: string; // YYYY-MM-DD
  operatorName: string;
  status: BatchStatus;
  rejectionNote: string | null;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  approvedAt: string | null; // ISO string
  approvedBy: string | null;
  samples: DRCSample[];
}

export interface EmailSummarySnapshot {
  batchCode: string;
  testDate: string;
  operatorName: string;
  status: BatchStatus;
  totalSamples: number;
  totalWetWeight: number;
  totalDryWeight: number;
  avgDRC: number;
  rejectionNote?: string | null;
  approvedBy?: string | null;
  approvedAt?: string | null;
  samples: DRCSample[];
}

export interface SimulatedEmail {
  id: string;
  batchId: string;
  batchCode: string;
  recipientRole: UserRole;
  recipientEmail: string;
  senderName: string;
  subject: string;
  sentAt: string; // ISO string
  triggerAction: 'SUBMIT' | 'RESUBMIT' | 'REJECT' | 'APPROVE';
  read: boolean;
  summarySnapshot: EmailSummarySnapshot;
}
