import React, { useState } from 'react';
import { Users, Mail, Phone, Calendar, ArrowRight, ShieldCheck, HeartHandshake, Key, Copy, Check, ExternalLink } from 'lucide-react';
import { Customer, Order } from '../../types';

interface CustomersManagerProps {
  customers: Customer[];
  orders: Order[];
  onSelectOrderToEdit: (order: Order) => void;
}

export const CustomersManager: React.FC<CustomersManagerProps> = ({
  customers,
  orders,
  onSelectOrderToEdit
}) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyLink = (email: string) => {
    const url = `${window.location.origin}/costumer?email=${encodeURIComponent(email)}`;
    navigator.clipboard.writeText(url);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white font-serif">Захиалагчдын Бүртгэл & Эрхийн Управлени</h2>
        <p className="text-xs text-stone-300">
          Харилцагчдын холбоо барих мэдээлэл, нэвтрэх эрхийн байдал болон тэдний захиалсан цахим урилгуудыг хянаж удирах
        </p>
      </div>

      {/* Customer Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(cust => {
          const custOrders = orders.filter(o => o.customerEmail === cust.email || o.customerName === cust.name);
          const hasActiveAccess = custOrders.some(o => o.status !== 'New');

          return (
            <div
              key={cust.id}
              className="bg-stone-900/90 backdrop-blur-xl rounded-3xl border border-stone-800 p-5 shadow-2xl space-y-4 hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f9e5af] to-[#b38b2d] text-slate-950 font-bold flex items-center justify-center text-base shadow-md font-serif">
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{cust.name}</h3>
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold inline-block ${
                        hasActiveAccess 
                          ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' 
                          : 'text-amber-300 bg-amber-500/15 border-amber-500/30'
                      }`}>
                        {hasActiveAccess ? '🟢 Нэвтрэх эрхтэй' : '🔴 Эрх нээгдээгүй'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopyLink(cust.email)}
                    className="p-2 bg-stone-800 hover:bg-stone-700 text-amber-300 rounded-xl border border-stone-700 transition-colors"
                    title="Захиалагчийн шууд нэвтрэх холбоосыг хуулах"
                  >
                    {copiedEmail === cust.email ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-stone-200 pt-2 border-t border-stone-800">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate font-mono font-medium text-amber-200">{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-mono">{cust.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Сүүлийн захиалга: {cust.lastOrderDate}</span>
                  </div>
                </div>

                {/* Customer Orders list */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-stone-300 block mb-1">Холбогдох Урилгууд:</span>
                  <div className="space-y-1.5">
                    {custOrders.length === 0 ? (
                      <span className="text-[11px] text-stone-400 italic">Захиалга одоогоор байхгүй.</span>
                    ) : (
                      custOrders.map(ord => (
                        <div
                          key={ord.id}
                          className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-bold text-white">{ord.invitationData.brideName} & {ord.invitationData.groomName}</div>
                            <div className="text-[10px] text-stone-400 font-mono">
                              {ord.orderNumber} • {ord.status === 'Published' ? '🟢 Нийтлэгдсэн' : ord.status === 'Ready for Preview' ? '🟡 Шалгахад бэлэн' : ord.status === 'In Preparation' ? '🔵 Бэлтгэж буй' : '🔴 Шинэ'}
                            </div>
                          </div>
                          <button
                            onClick={() => onSelectOrderToEdit(ord)}
                            className="p-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors shadow-sm"
                            title="Засварлагчийг нээх"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Direct Portal Link Copy Row */}
                <div className="pt-2 border-t border-stone-800">
                  <button
                    onClick={() => handleCopyLink(cust.email)}
                    className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>{copiedEmail === cust.email ? 'Нэвтрэх Холбоос Хуулагдлаа!' : 'Нэвтрэх Холбоос Хуулах'}</span>
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
