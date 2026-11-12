import React, { useState, useEffect, useCallback } from 'react';
import { DRCBatch, SimulatedEmail, UserRole } from './types/drc';
import { storageService } from './services/storageService';
import { emailService } from './services/emailService';
import { generateBatchCode } from './utils/drcCalculations';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { BatchEntryForm } from './components/BatchEntryForm';
import { BatchDetailModal } from './components/BatchDetailModal';
import { EmailOutboxView } from './components/EmailOutboxView';
import { PrintView } from './components/PrintView';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [batches, setBatches] = useState<DRCBatch[]>([]);
  const [emails, setEmails] = useState<SimulatedEmail[]>([]);
  const [activeRole, setActiveRoleState] = useState<UserRole>('Staf Makmal');
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'create-batch' | 'email-outbox'>('dashboard');
  const [selectedBatchForDetail, setSelectedBatchForDetail] = useState<DRCBatch | null>(null);
  const [batchToEdit, setBatchToEdit] = useState<DRCBatch | null>(null);
  const [batchForPrint, setBatchForPrint] = useState<DRCBatch | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load data on initial mount
  useEffect(() => {
    const loadedBatches = storageService.getBatches();
    const loadedEmails = emailService.getEmails();
    const savedRole = storageService.getActiveRole() as UserRole;

    setBatches(loadedBatches);
    setEmails(loadedEmails);
    if (['Staf Makmal', 'Supervisor', 'Pegawai'].includes(savedRole)) {
      setActiveRoleState(savedRole);
    }
  }, []);

  const showToast = useCallback(
    (type: 'success' | 'error' | 'info', title: string, message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto dismiss after 4.5s
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRoleChange = (role: UserRole) => {
    setActiveRoleState(role);
    storageService.setActiveRole(role);

    showToast(
      'info',
      `Peranan Ditukar: ${role}`,
      role === 'Staf Makmal'
        ? 'Anda kini boleh memasukkan sampel pukal dan membetulkan batch yang ditolak.'
        : role === 'Supervisor'
        ? 'Anda kini boleh menyemak dan meluluskan/menolak batch yang belum disahkan.'
        : 'Anda kini dalam mod pemantauan laporan rasmi yang telah diluluskan.'
    );
  };

  // Create new batch handler
  const handleStartCreateBatch = () => {
    setBatchToEdit(null);
    setCurrentTab('create-batch');
  };

  // Edit draft or rejected batch
  const handleStartEditBatch = (batch: DRCBatch) => {
    setBatchToEdit(batch);
    setSelectedBatchForDetail(null);
    setCurrentTab('create-batch');
  };

  // Save Draft
  const handleSaveDraft = (batchData: DRCBatch) => {
    const updated = storageService.updateBatch(batchData);
    setBatches(storageService.getBatches());
    setCurrentTab('dashboard');
    setBatchToEdit(null);

    showToast('success', 'Draft Disimpan', `Batch ${updated.batchCode} telah disimpan sebagai draft.`);
  };

  // Submit for approval (First time or Resubmit)
  const handleSubmitForApproval = (batchData: DRCBatch, isResubmit: boolean) => {
    const updated = storageService.updateBatch(batchData);
    setBatches(storageService.getBatches());

    // Trigger simulated email notification to Supervisor
    const triggerAction = isResubmit ? 'RESUBMIT' : 'SUBMIT';
    emailService.sendEmailForBatchEvent(updated, triggerAction);
    setEmails(emailService.getEmails());

    setCurrentTab('dashboard');
    setBatchToEdit(null);

    showToast(
      'success',
      isResubmit ? 'Batch Telah Dihantar Semula!' : 'Batch Dihantar untuk Kelulusan!',
      `Batch ${updated.batchCode} kini berstatus "Pending Approval". Email notifikasi telah dihantar ke peti masuk Supervisor.`
    );
  };

  // Supervisor Approves batch
  const handleApproveBatch = (batch: DRCBatch, supervisorNotes?: string) => {
    const now = new Date().toISOString();
    const approvedBatch: DRCBatch = {
      ...batch,
      status: 'Approved',
      approvedAt: now,
      approvedBy: 'En. Razak bin Othman (Supervisor Makmal)',
      updatedAt: now,
    };

    const updated = storageService.updateBatch(approvedBatch);
    setBatches(storageService.getBatches());
    setSelectedBatchForDetail(updated);

    // Send simulated email report to Pegawai
    emailService.sendEmailForBatchEvent(updated, 'APPROVE', supervisorNotes);
    setEmails(emailService.getEmails());

    showToast(
      'success',
      'Batch Diluluskan!',
      `Batch ${batch.batchCode} telah disahkan. Laporan rasmi DRC telah dihantar melalui email simulasi kepada Pegawai.`
    );
  };

  // Supervisor Rejects batch (with mandatory note)
  const handleRejectBatch = (batch: DRCBatch, rejectionNote: string) => {
    const now = new Date().toISOString();
    const rejectedBatch: DRCBatch = {
      ...batch,
      status: 'Rejected',
      rejectionNote,
      updatedAt: now,
    };

    const updated = storageService.updateBatch(rejectedBatch);
    setBatches(storageService.getBatches());
    setSelectedBatchForDetail(updated);

    // Send simulated email notification to Staf Makmal
    emailService.sendEmailForBatchEvent(updated, 'REJECT', rejectionNote);
    setEmails(emailService.getEmails());

    showToast(
      'error',
      'Batch Ditolak',
      `Batch ${batch.batchCode} telah ditolak berserta catatan pembetulan. Staf Makmal telah dimaklumkan melalui email.`
    );
  };

  // Delete batch (Draft only)
  const handleDeleteBatch = (id: string) => {
    const batch = batches.find((b) => b.id === id);
    if (!batch) return;

    if (window.confirm(`Adakah anda pasti mahu memadam draft batch "${batch.batchCode}"?`)) {
      storageService.deleteBatch(id);
      setBatches(storageService.getBatches());
      showToast('info', 'Batch Dipadam', `Draft batch ${batch.batchCode} telah dipadam.`);
    }
  };

  // Reset Demo Data
  const handleResetData = () => {
    storageService.resetToDemoData();
    setBatches(storageService.getBatches());
    setEmails(emailService.getEmails());
    setSelectedBatchForDetail(null);
    setBatchToEdit(null);
    setCurrentTab('dashboard');

    showToast(
      'info',
      'Data Contoh Ditetapkan Semula',
      'Semua data telah dikembalikan kepada 1 batch Approved, 1 Pending, dan 1 Rejected.'
    );
  };

  // Print Report Handler
  const handlePrintBatch = (batch: DRCBatch) => {
    setBatchForPrint(batch);
    // Give state a moment to render print view then trigger dialog
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Open specific batch from email outbox
  const handleOpenBatchFromEmail = (batchCode: string) => {
    const target = batches.find((b) => b.batchCode === batchCode);
    if (target) {
      setSelectedBatchForDetail(target);
      setCurrentTab('dashboard');
    } else {
      showToast('error', 'Batch Tidak Ditemui', `Batch ${batchCode} mungkin telah dipadam.`);
    }
  };

  const handleMarkEmailRead = (emailId: string) => {
    emailService.markAsRead(emailId);
    setEmails(emailService.getEmails());
  };

  const handleMarkAllEmailsRead = () => {
    emailService.markAllAsRead();
    setEmails(emailService.getEmails());
    showToast('info', 'Status Dikemaskini', 'Semua email telah ditandakan sebagai dibaca.');
  };

  const pendingBatchesCount = batches.filter((b) => b.status === 'Pending Approval').length;
  const unreadEmailCount = emailService.getUnreadCount();
  const knownSuppliers = storageService.getAllKnownSuppliers();
  const suggestedNextCode = generateBatchCode(batches);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased selection:bg-emerald-200">
      {/* Printable Certificate Layout - Only renders on @media print */}
      <PrintView batch={batchForPrint || selectedBatchForDetail} />

      {/* Main Interactive Screen */}
      <div className="print:hidden flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          activeRole={activeRole}
          setActiveRole={handleRoleChange}
          unreadEmailCount={unreadEmailCount}
          onResetData={handleResetData}
          pendingCount={pendingBatchesCount}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentTab === 'dashboard' && (
            <Dashboard
              batches={batches}
              activeRole={activeRole}
              onViewBatch={(batch) => setSelectedBatchForDetail(batch)}
              onEditBatch={handleStartEditBatch}
              onDeleteBatch={handleDeleteBatch}
              onCreateNewBatch={handleStartCreateBatch}
              onPrintBatch={handlePrintBatch}
            />
          )}

          {currentTab === 'create-batch' && (
            <BatchEntryForm
              initialBatch={batchToEdit}
              knownSuppliers={knownSuppliers}
              suggestedBatchCode={suggestedNextCode}
              onSaveDraft={handleSaveDraft}
              onSubmitForApproval={handleSubmitForApproval}
              onCancel={() => {
                setBatchToEdit(null);
                setCurrentTab('dashboard');
              }}
            />
          )}

          {currentTab === 'email-outbox' && (
            <EmailOutboxView
              emails={emails}
              activeRole={activeRole}
              onOpenBatch={handleOpenBatchFromEmail}
              onMarkRead={handleMarkEmailRead}
              onMarkAllRead={handleMarkAllEmailsRead}
            />
          )}
        </main>

        {/* Modal: Batch Detail, Laporan & Approval Panel */}
        {selectedBatchForDetail && (
          <BatchDetailModal
            batch={selectedBatchForDetail}
            activeRole={activeRole}
            onClose={() => setSelectedBatchForDetail(null)}
            onEdit={handleStartEditBatch}
            onPrint={handlePrintBatch}
            onApprove={handleApproveBatch}
            onReject={handleRejectBatch}
          />
        )}

        {/* Global Toast Notifications */}
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>RubberDRC Pro</strong> (v1.0 Fasa 1 Prototype) — Lembaga Getah Malaysia (LGM).
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span>Formula: DRC (%) = (Kering / Basah) × 100</span>
              <span>•</span>
              <span>Penyimpanan: localStorage Terasing</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
