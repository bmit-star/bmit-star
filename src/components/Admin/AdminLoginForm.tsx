import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { Lock, ShieldCheck, ArrowLeft, AlertCircle } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { authenticatedFetch } from '../../lib/authenticatedFetch';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
  onBackToLanding: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onLoginSuccess, onBackToLanding }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      const response = await authenticatedFetch('/api/auth/admin');
      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json') ? await response.json() : null;

      if (!response.ok || !data?.success) {
        await signOut(auth);
        throw new Error(data?.error || 'Админ баталгаажуулалт амжилтгүй боллоо.');
      }

      onLoginSuccess();
    } catch (err: any) {
      setError(err?.message || 'Нэвтрэх үед алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-stone-900/90 backdrop-blur-2xl rounded-3xl border border-[#d4af37]/40 p-8 shadow-2xl space-y-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#d4af37]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d4af37] via-[#f9e5af] to-[#b38b2d] flex items-center justify-center mx-auto text-slate-950 shadow-xl shadow-[#d4af37]/30 border border-amber-200/50">
            <Lock className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] bg-[#d4af37]/10 px-2.5 py-0.5 rounded-full border border-[#d4af37]/30 inline-block">Системийн удирдлага</span>
            <h2 className="text-2xl font-bold text-white font-serif tracking-tight">Администратор нэвтрэх</h2>
            <p className="text-xs text-white/60">Зөвшөөрөгдсөн Google бүртгэлээр нэвтэрнэ үү.</p>
          </div>
        </div>
        <button onClick={handleGoogleLogin} disabled={loading} className="w-full bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] text-slate-950 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#d4af37]/25 disabled:opacity-60 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>{loading ? 'Шалгаж байна…' : 'Google-ээр нэвтрэх'}</span>
        </button>
        {error && <p className="text-xs text-rose-400 font-medium flex gap-2"><AlertCircle className="w-4 h-4 shrink-0" />{error}</p>}
        <button onClick={onBackToLanding} className="w-full text-xs text-white/50 hover:text-white transition-colors flex items-center justify-center gap-1.5 py-1"><ArrowLeft className="w-3.5 h-3.5" /><span>Нүүр хуудас руу буцах</span></button>
      </div>
    </div>
  );
};
