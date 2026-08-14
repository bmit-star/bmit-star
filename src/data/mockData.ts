import { Template, Order, Customer } from '../types';
import { ALL_39_TEMPLATES } from './templatesData';

export const INITIAL_TEMPLATES: Template[] = ALL_39_TEMPLATES;

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'INV-2026-8901',
    customerName: 'Бат-Эрдэнэ & Анужин',
    customerEmail: 'ctsmanager.01@gmail.com',
    customerPhone: '+976 9911-2233',
    templateId: 'tmpl-1',
    templateTitle: 'Тансаг Эрдэнийн Ногоон Аялгуу',
    status: 'Published',
    createdAt: '2026-07-20T10:30:00Z',
    uniqueSlug: 'bat-erdene-and-anujin-2026',
    viewsCount: 248,
    changeRequests: [
      {
        id: 'cr-1',
        requestedAt: '2026-07-22T14:10:00Z',
        note: 'Хүлээн авалт эхлэх цагийг 18:00 байсныг 18:30 болгож өөрчилж өгнө үү.',
        status: 'Applied',
        adminResponse: 'Админ амжилттай засаж шинэчиллээ.'
      }
    ],
    invitationData: {
      brideName: 'Анужин',
      groomName: 'Бат-Эрдэнэ',
      brideParents: 'Д.Ганбаатар & Н.Оюунчимэг нарын гэр бүл',
      groomParents: 'А.Баатар & Ц.Цэцэгмаа нарын гэр бүл',
      eventTitle: 'Бат-Эрдэнэ ба Анужин нарын хуримын баяр',
      invitationMessage: 'Эцэг эхийнхээ буянд өсөж, эрдэм мэдлэгт шамдан суралцсан залуус хоёр биедээ сэтгэл өгч, гал голомтоо бадрааж буй хуримын баярт маань хүрэлцэн ирж, ерөөлийн цээжийг дэлгэн хамтдаа баярлахыг хүндэтгэн урьж байна.',
      blessingText: '“Хоёр сэтгэл нэгдэж, нэгэн гал голомт бадрах болтугай.”',
      date: '2026 оны 8 сарын 15-ны Бямба гараг',
      time: '16:00 - 22:00 цагт',
      locationName: 'Шангри-Ла Улаанбаатар, Их Танхим',
      address: 'Улаанбаатар хот, Сүхбаатар дүүрэг, Олимпийн гудамж-19',
      googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2673.8115201844284!2d106.917!3d47.917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5d96924e2e283f3d%3A0x8f2d8a39151e0638!2sShangri-La%20Ulaanbaatar!5e0!3m2!1smn!2smn!4v1620000000000!5m2!1smn!2smn',
      googleMapsDirectUrl: 'https://maps.google.com/?q=Shangri-La+Hotel+Ulaanbaatar',
      heroPhotoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      couplePhotos: [
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
      ],
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      themeColor: '#C5A059',
      secondaryColor: '#0D2B1D',
      backgroundMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
      backgroundMusicTitle: 'Канон Д мажор - Төгөлдөр хуур',
      schedule: [
        { time: '16:00', title: 'Зочдыг угтан авах ёслол', description: 'Хүндэт зочид цугларах, тавтай морилно уу.' },
        { time: '17:00', title: 'Бөгж солилцох ба Номын ёслол', description: 'Бат оршил ерөөл ба хуримын бөгж солилцох.' },
        { time: '18:30', title: 'Хүндэтгэлийн зоог ба Баярын тоглолт', description: 'Зоог барих, урлагийн тоглолт, урмын үгс.' },
        { time: '20:30', title: 'Хуримын торт зүсэх ёслол', description: 'Залуусын баярын торт зүсэх болон вальс бүжиг.' },
        { time: '21:30', title: 'Баярын үдэшлэг & Салют', description: 'Хамтдаа бүжиглэж баярлах агшин.' }
      ],
      dressCode: {
        title: 'Тансаг Үдэшлэгийн Хувцас',
        description: 'Эрэгтэй: Костюм пиджак эсвэл Монгол дээл. Эмэгтэй: Гоёлын даашинз эсвэл Тансаг дээл.',
        colorPalette: ['#0D2B1D', '#C5A059', '#1E1E1E', '#FDF8F0']
      },
      giftInfo: {
        enabled: true,
        qpayMerchantName: 'Бат-Эрдэнэ & Анужин Хуримын Данс',
        qpayQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QPay-BatErdene-Anujin',
        bankDetails: [
          { bankName: 'Хаан Банк', accountNumber: '5001234567', accountName: 'Бат-Эрдэнэ' },
          { bankName: 'Голомт Банк', accountNumber: '1105009876', accountName: 'Анужин' }
        ],
        message: 'Та бүхний маань хүрэлцэн ирэх нь бидний хамгийн том бэлэг юм. Хэрэв та залуу хосод бэлэг дурсгал илгээхийг хүсвэл QPay болон банкны дансаар бэлэг барих боломжтой.',
        wishlistUrl: ''
      },
      showCountdown: true,
      showMusicPlayer: true,
      showGallery: true,
      showQrCode: true,
      showRsvp: true,
      showGuestBook: true,
      showLiveStream: true,
      liveStreamUrl: 'https://www.youtube.com/embed/live_stream_placeholder',
      rsvps: [
        {
          id: 'rsvp-1',
          guestName: 'Б.Ганзориг гэр бүлийн хамт',
          phone: '9900-1122',
          attendance: 'attending',
          guestCount: 2,
          mealPreference: 'Үхрийн махан зоог',
          note: 'Баяр дээр нь баяр нэмэхээр заавал очино!',
          submittedAt: '2026-07-21T18:30:00Z'
        },
        {
          id: 'rsvp-2',
          guestName: 'М.Энхжин',
          phone: '8811-3344',
          attendance: 'attending',
          guestCount: 1,
          mealPreference: 'Цагаан хоол',
          note: 'Хоёр залуудаа баяр хүргэе!',
          submittedAt: '2026-07-22T09:15:00Z'
        }
      ],
      wishes: [
        {
          id: 'wish-1',
          guestName: 'Д.Баярмаа',
          message: 'Залуу хосдоо аз жаргал, хамгийн сайн сайхан бүхнийг хүсэн ерөөе! Газар шиг бат оршиж, тэнгэр шиг уудам сэтгэлээр бие биенээ хайрлаж яваарай.',
          submittedAt: '2026-07-21T19:00:00Z'
        },
        {
          id: 'wish-2',
          guestName: 'С.Болд ба гэр бүл',
          message: 'Аз жаргалтай сайхан гэр бүл болоорой! Урилга үнэхээр тансаг, гоёмсог болсон байна.',
          submittedAt: '2026-07-23T11:45:00Z'
        }
      ]
    }
  },
  {
    id: 'ord-102',
    orderNumber: 'INV-2026-8902',
    customerName: 'Тэмүүлэн & Энхжин',
    customerEmail: 'temuulen@example.mn',
    customerPhone: '+976 9900-8877',
    templateId: 'tmpl-2',
    templateTitle: 'Шампань Алтан Минимал',
    status: 'Ready for Preview',
    createdAt: '2026-07-24T15:20:00Z',
    uniqueSlug: 'temuulen-and-enkhjin-preview',
    viewsCount: 32,
    changeRequests: [
      {
        id: 'cr-2',
        requestedAt: '2026-07-25T11:00:00Z',
        note: 'Дээд хэсэгт эцэг эхийн нэрсийг нэмж оруулах боломжтой юу?',
        status: 'Pending'
      }
    ],
    invitationData: {
      brideName: 'Энхжин',
      groomName: 'Тэмүүлэн',
      brideParents: 'С.Батбаатар & Ж.Уранчимэг',
      groomParents: 'Т.Лхагвасүрэн & Д.Алтанцэцэг',
      eventTitle: 'Тэмүүлэн & Энхжин нарын баярын өдөр',
      invitationMessage: 'Баяр хөөрт сэтгэлээр Тэмүүлэн, Энхжин нар таныг хуримын ёслолын баяртаа хүрэлцэн ирэхийг урьж байна.',
      blessingText: '“Хайрлах ба хайрлуулах нь амьдралын хамгийн том аз жаргал юм.”',
      date: '2026 оны 9 сарын 20-ны Ням гараг',
      time: '15:30 цагт',
      locationName: 'Тэрэлж Боргио Амралт, Шиликэн Танхим',
      address: 'Төв аймаг, Эрдэнэ сум, Тэрэлж байгалийн цогцолборт газар',
      googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d107.45!3d47.98',
      googleMapsDirectUrl: 'https://maps.google.com/?q=Terelj+Resort',
      heroPhotoUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      couplePhotos: [
        'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
      ],
      themeColor: '#C5A059',
      secondaryColor: '#2B2620',
      backgroundMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8ad6656.mp3',
      backgroundMusicTitle: 'Мянган жил - Морин хийл',
      schedule: [
        { time: '15:30', title: 'Зочид суудалдаа суух' },
        { time: '16:00', title: 'Ил задгай байгаль дээрх ёслол' },
        { time: '18:00', title: 'Нар жаргах агшны зоог' }
      ],
      dressCode: {
        title: 'Минимал Байгалийн Өнгө',
        description: 'Шаргал, элсэн шаргал, крем болон цагаан өнгийн зохицол.',
        colorPalette: ['#C5A059', '#E8D2C9', '#8C6239', '#F5EFE6']
      },
      giftInfo: {
        enabled: true,
        qpayMerchantName: 'Тэмүүлэн & Энхжин QPay Сан',
        qpayQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QPay-Temuulen-Enkhjin',
        bankDetails: [
          { bankName: 'Хаан Банк', accountNumber: '5009876543', accountName: 'Тэмүүлэн' }
        ],
        message: 'Таны сэтгэлийн ерөөл, хүрэлцэн ирэх нь бидэнд хамгийн үнэтэй бэлэг юм.'
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
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Бат-Эрдэнэ & Анужин',
    email: 'ctsmanager.01@gmail.com',
    phone: '+976 9911-2233',
    registeredAt: '2026-07-20T10:00:00Z',
    associatedOrderIds: ['ord-101'],
    notes: 'Google OAuth нэвтрэх эрхтэй VIP захиалагч'
  },
  {
    id: 'cust-2',
    name: 'Тэмүүлэн & Энхжин',
    email: 'temuulen@example.mn',
    phone: '+976 9900-8877',
    registeredAt: '2026-07-24T14:30:00Z',
    associatedOrderIds: ['ord-102'],
    notes: 'Бэлтгэлийн шатанд байгаа'
  }
];
