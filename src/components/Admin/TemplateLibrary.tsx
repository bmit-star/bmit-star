import React, { useState } from 'react';
import { 
  Sparkles, Layers, Eye, Check, Star, Play, Music, 
  Palette, SlidersHorizontal, CheckCircle2, X, Smartphone,
  Search, ArrowRight, Zap, ShieldCheck
} from 'lucide-react';
import { Template, Order } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { DevicePreviewFrame } from '../Shared/DevicePreviewFrame';
import { LuxuryInvitationView } from '../Guest/LuxuryInvitationView';

interface TemplateLibraryProps {
  templates: Template[];
  orders: Order[];
  onUseTemplate: (template: Template) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  templates,
  orders,
  onUseTemplate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [quickOrderTemplate, setQuickOrderTemplate] = useState<Template | null>(null);

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.musicTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (catName: string) => {
    return templates.filter(t => t.category === catName).length;
  };

  return (
    <div className="space-y-8">
      
      {/* Header & Quick Action */}
      <div className="bg-white/5 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#f9e5af] px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider backdrop-blur-sm">
              <Zap className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Шуурхай 1 Үйлдлийн Сонголт</span>
            </div>
            <h1 className="text-2xl font-bold text-white font-serif">
              Загварын Сан (13 Ангилал • 39 Өвөрмөц Загвар)
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Та өөрийн арга хэмжээнд тохирох ангиллыг сонгон, 1 товшилтоор урилгаа сонгож сарын турш хязгааргүй илгээх эрхтэй үйлчилгээ авна уу.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Загварын нэр, ангиллаар хайх..."
              className="w-full bg-black/50 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#d4af37] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Visual Cards Grid */}
        <div className="pt-2">
          <span className="text-[11px] font-semibold uppercase text-[#f9e5af] tracking-wider block mb-3">
            Ангиллаар Харах & Шүүх
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 lg:grid-cols-14 gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`p-2.5 rounded-2xl text-center border transition-all flex flex-col items-center justify-center gap-1 ${
                selectedCategory === 'ALL'
                  ? 'bg-[#d4af37] text-slate-950 font-bold border-[#d4af37] shadow-lg shadow-[#d4af37]/20 scale-105'
                  : 'bg-black/40 text-white/70 border-white/10 hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <span className="text-lg">✨</span>
              <span className="text-[10px] font-semibold truncate w-full">Бүгд</span>
              <span className="text-[9px] opacity-75 font-mono">39</span>
            </button>

            {CATEGORIES.map(cat => {
              const count = getCategoryCount(cat.name);
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`p-2.5 rounded-2xl text-center border transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-[#d4af37] text-slate-950 font-bold border-[#d4af37] shadow-lg shadow-[#d4af37]/20 scale-105'
                      : 'bg-black/40 text-white/70 border-white/10 hover:border-white/30 hover:bg-white/10'
                  }`}
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-[10px] font-semibold truncate w-full">{cat.name}</span>
                  <span className="text-[9px] opacity-75 font-mono">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Template Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-white/60">
          <span>
            Илэрц: <strong className="text-white font-semibold">{filteredTemplates.length}</strong> загвар олдлоо
          </span>
          <span className="text-[#f9e5af]">
            💡 Нэг урилга = 1 Сарын турш Хязгааргүй Илгээх Эрх
          </span>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="p-12 text-center bg-white/5 rounded-3xl border border-white/10 text-slate-400 space-y-3">
            <Search className="w-8 h-8 text-white/30 mx-auto" />
            <h3 className="text-base font-bold text-white">Загвар олдсонгүй</h3>
            <p className="text-xs">Таны хайсан үг эсвэл сонгосон ангилалд тохирох загвар байхгүй байна.</p>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
              className="bg-[#d4af37] text-slate-950 px-4 py-2 rounded-xl text-xs font-bold"
            >
              Бүх загварыг харах
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl hover:border-[#d4af37]/50 transition-all flex flex-col group relative"
              >
                {/* Thumbnail Preview Banner */}
                <div className="relative h-64 overflow-hidden bg-black/60">
                  <img
                    src={template.thumbnail}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent"></div>

                  {/* Category & Premium Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-black/80 backdrop-blur-md text-[#f9e5af] border border-[#d4af37]/40 text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
                      {template.category}
                    </span>
                    {template.isPremium && (
                      <span className="bg-gradient-to-r from-[#d4af37] to-[#f9e5af] text-slate-950 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-0.5 shadow-md">
                        <Star className="w-3 h-3 fill-slate-950" /> Премиум
                      </span>
                    )}
                  </div>

                  {/* Quick Features Bottom overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full border border-white/50 shadow-sm shrink-0" style={{ backgroundColor: template.colorTheme }} />
                      <span className="font-semibold text-[11px] drop-shadow">{template.animationType}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold backdrop-blur-md">
                      49,000₮ / сар
                    </span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-[#f9e5af] transition-colors leading-snug">
                      {template.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-white/70">
                      <Music className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span className="truncate">{template.musicTitle}</span>
                    </div>

                    {/* Included Sections pills */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block mb-1.5">
                        Агуулагдах Тансаг Хэсгүүд:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.slice(0, 4).map((sec, idx) => (
                          <span key={idx} className="bg-black/40 text-white/80 border border-white/10 text-[10px] px-2 py-0.5 rounded-lg">
                            {sec}
                          </span>
                        ))}
                        {template.sections.length > 4 && (
                          <span className="bg-black/40 text-[#f9e5af] border border-[#d4af37]/30 text-[10px] px-1.5 py-0.5 rounded-lg">
                            +{template.sections.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(template)}
                      className="flex-1 bg-black/40 hover:bg-white/10 text-white border border-white/10 font-semibold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 backdrop-blur-md"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Урьдчилан харах</span>
                    </button>

                    <button
                      onClick={() => onUseTemplate(template)}
                      className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#f9e5af] hover:from-[#e5be48] hover:to-[#fcebc4] text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#d4af37]/20 active:scale-95 flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                      <span>Шууд Захиалах</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* TEMPLATE PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-white/15 rounded-3xl p-6 max-w-4xl w-full h-[90vh] flex flex-col text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-lg text-white">{previewTemplate.title}</h3>
                <p className="text-xs text-white/60">Ангилал: {previewTemplate.category} • Анимейшн: {previewTemplate.animationType}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    onUseTemplate(previewTemplate);
                    setPreviewTemplate(null);
                  }}
                  className="bg-[#d4af37] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:bg-[#e5be48] transition-all shadow-md shadow-[#d4af37]/20 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Энэ Загвараар Захиалах</span>
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-white/50 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <DevicePreviewFrame
                deviceMode={deviceMode}
                onDeviceModeChange={setDeviceMode}
                title={`Загвар шалгах: ${previewTemplate.title}`}
              >
                <LuxuryInvitationView
                  invitationData={{
                    brideName: 'Номин-Эрдэнэ',
                    groomName: 'Ганзориг',
                    brideParents: 'Сүйт бүсгүйн аав ээж',
                    groomParents: 'Сүйт залуугийн аав ээж',
                    eventTitle: `${previewTemplate.category} - ${previewTemplate.title}`,
                    invitationMessage: 'Хоёр сэтгэл нэгдэж, нэгэн гал голомт бадраах баярт маань хүрэлцэн ирэхийг урьж байна.',
                    blessingText: '“Баяр баясгалан дүүрэн өдөр тохиох болтугай.”',
                    date: '2026 оны 8 сарын 15-ны Бямба гараг',
                    time: '16:00 цагт',
                    locationName: 'Шангри-Ла Улаанбаатар',
                    address: 'Улаанбаатар хот, Сүхбаатар дүүрэг',
                    heroPhotoUrl: previewTemplate.thumbnail,
                    couplePhotos: [previewTemplate.thumbnail],
                    themeColor: previewTemplate.sampleData?.themeColor || '#C5A059',
                    secondaryColor: previewTemplate.sampleData?.secondaryColor || '#0D2B1D',
                    backgroundMusicTitle: previewTemplate.musicTitle,
                    backgroundMusicUrl: previewTemplate.musicUrl,
                    schedule: [
                      { time: '04:00 PM', title: 'Цугларах Цаг' },
                      { time: '06:00 PM', title: 'Баярын Хөтөлбөр' }
                    ],
                    dressCode: {
                      title: 'Formal Black Tie',
                      description: 'Баярын гоёмсог хувцаслалттай ирнэ үү.',
                      colorPalette: ['#C5A059', '#0D2B1D', '#1E1E1E']
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
                  }}
                  isPreviewMode={true}
                />
              </DevicePreviewFrame>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
