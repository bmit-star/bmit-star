import React from 'react';
import { LandingPage as LandingComponent } from '../components/Landing/LandingPage';
import { Template, Order } from '../types';

interface LandingPageProps {
  templates: Template[];
  onCreateOrder: (newOrder: Order) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ templates, onCreateOrder }) => {
  return (
    <div className="min-h-screen bg-[#0f0c0a] text-slate-100 font-sans selection:bg-[#d4af37]/30 relative overflow-x-hidden">
      {/* Background ambient gold & emerald glow effects */}
      <div className="fixed top-[-150px] left-[-150px] w-[600px] h-[600px] bg-[#d4af37] rounded-full mix-blend-screen opacity-15 filter blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-[40%] right-[-150px] w-[500px] h-[500px] bg-[#8e6e53] rounded-full mix-blend-screen opacity-10 filter blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-[-150px] left-[20%] w-[600px] h-[600px] bg-emerald-950 rounded-full mix-blend-screen opacity-15 filter blur-[160px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl w-full mx-auto p-4 sm:p-6">
        <LandingComponent
          templates={templates}
          onOrderCreated={(newOrder) => {
            onCreateOrder(newOrder);
          }}
        />
      </div>
    </div>
  );
};

export default LandingPage;
