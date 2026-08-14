import React from 'react';
import { CheckInConsole } from '../../modules/checkin';
import { Order } from '../../types';

interface AdminCheckInPageProps {
  orders: Order[];
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const AdminCheckInPage: React.FC<AdminCheckInPageProps> = ({
  orders,
  onUpdateOrder
}) => {
  return (
    <div className="space-y-6">
      <CheckInConsole
        orders={orders}
        onUpdateOrder={onUpdateOrder}
      />
    </div>
  );
};

export default AdminCheckInPage;
