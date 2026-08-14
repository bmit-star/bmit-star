import React from 'react';
import { useParams } from 'react-router-dom';
import { PhotoWallView } from '../../modules/photowall';
import { Order } from '../../types';

interface GuestWallPageProps {
  orders: Order[];
}

export const GuestWallPage: React.FC<GuestWallPageProps> = ({ orders }) => {
  const { slug } = useParams<{ slug: string }>();

  const matchedOrder = orders.find(
    o => o.uniqueSlug === slug || o.id === slug || o.orderNumber === slug
  ) || orders[0];

  if (!matchedOrder) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center text-white">
        <p className="text-sm text-white/60">Зургийн ханы арга хэмжээ олдсонгүй.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 max-w-5xl mx-auto">
      <PhotoWallView
        orderId={matchedOrder.id}
        invitationData={matchedOrder.invitationData}
      />
    </div>
  );
};

export default GuestWallPage;
