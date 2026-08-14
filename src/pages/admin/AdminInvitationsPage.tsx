import React from 'react';
import { AdminInvitationManager } from '../../components/Admin/AdminInvitationManager';

export const AdminInvitationsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <AdminInvitationManager />
    </div>
  );
};

export default AdminInvitationsPage;
