import React from 'react';
import { Eye, HeartHandshake, MessageSquare, Gift, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { Order } from '../../types';

interface AnalyticsViewProps {
  orders: Order[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ orders }) => {
  const publishedOrders = orders.filter(o => o.status === 'Published');
  const allRsvps = orders.flatMap(o => o.invitationData.rsvps || []);
  const attendingCount = allRsvps.filter(r => r.attendance === 'attending').reduce((sum, r) => sum + (r.guestCount || 1), 0);
  const declinedCount = allRsvps.filter(r => r.attendance === 'declined').length;
  const allWishes = orders.flatMap(o => o.invitationData.wishes || []);
  const totalViews = orders.reduce((sum, o) => sum + (o.viewsCount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Системийн Аналитик Мэдээлэл</h2>
        <p className="text-xs text-slate-400">
          Зочдын оролцоо, ирцийн мэдээ (RSVP), хүрэлцэн ирэх хүний тоо болон сэтгэлийн үгийн то hisг та статистик
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">Нийт зочны үзэлт</span>
            <div className="p-2.5 bg-[#d4af37]/20 text-[#f9e5af] rounded-2xl border border-[#d4af37]/30 shadow-md">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{totalViews}</span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">Очино гэсэн зочид</span>
            <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-500/30 shadow-md">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{attendingCount}</span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">Очиж чадахгүй</span>
            <div className="p-2.5 bg-red-500/20 text-red-300 rounded-2xl border border-red-500/30 shadow-md">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{declinedCount}</span>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">Ирсэн сэтгэлийн үгс</span>
            <div className="p-2.5 bg-purple-500/20 text-purple-300 rounded-2xl border border-purple-500/30 shadow-md">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <span className="text-2xl font-extrabold text-white">{allWishes.length}</span>
        </div>

      </div>

      {/* RSVP Breakdown Table */}
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl space-y-4">
        <h3 className="font-bold text-base text-white">Сүүлд Ирсэн Ирцийн Мэдээлэл</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white/80">
            <thead className="bg-black/60 text-white/50 font-semibold border-b border-white/10 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4">Зочны Нэр</th>
                <th className="py-3.5 px-4">Утасны Дугаар</th>
                <th className="py-3.5 px-4">Ирцийн Төлөв</th>
                <th className="py-3.5 px-4">Хүний Тоо</th>
                <th className="py-3.5 px-4">Зоогийн Төрөл</th>
                <th className="py-3.5 px-4">Илгээсэн Огноо</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {allRsvps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-white/40">
                    Одоогоор ирцийн мэдээ ирээгүй байна.
                  </td>
                </tr>
              ) : (
                allRsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">{rsvp.guestName}</td>
                    <td className="py-3.5 px-4 text-white/60 font-mono">
                      {rsvp.phone || '-'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[10px] ${
                        rsvp.attendance === 'attending'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {rsvp.attendance === 'attending' ? 'ОЧИНО' : 'ОЧИХГҮЙ'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-white/90">{rsvp.guestCount} Хүн</td>
                    <td className="py-3.5 px-4 text-white/80">{rsvp.mealPreference || 'Энгийн'}</td>
                    <td className="py-3.5 px-4 text-white/50 text-[11px]">{new Date(rsvp.submittedAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
