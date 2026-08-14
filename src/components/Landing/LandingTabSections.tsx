import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, Clock, HardDrive, Calendar, Music, Heart, 
  MapPin, Eye, ArrowRight, HelpCircle, Smartphone, 
  QrCode, Camera, ChevronDown, Search, X, Star
} from 'lucide-react';
import { Template } from '../../types';
import { CATEGORIES } from '../../data/categories';

// ==========================================
// 1. OVERVIEW TAB SECTION (Нүүр)
// ==========================================
interface OverviewSectionProps {
  handleStartOrder: (pkg: 'Standard' | 'VIP') => void;
  onNavigateTemplates: () => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  handleStartOrder,
  onNavigateTemplates
}) => {
  return (
    <div className="space-y-16">
      {/* HERO SECTION */}
      <section className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-rose-100 bg-[radial-gradient(circle_at_15%_10%,#fff0f5,transparent_30%),radial-gradient(circle_at_90%_80%,#ffe9ef,transparent_28%),#fffdfd] px-4 pb-12 pt-8 shadow-[0_18px_60px_rgba(202,112,142,.14)] sm:px-6 lg:px-8">
        {[...Array(16)].map((_, index) => <span key={index} className="pointer-events-none absolute h-3 w-5 rounded-[100%_0_100%_0] bg-rose-300/60 blur-[.2px] animate-[bounce_5s_ease-in-out_infinite]" style={{ left: `${(index * 19) % 100}%`, top: `${(index * 31) % 92}%`, animationDelay: `${index * 0.22}s`, transform: `rotate(${index * 29}deg)` }} />)}
        <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 backdrop-blur-md shadow-xl text-xs font-bold text-[#f9e5af]">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>✨ 2–8 цагийн дотор бэлэн болдог тансаг урилга</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#754a5a] tracking-tight leading-[1.1] font-serif">
              Таны баярын <br />
              <span className="bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] bg-clip-text text-transparent">
                анхны сэтгэгдэл
              </span> <br />
              эндээс эхэлнэ.
            </h1>

            <p className="text-base sm:text-lg text-[#8e6876] font-sans leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Зочин бүрт нэртэй хувийн линк, VIP QR тасалбар, бодит цагийн ирц бүртгэл, шууд фото хана бүхий тансаг арга хэмжээний платформыг <strong className="text-[#f9e5af] font-bold">2–8 цагийн дотор</strong> бэлтгэнэ.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => handleStartOrder('Standard')}
                className="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] hover:from-[#e5be48] hover:to-[#fcebc4] text-slate-950 font-extrabold px-8 py-4 rounded-2xl text-sm transition-all shadow-2xl shadow-[#d4af37]/30 flex items-center justify-center gap-2 group active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950 group-hover:rotate-12 transition-transform" />
                <span>Шууд Захиалах</span>
                <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onNavigateTemplates}
                className="w-full sm:w-auto bg-white hover:bg-rose-50 text-[#805764] hover:text-[#754a5a] px-7 py-4 rounded-2xl text-sm font-bold border border-stone-800 hover:border-[#d4af37]/50 transition-all text-center flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-[#d4af37]" />
                <span>Жишээ Урилга Үзэх</span>
              </button>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Хувийн тохируулгатай линк</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>VIP QR сканнер систем</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>30 хоногийн эрх</span>
              </div>
            </div>
          </div>

          {/* Right Floating Interactive Live Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#d4af37]/20 via-amber-500/10 to-transparent rounded-3xl blur-2xl pointer-events-none"></div>

            <div className="relative bg-[#181615] border border-[#d4af37]/40 rounded-3xl p-6 shadow-2xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-white font-serif">Арга хэмжээний шууд харагдац</span>
                </div>
                <span className="text-[10px] bg-[#d4af37]/20 text-[#f9e5af] px-2.5 py-1 rounded-full font-bold border border-[#d4af37]/40">
                  LIVE DEMO
                </span>
              </div>

              <div className="bg-stone-900/90 border border-stone-800 p-3.5 rounded-2xl flex items-center justify-between gap-3 shadow-lg">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-medium">Хувийн Урилга:</span>
                  <span className="text-sm font-bold text-white font-serif">
                    👤 Эрхэм зочин: Мягмарцэрэн танаа
                  </span>
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
              </div>

              <div className="bg-gradient-to-r from-amber-500/15 via-stone-900 to-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d4af37] text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-md">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-300 block">VIP Тасалбар</span>
                    <span className="text-xs font-mono font-bold text-white">#PASS-8899 • Баталгаажсан</span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-md font-bold border border-emerald-500/40">
                  READY
                </span>
              </div>

              <div className="p-3 bg-stone-900/80 rounded-2xl border border-stone-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-300 font-medium">Ирцийн статус:</span>
                  <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Хүрэлцэн ирнэ (142)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#d4af37] text-slate-950 font-bold py-2 rounded-xl text-center shadow-md">
                    ✅ Хүрэлцэн ирнэ
                  </div>
                  <div className="bg-stone-800 text-stone-400 py-2 rounded-xl text-center opacity-60">
                    ✖️ Амжихгүй
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 flex items-center gap-2">
                  <Music className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                  <span className="text-[11px] text-stone-200 truncate">Тансаг Вальс...</span>
                </div>
                <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800 flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-[11px] text-stone-200 truncate">56 Зураг Оров</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF / TRUST INDICATORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-stone-800">
            <div className="space-y-1 pt-3 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#f9e5af] font-serif">★ 4.9 / 5</div>
              <div className="text-xs text-stone-400 font-medium">Сэтгэл ханамж</div>
            </div>
            <div className="space-y-1 pt-3 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif">500+</div>
              <div className="text-xs text-stone-400 font-medium">Тансаг Арга Хэмжээ</div>
            </div>
            <div className="space-y-1 pt-3 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-serif">20,000+</div>
              <div className="text-xs text-stone-400 font-medium">Уригдсан Зочид</div>
            </div>
            <div className="space-y-1 pt-3 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-serif">99.9%</div>
              <div className="text-xs text-stone-400 font-medium">Хүргэлтийн Амжилт</div>
            </div>
            <div className="col-span-2 md:col-span-1 space-y-1 pt-3 md:pt-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#f9e5af] font-serif">2–8 Цаг</div>
              <div className="text-xs text-stone-400 font-medium">Шуурхай Бэлтгэл</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US - SUMMARY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif">
            Яагаад биднийг сонгох вэ?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto">
            Зөвхөн урилга бус, зочдын тань мартагдашгүй туршлагыг бүтээх цогц шийдэл.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#181615] border border-stone-800 rounded-3xl p-6 flex items-center gap-5 hover:border-[#d4af37]/60 transition-all shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-sans tracking-tight">2 - 8 Цагт Бэлэн</h3>
              <p className="text-xs text-stone-400">Мэргэжлийн баг шуурхай бэлтгэнэ</p>
            </div>
          </div>

          <div className="bg-[#181615] border border-stone-800 rounded-3xl p-6 flex items-center gap-5 hover:border-[#d4af37]/60 transition-all shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <HardDrive className="w-8 h-8 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-sans tracking-tight">Тансаг Фото Цомог</h3>
              <p className="text-xs text-stone-400">Өндөр чанартай зургийн цуглуулга</p>
            </div>
          </div>

          <div className="bg-[#181615] border border-stone-800 rounded-3xl p-6 flex items-center gap-5 hover:border-[#d4af37]/60 transition-all shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-8 h-8 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-sans tracking-tight">1 Сарын Эрх</h3>
              <p className="text-xs text-stone-400">30 хоногийн турш тасралтгүй</p>
            </div>
          </div>

          <div className="bg-[#181615] border border-stone-800 rounded-3xl p-6 flex items-center gap-5 hover:border-[#d4af37]/60 transition-all shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <QrCode className="w-8 h-8 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-sans tracking-tight">VIP Тасалбар & Сканнер</h3>
              <p className="text-xs text-amber-300 font-bold">Цахим ирц бүртгэлийн систем</p>
            </div>
          </div>

          <div className="bg-[#181615] border border-stone-800 rounded-3xl p-6 flex items-center gap-5 hover:border-[#d4af37]/60 transition-all shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Sparkles className="w-8 h-8 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-sans tracking-tight">Хувийн Линк</h3>
              <p className="text-xs text-stone-400">Зочин бүрийн нэрийг тодруулна</p>
            </div>
          </div>

          <div className="bg-[#181615] border border-stone-800 rounded-3xl p-6 flex items-center gap-5 hover:border-[#d4af37]/60 transition-all shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-8 h-8 text-amber-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white font-sans tracking-tight">Интерактив Фото Хана</h3>
              <p className="text-xs text-stone-400">Баярын нандин дурсамжууд</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};


// ==========================================
// 2. FEATURES TAB SECTION (Боломжууд)
// ==========================================
export const FeaturesSection: React.FC = () => {
  return (
    <div className="space-y-16">
      {/* FULL FEATURE MATRIX */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f9e5af] text-xs font-bold uppercase tracking-widest">
            Иж Бүрээн Арга Хэмжээний Шийдэл
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-serif">
            Нэг урилга. <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] bg-clip-text text-transparent">
              Хязгааргүй боломж.
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-2xl mx-auto leading-relaxed">
            Зөвхөн урилга биш, арга хэмжээг эхнээс нь дуустал удирдах иж бүрэн премиум платформ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 hover:border-[#d4af37]/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Зочны Хувийн Линк</h3>
            <p className="text-xs text-stone-300 leading-relaxed">Зочин бүрийн нэрийг онцолж, тусгайлан хүндэтгэл үзүүлсэн хувийн холбоос бэлтгэнэ.</p>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 hover:border-[#d4af37]/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">VIP QR Тасалбар</h3>
            <p className="text-xs text-stone-300 leading-relaxed">Хүлээн авалтын хаалгаар хурдан нэвтрэх цахим тасалбар ба сканнер систем.</p>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 hover:border-[#d4af37]/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Бодит Цагийн Ирц (RSVP)</h3>
            <p className="text-xs text-stone-300 leading-relaxed">Хэн ирэх, хэн татгалзсан мэдээллийг бодит цаг хугацаанд хялбар удирдана.</p>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 hover:border-[#d4af37]/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Интерактив Фото Хана</h3>
            <p className="text-xs text-stone-300 leading-relaxed">Зочдын авсан зургуудыг захиалагч хянаад баярын дэлгэц дээр шууд харуулна.</p>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 hover:border-[#d4af37]/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Баярын Арын Аялгуу</h3>
            <p className="text-xs text-stone-300 leading-relaxed">Урилга нээгдэхэд таны сонгосон тансаг аялгуу шууд эгшиглэж орчин бүрдүүлнэ.</p>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 hover:border-[#d4af37]/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Тансаг Зургийн Цомог</h3>
            <p className="text-xs text-stone-300 leading-relaxed">Баярын онцлох нандин агшин, зургуудыг өндөр чанартайгаар нэг дор дэлгэнэ.</p>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 hover:border-[#d4af37]/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Баярын Тоологч</h3>
            <p className="text-xs text-stone-300 leading-relaxed">Арга хэмжээ болоход үлдсэн цаг минутуудыг нарийвчлан тоолж хүлээлт үүсгэнэ.</p>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 hover:border-[#d4af37]/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Газрын Зураг & Чиглэл</h3>
            <p className="text-xs text-stone-300 leading-relaxed">Танхим руу 1 товшилтоор Google Map, Навигациар очих боломжийг олгоно.</p>
          </div>

          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-6 space-y-3 hover:border-[#d4af37]/50 transition-all shadow-xl group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white font-serif">Ерөөлийн Ном (Guest Book)</h3>
            <p className="text-xs text-stone-300 leading-relaxed">Зочдын халуун сэтгэлийн үгс, ерөөл болон дурсамжийн сэтгэгдлийг цуглуулна.</p>
          </div>
        </div>
      </section>

      {/* LIVE PHOTO WALL SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 border border-[#d4af37]/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>ИНТЕРАКТИВ ФОТО ХАНА</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif leading-tight">
                Зочдын авсан зураг <br />
                <span className="bg-gradient-to-r from-[#d4af37] to-[#f9e5af] bg-clip-text text-transparent">
                  баярын дэлгэц дээр шууд харагдана
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                Баярын үеэр зочид өөрсдийн гар утаснаас зургуудаа урилга руу оруулна. Захиалагчийн хяналтаар баталгаажсан зургууд Арга Хэмжээний Танхимын Дэлгэц дээр шууд харагдаж баярын уур амьсгалыг нэмнэ.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-1">
                  <span className="text-amber-400 font-bold block">1. Зочдын урилга</span>
                  <span className="text-stone-300 text-[11px]">Гар утаснаас зураг оруулна</span>
                </div>
                <div className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-1">
                  <span className="text-amber-400 font-bold block">2. Захиалагчийн хяналт</span>
                  <span className="text-stone-300 text-[11px]">Шалгаад зөвшөөрнө</span>
                </div>
                <div className="bg-stone-900 p-3.5 rounded-2xl border border-stone-800 space-y-1">
                  <span className="text-amber-400 font-bold block">3. Шууд дэлгэц</span>
                  <span className="text-stone-300 text-[11px]">Танхимын дэлгэц дээр гарна</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/3] bg-stone-900 border border-stone-800 rounded-3xl p-4 overflow-hidden shadow-2xl flex flex-col justify-between">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-stone-800">
                  <span className="font-bold text-white font-serif">📸 Танхимын Фото Хана</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                    Баталгаажсан (56)
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2">
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-amber-500/30">
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=80" alt="Sample 1" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-emerald-500 text-black text-[9px] font-extrabold px-1 rounded">✓</span>
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-amber-500/30">
                    <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=300&q=80" alt="Sample 2" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-emerald-500 text-black text-[9px] font-extrabold px-1 rounded">✓</span>
                  </div>
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-amber-500/30">
                    <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80" alt="Sample 3" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-emerald-500 text-black text-[9px] font-extrabold px-1 rounded">✓</span>
                  </div>
                </div>

                <div className="p-2 bg-stone-950 rounded-xl text-[10px] text-stone-400 flex items-center justify-between">
                  <span>✨ Шинэ зураг орж ирмэгц автоматаар шинэчлэгдэнэ</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (5 STEPS TIMELINE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">УРСГАЛ АЖИЛЛАГАА</span>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-serif">
            Хэрхэн ажилладаг вэ?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto">
            Энгийн 5 алхмаар баярынхаа тансаг урилгыг хурдан бэлтгэж, зочиддоо хүргээрэй.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
          <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 space-y-2 text-center relative shadow-xl">
            <span className="w-8 h-8 rounded-full bg-[#d4af37] text-slate-950 font-bold text-xs flex items-center justify-center mx-auto shadow-md">1</span>
            <h3 className="font-bold text-sm text-white font-serif">Загвар сонгох</h3>
            <p className="text-[11px] text-stone-400">Өөрийн баярт тохирох загварыг сонгоно</p>
          </div>

          <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 space-y-2 text-center relative shadow-xl">
            <span className="w-8 h-8 rounded-full bg-[#d4af37] text-slate-950 font-bold text-xs flex items-center justify-center mx-auto shadow-md">2</span>
            <h3 className="font-bold text-sm text-white font-serif">Мэдээлэл илгээх</h3>
            <p className="text-[11px] text-stone-400">Баярын огноо, хаяг, мэдээллээ бөглөнө</p>
          </div>

          <div className="bg-stone-900/80 border border-amber-500/40 rounded-3xl p-5 space-y-2 text-center relative shadow-xl bg-amber-500/5">
            <span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#d4af37] to-[#f9e5af] text-slate-950 font-bold text-xs flex items-center justify-center mx-auto shadow-md">3</span>
            <h3 className="font-bold text-sm text-amber-300 font-serif">2–8 Цагт Бэлэн</h3>
            <p className="text-[11px] text-amber-200/80">Мэргэжлийн баг урилгыг идэвхжүүлнэ</p>
          </div>

          <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 space-y-2 text-center relative shadow-xl">
            <span className="w-8 h-8 rounded-full bg-[#d4af37] text-slate-950 font-bold text-xs flex items-center justify-center mx-auto shadow-md">4</span>
            <h3 className="font-bold text-sm text-white font-serif">Зочдод хуваалцах</h3>
            <p className="text-[11px] text-stone-400">Хувийн линк болон QR кодыг илгээнэ</p>
          </div>

          <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 space-y-2 text-center relative shadow-xl">
            <span className="w-8 h-8 rounded-full bg-[#d4af37] text-slate-950 font-bold text-xs flex items-center justify-center mx-auto shadow-md">5</span>
            <h3 className="font-bold text-sm text-white font-serif">Ирц удирдах</h3>
            <p className="text-[11px] text-stone-400">Ирц болон фото ханыг хянаж удирдана</p>
          </div>
        </div>
      </section>
    </div>
  );
};


// ==========================================
// 3. TEMPLATES TAB SECTION (Загварууд)
// ==========================================
interface TemplatesSectionProps {
  templates: Template[];
  filteredTemplates: Template[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  getCategoryCount: (catName: string) => number;
  CATEGORY_FINISHED_SAMPLES: any[];
  setPreviewCustomData: (data: any) => void;
  setPreviewTemplate: (tpl: Template | null) => void;
  setSelectedTemplateId: (id: string) => void;
  handleStartOrder: (pkg: 'Standard' | 'VIP') => void;
}

const CATALOG_STYLES = [
  ['#f8e9ed', '#b86f83'], ['#fff0d7', '#c17d32'], ['#e2f1fb', '#5588ad'],
  ['#f7ead4', '#9a7445'], ['#e8f0db', '#648451'], ['#e9e5fa', '#7764a9'],
  ['#e4eff1', '#4c8187'], ['#fff1e6', '#c67745'], ['#f5e7fb', '#a55d9c'],
  ['#f4e8cd', '#9a782c'], ['#f4ead8', '#8d6033'], ['#edf0f4', '#73808e'], ['#eeeaf8', '#77679e']
];

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  templates, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery,
  setPreviewTemplate, setSelectedTemplateId, handleStartOrder
}) => {
  const [page, setPage] = useState(0);
  const [isTurning, setIsTurning] = useState(false);
  const catalog = CATEGORIES.map((category) => templates.find((template) => template.category === category.name)).filter(Boolean) as Template[];
  const matches = catalog.filter((template) => selectedCategory === 'ALL' || template.category === selectedCategory)
    .filter((template) => `${template.title} ${template.category}`.toLowerCase().includes(searchQuery.toLowerCase()));
  const active = matches[page % Math.max(1, matches.length)];

  const turnPage = (direction: number) => {
    if (!matches.length) return;
    setIsTurning(true);
    try {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(420, context.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(150, context.currentTime + 0.12);
      gain.gain.setValueAtTime(0.025, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.14);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + 0.14);
    } catch { /* Audio is optional and needs a user gesture. */ }
    setTimeout(() => { setPage((current) => (current + direction + matches.length) % matches.length); setIsTurning(false); }, 180);
  };

  if (!active) return null;
  const category = CATEGORIES.find((item) => item.name === active.category)!;
  const [soft, accent] = CATALOG_STYLES[CATEGORIES.findIndex((item) => item.name === active.category) % CATALOG_STYLES.length];

  return (
    <section id="templates" className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-rose-100 bg-[#fffafc] px-4 py-10 shadow-[0_20px_70px_rgba(178,107,132,.15)] sm:px-10">
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_8%_12%,#f8dce7_0,transparent_18%),radial-gradient(circle_at_92%_80%,#f7dce5_0,transparent_20%)]" />
      <div className="relative space-y-7">
        <header className="text-center">
          <span className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-rose-400">Zallaga invitation atelier</span>
          <h2 className="mt-2 font-serif text-3xl text-[#6d4855] sm:text-5xl">Баяр бүрт нэг онцгой загвар</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[#95717c]">Ангилал бүр өөрийн утга, өнгө, дүрслэлтэй. Сонгосон загвараа админаас бүрэн засварлана.</p>
        </header>
        <div className="flex flex-wrap justify-center gap-2">
          <button onClick={() => { setSelectedCategory('ALL'); setPage(0); }} className={`rounded-full px-3 py-2 text-xs font-bold ${selectedCategory === 'ALL' ? 'bg-rose-400 text-white' : 'bg-white text-rose-500 border border-rose-100'}`}>✨ Бүгд</button>
          {CATEGORIES.map((item) => <button key={item.id} onClick={() => { setSelectedCategory(item.name); setPage(0); }} className={`rounded-full px-3 py-2 text-xs font-bold ${selectedCategory === item.name ? 'bg-rose-400 text-white' : 'bg-white text-[#8b6872] border border-rose-100'}`}>{item.icon} {item.name}</button>)}
        </div>
        <div className="mx-auto max-w-md"><input value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setPage(0); }} placeholder="Ангиллаар хайх..." className="w-full rounded-full border border-rose-100 bg-white px-5 py-3 text-sm text-[#6d4855] outline-none focus:border-rose-300" /></div>
        <div className="mx-auto grid max-w-4xl grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-6">
          <button onClick={() => turnPage(-1)} className="z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-rose-400 shadow-md" aria-label="Өмнөх загвар">‹</button>
          <article className={`relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white bg-white shadow-xl transition-all duration-200 ${isTurning ? 'rotate-y-6 scale-[.98] opacity-80' : ''}`}>
            <div className="grid h-full md:grid-cols-2">
              <div className="relative min-h-64 overflow-hidden" style={{ backgroundColor: soft }}>
                <img src={active.thumbnail} alt={active.title} className="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-85" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold" style={{ color: accent }}>{category.icon} {category.name}</div>
                <div className="absolute bottom-5 left-5 right-5 text-white"><p className="font-serif text-3xl drop-shadow">{active.title}</p><p className="mt-1 text-xs">{category.description}</p></div>
                <div className="absolute -right-5 bottom-8 h-24 w-24 rotate-45 border-[12px] border-white/60" />
              </div>
              <div className="flex flex-col justify-between p-7 text-center sm:p-10">
                <div><span className="text-xs font-bold uppercase tracking-[.2em]" style={{ color: accent }}>Editable template</span><h3 className="mt-3 font-serif text-3xl text-[#644c55]">{category.name}</h3><p className="mt-4 text-sm leading-6 text-[#876f76]">{category.description}. Нэр, огноо, зураг, дэвсгэр, өнгө, хөтөлбөр болон бусад бүх талбарыг засварлана.</p></div>
                <div className="mt-7 flex gap-3"><button onClick={() => setPreviewTemplate(active)} className="flex-1 rounded-xl border border-rose-200 py-3 text-xs font-bold text-rose-500">Харах</button><button onClick={() => { setSelectedTemplateId(active.id); handleStartOrder('Standard'); }} className="flex-1 rounded-xl py-3 text-xs font-bold text-white shadow-md" style={{ backgroundColor: accent }}>Сонгох</button></div>
              </div>
            </div>
          </article>
          <button onClick={() => turnPage(1)} className="z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-rose-400 shadow-md" aria-label="Дараах загвар">›</button>
        </div>
        <p className="text-center text-xs text-[#a6878f]">Хуудсыг эргүүлэх товчийг дарахад зөөлөн цаасны чимээ гарна.</p>
      </div>
    </section>
  );
};

// 4. PRICING TAB SECTION (Үнэ)
// ==========================================
interface PricingSectionProps {
  handleStartOrder: (pkg: 'Standard' | 'VIP') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ handleStartOrder }) => {
  return (
    <div className="space-y-16">
      <section id="pricing" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Үнийн Нөхцөл</span>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif">
            1 Цахим Урилга = 1 Сарын Турш Хязгааргүй Илгээх Эрх
          </h2>
          <p className="text-xs sm:text-sm text-[#f9e5af] max-w-xl mx-auto font-medium">
            * Төлбөр баталгаажсаны дараа 2-8 цагийн дотор урилга бэлэн болж, захиалагчийн хэсэг нээгдэнэ.
          </p>
        </div>

        <div className="bg-gradient-to-b from-[#d4af37]/20 via-black/50 to-black/80 backdrop-blur-2xl p-8 sm:p-10 rounded-3xl border-2 border-[#d4af37]/60 space-y-8 relative overflow-hidden shadow-2xl shadow-[#d4af37]/20">
          <div className="absolute top-4 right-4 bg-[#d4af37] text-slate-950 text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-md">
            Ганц Багц • Хязгааргүй
          </div>

          <div className="space-y-4 text-center sm:text-left">
            <span className="text-xs uppercase font-bold tracking-wider text-[#f9e5af] block">Албан Ёсны Багц</span>
            <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-3 justify-center sm:justify-start">
              <span className="text-5xl font-bold text-white font-serif">49,000₮</span>
              <span className="text-xs text-[#f9e5af] font-semibold bg-[#d4af37]/20 px-3 py-1 rounded-full border border-[#d4af37]/30">
                1 Урилга • 1 Сарын хязгааргүй илгээх эрх
              </span>
            </div>
            <p className="text-xs text-white/70 max-w-lg">
              Таны сонгосон тансаг дижитал урилгыг мэргэжлийн түвшинд бэлтгэж, 1 сарын турш хүссэн хэмжээгээрээ зочдод илгээх боломжоор хангана.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/90 pt-6 border-t border-white/10">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span><strong>1 Сарын турш</strong> хязгааргүй зочдод илгээх</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span><strong>4GB хүртэлх</strong> зураг ба медиа сан</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span><strong>2 - 8 Цагт</strong> бэлэн болох шуурхай бэлтгэл</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>RSVP Зочдын бүртгэл & Сэтгэгдлийн ном</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>YouTube арын дуу тоглуулагч</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#d4af37] shrink-0" />
                <span>Google Maps чиглэл & навигаци</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => handleStartOrder('Standard')}
            className="w-full bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] hover:from-[#e5be48] hover:to-[#fcebc4] text-slate-950 font-bold py-4 rounded-2xl text-sm transition-all shadow-xl shadow-[#d4af37]/25 flex items-center justify-center gap-2 active:scale-95"
          >
            <Sparkles className="w-5 h-5 text-slate-950" />
            <span>Урилга Захиалах (49,000₮)</span>
          </button>
        </div>
      </section>
    </div>
  );
};


// ==========================================
// 5. FAQ TAB SECTION (Асуулт)
// ==========================================
interface FaqSectionProps {
  openFaqIndex: number | null;
  setOpenFaqIndex: (idx: number | null) => void;
  handleStartOrder: (pkg: 'Standard' | 'VIP') => void;
  onNavigateTemplates: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  openFaqIndex,
  setOpenFaqIndex,
  handleStartOrder,
  onNavigateTemplates
}) => {
  return (
    <div className="space-y-16">
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f9e5af] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Түгээмэл Асуулт Хариулт</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif">
            Танд асуулт байна уу?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            Захиалга өгөх болон үйлчилгээний талаарх түгээмэл асуултуудын хариултыг эндээс аваарай.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Урилга бэлэн болоход хэр хугацаа орох вэ?",
              a: "Төлбөр баталгаажсанаас хойш манай мэргэжлийн баг 2-оос 8 цагийн дотор урилгыг бэлэн болгож, таны хувийн удирдлагын хэсгийг нээж өгнө."
            },
            {
              q: "Зочид урилгаа хэрхэн хүлээн авах вэ?",
              a: "Зочин бүрийн нэртэй хувийн холбоос болон тэдэнд зориулсан VIP QR тасалбар үүснэ. Та сошиал чат болон мессежээр нэг товшилтоор хуваалцаж болно."
            },
            {
              q: "Урилгад оруулах мэдээллээ дараа нь өөрчилж болох уу?",
              a: "Тийм. Урилга идэвхтэй байх 30 хоногийн турш та хаяг байршил, огноо, зураг, арын дуу болон бусад мэдээллээ хэзээ ч өөрийн админ хэсгээс шууд засаж өөрчлөх боломжтой."
            },
            {
              q: "Интерактив фото хана хэрхэн ажилладаг вэ?",
              a: "Баярын үеэр уригдсан зочид өөрсдийн гар утаснаас урилга руу зураг оруулна. Захиалагч та зургийг шалгаж зөвшөөрснөөр баярын танхимын дэлгэц дээр шууд слайд хэлбэрээр харагдах болно."
            },
            {
              q: "Бэлгийн данс болон QPay байршуулж болох уу?",
              a: "Тийм. Урилга дотор дансны дугаар, дансны нэр болон QPay QR кодыг байршуулах боломжтой тул зочид хялбархан бэлгээ шилжүүлэх боломжтой."
            },
            {
              q: "Урилга хэд хоног идэвхтэй байх вэ?",
              a: "Захиалсан өдрөөс эхлэн 1 сар буюу 30 хоногийн турш урилга тасралтгүй нээлттэй байх бөгөөд ирц болон фото ханыг үргэлжлүүлэн ашиглаж болно."
            }
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden transition-all shadow-lg"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-[#f9e5af] transition-colors"
                >
                  <span className="font-serif">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#d4af37] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-300 border-t border-stone-800/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* LARGE LUXURY FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-black border-2 border-[#d4af37]/40 p-8 sm:p-14 text-center space-y-8 shadow-2xl shadow-[#d4af37]/15">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#d4af37]/10 blur-3xl pointer-events-none rounded-full"></div>
          <div className="absolute -bottom-10 left-1/4 w-64 h-64 bg-amber-500/10 blur-3xl pointer-events-none rounded-full"></div>

          <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 px-4 py-1.5 rounded-full text-[#f9e5af] text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Премиум Дижитал Урилгын Сан</span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white font-serif leading-tight">
              Таны баярын үнэ цэнэ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d]">урилгаас эхэлнэ.</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Онцгой мөчөө зочдод мартагдашгүйгээр үлдээж, баярынхаа уур амьсгалыг премиум түвшинд хүргээрэй. 2–8 цагийн дотор бэлэн болно.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleStartOrder('Standard')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] hover:brightness-110 text-slate-950 font-bold px-10 py-4 rounded-2xl text-base transition-all shadow-xl shadow-[#d4af37]/30 flex items-center justify-center gap-3 active:scale-95 group"
            >
              <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>Шууд захиалах</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onNavigateTemplates}
              className="w-full sm:w-auto bg-white hover:bg-rose-50 text-[#805764] hover:text-[#754a5a] px-8 py-4 rounded-2xl text-sm font-semibold transition-all border border-stone-800 text-center"
            >
              Загварууд үзэх
            </button>
          </div>

          <div className="pt-8 border-t border-stone-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>2-8 Цагт бэлэн</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>1 Сарын турш идэвхтэй</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>VIP Тасалбар & Цахим ирц</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Тансаг Фото Цомог</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
