import React, { useState } from 'react';
import { Sparkles, X, Copy, Check, RefreshCw, Wand2, Languages, BookOpen, HeartHandshake, Scissors, Layers, CheckCircle2, AlertCircle } from 'lucide-react';
import { InvitationData } from '../../types';
import { authenticatedFetch } from '../../lib/authenticatedFetch';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  invitationData: InvitationData;
  aiCallCount?: number;
  onIncrementAiCallCount?: () => void;
  onApplyGeneratedText: (field: keyof InvitationData, value: any) => void;
  onApplyTemplateData?: (data: Partial<InvitationData>) => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  invitationData,
  aiCallCount = 0,
  onIncrementAiCallCount,
  onApplyGeneratedText,
  onApplyTemplateData
}) => {
  const [activeTab, setActiveTab] = useState<'template_fill' | 'grammar' | 'greeting' | 'poem' | 'translate' | 'shorten'>('template_fill');
  const [tone, setTone] = useState<string>('Тансаг хүндэтгэлийн ба романтик');
  const [targetLanguage, setTargetLanguage] = useState<string>('English');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resultText, setResultText] = useState<string>('');
  const [parsedJsonResult, setParsedJsonResult] = useState<any | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [appliedSuccess, setAppliedSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const currentCategory = invitationData.category || 'Хурим';
  const isLimitReached = aiCallCount >= 2;

  const handleGenerate = async (actionType: string) => {
    if (isLimitReached) {
      setError('Урилга бүрт хамгийн ихдээ 2 удаа ИИ туслах ашиглах боломжтой (Хязгаар хүрсэн: 2/2).');
      return;
    }

    setLoading(true);
    setError('');
    setResultText('');
    setParsedJsonResult(null);
    setAppliedSuccess(false);

    try {
      const response = await authenticatedFetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          prompt: inputPrompt || invitationData.invitationMessage,
          tone,
          language: targetLanguage,
          category: currentCategory,
          aiCallCount,
          coupleInfo: {
            bride: invitationData.brideName || invitationData.childName || invitationData.graduateName || 'Нэр 1',
            groom: invitationData.groomName || invitationData.companyName || '',
            event: invitationData.eventTitle || currentCategory
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        if (actionType === 'template_fill') {
          try {
            // Strip any leftover codeblock fences if present
            const cleanText = data.result.replace(/```json/g, '').replace(/```/g, '').trim();
            const parsed = JSON.parse(cleanText);
            setParsedJsonResult(parsed);
          } catch {
            setResultText(data.result);
          }
        } else {
          setResultText(data.result);
        }

        if (onIncrementAiCallCount) {
          onIncrementAiCallCount();
        }
      } else {
        setError(data.error || 'ИИ туслахад алдаа гарлаа.');
      }
    } catch (err: any) {
      setError(err?.message || 'Сервертэй холбогдоход алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyAllTemplateFields = () => {
    if (!parsedJsonResult || !onApplyTemplateData) return;

    const updateData: Partial<InvitationData> = {};
    if (parsedJsonResult.eventTitle) updateData.eventTitle = parsedJsonResult.eventTitle;
    if (parsedJsonResult.invitationMessage) updateData.invitationMessage = parsedJsonResult.invitationMessage;
    if (parsedJsonResult.blessingText) updateData.blessingText = parsedJsonResult.blessingText;

    if (parsedJsonResult.dressCodeTitle || parsedJsonResult.dressCodeDesc) {
      updateData.dressCode = {
        title: parsedJsonResult.dressCodeTitle || invitationData.dressCode?.title || 'Гоёлын хувцаслалт',
        description: parsedJsonResult.dressCodeDesc || invitationData.dressCode?.description || 'Тансаг хүндэтгэлийн хувцаслалт',
        colorPalette: invitationData.dressCode?.colorPalette || ['#C5A059', '#0D2B1D', '#1E1E1E']
      };
    }

    if (Array.isArray(parsedJsonResult.scheduleHighlights) && parsedJsonResult.scheduleHighlights.length > 0) {
      updateData.schedule = parsedJsonResult.scheduleHighlights;
    }

    onApplyTemplateData(updateData);
    setAppliedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md flex justify-end">
      <div className="w-full max-w-xl bg-black/80 backdrop-blur-2xl border-l border-white/15 h-full flex flex-col shadow-2xl text-slate-100 animate-in slide-in-from-right duration-300">

        {/* Drawer Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#d4af37] text-slate-950 font-bold shadow-md shadow-[#d4af37]/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-white">V2.3 Админы ИИ Туслах</h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isLimitReached ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 'bg-[#d4af37]/20 text-[#f9e5af] border-[#d4af37]/30'
                }`}>
                  Ашиглалт: {aiCallCount}/2 удаа
                </span>
              </div>
              <p className="text-xs text-[#f9e5af]/80 font-medium">Gemini 3.6 Flash (Үнэгүй загвар) • Зөвхөн Админы Туслах</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lock & Limit Notice */}
        <div className="mx-5 mt-4 p-3 rounded-2xl bg-[#d4af37]/15 border border-[#d4af37]/30 text-xs text-[#f9e5af] flex items-start gap-2.5 backdrop-blur-md">
          <Wand2 className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p>
              <strong>Гараар идэвхжүүлэх:</strong> ИИ нь автоматаар ажиллахгүй бөгөөд зөвхөн админ дарахад ажиллана. Урилга бүрт хамгийн ихдээ 2 удаа ашиглах хязгаартай.
            </p>
            {isLimitReached && (
              <p className="text-rose-300 font-bold flex items-center gap-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Энэ урилга дээр ИИ ашиглах 2 удаагийн хязгаар хүрсэн байна.
              </p>
            )}
          </div>
        </div>

        {/* Assistant Action Tabs */}
        <div className="flex items-center gap-1 px-5 pt-4 border-b border-white/10 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => { setActiveTab('template_fill'); setResultText(''); setParsedJsonResult(null); }}
            className={`px-3 py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'template_fill'
                ? 'border-[#d4af37] text-[#f9e5af] font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            1-Клик Загвар Бөглөх
          </button>
          <button
            onClick={() => { setActiveTab('grammar'); setResultText(''); setParsedJsonResult(null); }}
            className={`px-3 py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'grammar'
                ? 'border-[#d4af37] text-[#f9e5af] font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            Зөв бичих & Засах
          </button>
          <button
            onClick={() => { setActiveTab('greeting'); setResultText(''); setParsedJsonResult(null); }}
            className={`px-3 py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'greeting'
                ? 'border-[#d4af37] text-[#f9e5af] font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Мэндчилгээ
          </button>
          <button
            onClick={() => { setActiveTab('poem'); setResultText(''); setParsedJsonResult(null); }}
            className={`px-3 py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'poem'
                ? 'border-[#d4af37] text-[#f9e5af] font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            Ерөөл шүлэг
          </button>
          <button
            onClick={() => { setActiveTab('translate'); setResultText(''); setParsedJsonResult(null); }}
            className={`px-3 py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'translate'
                ? 'border-[#d4af37] text-[#f9e5af] font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            Орчуулах
          </button>
          <button
            onClick={() => { setActiveTab('shorten'); setResultText(''); setParsedJsonResult(null); }}
            className={`px-3 py-2 border-b-2 transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'shorten'
                ? 'border-[#d4af37] text-[#f9e5af] font-bold'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            Товчлох
          </button>
        </div>

        {/* Drawer Form Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">

          {/* Event Context Card */}
          <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-xs flex justify-between items-center text-white/80">
            <div>
              <span className="text-white/50">Ангилал: </span>
              <span className="text-[#f9e5af] font-bold">{currentCategory}</span>
            </div>
            <span className="text-white/50 text-[11px] font-medium">{invitationData.eventTitle}</span>
          </div>

          {/* Tone Selector */}
          {(activeTab === 'template_fill' || activeTab === 'greeting' || activeTab === 'poem') && (
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">Найруулгын аяс & Стили</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] backdrop-blur-md"
              >
                <option value="Тансаг хүндэтгэлийн ба романтик" className="bg-stone-900">Тансаг хүндэтгэлийн ба Романтик</option>
                <option value="Дулаан, чин сэтгэлийн" className="bg-stone-900">Дулаан, чин сэтгэлийн</option>
                <option value="Орчин үеийн, минималист" className="bg-stone-900">Орчин үеийн, Минималист</option>
                <option value="Ард түмний уламжлалт бэлэгдэлтэй" className="bg-stone-900">Уламжлалт бэлэгдэлтэй, Яруу</option>
                <option value="Хүндэтгэлийн албан ёсны" className="bg-stone-900">Хүндэтгэлийн Албан ёсны</option>
              </select>
            </div>
          )}

          {/* Language Selector for Translate */}
          {activeTab === 'translate' && (
            <div>
              <label className="block text-xs font-medium text-white/80 mb-1.5">Орчуулах зорилтот хэл</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37] backdrop-blur-md"
              >
                <option value="English" className="bg-stone-900">Англи хэл (English)</option>
                <option value="Mongolian" className="bg-stone-900">Монгол хэл</option>
                <option value="Japanese" className="bg-stone-900">Япон хэл (日本語)</option>
                <option value="Korean" className="bg-stone-900">Солонгос хэл (한국어)</option>
                <option value="Chinese" className="bg-stone-900">Хятад хэл (中文)</option>
              </select>
            </div>
          )}

          {/* Source Text or Instruction Input */}
          <div>
            <label className="block text-xs font-medium text-white/80 mb-1.5">
              {activeTab === 'template_fill' ? 'Эздийн нэрс болон нэмэлт чиглэл (Заавал биш)' :
               activeTab === 'grammar' ? 'Засах эх бичвэр' :
               activeTab === 'translate' ? 'Орчуулах бичвэр' :
               activeTab === 'shorten' ? 'Товчлох урт бичвэр' :
               'Нэмэлт тайлбар эсвэл тусгай зааварчилгаа (Заавал биш)'}
            </label>
            <textarea
              rows={3}
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                activeTab === 'template_fill' ? 'Жишээ нь: Батболд ба Ариунаа нарын хурим. Шангри-Ла зочид буудалд болно...' :
                activeTab === 'grammar' ? 'Зөв бичих дүрэм засах бичвэрээ энд буулгана уу...' :
                activeTab === 'translate' ? 'Орчуулах бичвэрээ энд буулгана уу...' :
                activeTab === 'shorten' ? 'Богиносгох урт урилгын текстаа буулгана уу...' :
                'Жишээ нь: Зочдод гүн хүндэтгэл үзүүлж, оройн зоогт урих...'
              }
              className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#d4af37] backdrop-blur-md"
            />
          </div>

          {/* Action Trigger Button */}
          <button
            onClick={() => {
              if (activeTab === 'template_fill') handleGenerate('template_fill');
              else if (activeTab === 'grammar') handleGenerate('grammar');
              else if (activeTab === 'greeting') handleGenerate('greeting');
              else if (activeTab === 'poem') handleGenerate('poem');
              else if (activeTab === 'translate') handleGenerate('translate');
              else if (activeTab === 'shorten') handleGenerate('shorten');
            }}
            disabled={loading || isLimitReached}
            className="w-full bg-[#d4af37] hover:bg-[#e5be48] disabled:opacity-50 text-slate-950 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#d4af37]/20 active:scale-98"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>ИИ боловсруулж байна...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>
                  {activeTab === 'template_fill' && '1-Кликээр Бүх Мэдээллийг Авто-Бөглөх'}
                  {activeTab === 'grammar' && 'Зөв бичих дүрэм & Найруулга засах'}
                  {activeTab === 'greeting' && 'Хүндэтгэлийн Мэндчилгээ бэлтгэх'}
                  {activeTab === 'poem' && 'Билигтэй Ерөөл & Шүлэг зохиох'}
                  {activeTab === 'translate' && `${targetLanguage} руу орчуулах`}
                  {activeTab === 'shorten' && 'Текстийг оновчтой товчлох'}
                </span>
              </>
            )}
          </button>

          {/* Error Notice */}
          {error && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-xl text-xs backdrop-blur-md">
              {error}
            </div>
          )}

          {/* Applied Success Notice */}
          {appliedSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs backdrop-blur-md flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Мэдээлэл урилгын редакторт амжилттай суулгагдлаа!</span>
            </div>
          )}

          {/* Generated Structured Template Data Result */}
          {parsedJsonResult && (
            <div className="mt-4 bg-black/60 border border-[#d4af37]/40 rounded-2xl p-4 relative backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold text-[#f9e5af] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" /> ИИ Загварын Бүрэн Мэдээлэл
                </span>
                <span className="text-[10px] bg-[#d4af37]/20 text-[#f9e5af] px-2 py-0.5 rounded-full font-mono">
                  1-Клик Бэлэн
                </span>
              </div>

              <div className="space-y-2 text-xs text-white/90">
                {parsedJsonResult.eventTitle && (
                  <div>
                    <span className="text-white/50 text-[11px] block">Гарчиг:</span>
                    <p className="font-bold text-[#f9e5af]">{parsedJsonResult.eventTitle}</p>
                  </div>
                )}

                {parsedJsonResult.invitationMessage && (
                  <div>
                    <span className="text-white/50 text-[11px] block">Үндсэн урилгын текст:</span>
                    <p className="bg-black/40 p-2.5 rounded-xl border border-white/10 text-[11px] whitespace-pre-wrap">{parsedJsonResult.invitationMessage}</p>
                  </div>
                )}

                {parsedJsonResult.blessingText && (
                  <div>
                    <span className="text-white/50 text-[11px] block">Ерөөл шүлэг:</span>
                    <p className="italic text-[#f9e5af]/90 bg-black/40 p-2.5 rounded-xl border border-white/10 text-[11px]">{parsedJsonResult.blessingText}</p>
                  </div>
                )}

                {parsedJsonResult.dressCodeTitle && (
                  <div>
                    <span className="text-white/50 text-[11px] block">Дресс код:</span>
                    <p className="font-semibold text-white/80">{parsedJsonResult.dressCodeTitle} - {parsedJsonResult.dressCodeDesc}</p>
                  </div>
                )}
              </div>

              {/* ONE CLICK APPLY ALL BUTTON */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={handleApplyAllTemplateFields}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Нийт Мэдээллийг Урилгад Суулгах (Apply All)</span>
                </button>
              </div>
            </div>
          )}

          {/* Generated Text Result Output */}
          {resultText && (
            <div className="mt-4 bg-black/50 border border-white/10 rounded-2xl p-4 relative backdrop-blur-md space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#f9e5af] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" /> ИИ Бэлтгэсэн Бичвэр
                </span>
                <button
                  onClick={() => copyToClipboard(resultText)}
                  className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors text-xs flex items-center gap-1"
                  title="Хуулах"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Хуулагдлаа!' : 'Хуулах'}</span>
                </button>
              </div>

              <div className="bg-black/60 p-3.5 rounded-xl border border-white/10 text-xs text-white/90 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                {resultText}
              </div>

              {/* Quick Apply Buttons to Editor Fields */}
              <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    onApplyGeneratedText('invitationMessage', resultText);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#f9e5af] rounded-lg text-xs hover:bg-[#d4af37]/30 transition-all font-semibold"
                >
                  "Урилгын эх текст" талбарт оруулах
                </button>

                <button
                  onClick={() => {
                    onApplyGeneratedText('blessingText', resultText);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-white/10 border border-white/10 text-white rounded-lg text-xs hover:bg-white/20 transition-all font-medium"
                >
                  "Ерөөлийн үг" талбарт оруулах
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
