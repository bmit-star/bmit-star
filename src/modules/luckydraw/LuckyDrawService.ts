import { Order, RSVP } from '../../types';

export interface WinnerRecord {
  id: string;
  prizeName: string;
  guestName: string;
  phone?: string;
  wonAt: string;
}

export class LuckyDrawService {
  /**
   * Filter eligible candidates from RSVPs (must be attending)
   */
  static getEligibleCandidates(order: Order, existingWinners: WinnerRecord[] = []): RSVP[] {
    const rsvps = order.invitationData.rsvps || [];
    const attending = rsvps.filter((r) => r.attendance === 'attending');
    return attending.filter(
      (guest) => !existingWinners.some((w) => w.guestName === guest.guestName)
    );
  }

  /**
   * Select a random winner from candidates
   */
  static selectRandomWinner(candidates: RSVP[]): RSVP | null {
    if (!candidates || candidates.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * candidates.length);
    return candidates[randomIndex];
  }

  /**
   * Record a new winner and update order data
   */
  static recordWinner(
    order: Order,
    winner: RSVP,
    prizeName: string
  ): { updatedOrder: Order; newWinner: WinnerRecord } {
    const existingWinners: WinnerRecord[] = (order.invitationData as any).luckyDrawWinners || [];
    const newWinner: WinnerRecord = {
      id: `winner_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      prizeName,
      guestName: winner.guestName,
      phone: winner.phone,
      wonAt: new Date().toISOString(),
    };

    const updatedWinners = [newWinner, ...existingWinners];
    const updatedOrder: Order = {
      ...order,
      invitationData: {
        ...order.invitationData,
        luckyDrawWinners: updatedWinners,
      } as any,
    };

    return { updatedOrder, newWinner };
  }
}
