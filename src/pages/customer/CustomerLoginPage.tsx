import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, KeyRound, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Order } from '../../types';

interface CustomerLoginPageProps {
  orders: Order[];
  onLoginSuccess: (email: string) => void;
}

export const CustomerLoginPage: React.FC<CustomerLoginPageProps> = ({
  orders,
  onLoginSuccess
}) => {
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState('');
  const [orderNumberInput, setOrderNumberInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = emailInput.trim().toLowerCase();
    const trimmedOrder = orderNumberInput.trim().toUpperCase();

    if (!trimmedEmail || !trimmedOrder) {
      setError('Имэйл хаяг болон захиалгын дугаараа оруулна уу.');
      return;
    }

    const matches = orders.filter(
      (o) => o.customerEmail.toLowerCase().trim() === trimmedEmail
    );

    if (matches.length === 0) {
      setError(`"${trimmedEmail}" имэйл дээр одоогоор захиалга олдсонгүй.`);
      return;
    }

    const matchWithOrderNumber = matches.find(
      (o) => o.orderNumber.toUpperCase() === trimmedOrder || o.id === trimmedOrder
    );
    if (!matchWithOrderNumber) {
      setError(`"${trimmedOrder}" захиалгын дугаар ${trimmedEmail} имэйлд харгалзахгүй байна.`);
      return;
    }

    setError('');
    onLoginSuccess(trimmedEmail);
    navigate('/customer', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0f0c0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900/90 backdrop-blur-2xl rounded-3xl border border-[#d4af37]/30 p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f9e5af] to-[#b38b2d] flex items-center justify-center mx-auto text-slate-950 font-bold shadow-xl shadow-[#d4af37]/20 border border-amber-200/50">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 inline-block">
              Захиалагчийн Портал
            </span>
            <h2 className="text-2xl font-bold text-white font-serif tracking-tight">
              Захиалагч Нэвтрэх
            </h2>
            <p className="text-xs text-white/60">
              Та захиалга өгсөн имэйл болон захиалгын дугаараа оруулж урилгын хяналтын хэсэгт нэвтэрнэ үү.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 block flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Захиалсан Имэйл Хаяг *</span>
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                setError('');
              }}
              placeholder="client@example.mn"
              className="w-full bg-black/60 border border-white/15 focus:border-[#d4af37] rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-white/80 block flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Захиалгын Дугаар *</span>
            </label>
            <input
              type="text"
              required
              value={orderNumberInput}
              onChange={(e) => {
                setOrderNumberInput(e.target.value);
                setError('');
              }}
              placeholder="INV-2026-1001..."
              className="w-full bg-black/60 border border-white/15 focus:border-[#d4af37] rounded-xl px-4 py-3 text-sm font-mono text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] text-slate-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#d4af37]/25 hover:brightness-110 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Захиалга Шалгах & Нэвтрэх</span>
          </button>
        </form>

        <div className="pt-2 border-t border-white/10 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-white/50 hover:text-white transition-colors inline-flex items-center gap-1.5 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Нүүр хуудас руу буцах</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
