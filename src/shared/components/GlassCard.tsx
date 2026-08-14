import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-stone-900/80 backdrop-blur-xl border border-amber-500/20 rounded-3xl p-6 shadow-2xl transition-all hover:border-amber-500/40 ${className}`}
    >
      {children}
    </div>
  );
};
