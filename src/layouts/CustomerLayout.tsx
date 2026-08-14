import React from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Lock, LogOut, Eye, UserCheck, Users, MessageSquare, Image as ImageIcon, 
  Trophy, Bell, MessageSquarePlus, Sparkles, Home
} from 'lucide-react';
import { HeaderRoleBar } from '../components/Shared/HeaderRoleBar';

interface CustomerLayoutProps {
  authenticatedEmail: string;
  onLogout: () => void;
  onOpenLuckyDraw?: () => void;
  onOpenNotifications?: () => void;
  onRequestChange?: () => void;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  authenticatedEmail,
  onLogout,
  onOpenLuckyDraw,
  onOpenNotifications,
  onRequestChange
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDevMode = import.meta.env.DEV;

  if (!authenticatedEmail) {
    return <Outlet />;
  }

  const tabs = [
    { path: '/customer', label: 'Урилга Урьдчилан Харах & Хуваалцах', icon: Eye },
    { path: '/customer/checkin', label: '🎟️ Ирц & Check-in Консол', icon: UserCheck },
    { path: '/customer/rsvps', label: 'Ирэх Зочид', icon: Users },
    { path: '/customer/wishes', label: 'Сэтгэгдэл & Ерөөл', icon: MessageSquare },
    { path: '/customer/photos', label: '📸 Зургийн Хана Батлах', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0f0c0a] text-slate-100 font-sans flex flex-col relative overflow-x-hidden selection:bg-[#d4af37]/30">
      {/* Background ambient mesh */}
      <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#d4af37] rounded-full mix-blend-screen opacity-15 filter blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-100px] left-[-100px] w-[600px] h-[600px] bg-emerald-900 rounded-full mix-blend-screen opacity-10 filter blur-[150px] pointer-events-none z-0" />

      {/* Dev-Only Role Switcher */}
      {isDevMode && (
        <HeaderRoleBar
          currentRole="customer"
          onRoleChange={(role) => {
            if (role === 'landing') navigate('/');
            if (role === 'admin') navigate('/admin');
            if (role === 'guest') navigate('/invite/demo');
          }}
        />
      )}

      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Customer Portal Top Header */}
        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#f9e5af] bg-[#d4af37]/20 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 backdrop-blur-sm">
                Захиалагчийн Портал
              </span>
              <span className="text-[11px] text-emerald-300 font-semibold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {authenticatedEmail}
              </span>
            </div>
            <h1 className="text-xl font-bold text-white font-serif">
              Захиалагчийн Систем
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs border border-white/10 flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Нүүр</span>
            </Link>

            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs border border-rose-500/30 flex items-center gap-1.5 transition-colors font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Гарах</span>
            </button>
          </div>
        </div>

        {/* Protection Banner */}
        <div className="bg-[#d4af37]/10 backdrop-blur-xl border border-[#d4af37]/30 p-4 rounded-2xl text-xs text-[#f9e5af] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#d4af37]/20 text-[#f9e5af] rounded-xl shrink-0 border border-[#d4af37]/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <strong className="text-white font-semibold block">Урилгын Эх Загвар Хамгаалагдсан</strong>
              <span className="text-white/70 text-[11px]">
                Дизайны өөрчлөлт хүсэх бол "Өөрчлөлт хүсэх" товчлуурыг ашиглан админд илгээнэ үү.
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onOpenLuckyDraw && (
              <button
                onClick={onOpenLuckyDraw}
                className="bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1"
              >
                <Trophy className="w-3.5 h-3.5" />
                <span>🎁 Азтан</span>
              </button>
            )}

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold px-3 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1"
              >
                <Bell className="w-3.5 h-3.5 text-sky-400" />
                <span>Мэдэгдэл</span>
              </button>
            )}

            {onRequestChange && (
              <button
                onClick={onRequestChange}
                className="bg-[#d4af37] hover:bg-[#e5be48] text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1 shadow-md shadow-[#d4af37]/20"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" />
                <span>Өөрчлөлт хүсэх</span>
              </button>
            )}
          </div>
        </div>

        {/* Content View Container */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
