import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { 
  Users, FileText, LayoutDashboard, Layers, Globe, 
  UserCheck, BarChart3, LogOut, Lock, Home, Sparkles, Menu, X, ChevronRight, UserPlus
} from 'lucide-react';
import { HeaderRoleBar } from '../components/Shared/HeaderRoleBar';

interface AdminLayoutProps {
  isAdminAuthenticated: boolean;
  onLogout: () => void;
  onOpenAiAssistant?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  isAdminAuthenticated,
  onLogout,
  onOpenAiAssistant
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isAdminAuthenticated && !location.pathname.includes('/admin/login')) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdminAuthenticated, location.pathname, navigate]);

  const isDevMode = import.meta.env.DEV;

  const navItems = [
    { path: '/admin/customers', label: 'Захиалагчид (Харилцагч)', icon: Users },
    { path: '/admin/orders', label: 'Захиалгын жагсаалт', icon: FileText },
    { path: '/admin/dashboard', label: 'Хянах самбар', icon: LayoutDashboard },
    { path: '/admin/invitations', label: 'Админы Урилга & Баг', icon: UserPlus, badge: 'Шинэ' },
    { path: '/admin/templates', label: 'Загварын сан', icon: Layers },
    { path: '/admin/published', label: 'Нийтлэгдсэн урилгууд', icon: Globe },
    { path: '/admin/checkin', label: '🎟️ Ирц & Check-in Сканнер', icon: UserCheck },
    { path: '/admin/analytics', label: 'Статистик & Аналитик', icon: BarChart3 },
  ];


  if (!isAdminAuthenticated) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-[#0f0c0a] text-slate-100 font-sans flex flex-col relative overflow-x-hidden selection:bg-[#d4af37]/30">
      {/* Background ambient lighting */}
      <div className="fixed top-[-120px] left-[-120px] w-[500px] h-[500px] bg-[#d4af37] rounded-full mix-blend-screen opacity-15 filter blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-120px] right-[-120px] w-[600px] h-[600px] bg-[#8e6e53] rounded-full mix-blend-screen opacity-10 filter blur-[150px] pointer-events-none z-0" />

      {/* Dev-Only Role Bar */}
      {isDevMode && (
        <HeaderRoleBar
          currentRole="admin"
          onRoleChange={(role) => {
            if (role === 'landing') navigate('/');
            if (role === 'customer') navigate('/customer');
            if (role === 'guest') navigate('/invite/demo');
          }}
          onOpenAiAssistant={onOpenAiAssistant}
        />
      )}

      {/* Main Admin Frame with Sidebar */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row min-h-screen">
        
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 bg-stone-900/90 backdrop-blur-2xl border-r border-[#d4af37]/20 p-4 space-y-6 shrink-0 shadow-2xl">
          {/* Brand header */}
          <div className="flex items-center gap-3 p-2 border-b border-white/10 pb-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d4af37] via-[#f9e5af] to-[#b38b2d] flex items-center justify-center text-slate-950 font-bold text-xl font-serif shadow-lg shadow-[#d4af37]/20">
              З
            </div>
            <div>
              <h2 className="font-bold text-white text-sm font-serif tracking-wide">ЗАЛЛАГА АДМИН</h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">Системын панел</span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path === '/admin/orders' && location.pathname.includes('/admin/editor'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#d4af37] text-slate-950 font-bold shadow-lg shadow-[#d4af37]/20'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="pt-4 border-t border-white/10 space-y-2">
            {onOpenAiAssistant && (
              <button
                onClick={onOpenAiAssistant}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#f9e5af] hover:from-[#e5be48] hover:to-[#fcebc4] text-slate-950 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#d4af37]/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>AI Туслах Нээх</span>
              </button>
            )}

            <button
              onClick={() => navigate('/')}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-white/10"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Нүүр хуудас харах</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 transition-all flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Системээс Гарах</span>
            </button>
          </div>
        </aside>

        {/* Mobile Top Navigation Header */}
        <div className="md:hidden bg-stone-900/90 backdrop-blur-xl border-b border-[#d4af37]/20 p-3.5 px-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#d4af37] to-[#f9e5af] flex items-center justify-center text-slate-950 font-bold text-sm font-serif">
              З
            </div>
            <span className="font-bold text-white text-xs font-serif">Админ Панел</span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/80"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-stone-900 border-b border-white/10 p-4 space-y-2 z-20 shadow-2xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-[#d4af37] text-slate-950 font-bold'
                      : 'text-white/70 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-white/10 flex gap-2">
              <button
                onClick={onLogout}
                className="flex-1 px-3 py-2 bg-rose-500/20 text-rose-300 rounded-xl text-xs font-bold"
              >
                Гарах
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};
