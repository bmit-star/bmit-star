import React from 'react';
import { 
  FileText, Users, Globe, CheckCircle2, Clock, Eye, 
  Sparkles, TrendingUp, ArrowRight, PlusCircle, Layout, Layers, HeartHandshake
} from 'lucide-react';
import { Order, Template, Customer } from '../../types';

interface AdminDashboardProps {
  orders: Order[];
  templates: Template[];
  customers: Customer[];
  onNavigateTab: (tab: string) => void;
  onSelectOrderToEdit: (order: Order) => void;
  onNewOrder: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  templates,
  customers,
  onNavigateTab,
  onSelectOrderToEdit,
  onNewOrder
}) => {
  const totalOrders = orders.length;
  const publishedOrders = orders.filter(o => o.status === 'Published').length;
  const pendingOrders = orders.filter(o => o.status === 'New' || o.status === 'In Preparation').length;
  const totalViews = orders.reduce((sum, o) => sum + (o.viewsCount || 0), 0);
  const totalRsvps = orders.reduce((sum, o) => sum + (o.invitationData.rsvps?.length || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#f9e5af] bg-[#d4af37]/15 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 backdrop-blur-sm">
              Администратор Систем
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Цахим Урилгын Управлений Төв
          </h1>
          <p className="text-xs text-white/60 max-w-xl">
            Захиалагчийн цахим урилгын мэдээллийг бэлтгэх, динамик талбаруудыг оруулах, нийтлэх болон хянах нэгдсэн систем. Загварын бүтцийг чанарын стандарт хангахаар админ хянана.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <button
            onClick={onNewOrder}
            className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#e5be48] text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-[#d4af37]/20 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Шинэ Захиалга Үүсгэх</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl space-y-2 hover:border-[#d4af37]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">Нийт Захиалга</span>
            <div className="p-2 bg-blue-500/15 text-blue-300 rounded-xl border border-blue-500/20">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalOrders}</span>
            <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +12% энэ сард
            </span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl space-y-2 hover:border-[#d4af37]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">Нийтлэгдсэн Урилга</span>
            <div className="p-2 bg-emerald-500/15 text-emerald-300 rounded-xl border border-emerald-500/20">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{publishedOrders}</span>
            <span className="text-[11px] text-white/50 font-medium">
              {pendingOrders} бэлтгэгдэж буй
            </span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl space-y-2 hover:border-[#d4af37]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">Нийт Үзэлтийн Тоо</span>
            <div className="p-2 bg-[#d4af37]/15 text-[#f9e5af] rounded-xl border border-[#d4af37]/30">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalViews}</span>
            <span className="text-[11px] text-[#f9e5af] font-medium">Бүх холбоосын дагуу</span>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-xl space-y-2 hover:border-[#d4af37]/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/60 font-medium">Ирсэн Ирцийн Мэдээ (RSVP)</span>
            <div className="p-2 bg-purple-500/15 text-purple-300 rounded-xl border border-purple-500/20">
              <HeartHandshake className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-white">{totalRsvps}</span>
            <span className="text-[11px] text-purple-300 font-medium">Шууд бүртгэгдсэн</span>
          </div>
        </div>

      </div>

      {/* Main Content Area: Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders List (2 cols) */}
        <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-white">Идэвхтэй Захиалгууд</h3>
              <p className="text-xs text-white/50">Загвар бэлтгэх болон нийтлэх хүлээгдэж буй захиалгуудын жагсаалт</p>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs text-[#d4af37] hover:text-[#f9e5af] hover:underline flex items-center gap-1 font-semibold"
            >
              Бүх захиалгыг харах <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 hover:border-[#d4af37]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{order.invitationData.brideName} & {order.invitationData.groomName}</span>
                    <span className="text-[10px] font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                      {order.orderNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/60">
                    <span>Захиалагч: <strong className="text-white font-medium">{order.customerName}</strong></span>
                    <span>•</span>
                    <span>Загвар: <strong className="text-[#f9e5af] font-medium">{order.templateTitle}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${
                    order.status === 'Published'
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : order.status === 'Ready for Preview'
                      ? 'bg-[#d4af37]/15 text-[#f9e5af] border-[#d4af37]/30'
                      : 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                  }`}>
                    {order.status === 'Published' ? 'Нийтлэгдсэн' : order.status === 'Ready for Preview' ? 'Урьдчилан харахад бэлэн' : 'Бэлтгэж буй'}
                  </span>

                  <button
                    onClick={() => onSelectOrderToEdit(order)}
                    className="bg-[#d4af37] text-slate-950 font-bold hover:bg-[#e5be48] px-3.5 py-1.5 rounded-xl text-xs transition-all flex items-center gap-1 shrink-0 shadow-md shadow-[#d4af37]/20"
                  >
                    <span>Захиалга Боловсруулах</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tools & Template Library Quick Access (1 col) */}
        <div className="space-y-6">
          
          <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white">Управлений Хэсгүүд</h3>
            
            <div className="space-y-2.5">
              <button
                onClick={() => onNavigateTab('templates')}
                className="w-full bg-black/40 hover:bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-left transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#d4af37]/15 text-[#f9e5af] border border-[#d4af37]/30">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Загварын Сан</h4>
                    <p className="text-white/50 text-[11px]">{templates.length} бэлэн тансаг загвар</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40" />
              </button>

              <button
                onClick={() => onNavigateTab('customers')}
                className="w-full bg-black/40 hover:bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-left transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-500/15 text-blue-300 border border-blue-500/20">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Захиалагчдын Бүртгэл</h4>
                    <p className="text-white/50 text-[11px]">{customers.length} бүртгэлтэй харилцагч</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40" />
              </button>

              <button
                onClick={() => onNavigateTab('published')}
                className="w-full bg-black/40 hover:bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between text-left transition-all text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">Нийтлэгдсэн Урилгууд</h4>
                    <p className="text-white/50 text-[11px]">{publishedOrders} идэвхтэй холбоос & QR</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-white/40" />
              </button>
            </div>
          </div>

          {/* Workflow Reminder Card */}
          <div className="bg-gradient-to-br from-[#d4af37]/15 via-black/40 to-black/40 backdrop-blur-xl p-5 rounded-3xl border border-[#d4af37]/20 text-xs space-y-2 shadow-xl">
            <div className="flex items-center gap-2 text-[#f9e5af] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Админы Ажлын Дараалал</span>
            </div>
            <ol className="list-decimal list-inside text-white/70 space-y-1.5 leading-relaxed text-[11px]">
              <li>Захиалагчийн мэдээллийг хүлээн авах.</li>
              <li>Загвар сонгож, динамик мэдээллийг оруулах.</li>
              <li>AI туслах ашиглан найруулгыг сайжруулах.</li>
              <li>Урьдчилан шалгаж, URL & QR код нийтлэх.</li>
              <li>Захиалагчид холбоосыг илгээх.</li>
            </ol>
          </div>

        </div>

      </div>

    </div>
  );
};
