import React from 'react';
import { ShieldCheck, UserCheck, HeartHandshake, Eye, Sparkles, Smartphone, Tablet, Monitor, Home } from 'lucide-react';

export interface HeaderRoleBarProps {
  currentRole: 'landing' | 'admin' | 'customer' | 'guest';
  onRoleChange: (role: 'landing' | 'admin' | 'customer' | 'guest') => void;
  deviceMode?: 'mobile' | 'tablet' | 'desktop';
  onDeviceModeChange?: (mode: 'mobile' | 'tablet' | 'desktop') => void;
  activeOrderNumber?: string;
  onOpenAiAssistant?: () => void;
}

export const HeaderRoleBar: React.FC<HeaderRoleBarProps> = ({
  currentRole,
  onRoleChange,
  deviceMode = 'desktop',
  onDeviceModeChange,
  activeOrderNumber,
  onOpenAiAssistant
}) => {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-white/10 text-white px-4 py-3 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#d4af37] via-[#f9e5af] to-[#b38b2d] flex items-center justify-center text-slate-950 font-bold text-lg shadow-lg shadow-[#d4af37]/20 font-serif">
            З
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-wide text-sm text-white font-serif">ЗАЛЛАГА</span>
              <span className="text-[10px] uppercase tracking-wider bg-[#d4af37]/15 text-[#f9e5af] font-semibold px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 backdrop-blur-sm">
                СИСТЕМ
              </span>
            </div>
            <p className="text-xs text-white/50 hidden sm:block">
              Дижитал Урилгын Управлений Панел
            </p>
          </div>
        </div>

        {/* Role Switcher Controls */}
        <div className="flex items-center bg-black/50 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs shadow-inner overflow-x-auto">
          <button
            onClick={() => onRoleChange('landing')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap ${
              currentRole === 'landing'
                ? 'bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20 font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Нүүр хуудас</span>
          </button>

          <button
            onClick={() => onRoleChange('admin')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap ${
              currentRole === 'admin'
                ? 'bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20 font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Администратор</span>
          </button>

          <button
            onClick={() => onRoleChange('customer')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap ${
              currentRole === 'customer'
                ? 'bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20 font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Захиалагчийн хэсэг</span>
          </button>

          <button
            onClick={() => onRoleChange('guest')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all font-medium whitespace-nowrap ${
              currentRole === 'guest'
                ? 'bg-[#d4af37] text-slate-950 shadow-md shadow-[#d4af37]/20 font-bold'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Зочны харах урилга</span>
          </button>
        </div>

        {/* Right Tools (Device Mode & AI Assistant Trigger) */}
        <div className="flex items-center gap-3">
          {onDeviceModeChange && (
            <div className="hidden sm:flex items-center bg-black/50 backdrop-blur-md rounded-lg p-0.5 border border-white/10">
              <button
                onClick={() => onDeviceModeChange('mobile')}
                title="Утасны харагдац (375px)"
                className={`p-1.5 rounded-md transition-colors ${
                  deviceMode === 'mobile' ? 'bg-white/15 text-[#d4af37]' : 'text-white/50 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeviceModeChange('tablet')}
                title="Планшет харагдац (768px)"
                className={`p-1.5 rounded-md transition-colors ${
                  deviceMode === 'tablet' ? 'bg-white/15 text-[#d4af37]' : 'text-white/50 hover:text-white'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDeviceModeChange('desktop')}
                title="Компьютер харагдац (100%)"
                className={`p-1.5 rounded-md transition-colors ${
                  deviceMode === 'desktop' ? 'bg-white/15 text-[#d4af37]' : 'text-white/50 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {currentRole === 'admin' && onOpenAiAssistant && (
            <button
              onClick={onOpenAiAssistant}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#d4af37] to-[#f9e5af] hover:from-[#e5be48] hover:to-[#fcebc4] text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-[#d4af37]/20 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-slate-900" />
              <span>AI Туслах</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
