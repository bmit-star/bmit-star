import React, { useState } from 'react';
import { 
  QrCode, Search, CheckCircle2, XCircle, Clock, Users, UserCheck, 
  UserX, HelpCircle, ShieldCheck, Camera, Sparkles, RefreshCw, Plus, Check, Smartphone, Download
} from 'lucide-react';
import { Order, RSVP } from '../../types';

interface CheckInConsoleProps {
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
  initialOrderId?: string;
}

export const CheckInConsole: React.FC<CheckInConsoleProps> = ({
  orders,
  onUpdateOrder,
  initialOrderId
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialOrderId || (orders.length > 0 ? orders[0].id : '')
  );

  const activeOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'checked-in' | 'pending' | 'attending' | 'maybe' | 'declined'>('all');
  const [scannedToken, setScannedToken] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string; guestName?: string } | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);

  // Walk-in Guest Form State
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestCount, setNewGuestCount] = useState(1);

  if (!activeOrder) {
    return (
      <div className="p-12 text-center text-slate-400">
        <p className="text-sm">Одоогоор идэвхтэй урилгын захиалга олдсонгүй.</p>
      </div>
    );
  }

  const rsvps = activeOrder.invitationData.rsvps || [];

  // Metrics
  const totalRsvps = rsvps.length;
  const attendingList = rsvps.filter(r => r.attendance === 'attending');
  const maybeList = rsvps.filter(r => r.attendance === 'maybe');
  const declinedList = rsvps.filter(r => r.attendance === 'declined');

  const checkedInList = rsvps.filter(r => r.checkInStatus === 'checked-in');
  const pendingCheckInList = attendingList.filter(r => r.checkInStatus !== 'checked-in');

  const totalExpectedGuests = attendingList.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const actualAttendedGuests = checkedInList.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);

  const attendanceRate = attendingList.length > 0 
    ? Math.round((checkedInList.length / attendingList.length) * 100) 
    : 0;

  // Toggle Check-in status for a single guest
  const handleToggleCheckIn = (rsvpId: string) => {
    const updatedRsvps = rsvps.map(r => {
      if (r.id === rsvpId) {
        const isAlreadyCheckedIn = r.checkInStatus === 'checked-in';
        return {
          ...r,
          checkInStatus: isAlreadyCheckedIn ? 'pending' : 'checked-in' as 'checked-in' | 'pending',
          checkInTime: isAlreadyCheckedIn ? undefined : new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return r;
    });

    const updatedOrder: Order = {
      ...activeOrder,
      invitationData: {
        ...activeOrder.invitationData,
        rsvps: updatedRsvps
      }
    };

    onUpdateOrder(updatedOrder);
  };

  // Perform Token Check-in
  const handleTokenCheckIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const tokenToSearch = scannedToken.trim().toUpperCase();
    if (!tokenToSearch) return;

    const matchedRsvp = rsvps.find(r => 
      (r.token && r.token.toUpperCase() === tokenToSearch) ||
      r.id.toUpperCase() === tokenToSearch ||
      r.phone === tokenToSearch
    );

    if (matchedRsvp) {
      if (matchedRsvp.checkInStatus === 'checked-in') {
        setScanResult({
          success: true,
          message: `⚠️ "${matchedRsvp.guestName}" хэдийнэ Check-in хийгдсэн байна (${matchedRsvp.checkInTime || 'Өмнө нь'}).`,
          guestName: matchedRsvp.guestName
        });
      } else {
        // Perform Check-in
        const nowTime = new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' });
        const updatedRsvps = rsvps.map(r => r.id === matchedRsvp.id ? {
          ...r,
          attendance: 'attending' as const,
          checkInStatus: 'checked-in' as const,
          checkInTime: nowTime
        } : r);

        const updatedOrder: Order = {
          ...activeOrder,
          invitationData: {
            ...activeOrder.invitationData,
            rsvps: updatedRsvps
          }
        };

        onUpdateOrder(updatedOrder);

        setScanResult({
          success: true,
          message: `🎉 АМЖИЛТТАЙ CHECK-IN: "${matchedRsvp.guestName}" (${matchedRsvp.guestCount || 1} хүн)`,
          guestName: matchedRsvp.guestName
        });
      }
      setScannedToken('');
    } else {
      setScanResult({
        success: false,
        message: `❌ Токен болон дугаар олдсонгүй: "${tokenToSearch}"`
      });
    }

    setTimeout(() => {
      setScanResult(null);
    }, 5000);
  };

  // Add Walk-in Guest
  const handleAddWalkInGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    const token = `AURA-WALK-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const nowTime = new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' });

    const newRsvp: RSVP = {
      id: 'rsvp-' + Date.now(),
      guestName: newGuestName.trim(),
      phone: newGuestPhone.trim() || undefined,
      attendance: 'attending',
      guestCount: newGuestCount,
      submittedAt: new Date().toISOString(),
      token: token,
      checkInStatus: 'checked-in',
      checkInTime: nowTime,
      note: 'Хаалганы дээрх шууд бүртгэл (Walk-in)'
    };

    const updatedOrder: Order = {
      ...activeOrder,
      invitationData: {
        ...activeOrder.invitationData,
        rsvps: [newRsvp, ...rsvps]
      }
    };

    onUpdateOrder(updatedOrder);

    setNewGuestName('');
    setNewGuestPhone('');
    setNewGuestCount(1);
    setShowAddGuestModal(false);

    setScanResult({
      success: true,
      message: `🎉 Walk-In Зочин нэмэгдэж баталгаажлаа: "${newRsvp.guestName}"`
    });
    setTimeout(() => setScanResult(null), 4000);
  };

  // Filter List
  const filteredRsvps = rsvps.filter(r => {
    // Search matching
    const query = searchQuery.toLowerCase().trim();
    const nameMatch = r.guestName.toLowerCase().includes(query);
    const phoneMatch = r.phone ? r.phone.includes(query) : false;
    const tokenMatch = r.token ? r.token.toLowerCase().includes(query) : false;
    const matchesSearch = !query || nameMatch || phoneMatch || tokenMatch;

    // Status filter
    if (filterStatus === 'checked-in') return matchesSearch && r.checkInStatus === 'checked-in';
    if (filterStatus === 'pending') return matchesSearch && r.attendance === 'attending' && r.checkInStatus !== 'checked-in';
    if (filterStatus === 'attending') return matchesSearch && r.attendance === 'attending';
    if (filterStatus === 'maybe') return matchesSearch && r.attendance === 'maybe';
    if (filterStatus === 'declined') return matchesSearch && r.attendance === 'declined';

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Order Selector */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              V2.1 Check-in Консол
            </span>
            <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              QR Сканнер бэлэн
            </span>
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Ирц & QR Баталгаажуулалт</span>
          </h2>
          <p className="text-xs text-slate-400">
            {activeOrder.invitationData.eventTitle || `${activeOrder.invitationData.brideName} & ${activeOrder.invitationData.groomName}`}
          </p>
        </div>

        {/* Order Switcher */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 text-xs">
            <span className="text-slate-400 pl-2">Арга хэмжээ:</span>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="bg-slate-900 text-amber-300 font-semibold px-3 py-1.5 rounded-xl border border-slate-700 focus:outline-none"
            >
              {orders.map(o => (
                <option key={o.id} value={o.id}>
                  {o.invitationData.eventTitle || o.customerName} ({o.orderNumber})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* DASHBOARD METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total RSVP */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-medium">Нийт RSVP</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white">{totalRsvps}</div>
          <div className="text-[10px] text-slate-400">Нийт хариулсан</div>
        </div>

        {/* Checked In */}
        <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-semibold">Ирсэн (Checked-In)</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">{checkedInList.length}</div>
          <div className="text-[10px] text-emerald-400/80 font-medium">{actualAttendedGuests} хүн суудалд</div>
        </div>

        {/* Pending Check-In */}
        <div className="bg-amber-950/40 p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-semibold">Ирээгүй Хүлээгдэж буй</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{pendingCheckInList.length}</div>
          <div className="text-[10px] text-amber-400/80 font-medium">{totalExpectedGuests - actualAttendedGuests} хүн дутуу</div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-indigo-950/40 p-4 rounded-2xl border border-indigo-500/30 space-y-1">
          <div className="flex items-center justify-between text-indigo-300">
            <span className="text-[11px] font-semibold">Ирцийн Хувь</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-200">{attendanceRate}%</div>
          <div className="text-[10px] text-indigo-400">Ирэхээс баталгаажсан</div>
        </div>

        {/* Maybe */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-amber-200">
            <span className="text-[11px] font-medium">Магадгүй</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-200">{maybeList.length}</div>
          <div className="text-[10px] text-slate-400">Эргэлзээтэй</div>
        </div>

        {/* Declined */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-rose-300">
            <span className="text-[11px] font-medium">Очихгүй</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300">{declinedList.length}</div>
          <div className="text-[10px] text-slate-400">Татгалзсан</div>
        </div>
      </div>

      {/* SCAN & MANUAL TOKEN ENTRY BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-6 rounded-3xl border border-amber-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-0.5">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-400" />
              <span>Хүрэлцэн ирсэн зочны QR Код / Токен сканнердах</span>
            </h3>
            <p className="text-xs text-slate-400">Зочны утсан дээрх QR кодыг сканнердах эсвэл Токен дугаарыг оруулж 1-секундэд Check-in хийнэ үү</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsCameraActive(!isCameraActive)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                isCameraActive 
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' 
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>{isCameraActive ? 'Камера Хаах' : 'Камера Сканнер Нээх'}</span>
            </button>

            <button
              onClick={() => setShowAddGuestModal(true)}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Хаалганы Зочин Нэмэх</span>
            </button>
          </div>
        </div>

        {/* Live Camera Scanner Simulator / View */}
        {isCameraActive && (
          <div className="bg-black/90 p-6 rounded-2xl border border-amber-500/40 relative flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-64 h-64 border-2 border-dashed border-amber-400 rounded-3xl flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b from-amber-500/10 to-transparent animate-pulse">
              <QrCode className="w-16 h-16 text-amber-400 mb-2 opacity-80" />
              <span className="text-xs font-bold text-amber-300">QR Камера Сканнер Идэвхтэй</span>
              <span className="text-[10px] text-slate-400 mt-1">QR кодыг дэлгэц рүү чиглүүлнэ үү</span>
              
              {/* Scan laser line */}
              <div className="absolute inset-x-0 h-0.5 bg-amber-400 top-1/2 -translate-y-1/2 shadow-[0_0_12px_#f59e0b] animate-bounce" />
            </div>

            {/* Simulated quick tap test tokens */}
            <div className="space-y-1.5 max-w-lg">
              <span className="text-[11px] text-slate-400 font-medium block">Түргэн туршилтын бүртгэлтэй зочид (Товшиж сканнердах):</span>
              <div className="flex flex-wrap justify-center gap-2">
                {attendingList.slice(0, 4).map(r => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setScannedToken(r.token || r.id);
                      handleTokenCheckIn();
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5"
                  >
                    <span>{r.guestName}:</span>
                    <span className="font-bold text-white">{r.token || r.id.slice(0,6)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Manual Token or Phone Input Form */}
        <form onSubmit={handleTokenCheckIn} className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <QrCode className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
            <input
              type="text"
              value={scannedToken}
              onChange={(e) => setScannedToken(e.target.value)}
              placeholder="Токен дугаар эсвэл Утасны дугаар оруулна уу (д.ш: AURA-EVT-9X2P эсвэл 99112233)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-3 text-sm text-white font-mono placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-2xl text-xs transition-all shadow-lg shadow-amber-500/20 shrink-0 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950" />
            <span>Check-in Баталгаажуулах</span>
          </button>
        </form>

        {/* Feedback Message Banner */}
        {scanResult && (
          <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between gap-3 animate-fade-in ${
            scanResult.success 
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10' 
              : 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-lg shadow-rose-500/10'
          }`}>
            <span>{scanResult.message}</span>
            <button onClick={() => setScanResult(null)} className="text-white/70 hover:text-white">✕</button>
          </div>
        )}
      </div>

      {/* SEARCH BAR & FILTER TABS */}
      <div className="bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Нэр, утас, токеноор хайх..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Filter Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs w-full md:w-auto">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterStatus === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Нийт ({totalRsvps})
            </button>
            <button
              onClick={() => setFilterStatus('checked-in')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterStatus === 'checked-in'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Ирсэн ({checkedInList.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterStatus === 'pending'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-amber-300 hover:text-amber-200'
              }`}
            >
              Ирээгүй ({pendingCheckInList.length})
            </button>
            <button
              onClick={() => setFilterStatus('attending')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterStatus === 'attending'
                  ? 'bg-slate-800 text-white font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Очно ({attendingList.length})
            </button>
            <button
              onClick={() => setFilterStatus('maybe')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterStatus === 'maybe'
                  ? 'bg-slate-800 text-amber-200 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Магадгүй ({maybeList.length})
            </button>
            <button
              onClick={() => setFilterStatus('declined')}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                filterStatus === 'declined'
                  ? 'bg-slate-800 text-rose-300 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              Очихгүй ({declinedList.length})
            </button>
          </div>
        </div>

        {/* GUESTS TABLE LIST */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Зочны Нэр & Утас</th>
                <th className="p-3.5">RSVP Төлөв</th>
                <th className="p-3.5">Токен / QR</th>
                <th className="p-3.5">Check-in Төлөв</th>
                <th className="p-3.5 text-center">Хүний Тоо / Цэс</th>
                <th className="p-3.5 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredRsvps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    Хайлтанд тохирох зочин олдсонгүй.
                  </td>
                </tr>
              ) : (
                filteredRsvps.map((rsvp) => {
                  const isCheckedIn = rsvp.checkInStatus === 'checked-in';
                  return (
                    <tr key={rsvp.id} className="hover:bg-slate-900/50 transition-colors">
                      {/* Name & Phone */}
                      <td className="p-3.5">
                        <div className="font-bold text-white text-sm">{rsvp.guestName}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{rsvp.phone || 'Утасгүй'}</div>
                        {rsvp.note && (
                          <div className="text-[10px] text-amber-400/80 italic mt-0.5">"{rsvp.note}"</div>
                        )}
                      </td>

                      {/* RSVP Status */}
                      <td className="p-3.5">
                        {rsvp.attendance === 'attending' && (
                          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                            🟢 Очно
                          </span>
                        )}
                        {rsvp.attendance === 'maybe' && (
                          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                            🟡 Магадгүй
                          </span>
                        )}
                        {rsvp.attendance === 'declined' && (
                          <span className="bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1">
                            🔴 Очихгүй
                          </span>
                        )}
                      </td>

                      {/* Token & Device fingerprint */}
                      <td className="p-3.5">
                        <div className="font-mono text-amber-300 text-xs font-bold bg-slate-900 border border-slate-800 px-2 py-1 rounded-md inline-block">
                          {rsvp.token || 'TOKEN-NONE'}
                        </div>
                        <div className="text-[9px] text-slate-500 mt-1 flex items-center gap-1">
                          <Smartphone className="w-2.5 h-2.5" />
                          <span>Фингерпринт: #{rsvp.id.slice(-6)}</span>
                        </div>
                      </td>

                      {/* Check-In Status & Time */}
                      <td className="p-3.5">
                        {isCheckedIn ? (
                          <div className="space-y-0.5">
                            <span className="bg-emerald-500 text-slate-950 font-bold px-2.5 py-1 rounded-lg text-[11px] inline-flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                              <span>Ирсэн</span>
                            </span>
                            <div className="text-[10px] text-emerald-400 font-mono">
                              ⏰ {rsvp.checkInTime || 'Баталгаажсан'}
                            </div>
                          </div>
                        ) : (
                          <span className="bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg text-[11px] font-medium inline-flex items-center gap-1 border border-slate-700">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ирээгүй</span>
                          </span>
                        )}
                      </td>

                      {/* Guest count & Meal */}
                      <td className="p-3.5 text-center">
                        <div className="font-bold text-white">{rsvp.guestCount || 1} хүн</div>
                        <div className="text-[10px] text-slate-400">{rsvp.mealPreference || 'Стандарт'}</div>
                      </td>

                      {/* Action Toggle Button */}
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleCheckIn(rsvp.id)}
                          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-1 ml-auto ${
                            isCheckedIn
                              ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                          }`}
                        >
                          {isCheckedIn ? (
                            <>
                              <XCircle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Цуцлах</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                              <span>Check-In</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WALK-IN GUEST MODAL */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>Хаалганы Шинэ Зочин Нэмэх</span>
              </h3>
              <button onClick={() => setShowAddGuestModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddWalkInGuest} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">Зочны Бүтэн Нэр *</label>
                <input
                  type="text"
                  required
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  placeholder="Жишээ: Б.Энхжин"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Утасны Дугаар</label>
                <input
                  type="text"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  placeholder="99001122"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">Дагалдан Хүний Тоо</label>
                <select
                  value={newGuestCount}
                  onChange={(e) => setNewGuestCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n} хүн</option>)}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGuestModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20"
                >
                  Нэмэх & Шууд Check-in
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
