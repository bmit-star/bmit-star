import { Order, Template, Customer, RSVP, Wish, ChangeRequest, PhotoWallPhoto } from '../types';
import { 
  getStoredOrders, saveStoredOrders, 
  getStoredTemplates, getStoredCustomers, 
  updateOrderInStorage, addRsvpToOrder, addWishToOrder, 
  addChangeRequestToOrder, incrementOrderViews,
  addPhotoToPhotoWall, updatePhotoWallStatus, batchApprovePendingPhotos,
  deletePhotoWallPhoto, togglePhotoWallLike
} from './storage';

// 1. INVITATION STORAGE SERVICE
export class InvitationStorage {
  static getAll(): Order[] {
    return getStoredOrders();
  }

  static getById(id: string): Order | undefined {
    return getStoredOrders().find(o => o.id === id);
  }

  static getBySlug(slug: string): Order | undefined {
    return getStoredOrders().find(o => o.uniqueSlug === slug);
  }

  static save(order: Order): Order[] {
    return updateOrderInStorage(order);
  }

  static addRsvp(orderId: string, rsvpData: Omit<RSVP, 'id' | 'submittedAt'>): Order | null {
    return addRsvpToOrder(orderId, rsvpData);
  }

  static addWish(orderId: string, wishData: Omit<Wish, 'id' | 'submittedAt'>): Order | null {
    return addWishToOrder(orderId, wishData);
  }

  static addChangeRequest(orderId: string, note: string): Order | null {
    return addChangeRequestToOrder(orderId, note);
  }

  static incrementViews(orderId: string): void {
    incrementOrderViews(orderId);
  }
}

// 2. PHOTO STORAGE SERVICE
export class PhotoStorage {
  static async uploadAndAddPhoto(orderId: string, photoData: Parameters<typeof addPhotoToPhotoWall>[1]): Promise<Order | null> {
    let finalImageUrl = photoData.imageUrl;
    let finalThumbnailUrl = photoData.thumbnailUrl;

    // If base64 image provided, upload directly to Cloudinary folder zallaga_invitations/{orderId}
    if (photoData.imageUrl && photoData.imageUrl.startsWith('data:')) {
      const { CloudinaryService } = await import('./cloudinaryService');
      const uploadRes = await CloudinaryService.uploadImage(photoData.imageUrl, orderId);
      if (uploadRes.success && uploadRes.url) {
        finalImageUrl = uploadRes.url;
        finalThumbnailUrl = uploadRes.url;
      }
    }

    return addPhotoToPhotoWall(orderId, {
      ...photoData,
      imageUrl: finalImageUrl,
      thumbnailUrl: finalThumbnailUrl
    });
  }

  static addPhoto(orderId: string, photoData: Parameters<typeof addPhotoToPhotoWall>[1]): Order | null {
    return addPhotoToPhotoWall(orderId, photoData);
  }

  static updateStatus(orderId: string, photoId: string, status: 'pending' | 'approved' | 'rejected'): Order | null {
    return updatePhotoWallStatus(orderId, photoId, status);
  }

  static batchApprove(orderId: string): Order | null {
    return batchApprovePendingPhotos(orderId);
  }

  static deletePhoto(orderId: string, photoId: string): Order | null {
    return deletePhotoWallPhoto(orderId, photoId);
  }

  static toggleLike(orderId: string, photoId: string): Order | null {
    return togglePhotoWallLike(orderId, photoId);
  }
}

// 3. NOTIFICATION SERVICE & STORAGE
export class NotificationStorage {
  static getNotificationsForOrder(order: Order) {
    const notifications = [];
    if (order) {
      notifications.push({
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
    return notifications;
  }
}

export class NotificationService {
  static sendRsvpNotification(guestName: string, eventTitle: string) {
    console.log(`Notification sent for RSVP: ${guestName} attending ${eventTitle}`);
  }

  static sendPhotoUploadNotification(uploaderName: string, eventTitle: string) {
    console.log(`Notification sent for Photo Upload: ${uploaderName} uploaded to ${eventTitle}`);
  }
}

// 4. CHECK-IN & ATTENDANCE SERVICE
export class CheckInService {
  static processQrCheckIn(order: Order, qrToken: string): { success: boolean; guestName?: string; message: string } {
    const rsvps = order.invitationData.rsvps || [];
    const matchedGuest = rsvps.find(r => r.id === qrToken || r.token === qrToken || r.guestName.toLowerCase() === qrToken.toLowerCase());

    if (matchedGuest) {
      matchedGuest.checkInTime = new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' });
      matchedGuest.checkInStatus = 'checked-in';
      InvitationStorage.save(order);
      return {
        success: true,
        guestName: matchedGuest.guestName,
        message: `${matchedGuest.guestName} зочны ирц амжилттай бүртгэгдлээ!`
      };
    }

    return {
      success: false,
      message: 'Тохирох зочны бүртгэл олдсонгүй.'
    };
  }
}

export class AttendanceService {
  static getAttendanceStats(order: Order) {
    const rsvps = order.invitationData.rsvps || [];
    const attendingCount = rsvps.filter(r => r.attendance === 'attending').reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
    const maybeCount = rsvps.filter(r => r.attendance === 'maybe').length;
    const checkedInCount = rsvps.filter(r => r.checkInStatus === 'checked-in' || Boolean(r.checkInTime)).length;

    return {
      totalResponses: rsvps.length,
      attendingCount,
      maybeCount,
      checkedInCount,
      declinedCount: rsvps.filter(r => r.attendance === 'declined').length
    };
  }
}

// 5. LUCKY DRAW SERVICE
export class LuckyDrawService {
  static pickWinner(eligibleGuests: RSVP[], excludeWinnerNames: string[] = []): RSVP | null {
    const remaining = eligibleGuests.filter(g => !excludeWinnerNames.includes(g.guestName));
    if (remaining.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * remaining.length);
    return remaining[randomIndex];
  }
}

// 6. ANALYTICS & PAYMENT STORAGE SERVICES
export class AnalyticsStorage {
  static getOrderAnalytics(order: Order) {
    const views = order.viewsCount || 0;
    const rsvps = order.invitationData.rsvps || [];
    const wishes = order.invitationData.wishes || [];
    const photos = order.invitationData.photoWallPhotos || [];

    return {
      viewsCount: views,
      rsvpCount: rsvps.length,
      wishesCount: wishes.length,
      photosCount: photos.length,
      conversionRate: views > 0 ? ((rsvps.length / views) * 100).toFixed(1) + '%' : '0%'
    };
  }
}

export class PaymentStorage {
  static getPaymentInfo(order: Order) {
    return {
      amount: order.invitationData.giftInfo?.qpayMerchantName || '150,000₮',
      status: order.status === 'Published' ? 'Төлөгдсөн' : 'Хүлээгдэж буй',
      bankDetails: order.invitationData.giftInfo?.bankDetails || []
    };
  }
}
