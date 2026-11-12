import { DRCBatch, SimulatedEmail, UserRole } from '../types/drc';
import { calculateBatchSummary } from '../utils/drcCalculations';
import { INITIAL_EMAILS } from './storageService';

const EMAILS_STORAGE_KEY = 'rubber_drc_emails_v1';

class EmailService {
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public getEmails(): SimulatedEmail[] {
    if (!this.isBrowser()) return INITIAL_EMAILS;
    try {
      const data = localStorage.getItem(EMAILS_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(INITIAL_EMAILS));
        return INITIAL_EMAILS;
      }
      const parsed: SimulatedEmail[] = JSON.parse(data);
      // Sort newest first
      return parsed.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
    } catch (err) {
      console.error('Error reading emails from localStorage:', err);
      return INITIAL_EMAILS;
    }
  }

  public saveEmails(emails: SimulatedEmail[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(EMAILS_STORAGE_KEY, JSON.stringify(emails));
    } catch (err) {
      console.error('Error saving emails to localStorage:', err);
    }
  }

  public sendEmailForBatchEvent(
    batch: DRCBatch,
    triggerAction: 'SUBMIT' | 'RESUBMIT' | 'REJECT' | 'APPROVE',
    extraNotes?: string
  ): SimulatedEmail {
    const summary = calculateBatchSummary(batch.samples);
    const now = new Date().toISOString();

    let recipientRole: UserRole = 'Supervisor';
    let recipientEmail = 'supervisor.makmal@lgm.gov.my';
    let senderName = batch.operatorName || 'Staf Makmal';
    let subject = '';

    if (triggerAction === 'SUBMIT') {
      recipientRole = 'Supervisor';
      recipientEmail = 'supervisor.makmal@lgm.gov.my';
      senderName = batch.operatorName || 'Staf Makmal';
      subject = `[Tindakan Kelulusan] Batch Baharu ${batch.batchCode} Menunggu Semakan`;
    } else if (triggerAction === 'RESUBMIT') {
      recipientRole = 'Supervisor';
      recipientEmail = 'supervisor.makmal@lgm.gov.my';
      senderName = batch.operatorName || 'Staf Makmal';
      subject = `[Resubmit] Pembetulan Semula Batch ${batch.batchCode} Telah Dikemaskini`;
    } else if (triggerAction === 'REJECT') {
      recipientRole = 'Staf Makmal';
      recipientEmail = 'staf.makmal@lgm.gov.my';
      senderName = 'En. Razak bin Othman (Supervisor Makmal)';
      subject = `[Perhatian: Batch Ditolak] ${batch.batchCode} Memerlukan Pembetulan Semula`;
    } else if (triggerAction === 'APPROVE') {
      recipientRole = 'Pegawai';
      recipientEmail = 'pegawai.kawalan@lgm.gov.my';
      senderName = 'Sistem RubberDRC Pro (Supervisor: En. Razak)';
      subject = `[Laporan Rasmi DRC] ${batch.batchCode} Telah Diluluskan`;
    }

    const newEmail: SimulatedEmail = {
      id: `email-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      batchId: batch.id,
      batchCode: batch.batchCode,
      recipientRole,
      recipientEmail,
      senderName,
      subject,
      sentAt: now,
      triggerAction,
      read: false,
      summarySnapshot: {
        batchCode: batch.batchCode,
        testDate: batch.testDate,
        operatorName: batch.operatorName,
        status: batch.status,
        rejectionNote: extraNotes || batch.rejectionNote,
        approvedBy: batch.approvedBy,
        approvedAt: batch.approvedAt,
        ...summary,
        samples: [...batch.samples],
      },
    };

    const currentEmails = this.getEmails();
    const updated = [newEmail, ...currentEmails];
    this.saveEmails(updated);
    return newEmail;
  }

  public markAsRead(id: string): void {
    const emails = this.getEmails();
    const target = emails.find((e) => e.id === id);
    if (target) {
      target.read = true;
      this.saveEmails(emails);
    }
  }

  public markAllAsRead(): void {
    const emails = this.getEmails();
    emails.forEach((e) => {
      e.read = true;
    });
    this.saveEmails(emails);
  }

  public getUnreadCount(roleFilter?: UserRole): number {
    const emails = this.getEmails();
    if (roleFilter) {
      return emails.filter((e) => !e.read && e.recipientRole === roleFilter).length;
    }
    return emails.filter((e) => !e.read).length;
  }
}

export const emailService = new EmailService();
