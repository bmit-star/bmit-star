import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Camera, CheckCircle2, XCircle, Trash2, AlertTriangle, 
  Settings, Clock, ShieldCheck, Sparkles, Monitor, RefreshCw, Check, Eye
} from 'lucide-react';
import { Order, PhotoWallPhoto } from '../../types';
import { 
  updatePhotoWallStatus, 
  batchApprovePendingPhotos, 
  deletePhotoWallPhoto, 
  updatePhotoWallSettingsInStorage 
} from '../../lib/storage';

interface PhotoWallOrganizerPanelProps {
  order: Order;
  onUpdateOrder: (updatedOrder: Order) => void;
  onOpenLiveScreen?: () => void;
}

export const PhotoWallOrganizerPanel: React.FC<PhotoWallOrganizerPanelProps> = ({
  order,
  onUpdateOrder,
  onOpenLiveScreen
}) => {
  const settings = order.invitationData.photoWallSettings || {
    enabled: true,
    enableAfterEventStarts: false,
    eventStartTime: order.invitationData.date,
    requireApproval: true,
    enableDuplicateFilter: true,
    enableLiveScreen: true
  };

  const photos = order.invitationData.photoWallPhotos || [];
  const pendingPhotos = photos.filter(p => p.status === 'pending');
  const approvedPhotos = photos.filter(p => p.status === 'approved');
  const rejectedPhotos = photos.filter(p => p.status === 'rejected');

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'settings'>('pending');

  // Handle Approval Status Change
  const handleStatusChange = (photoId: string, status: 'approved' | 'rejected') => {
    const updated = updatePhotoWallStatus(order.id, photoId, status);
    if (updated) onUpdateOrder(updated);
  };

  const handleBatchApprove = () => {
    const updated = batchApprovePendingPhotos(order.id);
    if (updated) onUpdateOrder(updated);
  };

  const handleDelete = (photoId: string) => {
    if (confirm('Энэ зургийг бүрмөсөн устгах уу?')) {
      const updated = deletePhotoWallPhoto(order.id, photoId);
      if (updated) onUpdateOrder(updated);
    }
  };

  const handleToggleSetting = (key: keyof typeof settings, value: boolean | string) => {
    const updated = updatePhotoWallSettingsInStorage(order.id, { [key]: value });
    if (updated) onUpdateOrder(updated);
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 space-y-6 text-stone-100 font-sans shadow-2xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
            <Camera className="w-4 h-4 text-amber-400" />
            <span>V2.2 PHOTO WALL ЗОХИОН БАЙГУУЛАГЧИЙН УДИРДЛАГА</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-[#f9e5af] font-bold mt-1">
            Зочдын Фото Хянагч Консол
          </h2>
        </div>

        {/* Live Screen Launcher */}
        {onOpenLiveScreen && (
          <button
            onClick={onOpenLiveScreen}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-5 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
          >
            <Monitor className="w-4 h-4 text-stone-950" />
            <span>📺 Live Screen Дэлгэцийн Режим Эхлүүлэх</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-800 pb-3 overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
          }`}
        >
          <span>Хүлээгдэж буй ({pendingPhotos.length})</span>
          {pendingPhotos.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'approved'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
          }`}
        >
          <span>Зөвшөөрсөн ({approvedPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'rejected'
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
          }`}
        >
          <span>Татгалзсан ({rejectedPhotos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ml-auto ${
            activeTab === 'settings'
              ? 'bg-stone-800 text-amber-300 border border-amber-500/40'
              : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-amber-400" />
          <span>Тохиргоо</span>
        </button>
      </div>

      {/* TAB CONTENT: PENDING QUEUE */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingPhotos.length > 0 && (
            <div className="flex items-center justify-between bg-stone-950 p-3.5 rounded-2xl border border-stone-800">
              <span className="text-xs text-stone-300">
                Нийт <strong>{pendingPhotos.length}</strong> зураг зөвшөөрөл хүлээж байна
              </span>
              <button
                onClick={handleBatchApprove}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Бүгдийг Нэг Дор Зөвшөөрөх</span>
              </button>
            </div>
          )}

          {pendingPhotos.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-xs font-serif">
              Зөвшөөрөл хүлээж буй шинэ зураг байхгүй байна.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingPhotos.map((photo) => (
                <div key={photo.id} className="bg-stone-950 rounded-2xl p-3 border border-stone-800 space-y-3">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black border border-stone-800">
                    <img src={photo.imageUrl} alt={photo.uploaderName} className="w-full h-full object-cover" />
                    
                    {photo.similarityMatchId && (
                      <div className="absolute top-2 left-2 bg-amber-950/90 border border-amber-500/50 text-amber-300 px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-400" />
                        <span>OpenCV ImageHash Давхардал: {photo.similarityPercent}%</span>
                      </div>
                    )}
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="font-bold text-amber-300 flex items-center justify-between">
                      <span>{photo.uploaderName}</span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {new Date(photo.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {photo.uploaderPhone && <p className="text-stone-400 text-[11px]">📞 {photo.uploaderPhone}</p>}
                    {photo.caption && <p className="text-stone-300 italic text-[11px]">"{photo.caption}"</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleStatusChange(photo.id, 'approved')}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Зөвшөөрөх</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(photo.id, 'rejected')}
                      className="bg-rose-950 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-bold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Татгалзах</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: APPROVED PHOTOS */}
      {activeTab === 'approved' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {approvedPhotos.length === 0 ? (
            <div className="col-span-full text-center py-10 text-stone-500 text-xs">
              Зөвшөөрсөн зураг одоогоор байхгүй.
            </div>
          ) : (
            approvedPhotos.map((photo) => (
              <div key={photo.id} className="bg-stone-950 p-2.5 rounded-2xl border border-stone-800 space-y-2">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-black">
                  <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.uploaderName} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
                  <span className="truncate">{photo.uploaderName}</span>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="text-stone-500 hover:text-rose-400 p-1"
                    title="Устгах"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: REJECTED PHOTOS */}
      {activeTab === 'rejected' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {rejectedPhotos.length === 0 ? (
            <div className="col-span-full text-center py-10 text-stone-500 text-xs">
              Татгалзсан зураг алга.
            </div>
          ) : (
            rejectedPhotos.map((photo) => (
              <div key={photo.id} className="bg-stone-950 p-2.5 rounded-2xl border border-stone-800 space-y-2 opacity-60">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-black">
                  <img src={photo.thumbnailUrl || photo.imageUrl} alt={photo.uploaderName} className="w-full h-full object-cover grayscale" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400 truncate">{photo.uploaderName}</span>
                  <button
                    onClick={() => handleStatusChange(photo.id, 'approved')}
                    className="text-emerald-400 text-[10px] font-bold hover:underline"
                  >
                    Дахин зөвшөөрөх
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: SETTINGS TOGGLES */}
      {activeTab === 'settings' && (
        <div className="bg-stone-950 p-6 rounded-2xl border border-stone-800 space-y-5 text-xs text-stone-300">
          <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Фото Хана Модулийн Тохиргоонууд</span>
          </h3>

          <div className="space-y-4">
            
            {/* Toggle 1: Enable Photo Wall */}
            <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-800">
              <div>
                <span className="font-bold text-white block">Фото хана модуль идэвхжүүлэх</span>
                <span className="text-[11px] text-stone-400">Урилгын хуудсанд зочдын фото ханыг харуулах</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleToggleSetting('enabled', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Toggle 2: Enable after event starts */}
            <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-800">
              <div>
                <span className="font-bold text-white block">Баяр эхэлсний дараа нээгдэх (Enable after event starts)</span>
                <span className="text-[11px] text-stone-400">Товлосон цаг хүртэл зочид зураг оруулахыг түр хязгаарлах</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableAfterEventStarts}
                onChange={(e) => handleToggleSetting('enableAfterEventStarts', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Toggle 3: Require organizer approval */}
            <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-800">
              <div>
                <span className="font-bold text-white block">Зохион байгуулагч заавал зөвшөөрөх (Approval workflow)</span>
                <span className="text-[11px] text-stone-400">Зочны оруулсан зураг шууд биш, таныг зөвшөөрсний дараа нийтлэгдэнэ</span>
              </div>
              <input
                type="checkbox"
                checked={settings.requireApproval}
                onChange={(e) => handleToggleSetting('requireApproval', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Toggle 4: Python OpenCV / imagehash Duplicate Filter */}
            <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-800">
              <div>
                <span className="font-bold text-white block">OpenCV imagehash Давхардал Шүүлтүүр</span>
                <span className="text-[11px] text-stone-400">Ижил эсвэл дахин оруулсан зургийг Hamming distance алгоритмаар шалгах (AI ангилал биш)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableDuplicateFilter}
                onChange={(e) => handleToggleSetting('enableDuplicateFilter', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Toggle 5: Live Screen Mode */}
            <div className="flex items-center justify-between p-3 bg-stone-900 rounded-xl border border-stone-800">
              <div>
                <span className="font-bold text-white block">Live Screen Режим</span>
                <span className="text-[11px] text-stone-400">Тайз болон томоохон дэлгэц дээр зургуудыг слайд хэлбэрээр гаргах</span>
              </div>
              <input
                type="checkbox"
                checked={settings.enableLiveScreen}
                onChange={(e) => handleToggleSetting('enableLiveScreen', e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
