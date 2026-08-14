import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import QRCode from 'qrcode';
import { 
  Maximize2, Minimize2, Play, Pause, RefreshCw, Sparkles, 
  Camera, QrCode, Heart, Grid, Monitor, ArrowLeft, Volume2, ShieldCheck, X
} from 'lucide-react';
import { InvitationData, PhotoWallPhoto } from '../../types';

interface LivePhotoWallScreenProps {
  invitationData: InvitationData;
  onClose?: () => void;
  guestUploadUrl?: string;
}

export const LivePhotoWallScreen: React.FC<LivePhotoWallScreenProps> = ({
  invitationData,
  onClose,
  guestUploadUrl
}) => {
  const photos = (invitationData.photoWallPhotos || []).filter(p => p.status === 'approved');

  // Controls
  const [isPlaying, setIsPlaying] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'hero' | 'ticker'>('hero');
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate QR Code URL for guest upload
  useEffect(() => {
    const targetUrl = guestUploadUrl || window.location.href;
    QRCode.toDataURL(targetUrl, {
      width: 320,
      margin: 2,
      color: { dark: '#0a0a0a', light: '#ffffff' }
    }).then(url => setQrDataUrl(url)).catch(err => console.error(err));
  }, [guestUploadUrl]);

  // Slideshow timer
  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % photos.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPlaying, photos.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  const currentPhoto = photos[currentSlideIndex] || photos[0];

  return (
    <div className="fixed inset-0 z-50 bg-stone-950 text-stone-100 flex flex-col justify-between overflow-hidden font-sans select-none">
      
      {/* Background Ambient Blur Image Glow */}
      {currentPhoto && (
        <div className="absolute inset-0 pointer-events-none opacity-20 filter blur-3xl scale-125 transition-all duration-1000">
          <img
            src={currentPhoto.imageUrl}
            alt="Ambient background"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* TOP HEADER BAR */}
      <header className="relative z-20 p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md border-b border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
              title="Хаах"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 tracking-widest uppercase">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>LIVE EVENT PHOTO WALL - ДЭЛГЭЦНИЙ РЕЖИМ</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#f9e5af] truncate">
              {invitationData.eventTitle}
            </h1>
          </div>
        </div>

        {/* Layout & Play Controls */}
        <div className="flex items-center gap-2">
          <div className="bg-stone-900 p-1 rounded-xl border border-stone-800 flex items-center gap-1">
            <button
              onClick={() => setLayoutMode('hero')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                layoutMode === 'hero' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Слайд</span>
            </button>

            <button
              onClick={() => setLayoutMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                layoutMode === 'grid' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Грид</span>
            </button>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-800 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* MAIN DISPLAY AREA */}
      <main className="relative z-10 flex-1 p-6 sm:p-10 flex items-center justify-center overflow-hidden">
        {photos.length === 0 ? (
          <div className="text-center space-y-4 max-w-md bg-stone-900/80 backdrop-blur-xl p-8 rounded-3xl border border-stone-800">
            <Camera className="w-16 h-16 text-amber-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-serif text-[#f9e5af] font-bold">Зураг одоохондоо алга байна</h3>
            <p className="text-xs text-stone-400">
              Зочид QR кодыг утасныхаа камераар уншуулан зургаа энд шууд оруулах боломжтой!
            </p>
          </div>
        ) : layoutMode === 'hero' ? (
          /* HERO FOCUS SLIDESHOW MODE (With Edge Fade Mask & Ambient Soft Blending) */
          <div className="relative w-full max-w-5xl h-[65vh] sm:h-[72vh] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentPhoto && (
                <motion.div
                  key={currentPhoto.id}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.8 }}
                  className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl bg-black flex items-center justify-center"
                >
                  {/* Soft Radial Edge Fade Effect */}
                  <img
                    src={currentPhoto.imageUrl}
                    alt={currentPhoto.uploaderName}
                    className="w-full h-full object-contain z-10"
                  />

                  <div 
                    className="absolute inset-0 pointer-events-none z-20"
                    style={{
                      boxShadow: 'inset 0 0 50px 20px rgba(10, 10, 10, 0.85)'
                    }}
                  />

                  {/* Photo Overlay Caption Banner */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent p-6 sm:p-8 z-30 flex items-end justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-lg sm:text-2xl font-serif">
                        <Camera className="w-5 h-5 text-amber-400" />
                        <span>{currentPhoto.uploaderName}</span>
                      </div>
                      {currentPhoto.caption && (
                        <p className="text-sm sm:text-base text-stone-200 italic font-sans max-w-2xl">
                          "{currentPhoto.caption}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 bg-rose-950/70 border border-rose-500/40 text-rose-300 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                      <span>{currentPhoto.likesCount || 0}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* GRID MODE */
          <div className="w-full max-w-7xl h-full overflow-y-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2 custom-scrollbar">
            {photos.map((p) => (
              <div
                key={p.id}
                className="relative aspect-square rounded-2xl overflow-hidden border border-amber-500/20 bg-stone-900 group"
              >
                <img
                  src={p.thumbnailUrl || p.imageUrl}
                  alt={p.uploaderName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-2 left-2 right-2 text-xs font-bold text-amber-200 truncate">
                  {p.uploaderName}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* BOTTOM TICKER & QR SCANNER FOOTER */}
      <footer className="relative z-20 bg-stone-950/90 border-t border-amber-500/20 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Photo Counter */}
        <div className="flex items-center gap-3 text-xs font-mono text-stone-400">
          <span className="text-amber-400 font-bold text-sm">
            {photos.length > 0 ? `${currentSlideIndex + 1} / ${photos.length}` : '0 / 0'}
          </span>
          <span>Баталгаажсан зургууд</span>
        </div>

        {/* QR CODE UPLOAD CARD FOR GUESTS */}
        {qrDataUrl && (
          <div className="bg-stone-900 border border-amber-500/40 p-2.5 rounded-2xl flex items-center gap-3 shadow-xl">
            <img src={qrDataUrl} alt="Scan QR to upload photo" className="w-14 h-14 bg-white rounded-lg p-1 shrink-0" />
            <div className="space-y-0.5 text-left">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                УТАСААРАА СКАНИРДАН ЗУРАГ ОРУУЛАХ
              </span>
              <p className="text-xs text-stone-200 font-medium">
                QR кодыг уншуулж дурсамжаа нэмээрэй
              </p>
            </div>
          </div>
        )}
      </footer>

    </div>
  );
};
