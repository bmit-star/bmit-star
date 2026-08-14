import React, { useState } from 'react';
import { Globe, Copy, Check, QrCode, Eye, Share2, ExternalLink, Sparkles } from 'lucide-react';
import { Order } from '../../types';

interface PublishedInvitationsProps {
  orders: Order[];
  onSelectOrderToEdit: (order: Order) => void;
  onSelectOrderToPreview: (order: Order) => void;
}

export const PublishedInvitations: React.FC<PublishedInvitationsProps> = ({
  orders,
  onSelectOrderToEdit,
  onSelectOrderToPreview
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const publishedOrders = orders.filter(o => o.status === 'Published');

  const copyUrl = (id: string, slug: string) => {
    const url = `${window.location.origin}/invitation/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Нийтлэгдсэн Цахим Урилгууд</h2>
        <p className="text-xs text-slate-400">
          Нийтлэгдсэн урилгуудын давтагдашгүй URL холбоос, QR код болон захиалагчид илгээх бэлэн холбоосууд
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {publishedOrders.map(ord => {
          const liveUrl = `${window.location.origin}/invitation/${ord.uniqueSlug}`;
          const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(liveUrl)}`;

          return (
            <div
              key={ord.id}
              className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-2xl space-y-4 hover:border-[#d4af37]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {ord.invitationData.brideName} & {ord.invitationData.groomName}
                    </h3>
                    <p className="text-xs text-[#f9e5af] font-medium">{ord.templateTitle}</p>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold backdrop-blur-sm">
                    Нийтлэгдсэн
                  </span>
                </div>

                {/* QR Code and URL */}
                <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center gap-3">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code"
                    className="w-32 h-32 rounded-xl bg-white p-2 border border-white/20 shadow-lg"
                  />
                  <div className="w-full space-y-1 text-center">
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Цахим Холбоос (URL)</span>
                    <input
                      type="text"
                      readOnly
                      value={liveUrl}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-2.5 py-1.5 text-[11px] font-mono text-[#f9e5af] text-center select-all outline-none"
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <div>
                    <span className="text-[10px] text-white/50 block">Нийт үзэлт</span>
                    <strong className="text-white font-bold">{ord.viewsCount || 0}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-white/50 block">Ирсэн ирц (RSVP)</span>
                    <strong className="text-[#f9e5af] font-bold">{ord.invitationData.rsvps?.length || 0}</strong>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => copyUrl(ord.id, ord.uniqueSlug)}
                  className="flex-1 bg-black/40 hover:bg-white/10 text-white border border-white/10 font-semibold py-2 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 backdrop-blur-md"
                >
                  {copiedId === ord.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Хуулагдлаа!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Холбоос Хуулах</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onSelectOrderToPreview(ord)}
                  className="flex-1 bg-[#d4af37] hover:bg-[#e5be48] text-slate-950 font-bold py-2 rounded-xl text-xs transition-all shadow-md shadow-[#d4af37]/20 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-950" />
                  <span>Шууд Харах</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
