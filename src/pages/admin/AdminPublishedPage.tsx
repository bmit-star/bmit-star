import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PublishedInvitations } from '../../modules/admin';
import { Order } from '../../types';
import { incrementOrderViews } from '../../lib/storage';

interface AdminPublishedPageProps {
  orders: Order[];
}

export const AdminPublishedPage: React.FC<AdminPublishedPageProps> = ({ orders }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PublishedInvitations
        orders={orders}
        onSelectOrderToEdit={(ord) => navigate(`/admin/editor/${ord.id}`)}
        onSelectOrderToPreview={(ord) => {
          incrementOrderViews(ord.id);
          navigate(`/invite/${ord.uniqueSlug || ord.id}`);
        }}
      />
    </div>
  );
};

export default AdminPublishedPage;
