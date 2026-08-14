import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import {
  Calendar, Clock, MapPin, Music, Volume2, VolumeX, Heart,
  Send, QrCode, Share2, Camera, Play, Pause, Check,
  ExternalLink, Copy, Sparkles, ChevronDown, CheckCircle2, Navigation, UserCheck,
  HelpCircle, UserX, Download, Smartphone, ShieldCheck, Mail
} from 'lucide-react';
import { InvitationData, RSVP, Wish } from '../../types';
import { addRsvpToOrder, addWishToOrder } from '../../lib/storage';
import { normalizeImageUrl, extractYouTubeVideoId, isYouTubeUrl } from '../../lib/mediaUtils';
import { PhotoWallView } from '../PhotoWall/PhotoWallView';
import { LivePhotoWallScreen } from '../PhotoWall/LivePhotoWallScreen';
import { AmbientDecorOverlay } from './AmbientDecorOverlay';

interface LuxuryInvitationViewProps {
  invitationData: InvitationData;
  orderId?: string;
  isPreviewMode?: boolean;
}

export const LuxuryInvitationView: React.FC<LuxuryInvitationViewProps> = ({
  invitationData,
  orderId,
  isPreviewMode = false
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const youtubeVideoId = extractYouTubeVideoId(invitationData.backgroundMusicUrl);
  const isYouTubeMusic = Boolean(youtubeVideoId);

  // RSVP Form State
  const [personalizedGuestName, setPersonalizedGuestName] = useState<string>('Мягмарцэрэн');
  const [guestName, setGuestName] = useState('Мягмарцэрэн');
  const [guestPhone, setGuestPhone] = useState('');
  const [attendance, setAttendance] = useState<'attending' | 'maybe' | 'declined'>('attending');
  const [guestCount, setGuestCount] = useState<number>(1);
  const [mealPref, setMealPref] = useState('Standard Gourmet');
  const [rsvpNote, setRsvpNote] = useState('');
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);

  // Extract ?to=GuestName query parameter on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const toParam = searchParams.get('to');
      if (toParam) {
        const decodedName = decodeURIComponent(toParam).trim();
        if (decodedName) {
          setPersonalizedGuestName(decodedName);
          setGuestName(decodedName);
          setWishName(decodedName);
        }
      }
    }
  }, [isPreviewMode]);

  // Generated Badge & Pass State
  const [generatedBadgeToken, setGeneratedBadgeToken] = useState<string>('');
  const [generatedQrPassUrl, setGeneratedQrPassUrl] = useState<string>('');
  const [submittedGuestName, setSubmittedGuestName] = useState<string>('');
  const [submittedAttendance, setSubmittedAttendance] = useState<'attending' | 'maybe' | 'declined'>('attending');
  const [deviceFingerprintId, setDeviceFingerprintId] = useState<string>('');

  // Wish Form State
  const [wishName, setWishName] = useState('');
  const [wishMsg, setWishMsg] = useState('');
  const [wishPhoto, setWishPhoto] = useState('');
  const [wishSubmitted, setWishSubmitted] = useState(false);

  // Modals
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLiveScreen, setShowLiveScreen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Countdown uses ISO dates when available and also supports Mongolian date text.
  const getEventTimestamp = () => {
    const directTimestamp = Date.parse(`${invitationData.date || ''} ${invitationData.time || ''}`);
    if (!Number.isNaN(directTimestamp)) return directTimestamp;

    const values = (invitationData.date || '').match(/\d+/g)?.map(Number) || [];
    const time = (invitationData.time || '').match(/\d+/g)?.map(Number) || [];
    if (values.length >= 3) {
      return new Date(values[0], values[1] - 1, values[2], time[0] || 12, time[1] || 0).getTime();
    }
    return null;
  };

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [weather, setWeather] = useState({ temperature: '--', pressure: '--', humidity: '--' });

  useEffect(() => {
    const updateCountdown = () => {
      const eventTimestamp = getEventTimestamp();
      const diff = eventTimestamp ? Math.max(0, eventTimestamp - Date.now()) : 0;
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(interval);
  }, [invitationData.date, invitationData.time]);

  useEffect(() => {
    let cancelled = false;
    const loadWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=47.9184&longitude=106.9177&current=temperature_2m,relative_humidity_2m,pressure_msl&temperature_unit=celsius&timezone=Asia%2FUlaanbaatar');
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled && data.current) {
          setWeather({
            temperature: `${Number(data.current.temperature_2m).toFixed(1)}°C`,
            pressure: `${Math.round(data.current.pressure_msl)} hPa`,
            humidity: `${Math.round(data.current.relative_humidity_2m)}%`
          });
        }
      } catch {
        // Countdown remains useful when weather is unavailable.
      }
    };

    loadWeather();
    const interval = window.setInterval(loadWeather, 15 * 60 * 1000);
    return () => { cancelled = true; window.clearInterval(interval); };
  }, []);

  const toggleMusic = () => {
    if (isYouTubeMusic) {
      setIsPlayingMusic(prev => !prev);
      return;
    }
    if (!audioRef.current) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(e => console.log('Audio play error:', e));
    }
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    // Generate unique event token & secondary device fingerprint
    const token = `AURA-${invitationData.eventTitle ? invitationData.eventTitle.slice(0, 3).toUpperCase() : 'EVT'}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const fp = `FP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    let qrUrl = '';
    if (attendance === 'attending' || attendance === 'maybe') {
      try {
        qrUrl = await QRCode.toDataURL(token, {
          width: 320,
          margin: 2,
          color: { dark: '#0a0a0a', light: '#ffffff' }
        });
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    }

    if (orderId && !isPreviewMode) {
      addRsvpToOrder(orderId, {
        guestName,
        phone: guestPhone,
        attendance,
        guestCount,
        mealPreference: mealPref,
        note: rsvpNote,
        token: token,
        checkInStatus: 'pending',
        deviceFingerprint: fp
      });
    }

    setSubmittedGuestName(guestName);
    setSubmittedAttendance(attendance);
    setGeneratedBadgeToken(token);
    setGeneratedQrPassUrl(qrUrl);
    setDeviceFingerprintId(fp);
    setRsvpSubmitted(true);
  };

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishMsg.trim()) return;

    if (orderId && !isPreviewMode) {
      addWishToOrder(orderId, {
        guestName: wishName,
        message: wishMsg,
        photoUrl: wishPhoto || undefined
      });
    }

    setWishSubmitted(true);
    setTimeout(() => {
      setWishName('');
      setWishMsg('');
      setWishPhoto('');
      setWishSubmitted(false);
    }, 4000);
  };

  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent(invitationData.eventTitle);
    const details = encodeURIComponent(invitationData.invitationMessage);
    const location = encodeURIComponent(`${invitationData.locationName}, ${invitationData.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  const copyAccountNum = (accountNum: string) => {
    navigator.clipboard.writeText(accountNum);
    setCopiedAccount(accountNum);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const primaryColor = invitationData.themeColor || '#C5A059';
  const backgroundImageUrl = invitationData.backgroundImageUrl?.trim();
  const backgroundOverlayOpacity = Math.min(100, Math.max(0, invitationData.backgroundOverlayOpacity ?? 20));
  const backgroundStyle: React.CSSProperties | undefined = backgroundImageUrl ? {
    backgroundImage: `url(${normalizeImageUrl(backgroundImageUrl)})`,
    backgroundPosition: invitationData.backgroundPosition || 'center top',
    backgroundSize: invitationData.backgroundSize || 'cover',
    backgroundRepeat: invitationData.backgroundRepeat || 'no-repeat',
    backgroundAttachment: invitationData.backgroundAttachment || 'fixed'
  } : undefined;

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#fffdf7] text-[#314b52] font-serif selection:bg-[#dcefee]">
      {backgroundImageUrl && (
        <>
          <div className="fixed inset-0 z-0 pointer-events-none" style={backgroundStyle} aria-hidden="true" />
          <div
            className="fixed inset-0 z-0 pointer-events-none"
            style={{ backgroundColor: invitationData.backgroundOverlayColor || '#0c0a09', opacity: backgroundOverlayOpacity / 100 }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Background Audio / YouTube Player */}
      {invitationData.showMusicPlayer && invitationData.backgroundMusicUrl && (
        <>
          {isYouTubeMusic ? (
            isPlayingMusic && youtubeVideoId && (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&loop=1&playlist=${youtubeVideoId}&controls=0`}
                className="hidden pointer-events-none"
                allow="autoplay"
                title="Background YouTube Audio"
              />
            )
          ) : (
            <audio
              ref={audioRef}
              src={invitationData.backgroundMusicUrl}
              loop
              preload="auto"
            />
          )}

          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={toggleMusic}
              className="w-12 h-12 rounded-full bg-stone-900/90 backdrop-blur-md border border-amber-500/40 text-[#638c98] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all"
              title={isPlayingMusic ? 'Дууг зогсоох' : 'Арын дуу тоглуулах'}
            >
              {isPlayingMusic ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-amber-300 animate-bounce"></span>
                  <span className="w-1 h-4 bg-amber-300 animate-bounce delay-100"></span>
                  <span className="w-1 h-2 bg-amber-300 animate-bounce delay-200"></span>
                </div>
              ) : (
                <Music className="w-5 h-5 text-[#779ca6]" />
              )}
            </button>
          </div>
        </>
      )}

      {/* INTERACTIVE PERSONALIZED LINK TEST BAR (In Preview Mode) */}
      {isPreviewMode && (
        <div className="sticky top-0 z-50 bg-stone-900/95 border-b border-amber-500/30 px-4 py-2.5 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 font-bold text-[#638c98]">
              <Sparkles className="w-3.5 h-3.5 text-[#779ca6] animate-spin" />
              <span>Зочин бүрт нэртэй хувийн линк өгөх боломжтой:</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            <span className="text-[#728b90] hidden sm:inline shrink-0">Зочны нэр:</span>
            <input
              type="text"
              value={personalizedGuestName}
              onChange={(e) => {
                setPersonalizedGuestName(e.target.value);
                setGuestName(e.target.value);
                setWishName(e.target.value);
              }}
              placeholder="Нэр бичих (ж: Г.Болд, Аав, Ээж танаа)..."
              className="bg-[#f7fbf8] border border-amber-500/40 rounded-lg px-3 py-1 text-white text-xs w-full focus:outline-none focus:border-amber-400 font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] text-[#728b90] hidden md:inline">Турших нэрс:</span>
            {['Б.Болд', 'Эрхэм Аав, Ээж', 'Сүйт залуугийн тал'].map((sampleName) => (
              <button
                key={sampleName}
                onClick={() => {
                  setPersonalizedGuestName(sampleName);
                  setGuestName(sampleName);
                  setWishName(sampleName);
                }}
                className="bg-stone-800 hover:bg-amber-500/20 text-[#45636b] hover:text-amber-200 border border-stone-700 rounded px-2 py-0.5 text-[10px] transition-colors"
              >
                {sampleName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 1: LUXURY HERO COVER */}
      <section className="relative isolate min-h-screen overflow-hidden px-5 py-10 text-center sm:px-8 sm:py-14">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_10%_10%,rgba(193,220,234,.55),transparent_24%),radial-gradient(circle_at_90%_18%,rgba(227,240,211,.65),transparent_22%),linear-gradient(180deg,#fffef9_0%,#f7fbf5_100%)]" />
        <div className="absolute left-0 top-0 -z-10 h-56 w-56 rounded-full border-[18px] border-[#dbe9f0]/50 blur-[1px]" />
        <div className="absolute bottom-0 right-0 -z-10 h-64 w-64 rounded-full border-[22px] border-[#e2efd7]/60 blur-[1px]" />
        <AmbientDecorOverlay effectType="all" />
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl flex-col items-center justify-between rounded-[2.5rem] border border-[#dbe7e9] bg-white/70 p-6 shadow-[0_18px_55px_rgba(95,127,135,0.12)] backdrop-blur-sm sm:p-10">
        <div className="absolute inset-x-0 top-0 -z-10 h-64 overflow-hidden rounded-t-[2.5rem] opacity-25">
          <img src={normalizeImageUrl(invitationData.heroPhotoUrl)} alt="" className="h-full w-full object-cover" />
        </div>

        {/* Top Eyebrow */}
        <div className="relative z-10 pt-10 space-y-2">
          <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#78939b] font-bold block">
            {invitationData.eventTitle || 'THE WEDDING CELEBRATION OF'}
          </span>
          <div className="mx-auto h-px w-16 bg-[#9ebfc8]"></div>
        </div>

        {/* Center Main Subject Name display */}
        <div className="relative z-10 space-y-6 max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#486c78] font-light tracking-wide leading-tight drop-shadow-sm"
          >
            {invitationData.brideName && invitationData.groomName ? (
              <>
                {invitationData.brideName}
                <span className="block text-2xl sm:text-4xl text-[#9bbdcb] my-2 font-sans italic">&</span>
                {invitationData.groomName}
              </>
            ) : invitationData.birthdayPersonName ? (
              <>
                {invitationData.birthdayPersonName}
                {invitationData.age && (
                  <span className="block text-xl sm:text-2xl text-[#779ca6] my-2 font-sans">
                    {invitationData.age}
                  </span>
                )}
              </>
            ) : invitationData.childName ? (
              <>
                {invitationData.childName}
                {invitationData.age && (
                  <span className="block text-xl sm:text-2xl text-[#779ca6] my-2 font-sans">
                    {invitationData.age}
                  </span>
                )}
              </>
            ) : invitationData.companyName ? (
              invitationData.companyName
            ) : invitationData.graduateName ? (
              invitationData.graduateName
            ) : invitationData.clanName ? (
              invitationData.clanName
            ) : invitationData.deceasedName ? (
              invitationData.deceasedName
            ) : (
              invitationData.eventTitle || 'Заллага Дижитал Урилга'
            )}
          </motion.h1>

          {/* Personalized Guest Welcome Greeting with Prominent Font */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="my-6 max-w-xl space-y-3 rounded-[2rem] border border-[#cddfe3] bg-white/85 p-6 shadow-[0_12px_30px_rgba(96,132,143,0.12)] backdrop-blur-xl sm:p-8"
          >
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-center justify-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#6b919c]">
              <Sparkles className="w-3.5 h-3.5 text-[#779ca6]" />
              <span>ХҮНДЭТГЭЛИЙН УРИЛГА</span>
              <Sparkles className="w-3.5 h-3.5 text-[#779ca6]" />
            </div>

            <p className="font-serif text-base font-bold leading-snug tracking-wide text-[#557682] sm:text-2xl md:text-3xl">
              Эрхэм хүндэт: <span className="text-[#537b88] font-extrabold underline decoration-amber-400/60 underline-offset-8">{personalizedGuestName || 'Мягмарцэрэн'}</span> таныг гэр бүлийн хамт <span className="text-[#638c98] font-extrabold">{invitationData.eventTitle || 'Баярын Арга Хэмжээ'}</span>-нд морилон ирэхийг урьж байна...
            </p>
          </motion.div>

          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#718d94] sm:text-sm">
            {invitationData.date} {invitationData.time && `• ${invitationData.time}`}
          </p>
        </div>

        {/* Open Invitation Button & Smooth Animatic Reveal */}
        <div className="relative z-10 pb-12 space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsEnvelopeOpened(true);
              if (!isPlayingMusic && audioRef.current) {
                audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
              } else if (!isPlayingMusic && isYouTubeMusic) {
                setIsPlayingMusic(true);
              }
              const nextSection = document.getElementById('invitation-content-section');
              if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
              }
            }}
            className="group relative inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#a9c9d2] bg-[#dceff2] px-8 py-4 font-sans text-sm font-extrabold uppercase tracking-widest text-[#3e6672] shadow-[0_8px_20px_rgba(93,137,146,0.18)] transition-all hover:bg-[#cce6ea] active:scale-95 sm:text-base"
          >
            <Mail className="w-5 h-5 text-slate-950 animate-bounce" />
            <span>УРИЛГА НЭЭХ</span>
            <ChevronDown className="w-5 h-5 text-slate-950 group-hover:translate-y-1 transition-transform" />
          </motion.button>

          <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-[#7b969d]">
            Товчлуур дээр дарж баярын хөтөлбөртэй танилцана уу
          </p>
        </div>
        </div>
      </section>

      {/* SECTION 2: PARENTS & BLESSING MESSAGE */}
      <section id="invitation-content-section" className="relative z-10 mx-auto max-w-3xl space-y-8 px-6 py-20 text-center">

        {/* Family Acknowledgement / Category Details */}
        {(invitationData.brideParents || invitationData.groomParents || invitationData.fatherName || invitationData.motherName || invitationData.parentsNames || invitationData.schoolName || invitationData.clanLeader) && (
          <div className="space-y-4">
            <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#d4af37]">Баярын Эзэд & Эцэг Эх</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-sans text-[#5d777d] leading-relaxed pt-2 border-t border-white/10">
              {invitationData.brideParents && (
                <div>
                  <span className="block text-[#f9e5af] font-semibold mb-1">Сүйт бүсгүйн тал</span>
                  <span>{invitationData.brideParents}</span>
                </div>
              )}
              {invitationData.groomParents && (
                <div>
                  <span className="block text-[#f9e5af] font-semibold mb-1">Сүйт залуугийн тал</span>
                  <span>{invitationData.groomParents}</span>
                </div>
              )}
              {invitationData.fatherName && (
                <div>
                  <span className="block text-[#f9e5af] font-semibold mb-1">Аав</span>
                  <span>{invitationData.fatherName}</span>
                </div>
              )}
              {invitationData.motherName && (
                <div>
                  <span className="block text-[#f9e5af] font-semibold mb-1">Ээж</span>
                  <span>{invitationData.motherName}</span>
                </div>
              )}
              {invitationData.parentsNames && (
                <div className="col-span-full">
                  <span className="block text-[#f9e5af] font-semibold mb-1">Эцэг Эх</span>
                  <span>{invitationData.parentsNames}</span>
                </div>
              )}
              {invitationData.schoolName && (
                <div>
                  <span className="block text-[#f9e5af] font-semibold mb-1">Сургууль</span>
                  <span>{invitationData.schoolName}</span>
                </div>
              )}
              {invitationData.className && (
                <div>
                  <span className="block text-[#f9e5af] font-semibold mb-1">Анги / Мэргэжил</span>
                  <span>{invitationData.className}</span>
                </div>
              )}
              {invitationData.clanLeader && (
                <div className="col-span-full">
                  <span className="block text-[#f9e5af] font-semibold mb-1">Ургийн Ахлагч</span>
                  <span>{invitationData.clanLeader}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Dynamic Fields for "Бусад" */}
        {invitationData.customFields && invitationData.customFields.length > 0 && (
          <div className="bg-black/30 backdrop-blur-xl p-6 rounded-2xl border border-amber-500/20 text-xs font-sans space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-[#d4af37] font-bold block">Нэмэлт Мэдээлэл</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              {invitationData.customFields.map((cf) => (
                <div key={cf.id} className="p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="block text-[#f9e5af] font-semibold mb-0.5">{cf.label}</span>
                  <span className="text-[#45636b]">{cf.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Invitation Body Message */}
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 space-y-4 shadow-2xl relative">
          <div className="w-8 h-8 mx-auto text-[#d4af37] font-serif text-3xl">“</div>
          <p className="text-sm sm:text-base text-[#45636b] font-serif leading-relaxed italic">
            {invitationData.invitationMessage}
          </p>

          {invitationData.blessingText && (
            <p className="text-xs text-[#f9e5af] font-sans tracking-wide pt-4 border-t border-white/10">
              {invitationData.blessingText}
            </p>
          )}
        </div>

      </section>

      {/* SECTION 3: EVENT COUNTDOWN */}
      {invitationData.showCountdown && (
        <section className="relative z-10 px-3 py-10 sm:px-6">
          <div className="mx-auto max-w-xl rounded-2xl border border-[#eadfbf] bg-[#fffdf7]/95 p-3 shadow-[0_12px_32px_rgba(130,105,48,0.12)] backdrop-blur-xl sm:p-4">
            <div className="mb-3 text-center">
              <span className="font-sans text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#b68a2c]">Баярын өдөр хүртэл үлдсэн хугацаа</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              {[
                { label: 'ӨДӨР', value: timeLeft.days, sub: 'DAYS', color: '#f1a51d', soft: '#fff4d9', max: 30 },
                { label: 'ЦАГ', value: timeLeft.hours, sub: 'HOURS', color: '#1689ff', soft: '#eaf5ff', max: 24 },
                { label: 'МИНУТ', value: timeLeft.minutes, sub: 'MINS', color: '#8b5cf6', soft: '#f3edff', max: 60 },
                { label: 'СЕК', value: timeLeft.seconds, sub: 'SECS', color: '#31a866', soft: '#e8f8ee', max: 60 }
              ].map((unit) => (
                <div key={unit.label} className="relative isolate min-w-0 overflow-hidden rounded-xl border p-2 text-center shadow-sm sm:rounded-2xl sm:p-3" style={{ backgroundColor: unit.soft, borderColor: `${unit.color}55` }}>
                  <div className="mx-auto flex aspect-square max-w-[82px] items-center justify-center rounded-full border border-white/90 bg-white/80 shadow-inner" style={{ background: `conic-gradient(${unit.color} ${(unit.value / unit.max) * 360}deg, transparent 0)` }}>
                    <div className="flex h-[calc(100%-7px)] w-[calc(100%-7px)] flex-col items-center justify-center rounded-full bg-white">
                      <span className="font-sans text-[8px] font-extrabold tracking-wide sm:text-[10px]" style={{ color: unit.color }}>{unit.label}</span>
                      <strong className="font-sans text-2xl font-black leading-none tracking-tighter sm:text-4xl" style={{ color: unit.color }}>{String(unit.value).padStart(2, '0')}</strong>
                    </div>
                  </div>
                  <span className="mt-1 block font-sans text-[7px] font-bold tracking-[0.12em] text-[#728b90] sm:text-[9px]">{unit.sub}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-xl border border-[#eee6d5] bg-white/75 px-3 py-2 font-sans">
              <div className="flex items-center gap-2 text-[9px] font-semibold text-stone-500">
                <span className="text-sm">🌤️</span><span>ЦАГ АГААР</span><span className="truncate text-[#aa842c]">📍 Улаанбаатар · Өнөөдөр</span>
              </div>
              <div className="mt-2 grid grid-cols-3 divide-x divide-[#eee6d5] text-center">
                <div><span className="block text-[8px] text-[#728b90]">ДУВААН</span><strong className="text-[11px] text-stone-700">{weather.temperature}</strong></div>
                <div><span className="block text-[8px] text-[#728b90]">ДАРАЛТ</span><strong className="text-[11px] text-stone-700">{weather.pressure}</strong></div>
                <div><span className="block text-[8px] text-[#728b90]">ЧИЙГШИЛ</span><strong className="text-[11px] text-stone-700">{weather.humidity}</strong></div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: PROGRAM / SCHEDULE */}
      {invitationData.schedule && invitationData.schedule.length > 0 && (
        <section className="relative z-10 mx-auto max-w-2xl space-y-10 px-6 py-20 text-center">
          <div className="space-y-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#779ca6]">Хөтөлбөр</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#486c78]">Баярын Хөтөлбөр</h2>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-px before:bg-stone-800">
            {invitationData.schedule.map((item, idx) => (
              <div key={idx} className="relative bg-white/85 p-5 rounded-2xl border border-[#dce7e3] shadow-lg text-left max-w-md mx-auto space-y-1">
                <div className="flex items-center justify-between text-xs font-sans text-[#779ca6] font-semibold mb-1">
                  <span>{item.time}</span>
                  <Clock className="w-3.5 h-3.5 text-[#779ca6]/80" />
                </div>
                <h3 className="font-serif text-base text-[#355760]">{item.title}</h3>
                {item.description && (
                  <p className="text-xs font-sans text-[#728b90] leading-relaxed">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 5: VENUE, MAP & CALENDAR */}
      <section className="relative z-10 mx-auto max-w-4xl space-y-8 border-y border-[#dce8df] bg-white/70 px-6 py-20 text-center">
        <div className="space-y-2">
          <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#779ca6]">Байршил Ба Огноо</span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#486c78]">{invitationData.locationName}</h2>
          <p className="text-xs font-sans text-[#728b90] max-w-md mx-auto">{invitationData.address}</p>
        </div>

        {/* Embedded Google Map */}
        {invitationData.googleMapsEmbedUrl && (
          <div className="rounded-3xl border border-[#dce7e3] overflow-hidden shadow-2xl h-80 bg-stone-900">
            <iframe
              title="Venue Location Map"
              src={invitationData.googleMapsEmbedUrl}
              className="w-full h-full border-0 filter grayscale invert contrast-125 opacity-90 hover:opacity-100 transition-opacity"
              loading="lazy"
            ></iframe>
          </div>
        )}

        {/* Map & Calendar Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-sans">
          {invitationData.googleMapsDirectUrl && (
            <a
              href={invitationData.googleMapsDirectUrl}
              target="_blank"
              rel="noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 flex items-center gap-2"
            >
              <Navigation className="w-4 h-4 text-stone-950" />
              <span>Google Maps Дээр Чиглэл Харах</span>
            </a>
          )}

          <a
            href={generateGoogleCalendarUrl()}
            target="_blank"
            rel="noreferrer"
            className="bg-stone-900 hover:bg-stone-800 text-[#45636b] border border-stone-700 px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4 text-[#779ca6]" />
            <span>Календарьт Нэмэх</span>
          </a>
        </div>
      </section>

      {/* SECTION 6: DRESS CODE */}
      {invitationData.dressCode && (
        <section className="relative z-10 mx-auto max-w-xl space-y-4 px-6 py-16 text-center">
          <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#779ca6]">Хувцаслалтын Дүрэм</span>
          <h3 className="text-xl font-serif text-[#486c78]">{invitationData.dressCode.title}</h3>
          <p className="text-xs font-sans text-[#5d777d] leading-relaxed max-w-md mx-auto">
            {invitationData.dressCode.description}
          </p>

          {invitationData.dressCode.colorPalette && invitationData.dressCode.colorPalette.length > 0 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {invitationData.dressCode.colorPalette.map((color, idx) => (
                <div
                  key={idx}
                  className="w-7 h-7 rounded-full border border-stone-700 shadow-md"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* SECTION 7: PHOTO GALLERY LIGHTBOX */}
      {invitationData.showGallery && invitationData.couplePhotos && invitationData.couplePhotos.length > 0 && (
        <section className="relative z-10 mx-auto max-w-4xl space-y-8 px-6 py-20 text-center">
          <div className="space-y-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#779ca6]">Дурсамжит Зургууд</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#486c78]">Зургийн Цомог</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {invitationData.couplePhotos.map((photo, pIdx) => (
              <div
                key={pIdx}
                onClick={() => setSelectedPhotoIndex(pIdx)}
                className="aspect-square rounded-2xl overflow-hidden border border-[#dce7e3] cursor-pointer group relative bg-stone-900"
              >
                <img
                  src={normalizeImageUrl(photo)}
                  alt={`Couple photo ${pIdx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#f7fbf8]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera className="w-6 h-6 text-[#638c98]" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 8: RSVP FORM & INSTANT QR BADGE */}
      {invitationData.showRsvp && (
        <section className="relative z-10 mx-auto max-w-xl space-y-6 px-6 py-20 text-center">
          <div className="space-y-2">
            <span className="text-[10px] font-sans uppercase tracking-[0.3em] text-[#779ca6]">Ирэх Эсэхээ Мэдэгдэх</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#486c78]">RSVP - Бүртгэл & QR Нэвтрэх Пасс</h2>
            <p className="text-xs font-sans text-[#728b90]">Та хүрэлцэн ирэх эсэхээ тэмдэглэж бидэнд тусална уу</p>
          </div>

          {rsvpSubmitted ? (
            <div className="space-y-6">
              {/* Submission Confirmation Toast */}
              <div className="bg-emerald-950/60 border border-emerald-500/40 p-5 rounded-3xl text-emerald-300 text-xs space-y-1.5 shadow-xl">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm text-white">Баярлалаа! Таны бүртгэлийг хүлээн авлаа</h4>
                <p className="text-[#5d777d]">
                  {submittedAttendance === 'attending' ? 'Таны VIP нэвтрэх QR пасс бэлэн боллоо. Арга хэмжээний үүдэнд уншуулна уу.' :
                   submittedAttendance === 'maybe' ? 'Таны хариуг тэмдэглэн авлаа. Та дараа шийдвэрээ шинэчлэх боломжтой.' :
                   'Мэдээлэл өгсөнд баярлалаа.'}
                </p>
              </div>

              {/* VIP QR BADGE CARD (When Attending or Maybe) */}
              {(submittedAttendance === 'attending' || submittedAttendance === 'maybe') && generatedQrPassUrl && (
                <div className="bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 text-[#355760] font-sans shadow-2xl relative overflow-hidden space-y-5">

                  {/* Subtle Gold Accents */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Pass Header */}
                  <div className="space-y-1 border-b border-[#dce7e3] pb-4">
                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#779ca6] uppercase tracking-widest">
                      <Sparkles className="w-3.5 h-3.5 text-[#779ca6]" />
                      <span>VIP EVENT ENTRANCE PASS</span>
                    </div>
                    <h3 className="text-lg font-serif text-[#f9e5af] font-bold">
                      {invitationData.eventTitle}
                    </h3>
                  </div>

                  {/* Guest Info & Token */}
                  <div className="bg-stone-900/90 p-4 rounded-2xl border border-[#dce7e3] space-y-2 text-center">
                    <span className="text-[10px] uppercase font-bold text-[#728b90] tracking-wider block">Зочны Нэр</span>
                    <h4 className="text-xl font-bold text-white font-serif">{submittedGuestName}</h4>

                    <div className="pt-2 border-t border-[#dce7e3] flex items-center justify-center gap-2">
                      <span className="text-[10px] text-[#728b90] uppercase">Токен Код:</span>
                      <span className="text-sm font-mono font-bold text-[#638c98] bg-[#f7fbf8] px-2.5 py-0.5 rounded border border-amber-500/30">
                        {generatedBadgeToken}
                      </span>
                    </div>
                  </div>

                  {/* QR Code Canvas / Image Display */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-700 shadow-xl inline-block mx-auto space-y-2">
                    <img
                      src={generatedQrPassUrl}
                      alt="Guest QR Entrance Badge"
                      className="w-48 h-48 sm:w-56 sm:h-56 mx-auto object-contain"
                    />
                    <div className="text-[10px] font-mono text-stone-900 font-bold text-center uppercase tracking-wider">
                      {generatedBadgeToken}
                    </div>
                  </div>

                  {/* Date & Location */}
                  <div className="text-xs space-y-1 text-[#5d777d]">
                    <div className="flex items-center justify-center gap-1 text-[#638c98] font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{invitationData.date} ({invitationData.time})</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 text-[#728b90] text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-[#779ca6]" />
                      <span>{invitationData.locationName}</span>
                    </div>
                  </div>

                  {/* Secondary Device Fingerprint Indicator */}
                  <div className="pt-3 border-t border-[#dce7e3]/80 flex items-center justify-between text-[10px] text-stone-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-amber-500/70" />
                      <span>Төхөөрөмж: {deviceFingerprintId}</span>
                    </span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Баталгаажсан</span>
                    </span>
                  </div>

                  {/* Actions: Download Badge */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <a
                      href={generatedQrPassUrl}
                      download={`AURA_VIP_Pass_${submittedGuestName.replace(/\s+/g, '_')}.png`}
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4 text-stone-950" />
                      <span>QR Пасс Хадгалах (PNG)</span>
                    </a>

                    <button
                      onClick={() => setRsvpSubmitted(false)}
                      className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-[#5d777d] rounded-xl text-xs font-semibold border border-[#dce7e3] transition-colors"
                    >
                      Хариу шинэчлэх
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleRsvpSubmit} className="bg-white/90 p-6 sm:p-8 rounded-3xl border border-[#dce7e3] text-left font-sans text-xs space-y-4 shadow-2xl">
              <div>
                <label className="block text-[#5d777d] font-medium mb-1">Таны бүтэн нэр *</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Жишээ: Д.Батбаатар"
                  className="w-full bg-[#f7fbf8] border border-[#dce7e3] rounded-xl px-3.5 py-2.5 text-[#355760] focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#5d777d] font-medium mb-1">Утасны дугаар</label>
                <input
                  type="text"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="99110000"
                  className="w-full bg-[#f7fbf8] border border-[#dce7e3] rounded-xl px-3.5 py-2.5 text-[#355760] focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* 3 RSVP Choices: Attending / Maybe / Declined */}
              <div>
                <label className="block text-[#5d777d] font-medium mb-1.5">Та хүрэлцэн ирэх үү? *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAttendance('attending')}
                    className={`py-3 px-2 rounded-xl font-bold text-xs transition-all border flex flex-col items-center gap-1 ${
                      attendance === 'attending'
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-[#f7fbf8] text-[#728b90] border-[#dce7e3] hover:border-stone-700'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>🟢 Очно</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendance('maybe')}
                    className={`py-3 px-2 rounded-xl font-bold text-xs transition-all border flex flex-col items-center gap-1 ${
                      attendance === 'maybe'
                        ? 'bg-amber-500/30 text-[#638c98] border-amber-500/60 shadow-md'
                        : 'bg-[#f7fbf8] text-[#728b90] border-[#dce7e3] hover:border-stone-700'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>🟡 Магадгүй</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttendance('declined')}
                    className={`py-3 px-2 rounded-xl font-bold text-xs transition-all border flex flex-col items-center gap-1 ${
                      attendance === 'declined'
                        ? 'bg-stone-800 text-rose-300 border-stone-600 shadow-md'
                        : 'bg-[#f7fbf8] text-[#728b90] border-[#dce7e3] hover:border-stone-700'
                    }`}
                  >
                    <UserX className="w-4 h-4" />
                    <span>🔴 Очихгүй</span>
                  </button>
                </div>
              </div>

              {(attendance === 'attending' || attendance === 'maybe') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#5d777d] font-medium mb-1">Хүний тоо</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full bg-[#f7fbf8] border border-[#dce7e3] rounded-xl px-3.5 py-2.5 text-[#355760] focus:border-amber-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} хүн</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#5d777d] font-medium mb-1">Хоолны сонголт</label>
                    <select
                      value={mealPref}
                      onChange={(e) => setMealPref(e.target.value)}
                      className="w-full bg-[#f7fbf8] border border-[#dce7e3] rounded-xl px-3.5 py-2.5 text-[#355760] focus:border-amber-500 focus:outline-none"
                    >
                      <option value="Standard Gourmet">Стандарт цэс</option>
                      <option value="Pan-Seared Salmon">Салмон загас</option>
                      <option value="Vegetarian Gourmet Risotto">Цагаан хоол</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[#5d777d] font-medium mb-[2px]">Сэтгэлийн үг / Тэмдэглэл</label>
                <textarea
                  rows={2}
                  value={rsvpNote}
                  onChange={(e) => setRsvpNote(e.target.value)}
                  placeholder="Нэмэлт тэмдэглэл..."
                  className="w-full bg-[#f7fbf8] border border-[#dce7e3] rounded-xl p-3 text-[#355760] focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 hover:from-amber-400 hover:to-amber-500 flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4 text-stone-950" />
                <span>{attendance === 'attending' ? 'RSVP Бүртгүүлж QR Пасс Авах' : 'RSVP Бүртгэл Илгээх'}</span>
              </button>
            </form>
          )}
        </section>
      )}

      {/* SECTION 9: GUESTBOOK & WISHES */}
      {invitationData.showGuestBook && (
        <section className="relative z-10 mx-auto max-w-2xl space-y-8 px-6 py-20 text-center font-sans">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#779ca6]">Ерөөлийн Үгс</span>
            <h2 className="text-2xl sm:text-3xl font-serif text-[#486c78]">Зочдын Ном</h2>
          </div>

          {/* Leave a wish form */}
          <div className="bg-white/90 p-6 rounded-3xl border border-[#dce7e3] text-left text-xs space-y-3 shadow-xl">
            <h3 className="font-bold text-white text-sm">Сэтгэлийн Ерөөл Үлдээх</h3>

            {wishSubmitted ? (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300">
                Таны ерөөлийг хүлээн авлаа! Баярлалаа.
              </div>
            ) : (
              <form onSubmit={handleWishSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  value={wishName}
                  onChange={(e) => setWishName(e.target.value)}
                  placeholder="Таны нэр"
                  className="w-full bg-[#f7fbf8] border border-[#dce7e3] rounded-xl px-3.5 py-2 text-[#355760] focus:border-amber-500 focus:outline-none"
                />

                <textarea
                  required
                  rows={3}
                  value={wishMsg}
                  onChange={(e) => setWishMsg(e.target.value)}
                  placeholder="Залуу хосод зориулсан ерөөлөө бичнэ үү..."
                  className="w-full bg-[#f7fbf8] border border-[#dce7e3] rounded-xl p-3 text-[#355760] focus:border-amber-500 focus:outline-none"
                />

                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Ерөөл Илгээх
                </button>
              </form>
            )}
          </div>

          {/* List of existing wishes */}
          <div className="space-y-3 text-left">
            {(invitationData.wishes || []).map((wish) => (
              <div key={wish.id} className="bg-white/80 p-4 rounded-2xl border border-[#dce7e3] space-y-1">
                <div className="flex justify-between items-center text-[11px] text-[#638c98] font-semibold">
                  <span>{wish.guestName}</span>
                  <span className="text-[10px] text-stone-500 font-normal">{new Date(wish.submittedAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-[#45636b] italic font-serif leading-relaxed">"{wish.message}"</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 9.5: V2.2 PHOTO WALL */}
      <PhotoWallView
        orderId={orderId}
        invitationData={invitationData}
        isPreviewMode={isPreviewMode}
        onOpenLiveScreen={() => setShowLiveScreen(true)}
      />

      {/* LIVE PHOTO WALL SCREEN MODAL */}
      {showLiveScreen && (
        <LivePhotoWallScreen
          invitationData={invitationData}
          onClose={() => setShowLiveScreen(false)}
        />
      )}

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-[#dce7e3] text-center font-sans text-xs text-stone-500 space-y-3">
        <p className="text-[#5d777d] font-serif text-sm">
          {invitationData.brideName} & {invitationData.groomName}
        </p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#728b90]">
          <span>Бүтээсэн:</span>
          <a
            href="https://aura.mn"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#779ca6] hover:text-[#638c98] transition-colors bg-white border border-[#bdd5d9] px-2.5 py-1 rounded-full shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-[#779ca6] animate-pulse" />
            <span>Аура Дижитал Урилга Платформ</span>
          </a>
        </div>
      </footer>

      {/* LIGHTBOX PHOTO MODAL */}
      {selectedPhotoIndex !== null && invitationData.couplePhotos && (
        <div className="fixed inset-0 z-50 bg-[#f7fbf8]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-3xl w-full text-center space-y-3 relative">
            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="absolute top-2 right-2 text-white bg-white/85 p-2 rounded-full border border-[#dce7e3]"
            >
              ✕
            </button>
            <img
              src={normalizeImageUrl(invitationData.couplePhotos[selectedPhotoIndex])}
              alt="Expanded photo"
              className="max-h-[80vh] mx-auto rounded-2xl object-contain border border-[#dce7e3]"
            />
          </div>
        </div>
      )}

    </div>
  );
};
