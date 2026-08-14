import React from 'react';
import { CustomerPanel } from '../../components/Customer/CustomerPanel';
import { Order } from '../../types';

interface CustomerDashboardPageProps {
  orders: Order[];
  onRequestChange: (orderId: string, note: string) => void;
  onOpenGuestView: (order: Order) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const CustomerDashboardPage: React.FC<CustomerDashboardPageProps> = ({
  orders,
  onRequestChange,
  onOpenGuestView,
  onUpdateOrder
}) => {
  return (
    <div className="space-y-6">
      <CustomerPanel
        orders={orders}
        onRequestChange={onRequestChange}
        onOpenGuestView={onOpenGuestView}
        onUpdateOrder={onUpdateOrder}
      />
    </div>
  );
};

export default CustomerDashboardPage;
