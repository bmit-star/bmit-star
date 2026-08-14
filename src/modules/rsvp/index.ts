import { RSVP } from '../../types';
import { InvitationStorage } from '../../lib/services';

export { default as RSVPForm } from './RSVPForm';

export class RsvpService {
  static submitRsvp(orderId: string, rsvpData: Omit<RSVP, 'id' | 'submittedAt'>) {
    return InvitationStorage.addRsvp(orderId, rsvpData);
  }
}

