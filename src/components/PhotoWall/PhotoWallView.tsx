import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Upload, Heart, Sparkles, AlertTriangle, CheckCircle2, 
  Clock, ShieldAlert, Image as ImageIcon, QrCode, Maximize2, RefreshCw, X, Eye
} from 'lucide-react';
import { InvitationData, PhotoWallPhoto } from '../../types';
import { processUploadedPhoto, checkDuplicateImage } from '../../lib/imageProcessor';
import { addPhotoToPhotoWall, togglePhotoWallLike } from '../../lib/storage';

interface PhotoWallViewProps {
  orderId?: string;
  invitationData: InvitationData;
  isPreviewMode?: boolean;
  onOpenLiveScreen?: () => void;
}

export const PhotoWallView: React.FC<PhotoWallViewProps> = ({
  orderId,
  invitationData,
  isPreviewMode = false,
  onOpenLiveScreen
}) => {
  const settings = invitationData.photoWallSettings || {
    enabled: true,
    enableAfterEventStarts: false,
    requireApproval: true,
    enableDuplicateFilter: true,
    enableLiveScreen: true
  };

  const photos = invitationData.photoWallPhotos || [];
  const approvedPhotos = photos.filter(p => p.status === 'approved');

  // State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [uploaderPhone, setUploaderPhone] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Duplicate Detection Preview State
  const [duplicateWarning, setDuplicateWarning] = useState<{
    isDuplicate: boolean;
    matchId?: string;
    similarityPercent: number;
  } | null>(null);

  const [processedResult, setProcessedResult] = useState<{
    fullWebPUrl: string;
    thumbnailWebPUrl: string;
    imageHash: string;
  } | null>(null);

  const [uploadedSuccessMsg, setUploadedSuccessMsg] = useState('');
  const [activePhotoModal, setActivePhotoModal] = useState<PhotoWallPhoto | null>(null);

  // Check if event has started
  const [isEventStarted, setIsEventStarted] = useState(true);

  useEffect(() => {
    if (settings.enableAfterEventStarts && invitationData.date) {
      try {
        // Attempt to parse event date or default to started
        const eventDateStr = settings.eventStartTime || invitationData.date;
        const parsedDate = new Date(eventDateStr);
        if (!isNaN(parsedDate.getTime())) {
          setIsEventStarted(new Date() >= parsedDate);
        } else {
          setIsEventStarted(true);
        }
      } catch {
        setIsEventStarted(true);
      }
    } else {
      setIsEventStarted(true);
    }
  }, [settings.enableAfterEventStarts, settings.eventStartTime, invitationData.date]);

  // Handle file selection & WebP processing + OpenCV imagehash duplicate check
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsProcessing(true);
    setDuplicateWarning(null);
    setProcessedResult(null);

    try {
      const result = await processUploadedPhoto(file);
      setProcessedResult(result);

      // Perform duplicate check if filter is enabled
      if (settings.enableDuplicateFilter && photos.length > 0) {
        const dupCheck = checkDuplicateImage(result.imageHash, photos);
        if (dupCheck.isDuplicate) {
          setDuplicateWarning(dupCheck);
        }
      }
    } catch (err) {
      console.error('Error processing photo:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Photo
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploaderName.trim() || !processedResult) return;

    if (orderId && !isPreviewMode) {
      addPhotoToPhotoWall(orderId, {
        uploaderName,
        uploaderPhone,
        imageUrl: processedResult.fullWebPUrl,
        thumbnailUrl: processedResult.thumbnailWebPUrl,
        imageHash: processedResult.imageHash,
        similarityMatchId: duplicateWarning?.matchId,
        similarityPercent: duplicateWarning?.similarityPercent,
        caption
      });
    }

    setUploadedSuccessMsg(
      settings.requireApproval
        ? 'Таны зургийг хүлээн авлаа! Зохион байгуулагч зөвшөөрсний дараа Фото хананд нийтлэгдэнэ.'
        : 'Зураг амжилттай нийтлэгдлээ!'
    );

    // Reset Form
    setTimeout(() => {
      setIsUploadOpen(false);
      setUploaderName('');
      setUploaderPhone('');
      setCaption('');
      setSelectedFile(null);
      setProcessedResult(null);
      setDuplicateWarning(null);
      setUploadedSuccessMsg('');
    }, 2800);
  };

  const handleLike = (photoId: string) => {
    if (orderId && !isPreviewMode) {
      togglePhotoWallLike(orderId, photoId);
    }
  };

  if (!settings.enabled) return null;

  return (
    <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-10 text-stone-100 font-sans relative">
      
      {/* Section Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Camera className="w-4 h-4 text-amber-400" />
          <span>V2.2 PHOTO WALL - ЗОЧДЫН ФОТО ХАНА</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-serif text-[#f9e5af] font-bold">
          Баярын Дурсамж Зургаа Хуваалцах
        </h2>
        
        <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
          Баярын агшны гэрэл зургуудаа энд оруулж, зочид болон зохион байгуулагчидтай хамт дурсамжаа мөнхлөөрэй.
        </p>

        {/* Live Screen Launcher */}
        {settings.enableLiveScreen && onOpenLiveScreen && (
          <div className="pt-2">
            <button
              onClick={onOpenLiveScreen}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-stone-900 to-stone-950 hover:from-amber-950 hover:to-stone-900 border border-amber-500/40 text-amber-300 px-5 py-2.5 rounded-2xl text-xs font-bold shadow-xl transition-all hover:border-amber-400"
            >
              <Maximize2 className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>📺 Дэлгэцийн Шинэ "Live Screen" Режим Нээх (Тайз / Дэлгэц)</span>
            </button>
          </div>
        )}
      </div>

      {/* Event Start Restriction Banner if active */}
      {!isEventStarted && settings.enableAfterEventStarts && (
        <div className="bg-stone-900/90 border-2 border-amber-500/40 p-6 rounded-3xl text-center space-y-3 shadow-2xl backdrop-blur-xl max-w-2xl mx-auto">
          <Clock className="w-10 h-10 text-amber-400 mx-auto animate-bounce" />
          <h3 className="text-lg font-serif font-bold text-amber-200">
            Фото хана арга хэмжээ эхэлсний дараа идэвхжинэ
          </h3>
          <p className="text-xs text-stone-400">
            Зохион байгуулагчийн тохиргоогоор баяр эхэлсний дараа зочид зураг оруулах боломжтой болно.
          </p>
        </div>
      )}

      {/* Upload Action Bar */}
      {isEventStarted && (
        <div className="flex justify-center">
          <button
            onClick={() => setIsUploadOpen(true)}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 text-sm flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <Camera className="w-5 h-5 text-stone-950" />
            <span>Зураг Оруулах (WebP & OpenCV Дупликат Шүүлтүүртэй)</span>
          </button>
        </div>
      )}

      {/* PHOTO GALLERY GRID (With Soft Edge Fades & Radial Blending) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4">
        {approvedPhotos.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-stone-900/60 rounded-3xl border border-stone-800 space-y-3">
            <ImageIcon className="w-12 h-12 text-stone-600 mx-auto" />
            <p className="text-sm font-serif text-stone-400">Одоогоор зураг ороогүй байна.</p>
            <p className="text-xs text-stone-500">Анхны зургийг та оруулж дурсамж үлдээнэ үү!</p>
          </div>
        ) : (
          approvedPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4 }}
              className="group relative bg-stone-950 rounded-2xl overflow-hidden border border-amber-500/20 shadow-xl"
            >
              {/* Photo Image Container with Edge Fade Mask & Ambient Soft Glow */}
              <div 
                className="relative aspect-square overflow-hidden cursor-pointer bg-stone-900"
                onClick={() => setActivePhotoModal(photo)}
              >
                {/* Edge fade vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40 z-10 opacity-70 group-hover:opacity-40 transition-opacity" />
                
                <img
                  src={photo.thumbnailUrl || photo.imageUrl}
                  alt={photo.caption || photo.uploaderName}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Soft Edge Blending Radial Overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none z-10"
                  style={{
                    boxShadow: 'inset 0 0 25px 10px rgba(10, 10, 10, 0.7)'
                  }}
                />

                <div className="absolute top-2 right-2 z-20 bg-stone-950/80 backdrop-blur-md px-2 py-1 rounded-full text-[10px] text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>Харах</span>
                </div>
              </div>

              {/* Card Footer Info */}
              <div className="p-3 bg-stone-950/90 border-t border-stone-800/80 space-y-1.5 relative z-20">
                <div className="flex items-center justify-between gap-1 text-xs font-semibold text-stone-200">
                  <span className="truncate">{photo.uploaderName}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(photo.id);
                    }}
                    className="flex items-center gap-1 text-rose-400 hover:text-rose-300 transition-colors bg-stone-900 px-2 py-0.5 rounded-full border border-rose-500/20"
                  >
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    <span className="text-[11px] font-mono">{photo.likesCount || 0}</span>
                  </button>
                </div>

                {photo.caption && (
                  <p className="text-[11px] text-stone-400 line-clamp-1 italic">
                    "{photo.caption}"
                  </p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* UPLOAD MODAL */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-stone-900 border-2 border-amber-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-stone-100 relative"
            >
              <button
                onClick={() => setIsUploadOpen(false)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-full bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-400 mx-auto border border-amber-500/30">
                  <Camera className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-[#f9e5af] font-bold">Зураг Оруулах</h3>
                <p className="text-xs text-stone-400">
                  WebP форматруу хөрвүүлэгдэж, OpenCV дупликат шүүлтүүрээр шалгагдана
                </p>
              </div>

              {uploadedSuccessMsg ? (
                <div className="bg-emerald-950/80 border border-emerald-500/50 p-5 rounded-2xl text-center space-y-2 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="font-bold text-sm text-white">{uploadedSuccessMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs text-left">
                  
                  {/* File Upload Selector */}
                  <div>
                    <label className="block font-medium text-stone-300 mb-1.5">Зураг сонгох *</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-300 file:bg-amber-500 file:text-stone-950 file:border-0 file:rounded-lg file:px-3 file:py-1 file:font-bold file:text-xs hover:file:bg-amber-400 cursor-pointer"
                    />
                  </div>

                  {/* Processing / Preview Loader */}
                  {isProcessing && (
                    <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 text-center space-y-2 text-amber-400">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-400" />
                      <p className="text-[11px] font-semibold">WebP Хөрвүүлэлт & OpenCV imagehash давхардал шалгаж байна...</p>
                    </div>
                  )}

                  {/* Processed WebP Preview */}
                  {processedResult && !isProcessing && (
                    <div className="space-y-3 bg-stone-950 p-3 rounded-2xl border border-stone-800">
                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                        <span>Формат: WebP</span>
                        <span>Hash: {processedResult.imageHash}</span>
                      </div>
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-stone-700 bg-black">
                        <img
                          src={processedResult.thumbnailWebPUrl}
                          alt="WebP Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* OpenCV Duplicate Filter Warning */}
                      {duplicateWarning && duplicateWarning.isDuplicate && (
                        <div className="bg-amber-950/80 border border-amber-500/50 p-3 rounded-xl text-amber-200 text-[11px] space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-amber-400">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>⚠️ Давхардсан зураг илэрлээ ({duplicateWarning.similarityPercent}% адилхан)</span>
                          </div>
                          <p className="text-[10px] text-stone-300">
                            OpenCV imagehash алгоритм нь энэ зураг өмнө орсон зурагтай ижил байна гэж тэмдэглэлээ. Та одоо ч оруулах боломжтой.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Guest Info Fields */}
                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Таны Нэр *</label>
                    <input
                      type="text"
                      required
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      placeholder="Жишээ: Батзориг"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Утасны дугаар (Заавал биш)</label>
                    <input
                      type="tel"
                      value={uploaderPhone}
                      onChange={(e) => setUploaderPhone(e.target.value)}
                      placeholder="99112233"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-300 font-medium mb-1">Тайлбар, Ерөөл</label>
                    <textarea
                      rows={2}
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      placeholder="Аз жаргал хүсье!"
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!processedResult || !uploaderName.trim()}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-amber-500/20 text-xs"
                  >
                    Зураг Нийтлэх
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PHOTO ZOOM MODAL */}
      <AnimatePresence>
        {activePhotoModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setActivePhotoModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-3xl w-full bg-stone-950 border border-stone-800 rounded-3xl p-4 sm:p-6 space-y-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActivePhotoModal(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-white p-1.5 rounded-full bg-stone-900 border border-stone-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-auto max-h-[70vh] flex items-center justify-center bg-black rounded-2xl overflow-hidden border border-stone-800">
                <img
                  src={activePhotoModal.imageUrl}
                  alt={activePhotoModal.uploaderName}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-300 pt-2 border-t border-stone-800">
                <div>
                  <h4 className="font-bold text-amber-300 text-sm">{activePhotoModal.uploaderName}</h4>
                  {activePhotoModal.caption && <p className="text-stone-400 italic">"{activePhotoModal.caption}"</p>}
                </div>

                <button
                  onClick={() => handleLike(activePhotoModal.id)}
                  className="flex items-center gap-1.5 bg-rose-950/60 border border-rose-500/30 text-rose-300 px-4 py-2 rounded-xl hover:bg-rose-900 transition-colors"
                >
                  <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  <span className="font-bold">{activePhotoModal.likesCount || 0} Таалагдлаа</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};
