import React, { useState } from 'react';
import { 
  Plus, Search, Filter, ArrowRight, MessageSquare, Check, 
  X, Eye, Edit3, Globe, Sparkles, User, Calendar, Unlock, Lock, CheckCircle2,
  Key, Copy, ExternalLink, ShieldCheck, Mail, Phone, Send, Cloud, AlertTriangle, RefreshCw
} from 'lucide-react';
import { Order, Template, OrderStatus, ChangeRequest } from '../../types';
import { CloudinaryService } from '../../lib/cloudinaryService';

interface OrdersManagerProps {
  orders: Order[];
  templates: Template[];
  onSelectOrderToEdit: (order: Order) => void;
  onCreateOrder: (newOrder: Order) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders,
  templates,
  onSelectOrderToEdit,
  onCreateOrder,
  onUpdateOrder
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [selectedOrderForCr, setSelectedOrderForCr] = useState<Order | null>(null);
  const [selectedOrderForAccess, setSelectedOrderForAccess] = useState<Order | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isCheckingRetention, setIsCheckingRetention] = useState<boolean>(false);
  const [retentionAuditLog, setRetentionAuditLog] = useState<string | null>(null);

  const handleRunRetentionAudit = async () => {
    setIsCheckingRetention(true);
    setRetentionAuditLog(null);
    try {
      const result = await CloudinaryService.checkStorageRetention(orders);
      if (result && result.success) {
        if (result.processedOrders && result.processedOrders.length > 0) {
          result.processedOrders.forEach(po => {
            const original = orders.find(o => o.id === po.id);
            if (original) {
              onUpdateOrder({
                ...original,
                storageExpiresAt: po.storageExpiresAt,
                storageStatus: po.storageStatus,
                storageWarningSent: po.storageWarningSent,
                storageWarningSentAt: po.storageWarningSentAt
              });
            }
          });
        }
        setRetentionAuditLog(`Cloudinary 30 хоногийн сангийн шалгалт амжилттай: ${result.checkedCount} захиалгын хадгалах хугацааг шалгаж 5 хоногийн сануулга болон цэвэрлэгээг тохирууллаа.`);
      }
    } catch (err) {
      setRetentionAuditLog('Cloudinary сервертэй холбогдоход алдаа гарлаа.');
    } finally {
      setIsCheckingRetention(false);
    }
  };

  // New Order Form State
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || '');

  // Filtering
  const filteredOrders = orders.filter(o => {
    const matchesStatus = selectedStatus === 'ALL' || o.status === selectedStatus;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      o.customerName.toLowerCase().includes(q) ||
      o.customerEmail.toLowerCase().includes(q) ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.invitationData.brideName.toLowerCase().includes(q) ||
      o.invitationData.groomName.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const handleCopyCustomerLoginLink = (email: string) => {
    const loginUrl = `${window.location.origin}/customer/login?email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(loginUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !brideName || !groomName) return;

    const chosenTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
    const newOrderNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = `${brideName.toLowerCase().replace(/\s+/g, '-')}-and-${groomName.toLowerCase().replace(/\s+/g, '-')}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: newOrderNumber,
      customerName: custName,
      customerEmail: custEmail || 'customer@example.mn',
      customerPhone: custPhone || '+976 9900-0000',
      templateId: chosenTemplate.id,
      templateTitle: chosenTemplate.title,
      status: 'New',
      createdAt: new Date().toISOString(),
      uniqueSlug: slug,
      viewsCount: 0,
      changeRequests: [],
      invitationData: {
        brideName,
        groomName,
        brideParents: 'Сүйт бүсгүйн эцэг эхийн гэр бүл',
        groomParents: 'Сүйт залуугийн эцэг эхийн гэр бүл',
        eventTitle: `${brideName} ба ${groomName} нарын хуримын баяр`,
        invitationMessage: 'Эцэг эхийн нэрэмжит хуримын баярт маань хүрэлцэн ирж, залуу хосод сэтгэлийн ерөөлөө өргөхийг урьж байна.',
        blessingText: '“Хоёр сэтгэл нэгдэж, нэгэн гал голомт бадрах болтугай.”',
        date: '2026 оны 9 сарын 12-ны Бямба гараг',
        time: '16:00 цагт',
        locationName: 'Шангри-Ла Улаанбаатар, Их Танхим',
        address: 'Сүхбаатар дүүрэг, Олимпийн гудамж 19',
        heroPhotoUrl: chosenTemplate.thumbnail,
        couplePhotos: [chosenTemplate.thumbnail],
        themeColor: chosenTemplate.sampleData?.themeColor || '#C5A059',
        secondaryColor: chosenTemplate.sampleData?.secondaryColor || '#0D2B1D',
        backgroundMusicTitle: chosenTemplate.musicTitle,
        backgroundMusicUrl: chosenTemplate.musicUrl,
        schedule: [
          { time: '16:00', title: 'Зочдыг угтан авах' },
          { time: '18:00', title: 'Хүндэтгэлийн зоог & Тоглолт' }
        ],
        dressCode: {
          title: 'Гоёлын хувцас / Үндэсний дээл',
          description: 'Эрхэм зочид та бүхэн гоёлын даашинз, костьюм эсвэл үндэсний дээлээр гоёно уу.',
          colorPalette: ['#C5A059', '#0D2B1D', '#1E1E1E']
        },
        giftInfo: {
          enabled: true,
          qpayMerchantName: `${brideName} & ${groomName} Хуримын Данс`,
          qpayQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QPay-Wedding-Fund',
          bankDetails: [
            { bankName: 'Хаан Банк', accountNumber: '5000000000', accountName: brideName }
          ]
        },
        showCountdown: true,
        showMusicPlayer: true,
        showGallery: true,
        showQrCode: true,
        showRsvp: true,
        showGuestBook: true,
        showLiveStream: false,
        rsvps: [],
        wishes: []
      }
    };

    onCreateOrder(newOrder);
    setShowCreateModal(false);
    // Reset form
    setCustName('');
    setCustEmail('');
    setCustPhone('');
    setBrideName('');
    setGroomName('');
  };

  const handleResolveChangeRequest = (crId: string, status: 'Applied' | 'Rejected') => {
    if (!selectedOrderForCr) return;
    const updatedCrs = selectedOrderForCr.changeRequests.map(cr => {
      if (cr.id === crId) {
        return {
          ...cr,
          status,
          adminResponse: status === 'Applied' ? 'Change request applied in editor.' : 'Declined per design guidelines.'
        };
      }
      return cr;
    });

    const updatedOrder = {
      ...selectedOrderForCr,
      changeRequests: updatedCrs
    };

    onUpdateOrder(updatedOrder);
    setSelectedOrderForCr(updatedOrder);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Захиалгын Управлений Жагсаалт
            <span className="text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Cloud className="w-3 h-3" /> Cloudinary 30d Retention
            </span>
          </h2>
          <p className="text-xs text-slate-400">Харилцагчдын захиалгыг хүлээн авах, загвар сонгох болон 30 хоногийн сануулах бодлогыг удирах</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunRetentionAudit}
            disabled={isCheckingRetention}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 border border-white/10 text-white px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all disabled:opacity-50"
            title="30 хоногийн сангийн хугацаа болон 5 хоногийн сануулга шалгах"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isCheckingRetention ? 'animate-spin' : ''}`} />
            <span>{isCheckingRetention ? 'Шалгаж байна...' : '30 Хоногийн Сан Шалгах'}</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-amber-500/10 transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Шинэ Захиалга Нэмэх</span>
          </button>
        </div>
      </div>

      {retentionAuditLog && (
        <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-2xl text-xs text-sky-200 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{retentionAuditLog}</span>
          </div>
          <button onClick={() => setRetentionAuditLog(null)} className="text-white/60 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/40 backdrop-blur-xl p-2.5 rounded-2xl border border-white/10 text-xs shadow-2xl">
        
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'New', 'In Preparation', 'Ready for Preview', 'Published'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap ${
                selectedStatus === status
                  ? 'bg-[#d4af37] text-slate-950 font-bold shadow-md shadow-[#d4af37]/20'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {status === 'ALL' ? 'Бүх захиалга' : status === 'New' ? 'Шинэ' : status === 'In Preparation' ? 'Бэлтгэж буй' : status === 'Ready for Preview' ? 'Шалгахад бэлэн' : 'Нийтлэгдсэн'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Захиалгын дугаар эсвэл нэрээр хайх..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37] backdrop-blur-md"
          />
        </div>

      </div>

      {/* Orders Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-black/60 text-white/50 font-semibold border-b border-white/10 uppercase tracking-wider text-[11px] backdrop-blur-md">
              <tr>
                <th className="py-3.5 px-4">Захиалгын №</th>
                <th className="py-3.5 px-4">Залуу Хос</th>
                <th className="py-3.5 px-4">Захиалагч</th>
                <th className="py-3.5 px-4">Сонгосон Загвар</th>
                <th className="py-3.5 px-4">30D Сан</th>
                <th className="py-3.5 px-4">Төлөв</th>
                <th className="py-3.5 px-4">Засварын Хүсэлт</th>
                <th className="py-3.5 px-4 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#white]/10">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-white/40">
                    Хайлтад тохирох захиалга олдсонгүй.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const pendingCrs = order.changeRequests.filter(cr => cr.status === 'Pending').length;
                  const storageInfo = CloudinaryService.getOrderStorageInfo(order);

                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-4 font-mono font-bold text-[#f9e5af]">
                        {order.orderNumber}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-white text-sm">
                          {order.invitationData.brideName} & {order.invitationData.groomName}
                        </div>
                        <div className="text-[11px] text-white/50">
                          {order.invitationData.date}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="text-white font-medium">{order.customerName}</div>
                        <div className="text-[11px] text-white/40">{order.customerEmail}</div>
                      </td>

                      <td className="py-4 px-4 text-white/80 font-medium">
                        {order.templateTitle}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1 ${
                            storageInfo.isWarning
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : storageInfo.isExpired
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          }`}>
                            <Cloud className="w-3 h-3" />
                            {storageInfo.isWarning ? `${storageInfo.remainingDays}д (Сануулга)` : `${storageInfo.remainingDays}д үлдсэн`}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-col gap-1.5 items-start">
                          <select
                            value={order.status}
                            onChange={(e) => onUpdateOrder({ ...order, status: e.target.value as OrderStatus })}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-xl border backdrop-blur-sm bg-black focus:outline-none cursor-pointer ${
                              order.status === 'Published'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : order.status === 'Ready for Preview'
                                ? 'bg-[#d4af37]/20 text-[#f9e5af] border-[#d4af37]/40'
                                : order.status === 'In Preparation'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}
                          >
                            <option value="New" className="bg-stone-900 text-rose-300">🔴 Шинэ (Хаалттай)</option>
                            <option value="In Preparation" className="bg-stone-900 text-blue-300">🔵 Бэлтгэж буй (Нээлттэй)</option>
                            <option value="Ready for Preview" className="bg-stone-900 text-amber-300">🟡 Шалгахад бэлэн</option>
                            <option value="Published" className="bg-stone-900 text-emerald-300">🟢 Нийтлэгдсэн</option>
                          </select>

                          {order.status === 'New' ? (
                            <button
                              onClick={() => onUpdateOrder({ ...order, status: 'In Preparation' })}
                              className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1 transition-all"
                              title="Захиалагчийн хэсгийг нээх"
                            >
                              <Unlock className="w-3 h-3 text-emerald-400" />
                              <span>Хэсэг нээх</span>
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400/80 flex items-center gap-1 font-medium">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Захиалагч нэвтрэх эрхтэй</span>
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {order.changeRequests.length > 0 ? (
                          <button
                            onClick={() => setSelectedOrderForCr(order)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1 transition-all ${
                              pendingCrs > 0
                                ? 'bg-[#d4af37]/20 text-[#f9e5af] border border-[#d4af37]/30 animate-pulse'
                                : 'bg-white/10 text-white/80 hover:bg-white/15'
                            }`}
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>{pendingCrs} Хүлээгдэж буй</span>
                          </button>
                        ) : (
                          <span className="text-white/30 text-[11px]">Байхгүй</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrderForAccess(order)}
                            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                            title="Захиалагчийн нэвтрэх эрх болон холбоос тохируулах"
                          >
                            <Key className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Эрх нээх</span>
                          </button>

                          <button
                            onClick={() => onSelectOrderToEdit(order)}
                            className="bg-[#d4af37] hover:bg-[#e5be48] text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-[#d4af37]/20 flex items-center gap-1.5"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Засах</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ORDER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/70 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-lg text-white">Шинэ Захиалга Үүсгэх</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/80 font-medium mb-1">Захиалагчийн Бүтэн Нэр</label>
                <input
                  type="text"
                  required
                  value={custName}
                  onChange={(e) => setCustName(e.target.value)}
                  placeholder="жишээ нь: Д.Болдмаа"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">И-мэйл хаяг</label>
                  <input
                    type="email"
                    value={custEmail}
                    onChange={(e) => setCustEmail(e.target.value)}
                    placeholder="boldmaa@example.mn"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-white/80 font-medium mb-1">Утасны дугаар</label>
                  <input
                    type="text"
                    value={custPhone}
                    onChange={(e) => setCustPhone(e.target.value)}
                    placeholder="+976 9911-0000"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Сүйт бүсгүйн нэр</label>
                  <input
                    type="text"
                    required
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    placeholder="жишээ нь: Номин"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md"
                  />
                </div>
                <div>
                  <label className="block text-white/80 font-medium mb-1">Сүйт залуугийн нэр</label>
                  <input
                    type="text"
                    required
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    placeholder="жишээ нь: Ганзориг"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-medium mb-1">Сонгох Урилгын Загвар</label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id} className="bg-stone-900 text-white">
                      {t.title} ({t.category}) {t.isPremium ? '★ Тансаг' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/15"
                >
                  Цуцлах
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#d4af37] text-slate-950 font-bold rounded-xl hover:bg-[#e5be48] shadow-md shadow-[#d4af37]/20"
                >
                  Захиалга Үүсгэх
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE REQUESTS MODAL */}
      {selectedOrderForCr && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/70 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 max-w-md w-full text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-base text-white">Харилцагчийн Засварын Хүсэлт</h3>
                <p className="text-xs text-white/50">{selectedOrderForCr.customerName} ({selectedOrderForCr.orderNumber})</p>
              </div>
              <button
                onClick={() => setSelectedOrderForCr(null)}
                className="text-white/50 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto text-xs">
              {selectedOrderForCr.changeRequests.map((cr) => (
                <div key={cr.id} className="bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center text-[11px] text-white/50">
                    <span>Илгээсэн: {new Date(cr.requestedAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-full font-semibold ${
                      cr.status === 'Applied' ? 'bg-emerald-500/20 text-emerald-300' :
                      cr.status === 'Rejected' ? 'bg-red-500/20 text-red-300' : 'bg-[#d4af37]/20 text-[#f9e5af]'
                    }`}>
                      {cr.status === 'Applied' ? 'Бүртгэгдсэн' : cr.status === 'Rejected' ? 'Татгалзсан' : 'Хүлээгдэж буй'}
                    </span>
                  </div>

                  <p className="text-white/90 leading-relaxed font-medium">"{cr.note}"</p>

                  {cr.status === 'Pending' && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => handleResolveChangeRequest(cr.id, 'Rejected')}
                        className="px-3 py-1 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg text-[11px] font-semibold"
                      >
                        Татгалзах
                      </button>
                      <button
                        onClick={() => handleResolveChangeRequest(cr.id, 'Applied')}
                        className="px-3 py-1 bg-[#d4af37] text-slate-950 font-bold hover:bg-[#e5be48] rounded-lg text-[11px]"
                      >
                        Засвар Гүйцэтгэсэн
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedOrderForCr(null)}
              className="w-full bg-white/10 text-white py-2 rounded-xl text-xs font-semibold hover:bg-white/15"
            >
              Хаах
            </button>
          </div>
        </div>
      )}

      {/* CUSTOMER ACCESS MANAGEMENT MODAL */}
      {selectedOrderForAccess && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-amber-500/40 rounded-3xl p-6 max-w-lg w-full text-stone-100 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white font-serif">Захиалагчийн Эрх Тохируулах</h3>
                  <p className="text-[11px] text-amber-200">{selectedOrderForAccess.orderNumber} • {selectedOrderForAccess.customerName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrderForAccess(null)}
                className="text-stone-400 hover:text-white p-1.5 rounded-lg bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Account Details & Status */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Захиалагчийн нэр:</span>
                <span className="font-bold text-white text-sm">{selectedOrderForAccess.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Имэйл (Нэвтрэх хаяг):</span>
                <span className="font-mono text-amber-200 font-semibold">{selectedOrderForAccess.customerEmail}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-400">Утасны дугаар:</span>
                <span className="font-mono text-stone-200">{selectedOrderForAccess.customerPhone}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-800">
                <span className="text-stone-400">Одоогийн төлөв:</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                  selectedOrderForAccess.status === 'New' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {selectedOrderForAccess.status === 'New' ? '🔴 Шинэ (Эрх нээгдээгүй)' : '🟢 Захиалагчийн эрх нээлттэй'}
                </span>
              </div>
            </div>

            {/* Grant / Revoke Access Actions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                {selectedOrderForAccess.status === 'New' ? (
                  <button
                    onClick={() => {
                      const updated = { ...selectedOrderForAccess, status: 'In Preparation' as OrderStatus };
                      onUpdateOrder(updated);
                      setSelectedOrderForAccess(updated);
                    }}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <Unlock className="w-4 h-4" />
                    <span>Захиалагчийн Нэвтрэх Эрхийг Нээх</span>
                  </button>
                ) : (
                  <div className="w-full bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-emerald-200 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-2 font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Нэвтрэх эрх нээлттэй байна.</span>
                    </span>
                    <button
                      onClick={() => {
                        const updated = { ...selectedOrderForAccess, status: 'New' as OrderStatus };
                        onUpdateOrder(updated);
                        setSelectedOrderForAccess(updated);
                      }}
                      className="text-[10px] bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 px-2.5 py-1 rounded-lg border border-rose-500/30"
                    >
                      Эрх хаах
                    </button>
                  </div>
                )}
              </div>

              {/* Direct Link Share */}
              <div className="space-y-1.5">
                <label className="text-stone-300 font-semibold text-xs block">
                  Захиалагчийн Шүүд Нэвтрэх Холбоос:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/customer/login?email=${encodeURIComponent(selectedOrderForAccess.customerEmail)}`}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-amber-200 font-mono focus:outline-none"
                  />
                  <button
                    onClick={() => handleCopyCustomerLoginLink(selectedOrderForAccess.customerEmail)}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0 shadow-md"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Хуулагдлаа!' : 'Хуулах'}</span>
                  </button>
                </div>
              </div>

              {/* Share via Messenger / SMS Message Generator */}
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-amber-300 block uppercase tracking-wider">Харилцагчид илгээх мессеж:</span>
                <p className="text-stone-300 bg-stone-900 p-2.5 rounded-lg border border-stone-800 font-mono text-[11px] leading-relaxed">
                  Сайн байна уу, {selectedOrderForAccess.customerName}? Заллага цахим урилгын таны нэвтрэх эрх нээгдлээ. Та {selectedOrderForAccess.customerEmail} имэйлээрээ залуу хосын урилгыг хянана уу: {window.location.origin}/customer/login?email={encodeURIComponent(selectedOrderForAccess.customerEmail)}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`Сайн байна уу, ${selectedOrderForAccess.customerName}? Заллага цахим урилгын таны нэвтрэх эрх нээгдлээ. Та ${selectedOrderForAccess.customerEmail} имэйлээрээ залуу хосын урилгыг хянана уу: ${window.location.origin}/customer/login?email=${encodeURIComponent(selectedOrderForAccess.customerEmail)}`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold block pt-1"
                >
                  Мессежийн бичвэрийг санах ойд хуулах
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrderForAccess(null)}
                className="w-full bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-white/15"
              >
                Хаах
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
