import React, { useState } from 'react';
import { SimulatedEmail, UserRole } from '../types/drc';
import { StatusBadge } from './StatusBadge';
import {
  Mail,
  MailOpen,
  Calendar,
  User,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Send,
  Inbox,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';

interface EmailOutboxViewProps {
  emails: SimulatedEmail[];
  activeRole: UserRole;
  onOpenBatch: (batchCode: string) => void;
  onMarkRead: (emailId: string) => void;
  onMarkAllRead: () => void;
}

export const EmailOutboxView: React.FC<EmailOutboxViewProps> = ({
  emails,
  activeRole,
  onOpenBatch,
  onMarkRead,
  onMarkAllRead,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(
    emails.length > 0 ? emails[0].id : ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const filteredEmails = emails.filter((em) => {
    if (roleFilter !== 'ALL' && em.recipientRole !== roleFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        em.subject.toLowerCase().includes(q) ||
        em.batchCode.toLowerCase().includes(q) ||
        em.recipientEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedEmail = emails.find((e) => e.id === selectedEmailId) || filteredEmails[0] || null;

  const handleSelectEmail = (em: SimulatedEmail) => {
    setSelectedEmailId(em.id);
    if (!em.read) {
      onMarkRead(em.id);
    }
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in">
      {/* Top Banner explaining simulation */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Mail className="w-4 h-4" />
            Simulasi Penghantaran Email (Fasa 1 Prototype)
          </div>
          <h2 className="text-xl font-bold">Email Outbox &amp; Pratonton Laporan Rasmi</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Modul ini mensimulasikan notifikasi automatik ke peti masuk Supervisor (semasa submit/resubmit), Staf Makmal (jika rejected), dan Pegawai (apabila approved) tanpa memerlukan pelayan SMTP luar.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onMarkAllRead}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors"
          >
            Tanda Semua Telah Dibaca
          </button>
        </div>
      </div>

      {/* Main 2-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[600px]">
        {/* Left Panel: Email List (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Search & Filter Header */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari subjek atau no. batch..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] font-medium">Penerima Sasaran:</span>
              <div className="flex items-center gap-1">
                {(['ALL', 'Supervisor', 'Staf Makmal', 'Pegawai'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      roleFilter === r
                        ? 'bg-emerald-700 text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r === 'ALL' ? 'Semua' : r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Email Item Rows */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[650px] flex-1">
            {filteredEmails.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                Tiada email simulasi ditemui
              </div>
            ) : (
              filteredEmails.map((em) => {
                const isSelected = selectedEmail?.id === em.id;
                return (
                  <div
                    key={em.id}
                    onClick={() => handleSelectEmail(em)}
                    className={`p-3.5 cursor-pointer transition-colors relative text-left ${
                      isSelected
                        ? 'bg-emerald-50/70 border-l-4 border-emerald-600'
                        : em.read
                        ? 'hover:bg-slate-50'
                        : 'bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    {!em.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 absolute right-3 top-3.5"></span>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          em.recipientRole === 'Supervisor'
                            ? 'bg-amber-100 text-amber-800'
                            : em.recipientRole === 'Pegawai'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Ke: {em.recipientRole}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {new Date(em.sentAt).toLocaleTimeString('ms-MY', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div
                      className={`text-xs ${
                        !em.read ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                      } line-clamp-1`}
                    >
                      {em.subject}
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                      <span className="truncate max-w-[180px] font-mono text-[10px] text-slate-400">
                        {em.recipientEmail}
                      </span>
                      <span className="font-semibold text-emerald-800 font-mono text-[11px]">
                        {em.summarySnapshot?.avgDRC?.toFixed(2)}% DRC
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Panel: Full Email Body Preview (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {selectedEmail ? (
            <div className="flex-1 flex flex-col">
              {/* Email Envelope Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/60 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                    {selectedEmail.subject}
                  </h3>
                  <button
                    onClick={() => onOpenBatch(selectedEmail.batchCode)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shrink-0 shadow-xs"
                    title="Buka perincian batch ini dalam sistem"
                  >
                    <span>Buka Batch</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400">Daripada:</span>{' '}
                    <strong className="text-slate-800">{selectedEmail.senderName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Kepada:</span>{' '}
                    <strong className="text-slate-800">
                      {selectedEmail.recipientRole} &lt;{selectedEmail.recipientEmail}&gt;
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Waktu Dihantar:</span>{' '}
                    <span className="text-slate-800 font-medium">
                      {new Date(selectedEmail.sentAt).toLocaleString('ms-MY')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Rujukan Kod:</span>{' '}
                    <span className="text-slate-800 font-mono font-bold">
                      {selectedEmail.batchCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Rendered Message Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[600px] text-xs text-slate-800 font-sans leading-relaxed">
                {/* Official Email Greeting Banner */}
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-100 border border-slate-200">
                  <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold font-mono">
                    LGM
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      Pusat Pengumpulan &amp; Makmal Pengujian Getah
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Sistem Notifikasi Elektronik RubberDRC Pro
                    </div>
                  </div>
                </div>

                {/* Email Intent Message */}
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Assalamualaikum / Salam Sejahtera Tuan/Puan,
                  </p>
                  <p className="mt-2 text-slate-600">
                    {selectedEmail.triggerAction === 'SUBMIT' &&
                      `Staf makmal telah melengkapkan kemasukan data bagi kumpulan sampel ${selectedEmail.batchCode} dan memohon semakan serta pengesahan daripada pihak Supervisor.`}
                    {selectedEmail.triggerAction === 'RESUBMIT' &&
                      `Staf makmal telah mengemaskini semula data bagi kumpulan sampel ${selectedEmail.batchCode} susulan catatan teguran sebelum ini dan memohon semakan semula.`}
                    {selectedEmail.triggerAction === 'REJECT' &&
                      `Kumpulan sampel ${selectedEmail.batchCode} telah ditolak oleh Supervisor makmal kerana terdapat ketidaktepatan data dan memerlukan pembetulan segera.`}
                    {selectedEmail.triggerAction === 'APPROVE' &&
                      `Kumpulan sampel ${selectedEmail.batchCode} telah disahkan dan DILULUSKAN oleh Supervisor. Laporan rasmi Dry Rubber Content (DRC) sedia untuk tindakan rekod penerimaan dan perakaunan.`}
                  </p>
                </div>

                {/* Rejection Note in Email */}
                {selectedEmail.summarySnapshot?.rejectionNote && (
                  <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 text-rose-900">
                    <div className="font-bold text-xs uppercase tracking-wider text-rose-700 flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Catatan Pembetulan oleh Supervisor:
                    </div>
                    <p className="font-medium text-xs">
                      &ldquo;{selectedEmail.summarySnapshot.rejectionNote}&rdquo;
                    </p>
                  </div>
                )}

                {/* Batch Metrics Box in Email */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-200 pb-1.5">
                    Ringkasan Analisis DRC
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-center">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400">Jumlah Sampel</div>
                      <div className="font-bold text-sm text-slate-800">
                        {selectedEmail.summarySnapshot.totalSamples}
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400">Jumlah Berat Basah</div>
                      <div className="font-bold font-mono text-sm text-slate-800">
                        {selectedEmail.summarySnapshot.totalWetWeight?.toFixed(2)} g
                      </div>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <div className="text-[10px] text-slate-400">Jumlah Berat Kering</div>
                      <div className="font-bold font-mono text-sm text-slate-800">
                        {selectedEmail.summarySnapshot.totalDryWeight?.toFixed(2)} g
                      </div>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg border border-emerald-300">
                      <div className="text-[10px] text-emerald-800 font-bold">Purata DRC (%)</div>
                      <div className="font-black font-mono text-base text-emerald-900">
                        {selectedEmail.summarySnapshot.avgDRC?.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Full Snapshot Table in Email */}
                <div>
                  <div className="font-bold text-slate-800 text-xs mb-2">
                    Lampiran Data Sampel:
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs text-slate-700 border-collapse">
                      <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                        <tr>
                          <th className="py-2 px-2.5">No. Sampel</th>
                          <th className="py-2 px-2.5">Pembekal / Ladang</th>
                          <th className="py-2 px-2.5">Jenis</th>
                          <th className="py-2 px-2.5 text-right">Basah (g)</th>
                          <th className="py-2 px-2.5 text-right">Kering (g)</th>
                          <th className="py-2 px-2.5 text-right">DRC (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedEmail.summarySnapshot.samples.map((s, idx) => (
                          <tr key={s.id || idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2.5 font-mono font-bold text-slate-800">
                              {s.sampleNo}
                            </td>
                            <td className="py-1.5 px-2.5">{s.supplierName}</td>
                            <td className="py-1.5 px-2.5">{s.rubberType}</td>
                            <td className="py-1.5 px-2.5 text-right font-mono">
                              {s.wetWeight?.toFixed(2)}
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-mono">
                              {s.dryWeight?.toFixed(2)}
                            </td>
                            <td className="py-1.5 px-2.5 text-right font-mono font-bold text-emerald-800">
                              {s.drcPercent?.toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Sign-off footer */}
                <div className="pt-4 border-t border-slate-200 text-slate-500 text-[11px] leading-relaxed">
                  <p>Mesej ini dijana secara automatik oleh sistem pengujian makmal RubberDRC Pro.</p>
                  <p className="mt-1">
                    Untuk semakan langsung atau muat turun fail CSV/PDF rasmi, sila log masuk ke papan pemuka aplikasi RubberDRC Pro.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <MailOpen className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              Pilih satu email dari senarai di sebelah kiri untuk pratonton kandungan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
