import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TemplateEditor } from '../../modules/admin';
import { Order } from '../../types';

interface AdminEditorPageProps {
  orders: Order[];
  onSaveOrder: (updatedOrder: Order) => void;
  onPublishOrder: (updatedOrder: Order) => void;
  onOpenAiAssistant?: () => void;
}

export const AdminEditorPage: React.FC<AdminEditorPageProps> = ({
  orders,
  onSaveOrder,
  onPublishOrder,
  onOpenAiAssistant
}) => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const editingOrder = orders.find(o => o.id === orderId);

  if (!editingOrder) {
    return (
      <div className="bg-stone-900/90 border border-white/10 rounded-3xl p-12 text-center text-slate-400 space-y-4">
        <p className="text-sm">Сонгосон захиалга олдсонгүй (ID: {orderId})</p>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 bg-[#d4af37] text-slate-950 font-bold rounded-xl text-xs"
        >
          Захиалгын жагсаалт руу буцах
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <TemplateEditor
        order={editingOrder}
        onSave={onSaveOrder}
        onPublish={onPublishOrder}
        onBack={() => navigate('/admin/orders')}
        onOpenAiAssistant={onOpenAiAssistant}
      />
    </div>
  );
};

export default AdminEditorPage;
