import { Order, InvitationData, RSVP, Wish } from '../../../types';
import { getStoredOrders, updateOrderInStorage, addRsvpToOrder, addWishToOrder, incrementOrderViews } from '../../../lib/storage';

export class InvitationStorage {
  /**
   * Fetch order by unique slug or ID
   */
  static getOrderBySlug(slug: string, ordersList?: Order[]): Order | undefined {
    const list = ordersList && ordersList.length > 0 ? ordersList : getStoredOrders();
    return list.find(
      o => o.uniqueSlug === slug || o.id === slug || o.orderNumber === slug
    );
  }

  /**
   * Track invitation page view
   */
  static trackView(orderId: string): void {
    if (orderId) {
      incrementOrderViews(orderId);
    }
  }

  /**
   * Submit guest RSVP
   */
  static async submitRsvp(
    orderId: string | undefined,
    isPreviewMode: boolean,
    rsvpData: {
      guestName: string;
      phone: string;
      attendance: 'attending' | 'maybe' | 'declined';
      guestCount: number;
      mealPreference: string;
      note: string;
      token: string;
      deviceFingerprint: string;
    }
  ): Promise<boolean> {
    if (orderId && !isPreviewMode) {
      addRsvpToOrder(orderId, {
        guestName: rsvpData.guestName,
        phone: rsvpData.phone,
        attendance: rsvpData.attendance,
        guestCount: rsvpData.guestCount,
        mealPreference: rsvpData.mealPreference,
        note: rsvpData.note,
        token: rsvpData.token,
        checkInStatus: 'pending',
        deviceFingerprint: rsvpData.deviceFingerprint
      });
    }
    return true;
  }

  /**
   * Submit guest Wish/Blessing
   */
  static submitWish(
    orderId: string | undefined,
    isPreviewMode: boolean,
    wishData: {
      guestName: string;
      message: string;
      photoUrl?: string;
    }
  ): boolean {
    if (orderId && !isPreviewMode) {
      addWishToOrder(orderId, {
        guestName: wishData.guestName,
        message: wishData.message,
        photoUrl: wishData.photoUrl
      });
    }
    return true;
  }

  /**
   * Generate Google Calendar event URL
   */
  static generateGoogleCalendarUrl(invitationData: InvitationData): string {
    const title = encodeURIComponent(invitationData.eventTitle || 'Арга Хэмжээ');
    const details = encodeURIComponent(invitationData.invitationMessage || '');
    const location = encodeURIComponent(`${invitationData.locationName || ''}, ${invitationData.address || ''}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  }

  /**
   * Copy bank account number helper
   */
  static async copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
}
