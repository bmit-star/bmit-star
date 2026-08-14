import { Order } from '../../types';

// Digital Ticket Module Extension
export interface DigitalTicket {
  ticketId: string;
  orderId: string;
  guestName: string;
  qrCodeUrl: string;
  seatNumber?: string;
  ticketStatus: 'valid' | 'used' | 'cancelled';
  issuedAt: string;
}

export class DigitalTicketService {
  static generateTicketForGuest(order: Order, guestName: string, phone?: string): DigitalTicket {
    const ticketId = 'tkt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticketId)}`;
    return {
      ticketId,
      orderId: order.id,
      guestName,
      qrCodeUrl,
      ticketStatus: 'valid',
      issuedAt: new Date().toISOString()
    };
  }
}
