import React from 'react';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

interface DevicePreviewFrameProps {
  deviceMode: 'mobile' | 'tablet' | 'desktop';
  onDeviceModeChange?: (mode: 'mobile' | 'tablet' | 'desktop') => void;
  children: React.ReactNode;
  title?: string;
}

export const DevicePreviewFrame: React.FC<DevicePreviewFrameProps> = ({
  deviceMode,
  onDeviceModeChange,
  children,
  title = 'Live Invitation Preview'
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      {/* Device Frame Toolbar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
          <span className="ml-2 font-medium text-slate-400">{title}</span>
        </div>

        {onDeviceModeChange && (
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onDeviceModeChange('mobile')}
              className={`p-1 rounded ${deviceMode === 'mobile' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeviceModeChange('tablet')}
              className={`p-1 rounded ${deviceMode === 'tablet' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeviceModeChange('desktop')}
              className={`p-1 rounded ${deviceMode === 'desktop' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Frame Container */}
      <div className="flex-1 bg-slate-950 overflow-y-auto p-4 flex justify-center items-start min-h-[600px]">
        <div
          className={`transition-all duration-300 bg-stone-900 shadow-2xl overflow-y-auto ${
            deviceMode === 'mobile'
              ? 'w-[375px] max-w-full h-[780px] rounded-[36px] border-[10px] border-slate-800 relative shadow-amber-500/5'
              : deviceMode === 'tablet'
              ? 'w-[768px] max-w-full h-[850px] rounded-[24px] border-[8px] border-slate-800 relative'
              : 'w-full h-full min-h-[700px] rounded-xl border border-slate-800'
          }`}
        >
          {deviceMode === 'mobile' && (
            <div className="w-32 h-4 bg-slate-800 rounded-b-xl mx-auto absolute top-0 left-0 right-0 z-50"></div>
          )}
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
