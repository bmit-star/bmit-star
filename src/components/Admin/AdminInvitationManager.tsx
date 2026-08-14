import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Mail, ShieldCheck, Clock, Copy, Check, Trash2, Ban, 
  Send, Sparkles, RefreshCw, Search, Eye, ExternalLink, QrCode, 
  AlertCircle, CheckCircle2, Shield, User, FileText, ArrowRight
} from 'lucide-react';
import { AdminInvitation, AdminRole, AdminInvitationStatus } from '../../types';
import { getStoredAdminInvitations, saveStoredAdminInvitations, generateSecureSlug } from '../../lib/storage';

const ROLE_DESCRIPTIONS: Record<AdminRole, { title: string; desc: string; color: string; badgeBg: string }> = {
  'Super Admin': {
    title: 'Супер Админ',
    desc: 'Системийн бүх тохиргоо, админ удирдлага, санхүү ба тохиргоонд нэвтрэх бүрэн эрх.',
    color: 'text-amber-300',
    badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300'
  },
  'Manager': {
    title: 'Менежер',
    desc: 'Захиалгын жагсаалт, харилцагчийн бүртгэл ба загваруудыг удирдаж засах эрх.',
    color: 'text-sky-300',
    badgeBg: 'bg-sky-500/20 border-sky-500/40 text-sky-300'
  },
  'Support': {
    title: 'Харилцагчийн Дэмжлэг',
    desc: 'Харилцагчийн хүсэлт, ирц бүртгэл ба Check-in сканнер хэсгийг ашиглах эрх.',
    color: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
  },
  'Moderator': {
    title: 'Модератор',
    desc: 'Зургийн хана, зочдын сэтгэгдэл, хүсэлтүүдийг шалгаж зөвшөөрөх эрх.',
    color: 'text-purple-300',
    badgeBg: 'bg-purple-500/20 border-purple-500/40 text-purple-300'
  },
  'Editor': {
    title: 'Дизайнер / Загвар Засагч',
    desc: 'Урилгын загвар бэлдэх, визуал өөрчлөлт ба текстийг редакторлох эрх.',
    color: 'text-rose-300',
    badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300'
  }
};

export const AdminInvitationManager: React.FC = () => {
  const [invitations, setInvitations] = useState<AdminInvitation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [role, setRole] = useState<AdminRole>('Manager');
  const [expirationDays, setExpirationDays] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [sendViaEmail, setSendViaEmail] = useState<boolean>(true);

  // Load from local storage on mount
  useEffect(() => {
    const data = getStoredAdminInvitations();
    setInvitations(data);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getInviteLink = (token: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zallaga.art';
    return `${origin}/admin/accept-invite?token=${token}`;
  };

  const handleCreateInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim() || !recipientEmail.trim()) {
      showToast('⚠️ Хүлээн авагчийн нэр болон и-мэйл хаягийг оруулна уу.');
      return;
    }

    const newToken = `adm_tok_${generateSecureSlug('key')}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationDays * 86400000);

    const newInvite: AdminInvitation = {
      id: `adm-inv-${Date.now()}`,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      role: role,
      token: newToken,
      status: 'pending',
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
      createdByName: 'Систем Админ',
      note: note.trim() || undefined,
      sentViaEmail: sendViaEmail
    };

    const updated = [newInvite, ...invitations];
    setInvitations(updated);
    saveStoredAdminInvitations(updated);

    // Reset form
    setRecipientName('');
    setRecipientEmail('');
    setNote('');
    showToast('✨ Админы урилга амжилттай үүсгэгдлээ!');
  };

  const handleCopyLink = (inv: AdminInvitation) => {
    const link = getInviteLink(inv.token);
    navigator.clipboard.writeText(link);
    setCopiedId(inv.id);
    showToast('📋 Урилгын холбоос хуулагдлаа!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleRevoke = (id: string) => {
    const updated = invitations.map(inv => {
      if (inv.id === id) {
        return { ...inv, status: 'revoked' as AdminInvitationStatus };
      }
      return inv;
    });
    setInvitations(updated);
    saveStoredAdminInvitations(updated);
    showToast('🚫 Урилга цуцлагдлаа.');
  };

  const handleDelete = (id: string) => {
    const updated = invitations.filter(inv => inv.id !== id);
    setInvitations(updated);
    saveStoredAdminInvitations(updated);
    showToast('🗑️ Урилга устгагдлаа.');
  };

  const handleResend = (inv: AdminInvitation) => {
    const updated = invitations.map(i => {
      if (i.id === inv.id) {
        return { ...i, sentViaEmail: true };
      }
      return i;
    });
    setInvitations(updated);
    saveStoredAdminInvitations(updated);
    showToast(`📩 Урилга ${inv.recipientEmail} рүү дахин илгээгдлээ.`);
  };

  // Preview computations
  const previewToken = 'adm_tok_demo_sample';
  const previewLink = getInviteLink(previewToken);
  const previewExpirationDate = new Date(Date.now() + expirationDays * 86400000).toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Filtered invitations
  const filteredInvitations = invitations.filter(inv => {
    const matchesSearch = 
      inv.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.role.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    return inv.status === filterStatus && matchesSearch;
  });

  // Stats
  const totalCount = invitations.length;
  const pendingCount = invitations.filter(i => i.status === 'pending').length;
  const acceptedCount = invitations.filter(i => i.status === 'accepted').length;
  const revokedCount = invitations.filter(i => i.status === 'revoked' || i.status === 'expired').length;

  return (
    <div className="space-y-8 font-sans text-stone-100 max-w-7xl mx-auto pb-12">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-900 border border-[#d4af37]/60 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 backdrop-blur-xl animate-fade-in">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 p-6 sm:p-8 rounded-3xl border border-[#d4af37]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#d4af37]/15 border border-[#d4af37]/30 px-3 py-1 rounded-full text-[#f9e5af] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
            <span>Админ Баг & Эрхийн Удирдлага</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-wide">
            Командад Урих & Админ Урилга Үүсгэгч
          </h1>
          <p className="text-xs text-stone-300 leading-relaxed">
            Системийн админ хэсэгт шинэ гишүүн, менежер эсвэл харилцагчийн дэмжлэгийн ажилтан урих тусгай хамгаалалттай урилга (Unique Invite Link) үүсгэж удирдана.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto relative z-10">
          <div className="bg-stone-950/80 border border-stone-800 p-3.5 rounded-2xl text-center space-y-1 min-w-[100px]">
            <span className="text-[10px] text-stone-400 font-bold uppercase block">Нийт</span>
            <span className="text-xl font-bold font-mono text-white">{totalCount}</span>
          </div>
          <div className="bg-stone-950/80 border border-amber-500/30 p-3.5 rounded-2xl text-center space-y-1 min-w-[100px]">
            <span className="text-[10px] text-amber-400 font-bold uppercase block">Хүлээгдэж буй</span>
            <span className="text-xl font-bold font-mono text-amber-300">{pendingCount}</span>
          </div>
          <div className="bg-stone-950/80 border border-emerald-500/30 p-3.5 rounded-2xl text-center space-y-1 min-w-[100px]">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">Баталгаажсан</span>
            <span className="text-xl font-bold font-mono text-emerald-300">{acceptedCount}</span>
          </div>
          <div className="bg-stone-950/80 border border-rose-500/30 p-3.5 rounded-2xl text-center space-y-1 min-w-[100px]">
            <span className="text-[10px] text-rose-400 font-bold uppercase block">Цуцлагдсан</span>
            <span className="text-xl font-bold font-mono text-rose-300">{revokedCount}</span>
          </div>
        </div>
      </div>

      {/* TWO COLUMN WORKSPACE: FORM & LIVE PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INVITATION FORM */}
        <div className="lg:col-span-6 bg-stone-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-stone-800">
            <UserPlus className="w-5 h-5 text-[#d4af37]" />
            <h2 className="text-lg font-bold text-white font-serif">Шинэ Админ Урилга Үүсгэх</h2>
          </div>

          <form onSubmit={handleCreateInvitation} className="space-y-5">
            {/* Recipient Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>Хүлээн Авагчийн Нэр <span className="text-rose-400">*</span></span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Жишээ: Батзориг, Болормаа..."
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37] transition-all"
                />
              </div>
            </div>

            {/* Recipient Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>И-Мэйл Хаяг <span className="text-rose-400">*</span></span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="batzorig@zallaga.mn"
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-10 pr-4 py-3 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37] transition-all"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>Админы Эрх / Үүрэг Сонгох <span className="text-rose-400">*</span></span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(ROLE_DESCRIPTIONS) as AdminRole[]).map((r) => {
                  const roleData = ROLE_DESCRIPTIONS[r];
                  const isSelected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-1 ${
                        isSelected
                          ? 'bg-stone-950 border-[#d4af37] shadow-lg shadow-[#d4af37]/10 ring-1 ring-[#d4af37]'
                          : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-950'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-bold ${roleData.color}`}>{roleData.title}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#d4af37]" />}
                      </div>
                      <span className="text-[10px] text-stone-400 line-clamp-2 leading-tight">
                        {roleData.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Expiration Days & Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-300">Хүчинтэй Хугацаа</label>
                <select
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-3.5 py-3 text-xs text-stone-100 focus:outline-none focus:border-[#d4af37] transition-all"
                >
                  <option value={1}>24 Цаг (1 Хоног)</option>
                  <option value={3}>3 Хоног</option>
                  <option value={7}>7 Хоног</option>
                  <option value={30}>30 Хоног</option>
                </select>
              </div>

              <div className="space-y-1.5 flex flex-col justify-end">
                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-stone-950 border border-stone-800 cursor-pointer hover:border-stone-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={sendViaEmail}
                    onChange={(e) => setSendViaEmail(e.target.checked)}
                    className="w-4 h-4 accent-[#d4af37] rounded"
                  />
                  <span className="text-xs text-stone-200 font-semibold">И-мэйлээр шууд илгээх</span>
                </label>
              </div>
            </div>

            {/* Personal Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-300">Тэмдэглэл / Илгээх Мессеж (Заавал биш)</label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Нэмэлт тайлбар эсвэл угталт мессеж бичих..."
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl p-3.5 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] hover:brightness-110 text-slate-950 font-bold py-3.5 rounded-2xl text-xs transition-all shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2 active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Админ Урилга Үүсгэх & Холбоос Бэлтгэх</span>
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW CARD */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>Бодит Урьдчилсан Харагдац (Live Preview)</span>
            </span>
            <span className="text-[10px] bg-stone-800 text-stone-300 px-2.5 py-1 rounded-full border border-stone-700">
              Админ Карт
            </span>
          </div>

          {/* Luxury Card Frame */}
          <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 border-[#d4af37]/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden font-serif">
            {/* Gold Corner Accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/15 rounded-full blur-2xl pointer-events-none"></div>

            {/* Card Header */}
            <div className="text-center space-y-2 border-b border-stone-800/80 pb-5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#d4af37] to-[#f9e5af] flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-[#d4af37]/20 font-serif">
                З
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37] block">
                ЗАЛЛАГА • АДМИН УРИЛГА
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {recipientName.trim() ? `Эрхэм хүндэт ${recipientName} танаа` : 'Эрхэм хүндэт Зочин танаа'}
              </h3>
              <p className="text-xs font-sans text-stone-300 italic">
                Таныг манай дижитал системийн админ багаар ажиллахыг хүрэлцэн ирж урьж байна.
              </p>
            </div>

            {/* Role & Permissions Details */}
            <div className="bg-stone-950/80 p-5 rounded-2xl border border-stone-800 space-y-3 font-sans">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-bold">Олгож буй эрх:</span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${ROLE_DESCRIPTIONS[role].badgeBg}`}>
                  {ROLE_DESCRIPTIONS[role].title}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/60 p-3 rounded-xl border border-stone-800/60">
                {ROLE_DESCRIPTIONS[role].desc}
              </p>
            </div>

            {/* Personal Note Callout */}
            {note.trim() && (
              <div className="bg-[#d4af37]/10 p-4 rounded-2xl border border-[#d4af37]/30 text-xs text-stone-200 space-y-1 font-sans">
                <span className="text-[10px] text-[#f9e5af] font-bold uppercase block">Админы зурвас:</span>
                <p className="italic font-serif text-amber-100">"{note.trim()}"</p>
              </div>
            )}

            {/* Link & QR Code Preview */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3 font-sans text-center">
              <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                Урилгын Уник Холбоос & Хугацаа
              </span>
              
              <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 font-mono text-[11px] text-amber-300 truncate tracking-tight">
                {previewLink}
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span>Хүчинтэй огноо: <strong className="text-white font-mono">{previewExpirationDate}</strong></span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{expirationDays} хоног</span>
                </span>
              </div>
            </div>

            {/* Action Simulator Button */}
            <div className="pt-2 font-sans">
              <button
                type="button"
                className="w-full bg-stone-900 hover:bg-stone-800 border border-[#d4af37]/50 text-white font-bold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-md pointer-events-none"
              >
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>Эрх Хүлээн Авах & Нууц Үг Тохируулах (Дээж)</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* CREATED INVITATIONS LIST & MANAGEMENT TABLE */}
      <div className="bg-stone-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
        
        {/* Table Filter & Search Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-stone-800">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white font-serif flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#d4af37]" />
              <span>Үүсгэсэн Админ Урилгуудын Жагсаалт</span>
            </h2>
            <p className="text-xs text-stone-400">
              Нийт үүсгэгдсэн урилгуудын статус, холбоос болон цуцлах/дахин илгээх үйлдлүүд.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Нэр, и-мэйлээр хайх..."
                className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-100 placeholder-stone-600 focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800 text-xs">
              {[
                { id: 'ALL', label: 'Бүгд' },
                { id: 'pending', label: 'Хүлээгдэж буй' },
                { id: 'accepted', label: 'Баталгаажсан' },
                { id: 'revoked', label: 'Цуцлагдсан' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all text-[11px] ${
                    filterStatus === tab.id
                      ? 'bg-[#d4af37] text-slate-950 font-bold shadow-md'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        {filteredInvitations.length === 0 ? (
          <div className="p-12 text-center text-stone-500 space-y-3">
            <AlertCircle className="w-8 h-8 text-stone-600 mx-auto" />
            <p className="text-xs font-semibold">Урилга олдсонгүй.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-800 text-stone-400 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Хүлээн Авагч</th>
                  <th className="py-3 px-4">Эрх / Үүрэг</th>
                  <th className="py-3 px-4">Статус</th>
                  <th className="py-3 px-4">Үүсгэсэн / Дуусах</th>
                  <th className="py-3 px-4 text-right">Үйлдлүүд</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 font-medium">
                {filteredInvitations.map((inv) => {
                  const roleData = ROLE_DESCRIPTIONS[inv.role] || ROLE_DESCRIPTIONS['Manager'];
                  const link = getInviteLink(inv.token);
                  const isCopied = copiedId === inv.id;

                  return (
                    <tr key={inv.id} className="hover:bg-stone-950/50 transition-colors">
                      {/* Name & Email */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-bold text-white text-sm">{inv.recipientName}</div>
                        <div className="text-stone-400 text-[11px] flex items-center gap-1 font-mono">
                          <Mail className="w-3 h-3 text-stone-500" />
                          <span>{inv.recipientEmail}</span>
                        </div>
                        {inv.note && (
                          <div className="text-[10px] text-amber-200/80 italic line-clamp-1">
                            "{inv.note}"
                          </div>
                        )}
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-block ${roleData.badgeBg}`}>
                          {roleData.title}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-4">
                        {inv.status === 'pending' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                            <span>Хүлээгдэж буй</span>
                          </span>
                        )}
                        {inv.status === 'accepted' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Баталгаажсан</span>
                          </span>
                        )}
                        {inv.status === 'revoked' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-300">
                            <Ban className="w-3 h-3 text-rose-400" />
                            <span>Цуцлагдсан</span>
                          </span>
                        )}
                        {inv.status === 'expired' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-800 border border-stone-700 text-stone-400">
                            <Clock className="w-3 h-3" />
                            <span>Хугацаа дууссан</span>
                          </span>
                        )}
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-4 text-[11px] text-stone-400 font-mono space-y-0.5">
                        <div>Үүсгэсэн: <span className="text-stone-300">{new Date(inv.createdAt).toLocaleDateString()}</span></div>
                        <div>Дуусах: <span className="text-amber-300">{new Date(inv.expiresAt).toLocaleDateString()}</span></div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right space-x-1.5 shrink-0">
                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopyLink(inv)}
                          title="Холбоос хуулах"
                          className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 hover:text-white hover:border-[#d4af37] transition-all inline-flex items-center gap-1 text-[11px] font-bold"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Хууллаа</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                              <span>Холбоос</span>
                            </>
                          )}
                        </button>

                        {/* Resend button if pending */}
                        {inv.status === 'pending' && (
                          <button
                            onClick={() => handleResend(inv)}
                            title="Дахин илгээх"
                            className="p-2 rounded-xl bg-sky-950/60 border border-sky-800/60 text-sky-300 hover:bg-sky-900 transition-all inline-flex items-center gap-1 text-[11px]"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Revoke button */}
                        {inv.status === 'pending' && (
                          <button
                            onClick={() => handleRevoke(inv.id)}
                            title="Урилга цуцлах"
                            className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 hover:bg-rose-900/60 transition-all inline-flex items-center gap-1 text-[11px]"
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(inv.id)}
                          title="Устгах"
                          className="p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-500 hover:text-rose-400 hover:border-rose-900 transition-all inline-flex items-center gap-1 text-[11px]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
