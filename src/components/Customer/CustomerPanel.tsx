import React, { useState } from 'react';
import { 
  Eye, Copy, Check, QrCode, Share2, MessageSquarePlus, 
  Lock, Clock, CheckCircle2, ShieldCheck, Sparkles, Send, X, ExternalLink,
  Users, MessageSquare, Image as ImageIcon, Heart, Phone, Utensils, UserCheck, Trophy, Bell,
  Mail, KeyRound, LogOut, AlertCircle, Unlock, Cloud, AlertTriangle, HardDrive, Download
} from 'lucide-react';
import { Order, ChangeRequest } from '../../types';
import { DevicePreviewFrame } from '../Shared/DevicePreviewFrame';
import { LuxuryInvitationView } from '../Guest/LuxuryInvitationView';
import { CheckInConsole } from '../Admin/CheckInConsole';
import { PhotoWallOrganizerPanel } from '../PhotoWall/PhotoWallOrganizerPanel';
import { LivePhotoWallScreen } from '../PhotoWall/LivePhotoWallScreen';
import { LuckyDrawModal } from '../LuckyDraw/LuckyDrawModal';
import { NotificationDrawer } from '../Notification/NotificationDrawer';
import { getShortInvitationUrl, normalizeImageUrl } from '../../lib/mediaUtils';
import { CloudinaryService } from '../../lib/cloudinaryService';

interface CustomerPanelProps {
  orders: Order[];
  onRequestChange: (orderId: string, note: string) => void;
  onOpenGuestView: (order: Order) => void;
  onUpdateOrder?: (updatedOrder: Order) => void;
}

export const CustomerPanel: React.FC<CustomerPanelProps> = ({
  orders,
  onRequestChange,
  onOpenGuestView,
  onUpdateOrder
}) => {
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string>(
    () => localStorage.getItem('customer_login_email') || ''
  );
  const [loginInputEmail, setLoginInputEmail] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');

  const [selectedOrderIndex, setSelectedOrderIndex] = useState<number>(0);
  const [showRequestModal, setShowRequestModal] = useState<boolean>(false);
  const [requestNote, setRequestNote] = useState<string>('');
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [customGuestName, setCustomGuestName] = useState<string>('Д.Батбаатар');
  const [copiedCustomLink, setCopiedCustomLink] = useState<boolean>(false);
  const [requestSubmitted, setRequestSubmitted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'checkin' | 'rsvps' | 'wishes' | 'photos'>('preview');
  const [showLiveScreen, setShowLiveScreen] = useState<boolean>(false);
  const [showLuckyDraw, setShowLuckyDraw] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = loginInputEmail.trim().toLowerCase();
    if (!trimmed) return;

    const matches = orders.filter(
      (o) => o.customerEmail.toLowerCase().trim() === trimmed
    );

    if (matches.length === 0) {
      setLoginError(`"${trimmed}" имэйл дээр одоогоор захиалга олдсонгүй. Та захиалсан имэйл хаягаа зөв оруулна уу.`);
      return;
    }

    setLoginError('');
    setAuthenticatedEmail(trimmed);
    localStorage.setItem('customer_login_email', trimmed);
    setSelectedOrderIndex(0);
  };

  const handleLogout = () => {
    setAuthenticatedEmail('');
    localStorage.removeItem('customer_login_email');
    setLoginInputEmail('');
    setLoginError('');
  };

  // 1. EMAIL AUTHENTICATION SCREEN (Hidden by default to protect private orders)
  if (!authenticatedEmail) {
    return (
      <div className="max-w-md mx-auto my-12 bg-stone-900/90 border border-amber-500/30 rounded-3xl p-8 text-center space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-amber-200">Захиалагчийн Хэсэгт Нэвтрэх</h2>
          <p className="text-xs text-white/60 leading-relaxed">
            Та захиалга өгсөн эсвэл бүртгүүлсэн Имэйл хаягаа оруулж захиалгаа шалгана уу.
          </p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="relative text-left">
            <Mail className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
            <input
              type="email"
              required
              value={loginInputEmail}
              onChange={(e) => setLoginInputEmail(e.target.value)}
              placeholder="Захиалгын имэйл хаягаа оруулна уу..."
              className="w-full bg-black/50 border border-white/10 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 font-medium"
            />
          </div>

          {loginError && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-300 text-left flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-extrabold py-3.5 rounded-2xl text-xs shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Захиалга Шалгах & Нэвтрэх</span>
          </button>
        </form>

        <div className="pt-4 border-t border-white/10 text-[11px] text-white/40">
          Захиалга өгөөгүй юу? <a href="/" className="text-amber-400 hover:underline font-bold">Нүүр хуудаснаас захиалга өгөх</a>
        </div>
      </div>
    );
  }

  // Filter orders for logged-in email
  const userOrders = orders.filter(
    (o) => o.customerEmail.toLowerCase().trim() === authenticatedEmail.toLowerCase().trim()
  );

  // 2. NO ORDER FOUND FOR THIS EMAIL
  if (userOrders.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 bg-stone-900/90 border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl text-white">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-rose-200">Захиалга Олдсонгүй</h3>
          <p className="text-xs text-white/60">
            <span className="font-bold text-amber-300">{authenticatedEmail}</span> имэйл дээр одоогоор захиалга бүртгэгдээгүй байна.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-3 rounded-2xl text-xs transition-all flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          <span>Өөр имэйл хаягаар орох</span>
        </button>
      </div>
    );
  }

  const currentOrder = userOrders[selectedOrderIndex] || userOrders[0];

  // 3. PENDING ADMIN APPROVAL / NEW ORDER STATUS
  if (currentOrder.status === 'New') {
    return (
      <div className="max-w-xl mx-auto my-8 bg-stone-900/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-white space-y-6">
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center gap-3">
          <div className="p-3 bg-amber-500/20 text-amber-300 rounded-xl shrink-0">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-amber-200">Захиалга Бүртгэгдсэн (Хүлээгдэж байна)</h3>
            <p className="text-xs text-white/70">
              Админ таны захиалгын мэдээллийг шалгаж, Захиалагчийн хэсгийг нээсний дараа та энд урилгаа урьдчилан харах, засах болон хуваалцах боломжтой болно.
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="text-white/50">Захиалгын Дугаар:</span>
            <span className="font-mono font-bold text-amber-300">{currentOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="text-white/50">Арга хэмжээ:</span>
            <span className="font-bold text-white">{currentOrder.invitationData.eventTitle}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="text-white/50">Захиалагч Имэйл:</span>
            <span className="text-white/80">{currentOrder.customerEmail}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/50">Захиалсан Огноо:</span>
            <span className="text-white/80">{new Date(currentOrder.createdAt).toLocaleDateString('mn-MN')}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold py-3 rounded-2xl text-xs transition-all"
          >
            Төлөв Сэргээх
          </button>
          <button
            onClick={handleLogout}
            className="px-5 bg-white/5 hover:bg-white/10 text-white/70 font-semibold py-3 rounded-2xl text-xs transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Гарах</span>
          </button>
        </div>
      </div>
    );
  }

  // 4. APPROVED / ACTIVE CUSTOMER PANEL
  const liveUrl = getShortInvitationUrl(currentOrder.uniqueSlug);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(liveUrl)}`;

  const rsvps = currentOrder.invitationData.rsvps || [];
  const attendingRsvps = rsvps.filter(r => r.attendance === 'attending');
  const totalAttendingGuests = attendingRsvps.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const wishes = currentOrder.invitationData.wishes || [];
  const photos = currentOrder.invitationData.couplePhotos || [];

  const handleSendChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestNote.trim()) return;
    onRequestChange(currentOrder.id, requestNote);
    setRequestNote('');
    setShowRequestModal(false);
    setRequestSubmitted(true);
    setTimeout(() => setRequestSubmitted(false), 3000);
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Customer Header */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-[#f9e5af] bg-[#d4af37]/20 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 backdrop-blur-sm">
              Захиалагчийн Хэсэг
            </span>
            <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Нээгдсэн ({authenticatedEmail})
            </span>
          </div>
          <h1 className="text-xl font-bold text-white">
            Тавтай морилно уу, {currentOrder.customerName}
          </h1>
          <p className="text-xs text-white/60">
            Админаас бэлтгэсэн тансаг дижитал урилгаа шалгах болон хуваалцах хэсэг
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Order Selector if customer has multiple */}
          {userOrders.length > 1 && (
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 text-xs">
              <span className="text-white/50 pl-2">Захиалга:</span>
              <select
                value={selectedOrderIndex}
                onChange={(e) => setSelectedOrderIndex(Number(e.target.value))}
                className="bg-black text-[#f9e5af] font-medium px-3 py-1.5 rounded-xl border border-white/10 focus:outline-none"
              >
                {userOrders.map((o, idx) => (
                  <option key={o.id} value={idx} className="bg-stone-900 text-white">
                    {o.invitationData.brideName} & {o.invitationData.groomName} ({o.orderNumber})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs border border-white/10 flex items-center gap-1.5 transition-colors"
            title="Гарах / Өөр имэйлээр нэвтрэх"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Гарах</span>
          </button>
        </div>
      </div>

      {/* STRICT NO-EDIT LAYOUT NOTICE */}
      <div className="bg-[#d4af37]/10 backdrop-blur-xl border border-[#d4af37]/30 p-4 rounded-2xl text-xs text-[#f9e5af] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xl">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#d4af37]/20 text-[#f9e5af] rounded-xl shrink-0 border border-[#d4af37]/30">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-white font-semibold block">Урилгын Эх Загвар Хамгаалагдсан</strong>
            <span className="text-white/70 text-[11px]">
              Манай админууд урилгын стандартыг чанд баримтлан дизайныг бэлтгэдэг. Хэрэв өөрчлөх зүйл байвал "Өөрчлөлт хүсэх" товчлуурыг дарж админд хүсэлт илгээнэ үү.
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => setShowLuckyDraw(true)}
            className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold px-3.5 py-2 rounded-xl text-xs transition-all shadow-md flex items-center gap-1.5"
            title="Азтан Тодруулах"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>🎁 Азтан</span>
          </button>

          <button
            onClick={() => setShowNotifications(true)}
            className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5"
            title="Мэдэгдэл"
          >
            <Bell className="w-3.5 h-3.5 text-sky-400" />
            <span>Мэдэгдэл</span>
          </button>

          <button
            onClick={() => setShowRequestModal(true)}
            className="bg-[#d4af37] hover:bg-[#e5be48] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-[#d4af37]/20 flex items-center gap-1.5"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Өөрчлөлт хүсэх</span>
          </button>
        </div>
      </div>

      {/* CLOUDINARY 30-DAY STORAGE RETENTION BANNER */}
      {(() => {
        const storageInfo = CloudinaryService.getOrderStorageInfo(currentOrder);
        const percentLeft = Math.round((storageInfo.remainingDays / 30) * 100);

        return (
          <div className={`p-5 rounded-3xl border backdrop-blur-xl shadow-2xl space-y-3 transition-all ${
            storageInfo.isWarning
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-200'
              : storageInfo.isExpired
              ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
              : 'bg-stone-900/80 border-white/10 text-white'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl shrink-0 ${
                  storageInfo.isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'
                }`}>
                  <Cloud className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">
                      Cloudinary Хадгалах Сан (30 Хоног)
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      storageInfo.isWarning
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    }`}>
                      {storageInfo.isWarning ? '⚠️ 5 ХОНОГ ҮЛДЛЭЭ' : 'Идэвхтэй'}
                    </span>
                  </div>
                  <p className="text-white/60 text-[11px]">
                    Захиалагч бүрийн датаг 30 хоног хадгалах бодлого: <strong className="text-amber-300">{storageInfo.expiresAt}</strong> огноонд автоматаар устгагдана.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-black/40 p-3 rounded-2xl border border-white/10">
                <div className="text-right">
                  <span className="text-[10px] uppercase text-white/50 block">Үлдсэн хугацаа</span>
                  <span className="text-lg font-bold font-mono text-amber-300">{storageInfo.remainingDays} хоног</span>
                </div>
                <div className="w-24 bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      storageInfo.isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${percentLeft}%` }}
                  />
                </div>
              </div>
            </div>

            {storageInfo.isWarning && (
              <div className="p-3 bg-amber-500/20 border border-amber-500/30 rounded-2xl text-[11px] text-amber-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    <strong>Анхааруулга (5 хоногийн өмнөх сануулга):</strong> Хадгалах сангийн хугацаа дуусахад 5-аас цөөн хоног үлдлээ. 30 хоног дуусахад медиа файлууд устгагдах тул датагаа татаж авна уу!
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* Status Progress Pipeline */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <h3 className="font-bold text-sm text-white">Захиалгын Төлөв Ба Явц</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {[
            { step: '1', title: 'Захиалга авсан', desc: 'Админ хүлээн авлаа', done: true },
            { step: '2', title: 'Админ бэлтгэж байна', desc: 'Мэдээллийг оруулж байна', done: currentOrder.status !== 'New' },
            { step: '3', title: 'Шалгахад бэлэн', desc: 'Харилцагч шалгах', done: currentOrder.status === 'Ready for Preview' || currentOrder.status === 'Published' },
            { step: '4', title: 'Нийтлэгдсэн', desc: 'Цахим холбоос бэлэн', done: currentOrder.status === 'Published' }
          ].map((s, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border transition-all backdrop-blur-md ${
                s.done
                  ? 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#f9e5af] shadow-md'
                  : 'bg-black/40 border-white/10 text-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-[10px] font-bold">АЛХАМ 0{s.step}</span>
                {s.done && <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />}
              </div>
              <h4 className="font-bold text-white text-xs">{s.title}</h4>
              <p className="text-[10px] opacity-80">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOMER ANALYTICS & STATS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-[#d4af37]">
            <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Харсан хүний тоо</span>
            <Eye className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{currentOrder.viewsCount || 0}</div>
          <p className="text-[10px] text-white/50">Урилгын линк нээсэн үзэлт</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Ирэх Зочид (RSVP)</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-[#f9e5af] font-mono">{totalAttendingGuests} хүн</div>
          <p className="text-[10px] text-white/50">Баталгаажуулсан зочидын тоо</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Сэтгэгдэл / Ерөөл</span>
            <Heart className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{wishes.length}</div>
          <p className="text-[10px] text-white/50">Зочдоос ирсэн ерөөлийн үгс</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-lg space-y-1">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">Зургийн тоо</span>
            <ImageIcon className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-white font-mono">{photos.length}</div>
          <p className="text-[10px] text-white/50">Цомогт оруулсан зураг</p>
        </div>
      </div>

      {/* CUSTOMER TABS */}
      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 text-xs font-semibold overflow-x-auto shadow-xl">
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'preview'
              ? 'bg-[#d4af37] text-slate-950 font-bold shadow-lg shadow-[#d4af37]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Өөрийн Урилгаа Харах & Хуваалцах</span>
        </button>

        <button
          onClick={() => setActiveTab('checkin')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'checkin'
              ? 'bg-[#d4af37] text-slate-950 font-bold shadow-lg shadow-[#d4af37]/20'
              : 'text-emerald-400 hover:text-emerald-300 hover:bg-white/5'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-400" />
          <span>🎟️ Ирц & Check-in Консол</span>
        </button>

        <button
          onClick={() => setActiveTab('rsvps')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'rsvps'
              ? 'bg-[#d4af37] text-slate-950 font-bold shadow-lg shadow-[#d4af37]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Ирэх Зочидын Жагсаалт ({rsvps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishes')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'wishes'
              ? 'bg-[#d4af37] text-slate-950 font-bold shadow-lg shadow-[#d4af37]/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ерөөлийн Үгс ({wishes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'photos'
              ? 'bg-[#d4af37] text-slate-950 font-bold shadow-lg shadow-[#d4af37]/20'
              : 'text-amber-300 hover:text-amber-200 hover:bg-white/5'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-amber-400" />
          <span>📸 Зургийн Хана Батлах Хэсэг</span>
        </button>
      </div>

      {/* TAB CONTENT: PREVIEW */}
      {activeTab === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-8 bg-black/40 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                Урилгын Урьдчилан Харах Бүрэн Дэлгэц
              </span>
              <div className="flex gap-2">
                {(['mobile', 'desktop'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setDeviceMode(m)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-semibold uppercase transition-all ${
                      deviceMode === m
                        ? 'bg-[#d4af37] text-slate-950'
                        : 'bg-white/10 text-white/60 hover:bg-white/20'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black min-h-[600px] flex items-center justify-center p-2">
              <DevicePreviewFrame mode={deviceMode}>
                <LuxuryInvitationView invitationData={currentOrder.invitationData} />
              </DevicePreviewFrame>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl space-y-3">
              <h4 className="font-bold text-xs uppercase tracking-wider text-[#f9e5af] flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-[#d4af37]" />
                Урилгын Цахим Линк Хуваалцах
              </h4>
              <p className="text-[11px] text-white/60">
                Энэхүү цахим холбоосыг зочид руугаа Чат, Сошиал эсвэл SMS-ээр шууд илгээнэ үү.
              </p>

              <div className="flex items-center gap-2 bg-black/60 p-2 rounded-2xl border border-white/10 font-mono text-xs">
                <input
                  type="text"
                  readOnly
                  value={liveUrl}
                  className="bg-transparent text-white w-full focus:outline-none text-[11px]"
                />
                <button
                  onClick={copyLinkToClipboard}
                  className="bg-[#d4af37] hover:bg-[#e5be48] text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs shrink-0 flex items-center gap-1 transition-all"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink ? 'Хууллаа!' : 'Хуулах'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onOpenGuestView(currentOrder)}
                  className="w-full bg-white/10 hover:bg-white/15 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-white/10"
                >
                  <ExternalLink className="w-4 h-4 text-[#d4af37]" />
                  <span>Шинэ Цонхонд Нээж Харах</span>
                </button>
              </div>

              {/* PERSONALIZED GUEST LINK GENERATOR */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-2.5 text-left mt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Хувийн Урилгын Линк Үүсгэх (?to=Нэр)</span>
                  </span>
                </div>
                <p className="text-[10px] text-white/60">
                  Зочныхоо нэрийг оруулж урилгаа тухайн хүндээ зориулж нэрээр нь урина.
                </p>

                <div className="space-y-2 text-xs">
                  <input
                    type="text"
                    value={customGuestName}
                    onChange={(e) => setCustomGuestName(e.target.value)}
                    placeholder="Зочны нэр оруулна уу (жишээ: Д.Батбаатар)"
                    className="w-full bg-black/60 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400 font-medium"
                  />

                  {customGuestName.trim() && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          const pUrl = `${liveUrl}?to=${encodeURIComponent(customGuestName.trim())}`;
                          navigator.clipboard.writeText(pUrl);
                          setCopiedCustomLink(true);
                          setTimeout(() => setCopiedCustomLink(false), 2000);
                        }}
                        className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-2 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1 shadow-md shadow-amber-500/10"
                      >
                        {copiedCustomLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCustomLink ? 'Хууллаа!' : 'Хувийн Линк Хуулах'}</span>
                      </button>

                      <button
                        onClick={() => {
                          const pUrl = `${liveUrl}?to=${encodeURIComponent(customGuestName.trim())}`;
                          window.open(pUrl, '_blank');
                        }}
                        className="px-3 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold rounded-xl text-[11px] border border-amber-500/30 transition-all flex items-center gap-1"
                        title="Зочны нэртэй урилгыг турших"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Турших</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl space-y-3 text-center">
              <h4 className="font-bold text-xs uppercase tracking-wider text-white flex items-center justify-center gap-1.5">
                <QrCode className="w-4 h-4 text-[#d4af37]" />
                Урилгын QR Код
              </h4>
              <div className="bg-white p-3 rounded-2xl inline-block shadow-lg border border-white/20">
                <img src={qrCodeUrl} alt="Invitation QR" className="w-36 h-36" />
              </div>
              <p className="text-[10px] text-white/50">Хэвлэмэл картанд байршуулах QR код</p>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT: CHECKIN CONSOLE */}
      {activeTab === 'checkin' && (
        <CheckInConsole
          orders={[currentOrder]}
          onUpdateOrder={(updated) => {
            if (onUpdateOrder) onUpdateOrder(updated);
          }}
        />
      )}

      {/* TAB CONTENT: RSVPS */}
      {activeTab === 'rsvps' && (
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">Ирэхээ Баталгаажуулсан Зочид</h3>
            <span className="text-xs text-[#f9e5af] font-mono">Нийт: {rsvps.length} зочин</span>
          </div>

          {rsvps.length === 0 ? (
            <p className="text-xs text-white/40 py-8 text-center">Одоогоор ирэх баталгаажуулалт хийсэн зочин байхгүй байна.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-white/80">
                <thead className="bg-black/40 text-white/50 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Зочны Нэр</th>
                    <th className="py-3 px-4">Утас</th>
                    <th className="py-3 px-4">Шийдвэр</th>
                    <th className="py-3 px-4">Дагалдах Хүн</th>
                    <th className="py-3 px-4">Бүртгүүлсэн Огноо</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {rsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-white/5">
                      <td className="py-3 px-4 font-bold text-white">{r.guestName}</td>
                      <td className="py-3 px-4 text-white/60 font-mono">{r.phone || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.attendance === 'attending'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : r.attendance === 'maybe'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {r.attendance === 'attending' ? 'Очино' : r.attendance === 'maybe' ? 'Магадгүй' : 'Очихгүй'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{r.guestCount || 1} хүн</td>
                      <td className="py-3 px-4 text-white/40">{new Date(r.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: WISHES */}
      {activeTab === 'wishes' && (
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <h3 className="font-bold text-sm text-white">Зочдын Сэтгэгдэл & Ерөөлийн Үгс</h3>

          {wishes.length === 0 ? (
            <p className="text-xs text-white/40 py-8 text-center">Одоогоор зочдоос ирсэн сэтгэгдэл байхгүй байна.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {wishes.map((w) => (
                <div key={w.id} className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-[#f9e5af] font-semibold">
                    <span>{w.guestName}</span>
                    <span className="text-[10px] text-white/40 font-normal">{new Date(w.submittedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-white/90 italic font-serif leading-relaxed">"{w.message}"</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: V2.2 PHOTO WALL ORGANIZER PANEL */}
      {activeTab === 'photos' && (
        <PhotoWallOrganizerPanel
          order={currentOrder}
          onUpdateOrder={(updated) => {
            if (onUpdateOrder) onUpdateOrder(updated);
          }}
          onOpenLiveScreen={() => setShowLiveScreen(true)}
        />
      )}

      {/* LIVE SCREEN MODAL */}
      {showLiveScreen && (
        <LivePhotoWallScreen
          invitationData={currentOrder.invitationData}
          onClose={() => setShowLiveScreen(false)}
        />
      )}

      {/* LUCKY DRAW MODAL */}
      {showLuckyDraw && (
        <LuckyDrawModal
          order={currentOrder}
          onClose={() => setShowLuckyDraw(false)}
          onUpdateOrder={(updated) => {
            if (onUpdateOrder) onUpdateOrder(updated);
          }}
        />
      )}

      {/* NOTIFICATION DRAWER */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        order={currentOrder}
      />

      {/* REQUEST CHANGE MODAL */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/70 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 max-w-md w-full text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-base text-white">Админд Өөрчлөлтийн Хүсэлт Илгээх</h3>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendChangeRequest} className="space-y-3 text-xs">
              <p className="text-white/60">
                Засахыг хүссэн мэдээллээ тодорхой бичнэ үү (Жишээ нь: эхлэх цаг солих, хаяг засах, зураг шинэчлэх г.м):
              </p>

              <textarea
                required
                rows={4}
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                placeholder="Жишээ нь: Баярын цугларах цагийг 16:30 болгон өөрчилж өгнө үү..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37] backdrop-blur-md"
              />

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/15"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d4af37] text-slate-950 font-bold rounded-xl hover:bg-[#e5be48] shadow-md shadow-[#d4af37]/20 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Хүсэлт Илгээх
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
