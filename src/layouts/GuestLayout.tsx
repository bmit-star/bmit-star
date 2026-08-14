import React from 'react';
import { Outlet } from 'react-router-dom';

export const GuestLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-[#d4af37] selection:text-slate-950 font-sans relative overflow-x-hidden">
      {/* Standalone Guest Container — Zero system chrome or admin code */}
      <main className="w-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};
