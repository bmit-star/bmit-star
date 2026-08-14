import React, { useState } from 'react';
import { Gift, Trophy, Sparkles, X, Shuffle, CheckCircle2, RotateCcw, Users, Award } from 'lucide-react';
import { Order, RSVP } from '../../types';

interface LuckyDrawModalProps {
  order: Order;
  onClose: () => void;
  onUpdateOrder?: (updatedOrder: Order) => void;
}

export interface WinnerRecord {
  id: string;
  prizeName: string;
  guestName: string;
  phone?: string;
  wonAt: string;
}

export const LuckyDrawModal: React.FC<LuckyDrawModalProps> = ({
  order,
  onClose,
  onUpdateOrder
}) => {
  const [selectedPrize, setSelectedPrize] = useState<string>('Супер Шагнал');
  const [customPrizeInput, setCustomPrizeInput] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [currentDisplayGuest, setCurrentDisplayGuest] = useState<string>('Товчлуур дээр дарна уу');
  const [currentWinner, setCurrentWinner] = useState<RSVP | null>(null);
  const [winnersList, setWinnersList] = useState<WinnerRecord[]>(
    (order.invitationData as any).luckyDrawWinners || []
  );

  // Eligible guests: Attending or checked-in RSVPs
  const eligibleGuests = (order.invitationData.rsvps || []).filter(
    (r) => r.attendance === 'attending'
  );

  // Exclude already won guests
  const remainingCandidates = eligibleGuests.filter(
    (guest) => !winnersList.some((w) => w.guestName === guest.guestName)
  );

  const handleStartDraw = () => {
    if (remainingCandidates.length === 0) return;

    setIsSpinning(true);
    setCurrentWinner(null);

    const prize = customPrizeInput.trim() || selectedPrize;
    let counter = 0;
    const totalFlips = 30;
    const intervalTime = 80;

    const timer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * remainingCandidates.length);
      setCurrentDisplayGuest(remainingCandidates[randomIndex].guestName);
      counter++;

      if (counter >= totalFlips) {
        clearInterval(timer);
        const winner = remainingCandidates[Math.floor(Math.random() * remainingCandidates.length)];
        setCurrentDisplayGuest(winner.guestName);
        setCurrentWinner(winner);
        setIsSpinning(false);

        // Record winner
        const newWinnerRecord: WinnerRecord = {
          id: 'winner-' + Date.now(),
          prizeName: prize,
          guestName: winner.guestName,
          phone: winner.phone,
          wonAt: new Date().toLocaleTimeString('mn-MN', { hour: '2-digit', minute: '2-digit' })
        };

        const updatedWinners = [newWinnerRecord, ...winnersList];
        setWinnersList(updatedWinners);

        if (onUpdateOrder) {
          const updatedOrder: Order = {
            ...order,
            invitationData: {
              ...order.invitationData,
              luckyDrawWinners: updatedWinners
            } as any
          };
          onUpdateOrder(updatedOrder);
        }
      }
    }, intervalTime);
  };

  const handleResetWinners = () => {
    if (window.confirm('Азтануудын жагсаалтыг цэвэрлэх үү?')) {
      setWinnersList([]);
      setCurrentWinner(null);
      setCurrentDisplayGuest('Товчлуур дээр дарна уу');
      if (onUpdateOrder) {
        const updatedOrder: Order = {
          ...order,
          invitationData: {
            ...order.invitationData,
            luckyDrawWinners: []
          } as any
        };
        onUpdateOrder(updatedOrder);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-black border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 rounded-2xl shadow-lg shadow-amber-500/20">
              <Trophy className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-xl text-amber-200">
                  🎁 Азтан Тодруулах Систем
                </h2>
                <span className="text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Lucky Draw V2.0
                </span>
              </div>
              <p className="text-xs text-white/60">
                {order.invitationData.eventTitle} • Нийт оролцогч: {eligibleGuests.length}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prize Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> Тодруулах Шагнал
          </label>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
            {['Супер Шагнал', 'I Байр (Шагнал)', 'II Байр (Шагнал)', 'Сюрприз Шагнал'].map((prize) => (
              <button
                key={prize}
                onClick={() => {
                  setSelectedPrize(prize);
                  setCustomPrizeInput('');
                }}
                className={`p-2.5 rounded-xl border transition-all ${
                  selectedPrize === prize && !customPrizeInput
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold border-amber-300 shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-white/80 border-white/10 hover:border-white/30'
                }`}
              >
                {prize}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={customPrizeInput}
            onChange={(e) => setCustomPrizeInput(e.target.value)}
            placeholder="Бусад шагналын нэр оруулж болно..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Dynamic Display Wheel Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/40 rounded-3xl p-8 text-center shadow-inner space-y-3">
          <div className="text-xs font-bold text-amber-300/80 uppercase tracking-widest">
            {customPrizeInput.trim() || selectedPrize} - Азтан
          </div>

          <div className={`text-2xl sm:text-4xl font-extrabold text-amber-200 transition-all duration-100 min-h-[48px] flex items-center justify-center ${
            isSpinning ? 'scale-105 opacity-90 blur-[0.3px]' : 'scale-100'
          }`}>
            {currentDisplayGuest}
          </div>

          {currentWinner && (
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
              <CheckCircle2 className="w-4 h-4" /> Баяр хүргэе! Азтан тодорлоо!
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleStartDraw}
            disabled={isSpinning || remainingCandidates.length === 0}
            className="flex-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 disabled:opacity-40 text-slate-950 font-extrabold py-3.5 rounded-2xl text-sm transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <Shuffle className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>
              {isSpinning ? 'Тодруулж байна...' : `Азтан Эхлүүлэх (${remainingCandidates.length} боломжит)`}
            </span>
          </button>

          {winnersList.length > 0 && (
            <button
              onClick={handleResetWinners}
              className="px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Шинэчлэх</span>
            </button>
          )}
        </div>

        {/* Winners History List */}
        {winnersList.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white/80">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Тодорсон Азтануудын Жагсаалт ({winnersList.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {winnersList.map((w) => (
                <div
                  key={w.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-amber-200">{w.guestName}</div>
                    <div className="text-[11px] text-white/50">{w.prizeName} • {w.wonAt}</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                    <Trophy className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
