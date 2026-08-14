import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LivePhotoWallScreen } from '../../modules/photowall';
import { Order } from '../../types';

interface GuestLivePageProps {
  orders: Order[];
}

export const GuestLivePage: React.FC<GuestLivePageProps> = ({ orders }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const matchedOrder = orders.find(
    o => o.uniqueSlug === slug || o.id === slug || o.orderNumber === slug
  ) || orders[0];

  if (!matchedOrder) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center text-white">
        <p className="text-sm text-white/60">Дэлгэцийн арга хэмжээ олдсонгүй.</p>
      </div>
    );
  }

  return (
    <LivePhotoWallScreen
      photos={matchedOrder.invitationData.photoWallPhotos || []}
      eventTitle={matchedOrder.invitationData.eventTitle}
      invitationData={matchedOrder.invitationData}
      onClose={() => navigate('/')}
    />
  );
};

export default GuestLivePage;
