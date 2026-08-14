import React from 'react';
import { useNavigate } from 'react-router-dom';
import { OrdersManager } from '../../modules/admin';
import { Order, Template } from '../../types';

interface AdminOrdersPageProps {
  orders: Order[];
  templates: Template[];
  onCreateOrder: (newOrder: Order) => void;
  onUpdateOrder: (updatedOrder: Order) => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({
  orders,
  templates,
  onCreateOrder,
  onUpdateOrder
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <OrdersManager
        orders={orders}
        templates={templates}
        onSelectOrderToEdit={(ord) => navigate(`/admin/editor/${ord.id}`)}
        onCreateOrder={onCreateOrder}
        onUpdateOrder={onUpdateOrder}
      />
    </div>
  );
};

export default AdminOrdersPage;
