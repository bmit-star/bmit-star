import React from 'react';
import { useParams } from 'react-router-dom';
import { CheckInConsole } from '../../modules/checkin';
import { Order } from '../../types';

interface CheckInConsolePageProps {
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const CheckInConsolePage: React.FC<CheckInConsolePageProps> = ({
  orders,
  onUpdateOrder
}) => {
  const { slug } = useParams<{ slug: string }>();

  const filteredOrders = slug 
    ? orders.filter(o => o.uniqueSlug === slug || o.id === slug || o.orderNumber === slug)
    : orders;

  return (
    <div className="min-h-screen bg-[#0f0c0a] p-4 sm:p-6 max-w-7xl mx-auto">
      <CheckInConsole
        orders={filteredOrders.length > 0 ? filteredOrders : orders}
        onUpdateOrder={onUpdateOrder}
      />
    </div>
  );
};

export default CheckInConsolePage;
