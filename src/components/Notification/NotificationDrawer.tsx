import React from 'react';
import { Bell, X, Check, MessageSquare, UserCheck, Camera, Sparkles, Clock, AlertTriangle, Shield } from 'lucide-react';
import { Order } from '../../types';
import { CloudinaryService } from '../../lib/cloudinaryService';

export interface AppNotification {
  id: string;
  type: 'rsvp' | 'wish' | 'photo' | 'order_status' | 'reminder';
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order?: Order;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  order
}) => {
  if (!isOpen) return null;

  // Generate dynamic notification items from actual order data
  const rsvps = order?.invitationData?.rsvps || [];
  const wishes = order?.invitationData?.wishes || [];
  const photos = order?.invitationData?.photoWallPhotos || [];

  const notificationsList: AppNotification[] = [];

  // Cloudinary 30-day storage retention notification (5 days warning before deletion)
  if (order) {
    const storageInfo = CloudinaryService.getOrderStorageInfo(order);

    if (storageInfo.isWarning || order.storageWarningSent) {
      notificationsList.push({
        id: 'notif-storage-warning-' + order.id,
        type: 'reminder',
        title: `⚠️ Хадгалах сан дуусахад ${storageInfo.remainingDays} хоног үлдлээ!`,
        message: `Cloudinary (sk0s89bg) 30 хоногийн сануулах бодлого: Таны урилгын дата болон зураг ${storageInfo.expiresAt} огноонд автоматаар устгагдана. Захиалагч та медиа болон зургуудаа татаж авна уу!`,
        timeAgo: 'Сануулга',
        read: false
      });
    } else if (storageInfo.isExpired) {
      notificationsList.push({
        id: 'notif-storage-expired-' + order.id,
        type: 'reminder',
        title: '🚨 Хадгалах сангийн 30 хоног дууслаа',
        message: '30 хоногийн хадгалах хугацаа дууссан тул урилгын Cloudinary сан цэвэрлэгдлээ.',
        timeAgo: 'Дууссан',
        read: false
      });
    } else {
      notificationsList.push({
        id: 'notif-storage-active-' + order.id,
        type: 'order_status',
        title: 'Cloudinary Медиа Сан Ажиллаж байна',
        message: `Таны урилгын санд 30 хоногийн хадгалах хугацаа байна. Үлдсэн хугацаа: ${storageInfo.remainingDays} хоног (${storageInfo.expiresAt} хүртэл).`,
        timeAgo: 'Идэвхтэй',
        read: true
      });
    }
  }

  // Order status notification
  if (order) {
    notificationsList.push({
      id: 'notif-order-' + order.id,
      type: 'order_status',
      title: 'Урилгын төлөв',
      message: `Таны "${order.invitationData.eventTitle}" урилга ${
        order.status === 'Published' ? 'нийтлэгдсэн байна' : 'бэлтгэгдэж байна'
      }.`,
      timeAgo: 'Саяхан',
      read: false
    });
  }

  // Recent RSVPs
  rsvps.slice(0, 5).forEach((r) => {
    notificationsList.push({
      id: 'notif-rsvp-' + r.id,
      type: 'rsvp',
      title: 'Шинэ зочны бүртгэл',
      message: `${r.guestName} - ${
        r.attendance === 'attending'
          ? 'Очино (' + r.guestCount + ' хүнтэй)'
          : r.attendance === 'maybe'
          ? 'Магадгүй'
          : 'Очиж чадахгүй'
      }`,
      timeAgo: r.submittedAt ? new Date(r.submittedAt).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }) : 'Өнөөдөр',
      read: true
    });
  });

  // Recent Wishes
  wishes.slice(0, 5).forEach((w) => {
    notificationsList.push({
      id: 'notif-wish-' + w.id,
      type: 'wish',
      title: 'Шинэ ерөөлийн сэтгэгдэл',
      message: `${w.guestName}: "${w.message.slice(0, 45)}${w.message.length > 45 ? '...' : ''}"`,
      timeAgo: w.submittedAt ? new Date(w.submittedAt).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }) : 'Өнөөдөр',
      read: true
    });
  });

  // Recent Photo Wall photos
  photos.slice(0, 5).forEach((p) => {
    notificationsList.push({
      id: 'notif-photo-' + p.id,
      type: 'photo',
      title: 'Зургийн хананд шинэ зураг',
      message: `${p.uploaderName} зураг орууллаа (${p.status === 'approved' ? 'Зөвшөөрсөн' : 'Хүлээгдэж байна'})`,
      timeAgo: p.submittedAt ? new Date(p.submittedAt).toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' }) : 'Өнөөдөр',
      read: false
    });
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-md bg-stone-900 border-l border-white/10 h-full flex flex-col shadow-2xl text-white animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Мэдэгдлийн Төв</h3>
              <p className="text-xs text-white/50">Урилга ба Арга хэмжээний мэдээлэл</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {notificationsList.length === 0 ? (
            <div className="text-center py-12 text-white/40 text-xs">
              Мэдэгдэл одоогоор алга байна.
            </div>
          ) : (
            notificationsList.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3.5 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.type === 'rsvp' && <UserCheck className="w-4 h-4 text-emerald-400" />}
                    {item.type === 'wish' && <MessageSquare className="w-4 h-4 text-sky-400" />}
                    {item.type === 'photo' && <Camera className="w-4 h-4 text-purple-400" />}
                    {item.type === 'order_status' && <Sparkles className="w-4 h-4 text-amber-400" />}
                    <span className="font-bold text-xs text-amber-200">{item.title}</span>
                  </div>
                  <span className="text-[10px] text-white/40 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.timeAgo}
                  </span>
                </div>
                <p className="text-xs text-white/80 leading-relaxed">{item.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-stone-950 text-center text-xs text-white/40">
          Бүх мэдэгдлийг автоматаар шинэчлэв
        </div>

      </div>
    </div>
  );
};
