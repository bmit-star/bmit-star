import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, Download, QrCode, FileText, Sparkles, User, Phone, Users, Utensils, MessageSquare } from 'lucide-react';
import { RsvpService } from './index';

interface Props {
  eventSlug?: string;
  defaultName?: string;
  orderId?: string;
  onRsvpSubmitted?: (newRsvp: any, token: string) => void;
}

export default function RSVPForm({ eventSlug, defaultName = 'Эрхэм зочин', orderId, onRsvpSubmitted }: Props) {
  const initialName = defaultName !== 'Эрхэм зочин' ? defaultName : '';
  const [name, setName] = useState(initialName);
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [mealPreference, setMealPreference] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<'GOING' | 'NOT_GOING'>('GOING');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate unique token for QR check-in
  const [uniqueToken] = useState<string>(() => `INV-${Math.random().toString(36).substring(2, 9).toUpperCase()}`);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (orderId) {
        const rsvpData = {
          guestName: name || 'Зочин',
          phone,
          attendance: status === 'GOING' ? ('attending' as const) : ('declined' as const),
          guestCount,
          mealPreference,
          note,
        };
        await RsvpService.submitRsvp(orderId, rsvpData);
        if (onRsvpSubmitted) {
          onRsvpSubmitted(rsvpData, uniqueToken);
        }
      }
    } catch (err) {
      console.error('RSVP submission error:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const downloadPng = () => {
    if (!qrRef.current) return;
    const svgElement = qrRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 300;
      canvas.height = 300;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20, 260, 260);
        const pngUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngUrl;
        downloadLink.download = `QR_Pass_${name || 'Guest'}_${uniqueToken}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const downloadPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Хөтөчийн pop-up хаалттай байна.');
      return;
    }

    const svgElement = qrRef.current?.querySelector('svg');
    const svgHtml = svgElement ? svgElement.outerHTML : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>VIP Entry Pass - ${name || 'Зочин'}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .ticket { background: linear-gradient(135deg, #1e293b, #0f172a); border: 2px solid #d4af37; padding: 32px; rounded-radius: 24px; border-radius: 24px; text-align: center; max-width: 380px; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
            .gold-text { color: #f59e0b; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px; font-weight: bold; }
            .name { font-size: 24px; color: #ffffff; margin-bottom: 20px; font-weight: 600; }
            .qr-box { background: white; padding: 16px; border-radius: 16px; display: inline-block; margin-bottom: 16px; }
            .token { font-family: monospace; font-size: 16px; color: #cbd5e1; letter-spacing: 1px; }
            .footer { margin-top: 24px; font-size: 12px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <div class="gold-text">VIP Урилгын Тасалбар</div>
            <div class="name">${name || 'Эрхэм зочин'}</div>
            <div class="qr-box">${svgHtml}</div>
            <div class="token">Түлхүүр код: ${uniqueToken}</div>
            <div class="footer">Бүртгэлийн хэсэгт энэхүү QR кодыг уншуулна уу.</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <section className="py-16 px-4 max-w-lg mx-auto">
      <div className="p-8 rounded-3xl bg-stone-900/90 border border-amber-500/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
        {/* Decorative Gold Glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-2xl font-serif text-amber-100 text-center">Ирц Баталгаажуулах (RSVP)</h2>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-amber-200/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Таны нэр
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-amber-500/20 text-stone-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 outline-none transition-all placeholder-stone-500"
                placeholder="Бүтэн нэрээ оруулна уу"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-amber-200/80 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Утасны дугаар
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-amber-500/20 text-stone-100 focus:border-amber-400 outline-none transition-all placeholder-stone-500"
                placeholder="Утасны дугаар"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStatus('GOING')}
                className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  status === 'GOING'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                    : 'bg-black/30 text-stone-300 border-stone-700 hover:border-amber-500/40'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Оролцоно
              </button>
              <button
                type="button"
                onClick={() => setStatus('NOT_GOING')}
                className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  status === 'NOT_GOING'
                    ? 'bg-rose-950/80 text-rose-200 border-rose-500/50 shadow-lg shadow-rose-950/50'
                    : 'bg-black/30 text-stone-300 border-stone-700 hover:border-rose-500/40'
                }`}
              >
                Оролцохгүй
              </button>
            </div>

            {status === 'GOING' && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-amber-200/80 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Хүний тоо
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-stone-100 outline-none"
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num} className="bg-stone-900 text-stone-100">
                          {num} хүн
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-amber-200/80 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5" /> Хоолны сонголт
                    </label>
                    <input
                      type="text"
                      value={mealPreference}
                      onChange={(e) => setMealPreference(e.target.value)}
                      placeholder="Веган, Чихэргүй гэх мэт"
                      className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-stone-100 outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-amber-200/80 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" /> Тайлбар / Сэтгэгдэл
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Зохион байгуулагчдад дамжуулах нэмэлт мэдээлэл..."
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-amber-500/20 text-stone-100 outline-none text-xs resize-none"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black font-bold hover:brightness-110 active:scale-[0.99] transition-all shadow-xl shadow-amber-500/20 mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Боловсруулж байна...' : 'Баталгаажуулах'}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-5 animate-fadeIn">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-serif text-stone-100">Баярлалаа!</h3>
              <p className="text-sm text-amber-200/90 mt-1">
                {status === 'GOING' ? 'Таны ирц амжилттай баталгаажлаа.' : 'Мэдээлэл хүлээн авлаа.'}
              </p>
            </div>

            {status === 'GOING' && (
              <>
                <div className="bg-stone-950/80 p-5 rounded-2xl border border-amber-500/30 inline-block shadow-inner" ref={qrRef}>
                  <div className="bg-white p-3 rounded-xl inline-block shadow-md">
                    <QRCodeSVG value={uniqueToken} size={160} level="H" includeMargin={false} />
                  </div>
                  <p className="text-xs font-mono text-amber-300 mt-3 tracking-wider">
                    Түлхүүр код: <span className="font-bold">{uniqueToken}</span>
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={downloadPng}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> QR татах (PNG)
                  </button>
                  <button
                    type="button"
                    onClick={downloadPdf}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5" /> PDF татах
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
