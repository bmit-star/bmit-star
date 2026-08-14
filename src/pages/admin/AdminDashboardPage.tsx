import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboard } from '../../modules/admin';
import { Order, Template, Customer } from '../../types';

interface AdminDashboardPageProps {
  orders: Order[];
  templates: Template[];
  customers: Customer[];
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  orders,
  templates,
  customers
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <AdminDashboard
        orders={orders}
        templates={templates}
        customers={customers}
        onNavigateTab={(tab) => navigate(`/admin/${tab}`)}
        onSelectOrderToEdit={(ord) => navigate(`/admin/editor/${ord.id}`)}
        onNewOrder={() => navigate('/admin/orders')}
      />
    </div>
  );
};

export default AdminDashboardPage;
