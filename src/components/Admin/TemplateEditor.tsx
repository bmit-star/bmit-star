import React, { useState } from 'react';
import { 
  Lock, Sparkles, Save, Globe, Eye, ArrowLeft, CheckCircle2, 
  Calendar, Clock, MapPin, Music, Image as ImageIcon, Gift, 
  Users, MessageSquare, Plus, Trash2, Palette, ShieldAlert,
  Share2, QrCode, Smartphone, ExternalLink, Sliders, Layers
} from 'lucide-react';
import { Order, InvitationData, ScheduleItem, BankDetail, CustomField } from '../../types';
import { CATEGORIES, getCategoryConfig } from '../../data/categories';
import { DevicePreviewFrame } from '../Shared/DevicePreviewFrame';
import { LuxuryInvitationView } from '../Guest/LuxuryInvitationView';
import { CloudinaryService } from '../../lib/cloudinaryService';

interface TemplateEditorProps {
  order: Order;
  onSave: (updatedOrder: Order) => void;
  onPublish: (updatedOrder: Order) => void;
  onBack: () => void;
  onOpenAiAssistant: () => void;
}

export const TemplateEditor: React.FC<TemplateEditorProps> = ({
  order,
  onSave,
  onPublish,
  onBack,
  onOpenAiAssistant
}) => {
  // Determine current category name
  const initialCategoryName = order.invitationData.category || order.templateTitle || 'Хурим';
  const [invData, setInvData] = useState<InvitationData>({
    ...order.invitationData,
    category: order.invitationData.category || initialCategoryName
  });
  
  const [activeTab, setActiveTab] = useState<'content' | 'event' | 'schedule' | 'media' | 'dress' | 'toggles'>('content');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [showPublishedModal, setShowPublishedModal] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isBackgroundUploading, setIsBackgroundUploading] = useState(false);
  const [backgroundUploadError, setBackgroundUploadError] = useState('');

  // Get current category config
  const currentCategoryConfig = getCategoryConfig(invData.category || 'Хурим');

  // Helper for field change
  const handleFieldChange = (field: keyof InvitationData, value: any) => {
    setInvData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBackgroundUpload = async (file?: File) => {
    if (!file) return;

    setIsBackgroundUploading(true);
    setBackgroundUploadError('');
    const result = await CloudinaryService.uploadImage(file, order.id);
    setIsBackgroundUploading(false);

    if (!result.success) {
      setBackgroundUploadError(result.error || 'Дэвсгэр зургийг хадгалж чадсангүй.');
      return;
    }

    handleFieldChange('backgroundImageUrl', result.url);
  };

  // Helper for Category change
  const handleCategoryChange = (newCatName: string) => {
    const config = getCategoryConfig(newCatName);
    setInvData(prev => ({
      ...prev,
      category: config.name
    }));
  };

  // Custom fields management for "Бусад"
  const handleAddCustomField = () => {
    const newField: CustomField = {
      id: Date.now().toString(),
      label: 'Нэмэлт Талбар',
      value: ''
    };
    setInvData(prev => ({
      ...prev,
      customFields: [...(prev.customFields || []), newField]
    }));
  };

  const handleUpdateCustomField = (id: string, key: 'label' | 'value', val: string) => {
    const updated = (invData.customFields || []).map(f => {
      if (f.id === id) {
        return { ...f, [key]: val };
      }
      return f;
    });
    setInvData(prev => ({ ...prev, customFields: updated }));
  };

  const handleRemoveCustomField = (id: string) => {
    const updated = (invData.customFields || []).filter(f => f.id !== id);
    setInvData(prev => ({ ...prev, customFields: updated }));
  };

  // Schedule management
  const handleAddScheduleItem = () => {
    const newItem: ScheduleItem = {
      time: '06:00 PM',
      title: 'New Program Stage',
      description: 'Program description'
    };
    setInvData(prev => ({
      ...prev,
      schedule: [...(prev.schedule || []), newItem]
    }));
  };

  const handleUpdateScheduleItem = (index: number, key: keyof ScheduleItem, val: string) => {
    const updated = [...(invData.schedule || [])];
    updated[index] = { ...updated[index], [key]: val };
    setInvData(prev => ({ ...prev, schedule: updated }));
  };

  const handleRemoveScheduleItem = (index: number) => {
    const updated = (invData.schedule || []).filter((_, i) => i !== index);
    setInvData(prev => ({ ...prev, schedule: updated }));
  };

  // Bank details management
  const handleAddBankDetail = () => {
    const newBank: BankDetail = {
      bankName: 'New Bank Name',
      accountNumber: '0000-0000-0000',
      accountName: invData.brideName || 'Account Holder'
    };
    setInvData(prev => ({
      ...prev,
      giftInfo: {
        ...prev.giftInfo,
        bankDetails: [...(prev.giftInfo?.bankDetails || []), newBank]
      }
    }));
  };

  const handleUpdateBankDetail = (index: number, key: keyof BankDetail, val: string) => {
    const banks = [...(invData.giftInfo?.bankDetails || [])];
    banks[index] = { ...banks[index], [key]: val };
    setInvData(prev => ({
      ...prev,
      giftInfo: { ...prev.giftInfo, bankDetails: banks }
    }));
  };

  const handleRemoveBankDetail = (index: number) => {
    const banks = (invData.giftInfo?.bankDetails || []).filter((_, i) => i !== index);
    setInvData(prev => ({
      ...prev,
      giftInfo: { ...prev.giftInfo, bankDetails: banks }
    }));
  };

  // Save changes
  const handleSaveDraft = () => {
    const updatedOrder: Order = {
      ...order,
      invitationData: invData,
      status: order.status === 'New' ? 'In Preparation' : order.status
    };
    onSave(updatedOrder);
  };

  // Publish
  const handlePublishClick = () => {
    const updatedOrder: Order = {
      ...order,
      invitationData: invData,
      status: 'Published'
    };
    onPublish(updatedOrder);
    setShowPublishedModal(true);
  };

  const generatedUrl = `${window.location.origin}/invitation/${order.uniqueSlug}`;

  return (
    <div className="flex flex-col h-full bg-black/90 text-slate-100 min-h-screen">
      
      {/* Editor Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 sticky top-[57px] z-30 shadow-2xl">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5 text-xs font-medium backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>
          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-semibold text-base text-white">{order.templateTitle}</h2>
              <span className="text-[11px] bg-white/10 text-[#f9e5af] px-2 py-0.5 rounded-full font-mono border border-white/10 backdrop-blur-sm">
                {order.orderNumber}
              </span>
            </div>
            <p className="text-xs text-white/50">
              Preparing for <strong className="text-[#f9e5af] font-normal">{order.customerName}</strong>
            </p>
          </div>
        </div>

        {/* Editor Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-[#f9e5af] border border-[#d4af37]/30 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37] animate-pulse" />
            <span>AI Copilot</span>
          </button>

          <button
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white border border-white/10 px-4 py-2 rounded-xl text-xs font-semibold transition-all backdrop-blur-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublishClick}
            className="flex items-center gap-1.5 bg-[#d4af37] hover:bg-[#e5be48] text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-[#d4af37]/20 active:scale-95"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Publish Invitation</span>
          </button>
        </div>
      </div>

      {/* STRICT DESIGN LOCK BANNER */}
      <div className="bg-[#d4af37]/15 backdrop-blur-md border-b border-[#d4af37]/30 px-6 py-2.5 flex items-center justify-between text-xs text-[#f9e5af]">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#d4af37] shrink-0" />
          <span>
            <strong>Restricted Template Mode:</strong> Administrator can only edit dynamic data & toggle options. Core layout, CSS structure, and animations are strictly preserved.
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-[#d4af37]/20 border border-[#d4af37]/30 text-[#f9e5af] px-2 py-0.5 rounded-full">
          Layout Locked
        </span>
      </div>

      {/* Main Split Layout: Editor Form (Left) vs Live Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 gap-6 p-6 overflow-hidden">
        
        {/* LEFT COLUMN: Restricted Form Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 p-2 bg-black/40 backdrop-blur-md border-b border-white/10 overflow-x-auto text-xs font-medium">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'content' ? 'bg-[#d4af37] text-slate-950 font-bold shadow-md shadow-[#d4af37]/20' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Couple & Text</span>
            </button>
            <button
              onClick={() => setActiveTab('event')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'event' ? 'bg-[#d4af37] text-slate-950 font-bold shadow-md shadow-[#d4af37]/20' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Event & Venue</span>
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'schedule' ? 'bg-[#d4af37] text-slate-950 font-bold shadow-md shadow-[#d4af37]/20' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Program</span>
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'media' ? 'bg-[#d4af37] text-slate-950 font-bold shadow-md shadow-[#d4af37]/20' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photos & Video</span>
            </button>
            <button
              onClick={() => setActiveTab('dress')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'dress' ? 'bg-[#d4af37] text-slate-950 font-bold shadow-md shadow-[#d4af37]/20' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Dress Code</span>
            </button>
            <button
              onClick={() => setActiveTab('toggles')}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'toggles' ? 'bg-[#d4af37] text-slate-950 font-bold shadow-md shadow-[#d4af37]/20' : 'text-white/50 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Features & Music</span>
            </button>
          </div>

          {/* Form Fields Area */}
          <div className="p-6 overflow-y-auto max-h-[700px] space-y-5 text-xs">
            
            {/* Category Selector Banner */}
            <div className="p-4 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-[#d4af37]/30 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentCategoryConfig.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#f9e5af]">Сонгогдсон Ангилал:</span>
                    <span className="text-xs font-extrabold text-white bg-black/60 px-2.5 py-0.5 rounded-lg border border-[#d4af37]/40">
                      {currentCategoryConfig.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">{currentCategoryConfig.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-[11px] text-white/50 whitespace-nowrap">Ангилал солих:</label>
                <select
                  value={invData.category || 'Хурим'}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-black/80 border border-[#d4af37]/40 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#d4af37] w-full sm:w-auto font-medium"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.name} className="bg-slate-900 text-white">
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* TAB 1: Category Content Fields */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                <div className="text-[11px] font-semibold text-[#f9e5af] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>"{currentCategoryConfig.name}" Ангилалд Шаардлагатай Талбарууд</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentCategoryConfig.requiredFields.map((field) => {
                    // Skip schedule, map, gallery, music, toggle in content tab as they have dedicated tabs
                    if (['schedule', 'map', 'gallery', 'music', 'toggle', 'dresscode'].includes(field.type)) {
                      return null;
                    }

                    if (field.type === 'customFields') {
                      return (
                        <div key="custom-fields-block" className="col-span-full space-y-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-xs">Админы Дурын Динамик Талбарууд ("Бусад")</span>
                            <button
                              onClick={handleAddCustomField}
                              className="px-3 py-1.5 bg-[#d4af37] text-slate-950 font-bold text-xs rounded-xl hover:bg-[#e5be48] transition-all flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Шинэ Талбар Нэмэх</span>
                            </button>
                          </div>

                          {(invData.customFields || []).length === 0 ? (
                            <p className="text-white/40 italic text-[11px]">Одоогоор нэмэлт талбар байхгүй байна. "Шинэ Талбар Нэмэх" товч дээр дарна уу.</p>
                          ) : (
                            (invData.customFields || []).map((cf) => (
                              <div key={cf.id} className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={cf.label}
                                  onChange={(e) => handleUpdateCustomField(cf.id, 'label', e.target.value)}
                                  placeholder="Талбарын нэр"
                                  className="w-1/3 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={cf.value}
                                  onChange={(e) => handleUpdateCustomField(cf.id, 'value', e.target.value)}
                                  placeholder="Талбарын утга"
                                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-white focus:border-[#d4af37] focus:outline-none"
                                />
                                <button
                                  onClick={() => handleRemoveCustomField(cf.id)}
                                  className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      );
                    }

                    const isTextArea = field.type === 'textarea';
                    const fieldValue = (invData as any)[field.key] || '';

                    return (
                      <div key={field.key} className={isTextArea ? 'col-span-full' : ''}>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-white/90 font-semibold text-xs">
                            {field.label} {field.required && <span className="text-amber-400">*</span>}
                          </label>
                          {isTextArea && (
                            <button
                              onClick={onOpenAiAssistant}
                              className="text-[#f9e5af] hover:underline text-[11px] flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-[#d4af37]" /> AI Туслах
                            </button>
                          )}
                        </div>

                        {isTextArea ? (
                          <textarea
                            rows={3}
                            value={fieldValue}
                            onChange={(e) => handleFieldChange(field.key as keyof InvitationData, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37] focus:outline-none leading-relaxed backdrop-blur-md placeholder-white/30"
                          />
                        ) : (
                          <input
                            type="text"
                            value={fieldValue}
                            onChange={(e) => handleFieldChange(field.key as keyof InvitationData, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Event & Venue */}
            {activeTab === 'event' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 font-medium mb-1">Event Date</label>
                    <input
                      type="text"
                      value={invData.date}
                      onChange={(e) => handleFieldChange('date', e.target.value)}
                      placeholder="e.g. Saturday, August 15, 2026"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 font-medium mb-1">Event Time</label>
                    <input
                      type="text"
                      value={invData.time}
                      onChange={(e) => handleFieldChange('time', e.target.value)}
                      placeholder="e.g. 04:00 PM - 10:00 PM"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Venue / Location Name</label>
                  <input
                    type="text"
                    value={invData.locationName}
                    onChange={(e) => handleFieldChange('locationName', e.target.value)}
                    placeholder="e.g. The Grand Palm Ballroom, Ritz Carlton"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Full Address</label>
                  <input
                    type="text"
                    value={invData.address}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                    placeholder="e.g. 9291 Wilshire Blvd, Beverly Hills, CA 90210"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Google Maps Embed URL</label>
                  <input
                    type="text"
                    value={invData.googleMapsEmbedUrl || ''}
                    onChange={(e) => handleFieldChange('googleMapsEmbedUrl', e.target.value)}
                    placeholder="e.g. https://www.google.com/maps/embed?pb=..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none font-mono text-[11px] backdrop-blur-md placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Google Maps Direct Directions Link</label>
                  <input
                    type="text"
                    value={invData.googleMapsDirectUrl || ''}
                    onChange={(e) => handleFieldChange('googleMapsDirectUrl', e.target.value)}
                    placeholder="e.g. https://maps.google.com/?q=..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none font-mono text-[11px] backdrop-blur-md placeholder-white/30"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Schedule / Program */}
            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-white">Event Program & Timeline</h4>
                  <button
                    onClick={handleAddScheduleItem}
                    className="bg-[#d4af37]/20 text-[#f9e5af] hover:bg-[#d4af37]/30 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-all border border-[#d4af37]/30"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#d4af37]" /> Add Program Item
                  </button>
                </div>

                {(invData.schedule || []).map((item, idx) => (
                  <div key={idx} className="bg-black/40 backdrop-blur-md p-3.5 rounded-xl border border-white/10 space-y-2 relative group">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-28 shrink-0">
                        <input
                          type="text"
                          value={item.time}
                          onChange={(e) => handleUpdateScheduleItem(idx, 'time', e.target.value)}
                          placeholder="04:00 PM"
                          className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-mono text-xs focus:border-[#d4af37] focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleUpdateScheduleItem(idx, 'title', e.target.value)}
                        placeholder="Stage Title"
                        className="flex-1 bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white font-semibold text-xs focus:border-[#d4af37] focus:outline-none"
                      />
                      <button
                        onClick={() => handleRemoveScheduleItem(idx)}
                        className="p-1.5 text-white/40 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => handleUpdateScheduleItem(idx, 'description', e.target.value)}
                      placeholder="Optional details or instructions for guests..."
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-white/80 text-[11px] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: Media */}
            {activeTab === 'media' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 font-medium mb-1">
                    Hero Image URL (Google Drive эсвэл шууд зургийн линк)
                  </label>
                  <input
                    type="text"
                    value={invData.heroPhotoUrl}
                    onChange={(e) => handleFieldChange('heroPhotoUrl', e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none font-mono text-[11px] backdrop-blur-md"
                  />
                  {invData.heroPhotoUrl && (
                    <img
                      src={invData.heroPhotoUrl}
                      alt="Hero Preview"
                      className="mt-2 h-32 w-full object-cover rounded-xl border border-white/10"
                    />
                  )}
                </div>

                <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/5 p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#f9e5af]">Урилгын бүтэн дэвсгэр</h4>
                    <p className="text-[11px] text-white/55 mt-1">Энэ зураг hero-оос бусад бүх section-ийн ард харагдана. Шууд image URL эсвэл Cloudinary URL оруулна уу.</p>
                  </div>
                  <label className="block rounded-xl border border-dashed border-white/20 bg-black/20 px-3 py-2.5 text-center text-xs text-white/70 cursor-pointer hover:border-[#d4af37]/60 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleBackgroundUpload(e.target.files?.[0])} />
                    {isBackgroundUploading ? 'Cloudinary руу хадгалж байна…' : 'Зураг сонгож Cloudinary руу байрлуулах'}
                  </label>
                  {backgroundUploadError && <p className="text-xs text-rose-300">{backgroundUploadError}</p>}
                  <input
                    type="url"
                    value={invData.backgroundImageUrl || ''}
                    onChange={(e) => handleFieldChange('backgroundImageUrl', e.target.value)}
                    placeholder="https://res.cloudinary.com/.../background.jpg"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none font-mono text-[11px]"
                  />
                  {invData.backgroundImageUrl && <img src={invData.backgroundImageUrl} alt="Background preview" className="h-28 w-full rounded-xl border border-white/10 object-cover" />}
                  <div className="grid grid-cols-2 gap-3">
                    <label className="text-[11px] text-white/70 space-y-1">Position
                      <select value={invData.backgroundPosition || 'center top'} onChange={(e) => handleFieldChange('backgroundPosition', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-white">
                        <option value="center top">Дээд гол</option><option value="center center">Төв</option><option value="center bottom">Доод гол</option><option value="left top">Зүүн дээд</option><option value="right top">Баруун дээд</option>
                      </select>
                    </label>
                    <label className="text-[11px] text-white/70 space-y-1">Image fit
                      <select value={invData.backgroundSize || 'cover'} onChange={(e) => handleFieldChange('backgroundSize', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-white">
                        <option value="cover">Бүтэн дүүргэх</option><option value="contain">Бүтнээр харуулах</option><option value="auto">Original хэмжээ</option>
                      </select>
                    </label>
                    <label className="text-[11px] text-white/70 space-y-1">Scroll effect
                      <select value={invData.backgroundAttachment || 'fixed'} onChange={(e) => handleFieldChange('backgroundAttachment', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-white">
                        <option value="fixed">Дэлгэцэнд тогтоох</option><option value="scroll">Контенттой хамт гүйлгэх</option>
                      </select>
                    </label>
                    <label className="text-[11px] text-white/70 space-y-1">Repeat
                      <select value={invData.backgroundRepeat || 'no-repeat'} onChange={(e) => handleFieldChange('backgroundRepeat', e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-2 text-white">
                        <option value="no-repeat">Давтахгүй</option><option value="repeat">Давтах</option><option value="repeat-y">Босоогоор давтах</option>
                      </select>
                    </label>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-3 items-center">
                    <input type="color" value={invData.backgroundOverlayColor || '#0c0a09'} onChange={(e) => handleFieldChange('backgroundOverlayColor', e.target.value)} className="w-10 h-10 rounded-lg cursor-pointer bg-black/40 border border-white/10 p-1" aria-label="Overlay color" />
                    <label className="text-[11px] text-white/70">Overlay darkness: {invData.backgroundOverlayOpacity ?? 20}%
                      <input type="range" min="0" max="90" step="5" value={invData.backgroundOverlayOpacity ?? 20} onChange={(e) => handleFieldChange('backgroundOverlayOpacity', Number(e.target.value))} className="w-full accent-[#d4af37]" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Gallery Photo URLs (Comma-separated)</label>
                  <textarea
                    rows={3}
                    value={(invData.couplePhotos || []).join('\n')}
                    onChange={(e) => handleFieldChange('couplePhotos', e.target.value.split('\n').filter(s => s.trim().length > 0))}
                    placeholder="Paste photo URLs, one per line..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-mono text-[11px] focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Video / Pre-wedding Teaser Embed URL</label>
                  <input
                    type="text"
                    value={invData.videoUrl || ''}
                    onChange={(e) => handleFieldChange('videoUrl', e.target.value)}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none font-mono text-[11px] backdrop-blur-md placeholder-white/30"
                  />
                </div>
              </div>
            )}

            {/* TAB 5: Dress Code */}
            {activeTab === 'dress' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 font-medium mb-1">Dress Code Title</label>
                  <input
                    type="text"
                    value={invData.dressCode?.title || ''}
                    onChange={(e) => handleFieldChange('dressCode', { ...invData.dressCode, title: e.target.value })}
                    placeholder="e.g. Black Tie Elegance"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Dress Code Description & Guidance</label>
                  <textarea
                    rows={3}
                    value={invData.dressCode?.description || ''}
                    onChange={(e) => handleFieldChange('dressCode', { ...invData.dressCode, description: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Recommended Color Swatches (Comma-separated Hex Codes)</label>
                  <input
                    type="text"
                    value={(invData.dressCode?.colorPalette || []).join(', ')}
                    onChange={(e) => handleFieldChange('dressCode', {
                      ...invData.dressCode,
                      colorPalette: e.target.value.split(',').map(s => s.trim())
                    })}
                    placeholder="#0D2B1D, #C5A059, #1E1E1E, #FDF8F0"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    {(invData.dressCode?.colorPalette || []).map((color, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Features & Theme Colors */}
            {activeTab === 'toggles' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 font-medium mb-1">Primary Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={invData.themeColor || '#C5A059'}
                        onChange={(e) => handleFieldChange('themeColor', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-black/40 border border-white/10 p-1"
                      />
                      <input
                        type="text"
                        value={invData.themeColor || '#C5A059'}
                        onChange={(e) => handleFieldChange('themeColor', e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono uppercase text-xs backdrop-blur-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 font-medium mb-1">Secondary Theme Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={invData.secondaryColor || '#0D2B1D'}
                        onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer bg-black/40 border border-white/10 p-1"
                      />
                      <input
                        type="text"
                        value={invData.secondaryColor || '#0D2B1D'}
                        onChange={(e) => handleFieldChange('secondaryColor', e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white font-mono uppercase text-xs backdrop-blur-md"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">Background Music Title</label>
                  <input
                    type="text"
                    value={invData.backgroundMusicTitle || ''}
                    onChange={(e) => handleFieldChange('backgroundMusicTitle', e.target.value)}
                    placeholder="e.g. Canon in D Major - Piano"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-medium mb-1">
                    Background Music (YouTube Video Link эсвэл MP3 URL)
                  </label>
                  <input
                    type="text"
                    value={invData.backgroundMusicUrl || ''}
                    onChange={(e) => handleFieldChange('backgroundMusicUrl', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... эсвэл MP3 линк"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-white font-mono text-[11px] focus:border-[#d4af37] focus:outline-none backdrop-blur-md placeholder-white/30"
                  />
                  <p className="text-[10px] text-[#f9e5af]/70 mt-1">
                    * YouTube линк тавихад автоматаар хөгжмийг ард тоглуулна.
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10 space-y-3">
                  <h4 className="font-semibold text-white">Optional Section Toggles</h4>

                  {[
                    { key: 'showCountdown', label: 'Countdown Timer to Event' },
                    { key: 'showMusicPlayer', label: 'Floating Background Music Player' },
                    { key: 'showGallery', label: 'Interactive Photo Gallery' },
                    { key: 'showRsvp', label: 'Guest RSVP Form' },
                    { key: 'showGuestBook', label: 'Guest Book & Wishes' },
                    { key: 'showQrCode', label: 'QR Code Share Badge' },
                    { key: 'showLiveStream', label: 'Live Stream Player' }
                  ].map((toggle) => (
                    <div key={toggle.key} className="flex items-center justify-between bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
                      <span className="text-white/80 font-medium">{toggle.label}</span>
                      <input
                        type="checkbox"
                        checked={Boolean((invData as any)[toggle.key])}
                        onChange={(e) => handleFieldChange(toggle.key as keyof InvitationData, e.target.checked)}
                        className="w-4 h-4 accent-[#d4af37] rounded cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Preview (5 cols) */}
        <div className="lg:col-span-5 h-full flex flex-col">
          <DevicePreviewFrame
            deviceMode={previewMode}
            onDeviceModeChange={setPreviewMode}
            title={`Previewing: ${invData.brideName} & ${invData.groomName}`}
          >
            <LuxuryInvitationView
              invitationData={invData}
              isPreviewMode={true}
            />
          </DevicePreviewFrame>
        </div>

      </div>

      {/* PUBLISHED SUCCESS MODAL */}
      {showPublishedModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-black/70 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 max-w-lg w-full text-slate-100 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-xl font-bold text-white">Invitation Published Successfully!</h3>
              <p className="text-xs text-white/60">
                Unique URL and QR Code generated. Ready to share with customer <strong className="text-[#f9e5af]">{order.customerName}</strong>.
              </p>
            </div>

            {/* Generated Unique URL Box */}
            <div className="bg-black/40 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-2">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/50">Unique Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  className="bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-[#f9e5af] flex-1 select-all outline-none"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedUrl);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="bg-[#d4af37] text-slate-950 font-bold px-3 py-2 rounded-xl text-xs hover:bg-[#e5be48] transition-all shrink-0 shadow-md shadow-[#d4af37]/20"
                >
                  {copiedLink ? 'Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* QR Code Container */}
            <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex flex-col items-center justify-center gap-3 text-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generatedUrl)}`}
                alt="Generated QR Code"
                className="w-36 h-36 rounded-xl border border-white/20 p-2 bg-white"
              />
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(generatedUrl)}`}
                download="Invitation_QR_Code.png"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-[#f9e5af] hover:underline flex items-center gap-1 font-medium"
              >
                <QrCode className="w-3.5 h-3.5 text-[#d4af37]" /> Download QR Code PNG
              </a>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowPublishedModal(false);
                  onBack();
                }}
                className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors backdrop-blur-md"
              >
                Return to Orders Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
