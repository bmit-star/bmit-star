import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLoginForm } from '../../components/Admin/AdminLoginForm';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f0c0a] flex items-center justify-center p-4">
      <AdminLoginForm
        onLoginSuccess={() => {
          onLoginSuccess();
          navigate('/admin/dashboard', { replace: true });
        }}
        onBackToLanding={() => navigate('/')}
      />
    </div>
  );
};

export default AdminLoginPage;
