import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { LuxuryInvitationView } from '../../modules/invitation';
import { Order } from '../../types';
import { incrementOrderViews } from '../../lib/storage';

interface GuestInvitationPageProps {
  orders: Order[];
}

export const GuestInvitationPage: React.FC<GuestInvitationPageProps> = ({ orders }) => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const guestName = searchParams.get('to') || '';

  const matchedOrder = orders.find(
    o => o.uniqueSlug === slug || o.id === slug || o.orderNumber === slug
  ) || orders[0];

  useEffect(() => {
    if (matchedOrder) {
      incrementOrderViews(matchedOrder.id);
    }
  }, [matchedOrder?.id]);

  if (!matchedOrder) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4 text-white">
        <h2 className="text-2xl font-serif text-[#d4af37]">Урилга Олдсонгүй</h2>
        <p className="text-xs text-white/60">Таны холбоос буруу эсвэл цуцлагдсан байна.</p>
      </div>
    );
  }

  // Inject guestName parameter into invitationData if passed in query string
  const customizedInvitationData = {
    ...matchedOrder.invitationData,
    personalizedGuestName: guestName || matchedOrder.invitationData.personalizedGuestName
  };

  return (
    <LuxuryInvitationView
      invitationData={customizedInvitationData}
      orderId={matchedOrder.id}
      isPreviewMode={false}
    />
  );
};

export default GuestInvitationPage;
