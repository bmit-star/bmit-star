import React, { useState } from 'react';
import { GiftInfo } from '../../../types';
import { Gift, Copy, Check, ExternalLink, QrCode } from 'lucide-react';

interface InvitationGiftSectionProps {
  giftInfo?: GiftInfo;
}

export const InvitationGiftSection: React.FC<InvitationGiftSectionProps> = ({ giftInfo }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!giftInfo || !giftInfo.enabled) {
    return null;
  }

  const handleCopy = (accountNum: string, index: number) => {
    navigator.clipboard.writeText(accountNum);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <section className="py-16 px-6 max-w-xl mx-auto text-center space-y-6 font-sans">
      <div className="space-y-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37] font-bold block">
          Бэлгийн Санамж & Сэтгэлийн Бэлэг
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif text-stone-100">
          Бэлэг Ба Дансны Мэдээлэл
        </h2>
        {giftInfo.message && (
          <p className="text-xs text-stone-300 max-w-md mx-auto leading-relaxed italic font-serif">
            "{giftInfo.message}"
          </p>
        )}
      </div>

      <div className="bg-gradient-to-b from-stone-900/90 via-stone-950 to-stone-900/90 p-6 sm:p-8 rounded-3xl border border-amber-500/30 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none"></div>

        {/* QPay QR Section */}
        {giftInfo.qpayQrUrl && (
          <div className="bg-stone-950 p-5 rounded-2xl border border-amber-500/20 space-y-3 text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <QrCode className="w-4 h-4 text-amber-400" />
              <span>QPay Түргэн Шилжүүлэг</span>
            </div>
            
            <div className="bg-white p-3 rounded-xl border border-stone-800 inline-block mx-auto shadow-lg">
              <img
                src={giftInfo.qpayQrUrl}
                alt="QPay QR Code"
                className="w-40 h-40 object-contain mx-auto"
              />
            </div>
            {giftInfo.qpayMerchantName && (
              <p className="text-[11px] text-stone-400 font-medium">
                Хүлээн авагч: <span className="text-white font-bold">{giftInfo.qpayMerchantName}</span>
              </p>
            )}
          </div>
        )}

        {/* Bank Details List */}
        {giftInfo.bankDetails && giftInfo.bankDetails.length > 0 && (
          <div className="space-y-3 text-left">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
              Дансны Дугаар:
            </span>
            <div className="space-y-2.5">
              {giftInfo.bankDetails.map((bank, idx) => (
                <div
                  key={idx}
                  className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex items-center justify-between gap-3 shadow-md hover:border-amber-500/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-amber-300 block font-serif">
                      {bank.bankName}
                    </span>
                    <span className="text-sm font-mono font-bold text-white tracking-wider block">
                      {bank.accountNumber}
                    </span>
                    <span className="text-[11px] text-stone-400 block">
                      Дансны нэр: <strong className="text-stone-200">{bank.accountName}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(bank.accountNumber, idx)}
                    className="bg-stone-950 hover:bg-stone-800 text-stone-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-stone-700 transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Хуулсан</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Хуулах</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlist External Link */}
        {giftInfo.wishlistUrl && (
          <div className="pt-2 border-t border-stone-800/80">
            <a
              href={giftInfo.wishlistUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-bold text-amber-300 hover:text-amber-200 bg-stone-900 border border-amber-500/30 px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              <Gift className="w-4 h-4 text-amber-400" />
              <span>Хүслийн Жагсаалт (Wishlist) Харах</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
