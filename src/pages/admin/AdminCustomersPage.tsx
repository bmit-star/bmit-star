import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomersManager } from '../../modules/admin';
import { Customer, Order } from '../../types';

interface AdminCustomersPageProps {
  customers: Customer[];
  orders: Order[];
}

export const AdminCustomersPage: React.FC<AdminCustomersPageProps> = ({
  customers,
  orders
}) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <CustomersManager
        customers={customers}
        orders={orders}
        onSelectOrderToEdit={(ord) => navigate(`/admin/editor/${ord.id}`)}
      />
    </div>
  );
};

export default AdminCustomersPage;
