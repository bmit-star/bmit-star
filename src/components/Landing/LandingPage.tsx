import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, CheckCircle2, Clock, HardDrive, Calendar, Music, Heart, Users, 
  MapPin, Gift, Eye, ArrowRight, ShieldCheck, HelpCircle, Smartphone, 
  QrCode, Play, Image as ImageIcon, Check, Star, Lock, Send, X, ExternalLink,
  Search, Zap, Layers, Camera, ChevronLeft, ChevronRight, ChevronDown
} from 'lucide-react';
import { Order, Template } from '../../types';
import { CATEGORIES, getCategoryConfig } from '../../data/categories';
import { extractGoogleDriveId, extractYouTubeVideoId } from '../../lib/mediaUtils';
import { DevicePreviewFrame } from '../Shared/DevicePreviewFrame';
import { LuxuryInvitationView } from '../Guest/LuxuryInvitationView';
import {
  OverviewSection,
  FeaturesSection,
  TemplatesSection,
  PricingSection,
  FaqSection
} from './LandingTabSections';

interface LandingPageProps {
  templates: Template[];
  onOrderCreated: (newOrder: Order) => void;
  onNavigateCustomer?: () => void;
  onNavigateAdmin?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  templates,
  onOrderCreated,
  onNavigateCustomer,
  onNavigateAdmin
}) => {
  const [showOrderModal, setShowOrderModal] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<'Standard' | 'VIP'>('Standard');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templates[0]?.id || 'tmpl-1');

  // Category & Search State for Template Library
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [previewCustomData, setPreviewCustomData] = useState<{ title: string; category: string; invitationData: any } | null>(null);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [phonePreviewSampleId, setPhonePreviewSampleId] = useState<string>('sample-wedding');
  const [activeFeatureTab, setActiveFeatureTab] = useState<string>('guest-link');
  const [activeMainTab, setActiveMainTab] = useState<'overview' | 'features' | 'templates' | 'pricing' | 'faq' | 'all'>('overview');

  const WHY_CHOOSE_US_FEATURES = [
    {
      id: 'personalized-link',
      icon: Sparkles,
      badge: 'Хувийн Линк',
      stepNum: '01',
      title: '✨ Зочин бүрийн нэртэй хувийн урилгын линк',
      description: 'Урилга бүрийг зочны нэрээр бэлтгэж, онцгой мэдрэмж төрүүлнэ.',
      tagline: 'Зочин бүрд зориулсан хүндэтгэл',
      previewMock: 'zallaga.mn/invite/wedding-2026?to=Эрхэм Аав, Ээж танаа'
    },
    {
      id: 'vip-qr-pass',
      icon: QrCode,
      badge: 'VIP QR Тасалбар',
      stepNum: '02',
      title: '🎟️ Автомат VIP QR урилга',
      description: 'Зочин бүр дахин давтагдашгүй QR кодтой урилга хүлээн авч, нэвтрэхэд ашиглана.',
      tagline: 'Хүлээн авалтын танхимд нэвтрэх VIP Пасс',
      previewMock: 'VIP TOKEN: #PASS-8899 • QR Сканнер Баталгаажсан'
    },
    {
      id: 'attendance-checkin',
      icon: CheckCircle2,
      badge: 'Цахим Ирц',
      stepNum: '03',
      title: '✅ Цахим ирц бүртгэл',
      description: 'Хэн ирэх, хэн татгалзсан мэдээллийг бодит цаг хугацаанд хялбар удирдана.',
      tagline: 'Уригдсан зочдын ирцийн нэгдсэн хяналт',
      previewMock: 'Бодит цагийн ирц: 142 Зочин ирнэ (94.6%)'
    },
    {
      id: 'interactive-photowall',
      icon: Camera,
      badge: 'Интерактив Сан',
      stepNum: '04',
      title: '✨ Интерактив Фото Хана',
      description: 'Баярын үеэр зочид өөрсдийн зураг, дурсамжаа нэг товшилтоор нийтэлнэ. Захиалагчийн хяналтаар баталгаажсан зургууд Фото Хана болон арга хэмжээний дэлгэц дээр шууд харагдана.',
      tagline: 'Баярын нандин дурсамжуудыг хамтдаа бүтээнэ',
      previewMock: 'Захиалагч хянасан 56 зураг дэлгэц дээр харагдаж байна'
    },
    {
      id: 'bg-music',
      icon: Music,
      badge: 'Арын Аялгуу',
      stepNum: '05',
      title: '🎵 Арын хөгжмийн тохиргоо',
      description: 'Таны арга хэмжээний уур амьсгалд тохирсон аялгуугаар урилгыг илүү амьд болгоно.',
      tagline: 'Сэтгэл хөдөлгөм тансаг аялгуу',
      previewMock: '🎵 Тансаг хийлийн вальс эгшиглэж байна'
    },
    {
      id: 'active-duration',
      icon: Calendar,
      badge: '30 Хоногийн Эрх',
      stepNum: '06',
      title: '🌐 1 сарын турш идэвхтэй',
      description: 'Урилга, фото цомог болон бүх мэдээлэл 30 хоногийн турш тасралтгүй ашиглах боломжтой.',
      tagline: '30 хоногийн турш хязгааргүй ашиглалт',
      previewMock: '30 хоногийн турш 100% идэвхтэй ажиллана'
    },
    {
      id: 'fast-turnaround',
      icon: Clock,
      badge: 'Шуурхай Бэлтгэл',
      stepNum: '07',
      title: '⚡ 2–8 цагийн дотор бэлэн',
      description: 'Хурдан, чанартай, мэргэжлийн үйлчилгээ.',
      tagline: 'Хамгийн шуурхай бэлтгэл',
      previewMock: 'Захиалснаас хойш дунджаар 3 цагийн дотор бэлэн'
    }
  ];

  const CATEGORY_FINISHED_SAMPLES = [
    {
      id: 'sample-wedding',
      category: 'Хурим',
      title: 'Александр & София',
      subtitle: 'Гал голомтоо бадраах хуримын хүндэтгэлийн баяр',
      thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      badge: 'Хуримын Бэлэн Загвар',
      invitationData: {
        brideName: 'София',
        groomName: 'Александр',
        brideParents: 'Сүйт бүсгүйн аав Б.Эрдэнэ, ээж Ч.Туяа',
        groomParents: 'Сүйт залуугийн аав Д.Батбаяр, ээж С.Оюун',
        eventTitle: 'Александр & София нарын Хуримын Баяр',
        invitationMessage: 'Эцэг эхийн дээд ерөөлөөр гал голомтоо засаж, нэгэн гэр бүл болох баярт та бүхнийг хүндэтгэн урьж байна.',
        blessingText: '“Хоёр сэтгэл нэгдэж, нэгэн гал голомт бадрах болтугай.”',
        date: '2026 оны 8 сарын 15 (Бямба гараг)',
        time: '16:00 цагт',
        locationName: 'Шангри-Ла Улаанбаатар, Их Танхим',
        address: 'Сүхбаатар дүүрэг, Олимпийн гудамж 19',
        heroPhotoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        couplePhotos: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80'
        ],
        themeColor: '#C5A059',
        secondaryColor: '#0D2B1D',
        backgroundMusicTitle: 'Мөнхийн Вальс',
        backgroundMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
        schedule: [
          { time: '16:00', title: 'Зочдыг Угтан Авах' },
          { time: '17:00', title: 'Хуримын Тангараг Ёслол' },
          { time: '18:30', title: 'Хүндэтгэлийн Зоог & Баярын Хөтөлбөр' }
        ],
        dressCode: {
          title: 'Black Tie / Тансаг Гоёлын Дээл',
          description: 'Алтлаг, хар, бараан өнгийн гоёлын хувцаслалттай ирнэ үү.',
          colorPalette: ['#C5A059', '#0D2B1D', '#1E1E1E']
        },
        showCountdown: true,
        showMusicPlayer: true,
        showGallery: true,
        showQrCode: true,
        showRsvp: true,
        showGuestBook: true
      }
    },
    {
      id: 'sample-birthday',
      category: 'Төрсөн өдөр',
      title: 'Н.Билгүүн',
      subtitle: '30 Насны Ойн Баярын Тансаг Үдэшлэг',
      thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
      badge: 'Ойн Баярын Бэлэн Загвар',
      invitationData: {
        birthdayPersonName: 'Н.Билгүүн',
        groomName: 'Н.Билгүүн',
        age: '30 нас',
        eventTitle: 'Н.Билгүүний 30 Насны Ойн Баяр',
        invitationMessage: 'Миний 30 насны ой тохиож байгаа тул ах дүү, найз нөхөд та бүхнийг нэгэн үдшийг хамтдаа дурсамжтай өнгөрүүлэхийг урьж байна.',
        blessingText: '“Нас нэмж, ухаан тэлэх баярын өдрийн мэнд!”',
        date: '2026 оны 9 сарын 10 (Пүрэв гараг)',
        time: '18:00 цагт',
        locationName: 'Sky Lounge & Event Hall',
        address: 'Хан-Уул дүүрэг, Зайсан гудамж 15',
        heroPhotoUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
        couplePhotos: ['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80'],
        themeColor: '#D4AF37',
        secondaryColor: '#1A1A1A',
        backgroundMusicTitle: 'Birthday Jazz Lounge',
        backgroundMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
        showCountdown: true,
        showMusicPlayer: true,
        showGallery: true,
        showQrCode: true,
        showRsvp: true,
        showGuestBook: true
      }
    },
    {
      id: 'sample-haircut',
      category: 'Сэвлэг үргээх ёслол',
      title: 'Б.Амин-Эрдэнэ',
      subtitle: 'Сэвлэг Үргээх Уламжлалт Ёслол',
      thumbnail: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
      badge: 'Уламжлалт Баярын Загвар',
      invitationData: {
        childName: 'Б.Амин-Эрдэнэ',
        groomName: 'Б.Амин-Эрдэнэ',
        age: '3 нас',
        parentsNames: 'Аав Т.Баттулга, Ээж С.Ариунаа',
        eventTitle: 'Б.Амин-Эрдэнэ Хүүгийн Сэвлэг Үргээх Баяр',
        invitationMessage: 'Нандин хүүгийн маань сэвлэг үргээх уламжлалт баяр тохиож байгаа тул ах дүү, нагац, танил та бүхнээ хүндэтгэн урьж байна.',
        blessingText: '“Уудаг ус шиг тунгалаг, ургах наран шиг гэрэлтэй явах болтугай.”',
        date: '2026 оны 10 сарын 05 (Даваа гараг)',
        time: '11:00 цагт',
        locationName: 'Монгол Өргөө Гэр Ресторан',
        address: 'Хан-Уул дүүрэг, Богд уулын бэл',
        heroPhotoUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80',
        couplePhotos: ['https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80'],
        themeColor: '#C5A059',
        secondaryColor: '#2C1810',
        backgroundMusicTitle: 'Морин Хуурын Аялгуу',
        backgroundMusicUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
        showCountdown: true,
        showMusicPlayer: true,
        showGallery: true,
        showQrCode: true,
        showRsvp: true,
        showGuestBook: true
      }
    },
    {
      id: 'sample-clan',
      category: 'Ургийн баяр',
      title: 'Боржигон Овог',
      subtitle: 'Ургийн Чуулган & Баярын Уулзалт',
      thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
      badge: 'Ургийн Баярын Загвар',
      invitationData: {
        clanName: 'Боржигон Овог',
        groomName: 'Боржигон Овог',
        familySurname: 'Алтан Овог',
        clanLeader: 'Ахлагч Б.Дамдинсүрэн',
        eventTitle: 'Боржигон Овгийн Ургийн Чуулган Баяр',
        invitationMessage: 'Боржигон ургийн залгамж халаа, ах дүү, үе удмаараа цугларан ураг төрлөө бэхжүүлэх баярт хүрэлцэн ирнэ үү.',
        date: '2026 оны 7 сарын 25 (Бямба гараг)',
        time: '10:00 цагт',
        locationName: 'Тэрэлж Цогцолбор',
        address: 'Горхи Тэрэлжийн Байгалийн Цогцолбор Газар',
        heroPhotoUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
        themeColor: '#C5A059',
        secondaryColor: '#1B3B2B',
        backgroundMusicTitle: 'Ургийн Баярын Дуу',
        showCountdown: true,
        showMusicPlayer: true,
        showGallery: true,
        showQrCode: true,
        showRsvp: true,
        showGuestBook: true
      }
    },
    {
      id: 'sample-graduation',
      category: 'Төгсөлт',
      title: 'М.Тэмүүлэн',
      subtitle: 'МУИС Бакалаврын Төгсөлтийн Баяр',
      thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80',
      badge: 'Төгсөлтийн Загвар',
      invitationData: {
        graduateName: 'М.Тэмүүлэн',
        groomName: 'М.Тэмүүлэн',
        schoolName: 'МУИС - Мэдээллийн Технологийн Сургууль',
        className: 'Программ Хангамж 4-р анги',
        eventTitle: 'М.Тэмүүлэнгийн Төгсөлтийн Баярын Урилга',
        invitationMessage: '4 жилийн суралцах аяллаа амжилттай дүүргэж бакалаврын зэрэг хамгаалсан баяраа та бүхэнтэйгээ хуваалцахад бэлэн байна.',
        date: '2026 оны 6 сарын 20 (Бямба гараг)',
        time: '15:00 цагт',
        locationName: 'МУИС-ийн Эрдмийн Танчим',
        address: 'Сүхбаатар дүүрэг, Их Сургуулийн гудамж 1',
        heroPhotoUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
        themeColor: '#D4AF37',
        secondaryColor: '#0F172A',
        backgroundMusicTitle: 'Graduation Anthem',
        showCountdown: true,
        showMusicPlayer: true,
        showGallery: true,
        showQrCode: true,
        showRsvp: true,
        showGuestBook: true
      }
    },
    {
      id: 'sample-corporate',
      category: 'Байгууллагын арга хэмжээ',
      title: '"Говь" ХК',
      subtitle: '40 Жилийн Ойн Хүндэтгэлийн Гала Үдэшлэг',
      thumbnail: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      badge: 'VIP Бэлэн Загвар',
      invitationData: {
        companyName: '"Говь" ХК',
        groomName: '"Говь" ХК',
        eventTitle: 'Үүсэн Байгуулагдсаны 40 Жилийн Ойн Гала Үдэшлэг',
        invitationMessage: 'Манай байгууллагын амжилтын түүхийг хамтдаа бүтээлцсэн эрхэм харилцагч, хамтран ажиллагч таныг ойн хүндэтгэлийн арга хэмжээнд морилон ирэхийг урьж байна.',
        date: '2026 оны 11 сарын 15 (Ням гараг)',
        time: '18:30 цагт',
        locationName: 'Corporate Hotel & Convention Centre',
        address: 'Хан-Уул дүүрэг, Махатма Гандийн гудамж',
        heroPhotoUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
        themeColor: '#C5A059',
        secondaryColor: '#1E1E1E',
        backgroundMusicTitle: 'Gala Symphony',
        showCountdown: true,
        showMusicPlayer: true,
        showGallery: true,
        showQrCode: true,
        showRsvp: true,
        showGuestBook: true
      }
    }
  ];

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.musicTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryCount = (catName: string) => {
    return templates.filter(t => t.category === catName).length;
  };

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  const [eventType, setEventType] = useState<'Wedding' | 'Anniversary' | 'Gala' | 'Birthday' | 'Baby Shower'>('Wedding');
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [brideParents, setBrideParents] = useState('');
  const [groomParents, setGroomParents] = useState('');
  const [birthdayPersonName, setBirthdayPersonName] = useState('');
  const [age, setAge] = useState('');
  const [childName, setChildName] = useState('');
  const [parentsNames, setParentsNames] = useState('');
  const [clanName, setClanName] = useState('');
  const [clanLeader, setClanLeader] = useState('');
  const [graduateName, setGraduateName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('2026 оны 8 сарын 15-ны Бямба гараг');
  const [eventTime, setEventTime] = useState('16:00 цагт');
  const [locationName, setLocationName] = useState('Шангри-Ла Улаанбаатар, Их Танхим');
  const [address, setAddress] = useState('Сүхбаатар дүүрэг, Олимпийн гудамж 19');
  const [drivePhotoUrl, setDrivePhotoUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const [formStep, setFormStep] = useState<number>(1);
  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  const handleStartOrder = (pkg: 'Standard' | 'VIP') => {
    setSelectedPackage(pkg);
    setFormStep(1);
    setOrderSubmitted(false);
    setShowOrderModal(true);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    const chosenTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
    const newOrderNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const slug = `urilga-${Math.floor(1000 + Math.random() * 9000)}`;

    const driveId = extractGoogleDriveId(drivePhotoUrl);
    const heroPhoto = driveId 
      ? `https://lh3.googleusercontent.com/d/${driveId}` 
      : (chosenTemplate?.thumbnail || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80');

    // Merge chosen template's rich default sampleData with user inputs
    const sample = chosenTemplate?.sampleData || {};

    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber: newOrderNumber,
      customerName: customerName || 'Шинэ Захиалагч',
      customerEmail: customerEmail || 'client@gmail.com',
      customerPhone: customerPhone || '+976 9900-0000',
      templateId: chosenTemplate?.id || 'tmpl-1',
      templateTitle: chosenTemplate?.title || 'Тансаг Загвар',
      status: 'New', // Ordering without login creates new order for admin review
      createdAt: new Date().toISOString(),
      uniqueSlug: slug,
      viewsCount: 0,
      changeRequests: [],
      invitationData: {
        brideName: brideName || sample.brideName || 'Сүйт бүсгүй',
        groomName: groomName || birthdayPersonName || childName || graduateName || companyName || sample.groomName || 'Баярын эзэн',
        brideParents: brideParents || sample.brideParents || 'Сүйт бүсгүйн эцэг эхийн гэр бүл',
        groomParents: groomParents || sample.groomParents || 'Сүйт залуугийн эцэг эхийн гэр бүл',
        childName: childName || sample.childName,
        birthdayPersonName: birthdayPersonName || sample.birthdayPersonName,
        age: age || sample.age,
        parentsNames: parentsNames || sample.parentsNames,
        fatherName: sample.fatherName,
        motherName: sample.motherName,
        birthDate: sample.birthDate,
        clanName: clanName || sample.clanName,
        familySurname: sample.familySurname,
        clanLeader: clanLeader || sample.clanLeader,
        graduateName: graduateName || sample.graduateName,
        schoolName: schoolName || sample.schoolName,
        className: sample.className,
        companyName: companyName || sample.companyName,
        deceasedName: sample.deceasedName,
        eventTitle: eventTitle || sample.eventTitle || `${chosenTemplate?.category || 'Баяр'} - ${groomName || birthdayPersonName || childName || graduateName || companyName || 'Урилга'}`,
        invitationMessage: sample.invitationMessage || 'Эцэг эхийн дээд ерөөлөөр гал голомтоо засаж, баярын өдрөө тэмдэглэн зочдоо урьж байна.',
        blessingText: sample.blessingText || '“Хоёр сэтгэл нэгдэж, нэгэн гал голомт бадрах болтугай.”',
        date: eventDate || sample.date || '2026 оны 8 сарын 15 (Бямба гараг)',
        time: eventTime || sample.time || '16:00 цагт',
        locationName: locationName || sample.locationName || 'Шангри-Ла Улаанбаатар, Их Танхим',
        address: address || sample.address || 'Сүхбаатар дүүрэг, Олимпийн гудамж 19',
        heroPhotoUrl: heroPhoto,
        couplePhotos: [heroPhoto],
        themeColor: sample.themeColor || chosenTemplate?.colorTheme || '#C5A059',
        secondaryColor: sample.secondaryColor || '#0D2B1D',
        backgroundMusicTitle: youtubeUrl ? 'YouTube Арын Хөгжим' : sample.backgroundMusicTitle || chosenTemplate?.musicTitle || 'Тансаг Вальс',
        backgroundMusicUrl: youtubeUrl || sample.backgroundMusicUrl || chosenTemplate?.musicUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
        schedule: [
          { time: eventTime || '16:00', title: 'Зочдыг угтан авах' },
          { time: '18:00', title: 'Хүндэтгэлийн зоог & Хөтөлбөр' }
        ],
        dressCode: {
          title: 'Үдэшлэгийн гоёлын хувцас / Дээл',
          description: 'Алтлаг, хар, цагаан болон бараан өнгийн гоёлын хувцас.',
          colorPalette: ['#C5A059', '#0D2B1D', '#1E1E1E']
        },
        giftInfo: {
          enabled: true,
          qpayMerchantName: 'Баярын Бэлгийн Данс',
          qpayQrUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QPay-Fund',
          bankDetails: [
            { bankName: 'Хаан Банк', accountNumber: '5000000000', accountName: customerName || 'Захиалагч' }
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

    setOrderSubmitted(true);
    setTimeout(() => {
      onOrderCreated(newOrder);
      setShowOrderModal(false);
    }, 2000);
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* PUBLIC NAVBAR */}
      <header className="bg-stone-900/90 backdrop-blur-xl border border-stone-800 rounded-2xl px-4 sm:px-5 py-3 sticky top-3 z-40 shadow-2xl max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setActiveMainTab('overview'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d4af37] via-[#f9e5af] to-[#b38b2d] flex items-center justify-center text-slate-950 font-bold text-xl shadow-lg shadow-[#d4af37]/20 font-serif">
              З
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-wide text-sm sm:text-base text-white font-serif">ЗАЛЛАГА</span>
                <span className="text-[9px] uppercase tracking-wider bg-[#d4af37]/15 text-[#f9e5af] font-semibold px-2 py-0.5 rounded-full border border-[#d4af37]/30 hidden sm:inline-block">
                  SaaS Event Platform
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Direct CTA */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => handleStartOrder('Standard')}
              className="bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Захиалах</span>
            </button>
          </div>
        </div>

        {/* 1-CLICK TAB SWITCHER (DESKTOP & MOBILE) */}
        <div className="flex items-center gap-1 bg-stone-950/80 p-1 rounded-xl border border-stone-800/80 overflow-x-auto max-w-full no-scrollbar">
          {[
            { id: 'overview', label: 'Нүүр', icon: Sparkles },
            { id: 'features', label: 'Боломжууд', icon: Zap },
            { id: 'templates', label: 'Загварууд', icon: Layers },
            { id: 'pricing', label: 'Үнэ (49k)', icon: CheckCircle2 },
            { id: 'faq', label: 'Асуулт', icon: HelpCircle },
            { id: 'all', label: 'Бүгдийг харах', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMainTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveMainTab(tab.id as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 touch-manipulation ${
                  isActive
                    ? 'bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] text-slate-950 shadow-md shadow-[#d4af37]/20 scale-105'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-[#d4af37]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {onNavigateCustomer && (
            <button
              onClick={onNavigateCustomer}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-semibold border border-stone-700 transition-all"
            >
              <Users className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Нэвтрэх</span>
            </button>
          )}
          <button
            onClick={() => handleStartOrder('Standard')}
            className="bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] text-slate-950 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-[#d4af37]/20 hover:brightness-110 active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
            <span>Шууд Захиалах</span>
          </button>
        </div>

      </header>

      {/* MAIN TAB SWITCHER CONTAINER WITH ANIMATION */}
      <main className="min-h-[60vh] max-w-7xl mx-auto px-2 sm:px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMainTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {activeMainTab === 'overview' && (
              <OverviewSection
                handleStartOrder={handleStartOrder}
                onNavigateTemplates={() => {
                  setActiveMainTab('templates');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeMainTab === 'features' && (
              <FeaturesSection />
            )}

            {activeMainTab === 'templates' && (
              <TemplatesSection
                templates={templates}
                filteredTemplates={filteredTemplates}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                getCategoryCount={getCategoryCount}
                CATEGORY_FINISHED_SAMPLES={CATEGORY_FINISHED_SAMPLES}
                setPreviewCustomData={setPreviewCustomData}
                setPreviewTemplate={setPreviewTemplate}
                setSelectedTemplateId={setSelectedTemplateId}
                handleStartOrder={handleStartOrder}
              />
            )}

            {activeMainTab === 'pricing' && (
              <PricingSection handleStartOrder={handleStartOrder} />
            )}

            {activeMainTab === 'faq' && (
              <FaqSection
                openFaqIndex={openFaqIndex}
                setOpenFaqIndex={setOpenFaqIndex}
                handleStartOrder={handleStartOrder}
                onNavigateTemplates={() => {
                  setActiveMainTab('templates');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {activeMainTab === 'all' && (
              <div className="space-y-16">
                <OverviewSection
                  handleStartOrder={handleStartOrder}
                  onNavigateTemplates={() => {
                    setActiveMainTab('templates');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                <FeaturesSection />
                <TemplatesSection
                  templates={templates}
                  filteredTemplates={filteredTemplates}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  getCategoryCount={getCategoryCount}
                  CATEGORY_FINISHED_SAMPLES={CATEGORY_FINISHED_SAMPLES}
                  setPreviewCustomData={setPreviewCustomData}
                  setPreviewTemplate={setPreviewTemplate}
                  setSelectedTemplateId={setSelectedTemplateId}
                  handleStartOrder={handleStartOrder}
                />
                <PricingSection handleStartOrder={handleStartOrder} />
                <FaqSection
                  openFaqIndex={openFaqIndex}
                  setOpenFaqIndex={setOpenFaqIndex}
                  handleStartOrder={handleStartOrder}
                  onNavigateTemplates={() => {
                    setActiveMainTab('templates');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* HERO REMOVED */}

      {/* WHY CHOOSE US REMOVED */}













      {/* SAMPLE TEMPLATES PREVIEW & CATEGORY FILTER */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        
        {/* Header & Search */}
        <div className="bg-stone-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37]">Загварын Сан (39 Тансаг Загвар)</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif">
                Ангилал Бүрээр Шүүж Сонгох
              </h2>
              <p className="text-xs text-stone-300 max-w-xl">
                Та өөрийн баяр ёслолд тохирох ангиллыг сонгон, ганцхан товшилтоор урилгатайгаа танилцаж шууд захиалаарай.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Загварын нэр, ангиллаар хайх..."
                className="w-full bg-stone-950 border border-stone-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#d4af37] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="space-y-2 pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between text-xs text-stone-300 mb-2">
              <span className="font-semibold text-[#f9e5af] uppercase tracking-wider text-[11px]">
                Баярын Ангилал:
              </span>
              <span className="text-[11px] text-stone-400">
                Илэрц: <strong className="text-white font-bold">{filteredTemplates.length}</strong> загвар
              </span>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-1 items-center">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 border touch-manipulation min-h-[40px] sm:min-h-[44px] ${
                  selectedCategory === 'ALL'
                    ? 'bg-[#d4af37] text-slate-950 font-bold border-[#d4af37] shadow-lg shadow-[#d4af37]/20 scale-102'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-500/50 hover:bg-stone-800'
                }`}
              >
                <span>✨</span>
                <span>Бүгд</span>
                <span className="text-[10px] opacity-80 font-mono px-1.5 py-0.2 bg-black/40 rounded-full">
                  {templates.length}
                </span>
              </button>

              {CATEGORIES.map(cat => {
                const count = getCategoryCount(cat.name);
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-semibold transition-all flex items-center gap-1.5 border touch-manipulation min-h-[40px] sm:min-h-[44px] ${
                      isSelected
                        ? 'bg-[#d4af37] text-slate-950 font-bold border-[#d4af37] shadow-lg shadow-[#d4af37]/20 scale-102'
                        : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-amber-500/50 hover:bg-stone-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                    <span className="text-[10px] opacity-80 font-mono px-1.5 py-0.2 bg-black/40 rounded-full">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="p-12 text-center bg-stone-900/90 rounded-3xl border border-stone-800 text-stone-400 space-y-3">
            <Search className="w-8 h-8 text-stone-500 mx-auto" />
            <h3 className="text-base font-bold text-white">Загвар олдсонгүй</h3>
            <p className="text-xs">Таны хайсан үг эсвэл сонгосон ангилалд тохирох загвар одоогоор байхгүй байна.</p>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
              className="bg-[#d4af37] text-slate-950 px-4 py-2 rounded-xl text-xs font-bold"
            >
              Бүх загварыг харах
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTemplates.map((tpl) => (
              <div 
                key={tpl.id}
                className="bg-stone-900/90 rounded-3xl overflow-hidden border border-stone-800 hover:border-[#d4af37]/60 transition-all group flex flex-col justify-between shadow-2xl relative"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-950">
                  <img
                    src={tpl.thumbnail}
                    alt={tpl.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-black/85 backdrop-blur-md text-[#f9e5af] text-[10px] font-bold px-3 py-1 rounded-full border border-[#d4af37]/40 shadow-md">
                      {tpl.category}
                    </span>
                    {tpl.isPremium && (
                      <span className="bg-gradient-to-r from-[#d4af37] to-[#f9e5af] text-slate-950 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-0.5 shadow-md">
                        <Star className="w-3 h-3 fill-slate-950" />
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white">
                    <span className="text-stone-200 font-medium truncate">{tpl.animationType}</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono font-bold text-[10px]">
                      49,000₮
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base text-white group-hover:text-[#f9e5af] transition-colors leading-snug">
                      {tpl.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-300">
                      <Music className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                      <span className="truncate">{tpl.musicTitle}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center gap-2">
                    <button
                      onClick={() => setPreviewTemplate(tpl)}
                      className="flex-1 bg-stone-950 hover:bg-stone-800 text-stone-100 font-semibold py-2.5 rounded-xl text-xs transition-all border border-stone-800 flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Үзэх</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedTemplateId(tpl.id);
                        handleStartOrder('Standard');
                      }}
                      className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#f9e5af] hover:from-[#e5be48] hover:to-[#fcebc4] text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-[#d4af37]/20 flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                      <span>Захиалах</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* LANDING TEMPLATE PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-950 border border-white/15 rounded-3xl p-5 sm:p-6 max-w-4xl w-full h-[90vh] flex flex-col text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white font-serif">{previewTemplate.title}</h3>
                <p className="text-xs text-white/60">Ангилал: {previewTemplate.category} • {previewTemplate.animationType}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedTemplateId(previewTemplate.id);
                    setPreviewTemplate(null);
                    handleStartOrder('Standard');
                  }}
                  className="bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] text-slate-950 font-bold px-4 py-2 rounded-xl text-xs hover:brightness-110 transition-all shadow-md shadow-[#d4af37]/20 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Энэ Загвараар Захиалах (49,000₮)</span>
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="text-white/50 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              <DevicePreviewFrame
                deviceMode={deviceMode}
                onDeviceModeChange={setDeviceMode}
                title={`Загвар шалгах: ${previewTemplate.title}`}
              >
                <LuxuryInvitationView
                  invitationData={{
                    brideName: 'Номин-Эрдэнэ',
                    groomName: 'Ганзориг',
                    brideParents: 'Сүйт бүсгүйн эцэг эх',
                    groomParents: 'Сүйт залуугийн эцэг эх',
                    eventTitle: `${previewTemplate.category} - ${previewTemplate.title}`,
                    invitationMessage: 'Хоёр сэтгэл нэгдэж, нэгэн гал голомт бадраах баярт маань хүрэлцэн ирэхийг урьж байна.',
                    blessingText: '“Баяр баясгалан дүүрэн өдөр тохиох болтугай.”',
                    date: '2026 оны 8 сарын 15-ны Бямба гараг',
                    time: '16:00 цагт',
                    locationName: 'Шангри-Ла Улаанбаатар',
                    address: 'Улаанбаатар хот, Сүхбаатар дүүрэг',
                    heroPhotoUrl: previewTemplate.thumbnail,
                    couplePhotos: [previewTemplate.thumbnail],
                    themeColor: previewTemplate.sampleData?.themeColor || '#C5A059',
                    secondaryColor: previewTemplate.sampleData?.secondaryColor || '#0D2B1D',
                    backgroundMusicTitle: previewTemplate.musicTitle,
                    backgroundMusicUrl: previewTemplate.musicUrl,
                    schedule: [
                      { time: '04:00 PM', title: 'Цугларах Цаг' },
                      { time: '06:00 PM', title: 'Баярын Хөтөлбөр' }
                    ],
                    dressCode: {
                      title: 'Formal Black Tie',
                      description: 'Баярын гоёмсог хувцаслалттай ирнэ үү.',
                      colorPalette: ['#C5A059', '#0D2B1D', '#1E1E1E']
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
                  }}
                  isPreviewMode={true}
                />
              </DevicePreviewFrame>
            </div>
          </div>
        </div>
      )}

      {/* FINISHED CUSTOM SAMPLE FULLSCREEN STANDALONE GUEST VIEW */}
      {previewCustomData && (
        <div className="fixed inset-0 z-50 bg-stone-950 overflow-y-auto">
          {/* Top Floating Control Bar */}
          <div className="fixed top-3 left-3 right-3 z-50 flex items-center justify-between gap-3 p-3 rounded-2xl bg-stone-900/90 border border-amber-500/40 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <div>
                <div className="text-xs font-bold text-white font-serif flex items-center gap-1.5">
                  <span>{previewCustomData.title}</span>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full border border-amber-500/40 font-sans font-medium">
                    Зочин урилга хүлээн авсан бодит харагдац
                  </span>
                </div>
                <div className="text-[10px] text-stone-300 font-sans">
                  Линк: <code className="text-amber-200">zallaga.mn/invite/{previewCustomData.id}?to=Г.Болд</code>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedCategory(previewCustomData.category);
                  setPreviewCustomData(null);
                  handleStartOrder('Standard');
                }}
                className="bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] hover:brightness-110 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md shadow-[#d4af37]/30 flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span className="hidden sm:inline">Энэ Ангилалаар Захиалах (49,000₮)</span>
                <span className="sm:hidden">Захиалах</span>
              </button>
              <button
                onClick={() => setPreviewCustomData(null)}
                className="bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-all border border-stone-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Буцах</span>
              </button>
            </div>
          </div>

          {/* Actual Standalone Guest Invitation View */}
          <div className="pt-16">
            <LuxuryInvitationView
              invitationData={previewCustomData.invitationData}
              isPreviewMode={true}
            />
          </div>
        </div>
      )}



      {/* FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 text-[#f9e5af] text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Түгээмэл Асуулт Хариулт</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-white font-serif">
            Танд асуулт байна уу?
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
            Захиалга өгөх болон үйлчилгээний талаарх түгээмэл асуултуудын хариултыг эндээс аваарай.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Урилга бэлэн болоход хэр хугацаа орох вэ?",
              a: "Төлбөр баталгаажсанаас хойш манай мэргэжлийн баг 2-оос 8 цагийн дотор урилгыг бэлэн болгож, таны хувийн удирдлагын хэсгийг нээж өгнө."
            },
            {
              q: "Зочид урилгаа хэрхэн хүлээн авах вэ?",
              a: "Зочин бүрийн нэртэй хувийн холбоос болон тэдэнд зориулсан VIP QR тасалбар үүснэ. Та сошиал чат болон мессежээр нэг товшилтоор хуваалцаж болно."
            },
            {
              q: "Урилгад оруулах мэдээллээ дараа нь өөрчилж болох уу?",
              a: "Тийм. Урилга идэвхтэй байх 30 хоногийн турш та хаяг байршил, огноо, зураг, арын дуу болон бусад мэдээллээ хэзээ ч өөрийн админ хэсгээс шууд засаж өөрчлөх боломжтой."
            },
            {
              q: "Интерактив фото хана хэрхэн ажилладаг вэ?",
              a: "Баярын үеэр уригдсан зочид өөрсдийн гар утаснаас урилга руу зураг оруулна. Захиалагч та зургийг шалгаж зөвшөөрснөөр баярын танхимын дэлгэц дээр шууд слайд хэлбэрээр харагдах болно."
            },
            {
              q: "Бэлгийн данс болон QPay байршуулж болох уу?",
              a: "Тийм. Урилга дотор дансны дугаар, дансны нэр болон QPay QR кодыг байршуулах боломжтой тул зочид хялбархан бэлгээ шилжүүлэх боломжтой."
            },
            {
              q: "Урилга хэд хоног идэвхтэй байх вэ?",
              a: "Захиалсан өдрөөс эхлэн 1 сар буюу 30 хоногийн турш урилга тасралтгүй нээлттэй байх бөгөөд ирц болон фото ханыг үргэлжлүүлэн ашиглаж болно."
            }
          ].map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-stone-900/90 border border-stone-800 rounded-2xl overflow-hidden transition-all shadow-lg"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-white hover:text-[#f9e5af] transition-colors"
                >
                  <span className="font-serif">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-[#d4af37] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-300 border-t border-stone-800/60 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* LARGE LUXURY FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        <div className="relative rounded-3xl bg-gradient-to-br from-stone-900 via-stone-950 to-black border-2 border-[#d4af37]/40 p-8 sm:p-14 text-center space-y-8 shadow-2xl shadow-[#d4af37]/15">
          {/* Subtle gold glow effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#d4af37]/10 blur-3xl pointer-events-none rounded-full"></div>
          <div className="absolute -bottom-10 left-1/4 w-64 h-64 bg-amber-500/10 blur-3xl pointer-events-none rounded-full"></div>

          <div className="inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 px-4 py-1.5 rounded-full text-[#f9e5af] text-xs font-semibold uppercase tracking-widest backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>Премиум Дижитал Урилгын Сан</span>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white font-serif leading-tight">
              Таны баярын үнэ цэнэ <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d]">урилгаас эхэлнэ.</span>
            </h2>
            <p className="text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
              Онцгой мөчөө зочдод мартагдашгүйгээр үлдээж, баярынхаа уур амьсгалыг премиум түвшинд хүргээрэй. 2–8 цагийн дотор бэлэн болно.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleStartOrder('Standard')}
              className="w-full sm:w-auto bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] hover:brightness-110 text-slate-950 font-bold px-10 py-4 rounded-2xl text-base transition-all shadow-xl shadow-[#d4af37]/30 flex items-center justify-center gap-3 active:scale-95 group"
            >
              <Sparkles className="w-5 h-5 text-slate-950 group-hover:rotate-12 transition-transform" />
              <span>Шууд захиалах</span>
              <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#templates"
              className="w-full sm:w-auto bg-stone-900/90 hover:bg-stone-800 text-stone-200 hover:text-white px-8 py-4 rounded-2xl text-sm font-semibold transition-all border border-stone-800 text-center"
            >
              Загварууд үзэх
            </a>
          </div>

          <div className="pt-8 border-t border-stone-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>2-8 Цагт бэлэн</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>1 Сарын турш идэвхтэй</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>VIP Тасалбар & Цахим ирц</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#d4af37]" />
              <span>Тансаг Фото Цомог</span>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-white/10 text-white/60 text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#d4af37] text-slate-950 font-bold font-serif flex items-center justify-center text-xs">
                З
              </div>
              <span className="font-bold text-white text-sm font-serif">ЗАЛЛАГА — ДИЖИТАЛ УРИЛГА</span>
            </div>
            <p className="text-white/50 text-[11px] max-w-sm">
              Монголын анхны дижитал урилгын сайт. Хурим, баяр ёслолын тансаг цахим урилгыг 2-8 цагийн дотор бэлтгэх платформ.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
            <a
              href="https://www.facebook.com/profile.php?id=100063605375824"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f9e5af] transition-colors flex items-center gap-1.5 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-xl border border-blue-500/30 shadow-lg"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Админтай Фэйсбүүкээр Холбогдох</span>
            </a>
          </div>
        </div>

        <div className="text-center py-4 border-t border-white/5 text-[10px] text-white/40">
          © 2026 Заллага Дижитал Урилга. Бүх эрх хуулиар хамгаалагдсан. SBP LLC-ийн өмч болно.
        </div>
      </footer>

      {/* NATIVE MOBILE BOTTOM TAB BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 backdrop-blur-xl border-t border-stone-800/80 shadow-2xl py-1.5 px-2 flex items-center justify-around">
        {[
          { id: 'overview', label: 'Нүүр', icon: Sparkles },
          { id: 'features', label: 'Боломж', icon: Zap },
          { id: 'templates', label: 'Загвар', icon: Layers },
          { id: 'pricing', label: 'Үнэ', icon: CheckCircle2 },
          { id: 'faq', label: 'Асуулт', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveMainTab(tab.id as any);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all touch-manipulation ${
                isActive ? 'text-[#f9e5af]' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#d4af37]/20 text-[#f9e5af]' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-medium tracking-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ORDER INTAKE / REGISTRATION MODAL */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-[#d4af37]/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-white shadow-2xl my-8 relative">
            
            {/* Close Button */}
            <button
              onClick={() => setShowOrderModal(false)}
              className="absolute top-5 right-5 text-white/50 hover:text-white p-2 rounded-xl bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37] block">
                Захиалга Бөглөх — {selectedPackage === 'VIP' ? 'VIP Премиум (89,000₮)' : 'Стандарт Багц (49,000₮)'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                Цахим Урилгын Мэдээлэл Бөглөх
              </h3>
              <p className="text-xs text-[#f9e5af] mt-1 font-medium">
                * Төлбөр баталгаажсаны дараа 2-8 цагийн дотор мэргэжлийн баг урилгыг бэлтгэж нээнэ.
              </p>
            </div>

            {/* Stepper Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4 text-xs font-semibold">
              <div className={`flex items-center gap-1.5 ${formStep >= 1 ? 'text-[#d4af37]' : 'text-stone-500'}`}>
                <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[10px]">1</span>
                <span>Бүртгэл</span>
              </div>
              <div className={`flex items-center gap-1.5 ${formStep >= 2 ? 'text-[#d4af37]' : 'text-stone-500'}`}>
                <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[10px]">2</span>
                <span>Урилгын Мэдээлэл</span>
              </div>
              <div className={`flex items-center gap-1.5 ${formStep >= 3 ? 'text-[#d4af37]' : 'text-stone-500'}`}>
                <span className="w-5 h-5 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[10px]">3</span>
                <span>Төлбөр</span>
              </div>
            </div>

            {orderSubmitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce shadow-lg">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white font-serif">Захиалга Амжилттай Хүлээн Авлаа!</h4>
                <p className="text-xs sm:text-sm text-stone-200 max-w-md mx-auto leading-relaxed">
                  Таны цахим урилгын баярын мэдээлэл манай системд амжилттай бүртгэгдлээ.
                </p>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs text-amber-200 text-left space-y-2">
                  <p className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Дараагийн алхам:</span>
                  </p>
                  <p className="text-stone-200 leading-relaxed">
                    1. Манай урилга бэлтгэлийн мэргэжлийн баг мэдээллийг хянаад <strong>2 - 8 цагийн дотор</strong> урилгыг бэлтгэнэ.
                  </p>
                  <p className="text-stone-200 leading-relaxed">
                    2. Бэлэн болсны дараа таны <strong>хувийн цахим холбоосыг</strong> идэвхжүүлж илгээнэ.
                  </p>
                  <p className="text-stone-200 leading-relaxed">
                    3. Та холбоосоор орж урилгаа шууд зочид руугаа түгээж, ирц болон баярын ерөөлийн сэтгэгдлүүдийг хянах боломжтой.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://www.facebook.com/profile.php?id=100063605375824"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-5 rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30 min-h-[44px]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Мэргэжлийн Зөвлөхтэй Чатлах</span>
                  </a>
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      setOrderSubmitted(false);
                    }}
                    className="px-5 py-3 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition-colors border border-stone-700 min-h-[44px]"
                  >
                    Хаах
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitOrder} className="space-y-5 text-xs">
                
                {/* STEP 1: CLIENT REGISTRATION */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-[#f9e5af]">1. Захиалагчийн Мэдээлэл</h4>
                    
                    <div className="space-y-1">
                      <label className="text-stone-300 font-semibold block">Таны Бүтэн Нэр *</label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Д. Болд"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-stone-300 font-semibold block">Утасны Дугаар *</label>
                        <input
                          type="text"
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="+976 9911-2233"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-300 font-semibold block">И-мэйл Хаяг *</label>
                        <input
                          type="email"
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="client@example.mn"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-stone-300 font-semibold block">Сонгох Урилгын Загвар</label>
                      <select
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                      >
                        {templates.map((t) => (
                          <option key={t.id} value={t.id} className="bg-stone-900 text-white">
                            {t.title} ({t.category})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (customerName && customerPhone) setFormStep(2);
                      }}
                      className="w-full bg-[#d4af37] text-slate-950 font-bold py-3.5 rounded-xl text-xs hover:bg-[#e5be48] transition-all flex items-center justify-center gap-2 mt-4 min-h-[44px]"
                    >
                      <span>Дараах: Урилгын Мэдээлэл Бөглөх</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* STEP 2: INVITATION DETAILS */}
                {formStep === 2 && (() => {
                  const chosenTpl = templates.find(t => t.id === selectedTemplateId) || templates[0];
                  const chosenCat = chosenTpl?.category || 'Хурим';

                  const isWeddingCat = chosenCat.includes('Хурим');
                  const isBirthdayCat = chosenCat.includes('Төрсөн');
                  const isKidsCat = chosenCat.includes('Хүүхэд') || chosenCat.includes('Сэвлэг') || chosenCat.includes('Даахь');
                  const isClanCat = chosenCat.includes('Ургийн');
                  const isGraduationCat = chosenCat.includes('Төгсөлт');
                  const isCorporateCat = chosenCat.includes('Байгууллага') || chosenCat.includes('Нээлт') || chosenCat.includes('Шагнал');

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-stone-950 p-3 rounded-2xl border border-stone-800 text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <span className="text-amber-400 font-bold shrink-0">Загвар:</span>
                          <span className="text-white font-bold truncate">{chosenTpl?.title}</span>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30 shrink-0">
                          {chosenCat}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-[#f9e5af]">2. {chosenCat} — Урилгад Орох Мэдээлэл</h4>

                      {/* DYNAMIC FIELDS BY CATEGORY */}
                      {isWeddingCat && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-stone-300 font-semibold block">Сүйт залуугийн нэр *</label>
                              <input
                                type="text"
                                required
                                value={groomName}
                                onChange={(e) => setGroomName(e.target.value)}
                                placeholder="Александр"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-stone-300 font-semibold block">Сүйт бүсгүйн нэр *</label>
                              <input
                                type="text"
                                required
                                value={brideName}
                                onChange={(e) => setBrideName(e.target.value)}
                                placeholder="София"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-stone-300 font-semibold block">Сүйт залуугийн эцэг эхийн нэр</label>
                              <input
                                type="text"
                                value={groomParents}
                                onChange={(e) => setGroomParents(e.target.value)}
                                placeholder="Аав Д.Батбаяр, Ээж С.Оюун"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-stone-300 font-semibold block">Сүйт бүсгүйн эцэг эхийн нэр</label>
                              <input
                                type="text"
                                value={brideParents}
                                onChange={(e) => setBrideParents(e.target.value)}
                                placeholder="Аав Б.Эрдэнэ, Ээж Ч.Туяа"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {isBirthdayCat && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Төрсөн өдрийн эзний нэр *</label>
                            <input
                              type="text"
                              required
                              value={birthdayPersonName || groomName}
                              onChange={(e) => {
                                setBirthdayPersonName(e.target.value);
                                setGroomName(e.target.value);
                              }}
                              placeholder="Н.Билгүүн"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Тохиож буй нас / Ой *</label>
                            <input
                              type="text"
                              required
                              value={age}
                              onChange={(e) => setAge(e.target.value)}
                              placeholder="25 нас / 30 насны ой"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                        </div>
                      )}

                      {isKidsCat && (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-stone-300 font-semibold block">Хүүхдийн нэр *</label>
                              <input
                                type="text"
                                required
                                value={childName || groomName}
                                onChange={(e) => {
                                  setChildName(e.target.value);
                                  setGroomName(e.target.value);
                                }}
                                placeholder="Б.Амин-Эрдэнэ"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-stone-300 font-semibold block">Нас / Баярын утга *</label>
                              <input
                                type="text"
                                required
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="1 нас (Мөнгөн хонх) / 3 нас (Сэвлэг үргээх)"
                                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Аав, ээжийн нэрс *</label>
                            <input
                              type="text"
                              value={parentsNames}
                              onChange={(e) => setParentsNames(e.target.value)}
                              placeholder="Аав Т.Баттулга, Ээж С.Ариунаа"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                        </>
                      )}

                      {isClanCat && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Ургийн овог / Овгийн нэр *</label>
                            <input
                              type="text"
                              required
                              value={clanName || groomName}
                              onChange={(e) => {
                                setClanName(e.target.value);
                                setGroomName(e.target.value);
                              }}
                              placeholder="Боржигон овог"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Ахмадууд / Зохион байгуулах зөвлөл</label>
                            <input
                              type="text"
                              value={clanLeader}
                              onChange={(e) => setClanLeader(e.target.value)}
                              placeholder="Аав, ах нарын зөвлөл"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                        </div>
                      )}

                      {isGraduationCat && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Төгсөгчийн нэр / Анги *</label>
                            <input
                              type="text"
                              required
                              value={graduateName || groomName}
                              onChange={(e) => {
                                setGraduateName(e.target.value);
                                setGroomName(e.target.value);
                              }}
                              placeholder="Б.Билгүүн / МУИС 4-р курс"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Сургууль / Мэргэжил *</label>
                            <input
                              type="text"
                              value={schoolName}
                              onChange={(e) => setSchoolName(e.target.value)}
                              placeholder="Монгол Улсын Их Сургууль"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                        </div>
                      )}

                      {isCorporateCat && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Байгууллага / Арга хэмжээний нэр *</label>
                            <input
                              type="text"
                              required
                              value={companyName || groomName}
                              onChange={(e) => {
                                setCompanyName(e.target.value);
                                setGroomName(e.target.value);
                              }}
                              placeholder='"Аура Трейд" ХХК'
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Баярын утга / Жилийн ой *</label>
                            <input
                              type="text"
                              value={eventTitle}
                              onChange={(e) => setEventTitle(e.target.value)}
                              placeholder="10 Жилийн Ойн Баяр / Нээлтийн Ёслол"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                        </div>
                      )}

                      {!isWeddingCat && !isBirthdayCat && !isKidsCat && !isClanCat && !isGraduationCat && !isCorporateCat && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Арга хэмжээний эзэн / Зохион байгуулагч *</label>
                            <input
                              type="text"
                              required
                              value={groomName}
                              onChange={(e) => setGroomName(e.target.value)}
                              placeholder="Д.Болд"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-stone-300 font-semibold block">Баярын гарчиг / Утга *</label>
                            <input
                              type="text"
                              value={eventTitle}
                              onChange={(e) => setEventTitle(e.target.value)}
                              placeholder="Хүндэтгэлийн баярын урилга"
                              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                            />
                          </div>
                        </div>
                      )}

                      {/* EVENT DATE & TIME */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-stone-300 font-semibold block">Баяр Болох Огноо *</label>
                          <input
                            type="text"
                            required
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-stone-300 font-semibold block">Эхлэх Цаг *</label>
                          <input
                            type="text"
                            required
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-stone-300 font-semibold block">Ресторан / Заалны Нэр & Хаяг *</label>
                        <input
                          type="text"
                          required
                          value={locationName}
                          onChange={(e) => setLocationName(e.target.value)}
                          placeholder="Шангри-Ла Улаанбаатар"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-white focus:border-[#d4af37] focus:outline-none min-h-[44px]"
                        />
                      </div>

                      <div className="p-3 bg-stone-950 border border-stone-800 rounded-xl text-[11px] text-stone-300 leading-relaxed">
                        💡 <strong>Зөвлөмж:</strong> Тансаг урилгын зураг (цомог) болон арын тусгай аялгууны холбоосыг захиалга баталгаажсаны дараа манай мэргэжлийн баг тантай холбогдон нэгтгэж бэлтгэнэ.
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setFormStep(1)}
                          className="w-1/3 bg-stone-800 hover:bg-stone-700 text-white font-semibold py-3 rounded-xl text-xs transition-all min-h-[44px]"
                        >
                          Буцах
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormStep(3)}
                          className="w-2/3 bg-[#d4af37] text-slate-950 font-bold py-3 rounded-xl text-xs hover:bg-[#e5be48] transition-all flex items-center justify-center gap-2 min-h-[44px]"
                        >
                          <span>Дараах: Төлбөр Баталгаажуулах</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* STEP 3: PAYMENT & SUBMIT */}
                {formStep === 3 && (
                  <div className="space-y-4">
                    <h4 className="font-bold text-sm text-[#f9e5af]">3. Төлбөр & Захиалга Илгээх</h4>

                    <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-stone-800">
                        <span className="text-stone-400">Үйлчилгээний нөхцөл:</span>
                        <span className="font-bold text-[#f9e5af]">1 Урилга • 1 Сарын Хязгааргүй Илгээх Эрх</span>
                      </div>
                      <div className="flex justify-between items-center text-xs pb-2 border-b border-stone-800">
                        <span className="text-stone-400">Төлөх дүнг:</span>
                        <span className="font-bold text-white text-base font-serif">49,000₮</span>
                      </div>

                      {/* Bank Details & Contact */}
                      <div className="bg-stone-900 p-3.5 rounded-xl border border-amber-500/30 space-y-3 text-center">
                        <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider block">Дансны мэдээлэл & Зөвлөх</span>
                        <p className="text-xs font-semibold text-white">Хаан Банк: <span className="font-mono text-[#f9e5af]">5000 123 456</span></p>
                        <p className="text-[11px] text-stone-300">
                          Гүйлгээний утга (Заавал): <span className="font-mono text-emerald-400 font-bold">{customerEmail || 'Gmail хаяг'} {customerPhone || 'Утас'}</span>
                        </p>

                        <div className="pt-2 border-t border-stone-800">
                          <a
                            href="https://www.facebook.com/profile.php?id=100063605375824"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 min-h-[44px]"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Мэргэжлийн Зөвлөхтэй Чатлах (Фэйсбүүк)</span>
                          </a>
                        </div>
                      </div>

                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-[11px] text-amber-200/90 leading-relaxed">
                        ⚠️ <strong>Санамж:</strong> Төлбөр баталгаажсаны дараа <strong>2 - 8 цагийн дотор</strong> манай мэргэжлийн баг таны цахим урилгыг бэлтгэж, тусгай холбоосыг нээнэ.
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setFormStep(2)}
                        className="w-1/3 bg-stone-800 hover:bg-stone-700 text-white font-semibold py-3 rounded-xl text-xs transition-all min-h-[44px]"
                      >
                        Буцах
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 bg-gradient-to-r from-[#d4af37] via-[#f9e5af] to-[#b38b2d] hover:from-[#e5be48] hover:to-[#fcebc4] text-slate-950 font-bold py-3.5 rounded-xl text-xs transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 min-h-[44px]"
                      >
                        <Send className="w-4 h-4 text-slate-950" />
                        <span>Захиалга Баталгаажуулж Илгээх</span>
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
