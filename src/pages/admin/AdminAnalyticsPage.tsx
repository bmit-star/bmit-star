import React from 'react';
import { AnalyticsView } from '../../modules/analytics';
import { Order } from '../../types';

interface AdminAnalyticsPageProps {
  orders: Order[];
}

export const AdminAnalyticsPage: React.FC<AdminAnalyticsPageProps> = ({ orders }) => {
  return (
    <div className="space-y-6">
      <AnalyticsView orders={orders} />
    </div>
  );
};

export default AdminAnalyticsPage;
