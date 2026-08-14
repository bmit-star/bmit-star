import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateLibrary } from '../../modules/admin';
import { Template, Order } from '../../types';
import { generateSecureSlug } from '../../lib/storage';

interface AdminTemplatesPageProps {
  templates: Template[];
  orders: Order[];
  onCreateOrder: (newOrder: Order) => void;
}

export const AdminTemplatesPage: React.FC<AdminTemplatesPageProps> = ({
  templates,
  orders,
  onCreateOrder
}) => {
  const navigate = useNavigate();

  const handleUseTemplate = (template: Template) => {
    const newOrderNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = generateSecureSlug();

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: newOrderNumber,
      customerName: 'Шинэ Захиалагч',
      customerEmail: 'client@example.mn',
      customerPhone: '+976 9900-0000',
      templateId: template.id,
      templateTitle: template.title,
      status: 'In Preparation',
      createdAt: new Date().toISOString(),
      uniqueSlug: slug,
      viewsCount: 0,
      changeRequests: [],
      invitationData: {
        brideName: 'Сүйт бүсгүй',
        groomName: 'Сүйт залуу',
        brideParents: 'Сүйт бүсгүйн эцэг эхийн гэр бүл',
        groomParents: 'Сүйт залуугийн эцэг эхийн гэр бүл',
        eventTitle: `Хуримын баяр - ${template.title}`,
        invitationMessage: 'Эцэг эхийн нэрэмжит хуримын баярт маань хүрэлцэн ирж, залуу хосод сэтгэлийн ерөөлөө өргөхийг урьж байна.',
        blessingText: '“Хоёр сэтгэл нэгдэж, нэгэн гал голомт бадрах болтугай.”',
        date: '2026 оны 8 сарын 15-ны Бямба гараг',
        time: '16:00 цагт',
        locationName: 'Шангри-Ла Улаанбаатар, Их Танхим',
        address: 'Сүхбаатар дүүрэг, Олимпийн гудамж 19',
        heroPhotoUrl: template.thumbnail,
        couplePhotos: [template.thumbnail],
        themeColor: template.sampleData?.themeColor || '#C5A059',
        secondaryColor: template.sampleData?.secondaryColor || '#0D2B1D',
        backgroundMusicTitle: template.musicTitle,
        backgroundMusicUrl: template.musicUrl,
        schedule: [
          { time: '16:00', title: 'Зочдыг угтан авах' },
          { time: '18:00', title: 'Хүндэтгэлийн зоог & Тоглолт' }
        ],
        dressCode: {
          title: 'Үдэшлэгийн гоёлын хувцас / Дээл',
          description: 'Алтлаг, хар, цагаан болон бараан өнгийн гоёлын хувцас.',
          colorPalette: ['#C5A059', '#0D2B1D', '#1E1E1E']
        },
        giftInfo: {
          enabled: true,
          qpayMerchantName: 'Хуримын Бэлгийн Данс',
          qpayQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QPay-Fund',
          bankDetails: [
            { bankName: 'Хаан Банк', accountNumber: '5000000000', accountName: 'Залуу хос' }
          ]
        },
        showCountdown: true,
        showMusicPlayer: true,
        showGallery: true,
        showQrCode: true,
        showRsvp: true,
        showGuestBook: true,
        showLiveStream: false,
        rsvps: [],
        wishes: []
      }
    };

    onCreateOrder(newOrder);
    navigate(`/admin/editor/${newOrder.id}`);
  };

  return (
    <div className="space-y-6">
      <TemplateLibrary
        templates={templates}
        orders={orders}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  );
};

export default AdminTemplatesPage;
