export type OrderStatus = 'New' | 'In Preparation' | 'Ready for Preview' | 'Published';

export interface ScheduleItem {
  time: string;
  title: string;
  description?: string;
  iconName?: string;
}

export interface BankDetail {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export interface GiftInfo {
  enabled: boolean;
  qpayQrUrl?: string;
  qpayMerchantName?: string;
  bankDetails: BankDetail[];
  message?: string;
  wishlistUrl?: string;
}

export interface DressCode {
  title: string;
  description: string;
  colorPalette: string[]; // Hex codes or color names
}

export interface PhotoWallPhoto {
  id: string;
  uploaderName: string;
  uploaderPhone?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  imageHash?: string; // Perceptual hash for duplicate filtering (OpenCV imagehash style)
  similarityMatchId?: string; // ID of photo it duplicates
  similarityPercent?: number; // Similarity score 0-100%
  caption?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  likesCount?: number;
}

export interface PhotoWallSettings {
  enabled: boolean;
  enableAfterEventStarts: boolean;
  eventStartTime?: string; // ISO string or format e.g. "2026-08-15T16:00"
  requireApproval: boolean;
  enableDuplicateFilter: boolean;
  enableLiveScreen: boolean;
}

export interface RSVP {
  id: string;
  guestName: string;
  phone?: string;
  attendance: 'attending' | 'maybe' | 'declined';
  guestCount: number;
  mealPreference?: string;
  note?: string;
  submittedAt: string;
  token?: string;
  checkInStatus?: 'checked-in' | 'pending';
  checkInTime?: string;
  deviceFingerprint?: string;
}

export interface Wish {
  id: string;
  guestName: string;
  message: string;
  photoUrl?: string;
  submittedAt: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface InvitationData {
  category?: string; // Category name, e.g. "Хурим", "Төрсөн өдөр", "Сэвлэг үргээх ёслол"...
  
  // Couple & Host Info (Хурим)
  brideName?: string;
  groomName?: string;
  brideParents?: string;
  groomParents?: string;

  // Category Specific Fields
  birthdayPersonName?: string; // Төрсөн өдөр
  age?: string; // Төрсөн өдөр & Хүүхдийн баяр
  childName?: string; // Хүүхдийн баяр & Сэвлэг үргээх
  parentsNames?: string; // Хүүхдийн баяр
  birthDate?: string; // Сэвлэг үргээх
  fatherName?: string; // Сэвлэг үргээх
  motherName?: string; // Сэвлэг үргээх
  blessingText?: string; // Сэвлэг үргээх / Ерөөл
  clanName?: string; // Ургийн баяр
  familySurname?: string; // Ургийн баяр
  clanLeader?: string; // Ургийн баяр
  graduateName?: string; // Төгсөлт
  schoolName?: string; // Төгсөлт
  className?: string; // Төгсөлт
  companyName?: string; // Байгууллагын арга хэмжээ, Нээлт, Шагнал гардуулах
  deceasedName?: string; // Дурсгалын арга хэмжээ
  
  // Custom Dynamic Fields ("Бусад")
  customFields?: CustomField[];
  
  // Event Essentials
  eventTitle: string; // e.g., "The Wedding of Alexander & Sophia"
  invitationMessage: string;
  date: string; // e.g., "2026 оны 8 сарын 15"
  time: string; // e.g., "16:00 цагт"
  locationName: string; // e.g., "Шангри-Ла Улаанбаатар"
  address: string; // e.g., "Сүхбаатар дүүрэг, Олимпийн гудамж 19"
  googleMapsEmbedUrl?: string;
  googleMapsDirectUrl?: string;

  // Media
  heroPhotoUrl: string;
  couplePhotos: string[];
  videoUrl?: string;

  // Custom Options & Style
  themeColor: string; // e.g., '#C5A059' (Champagne Gold)
  secondaryColor?: string; // e.g., '#1B2A22' (Emerald)
  backgroundMusicUrl?: string;
  backgroundMusicTitle?: string;

  // Dynamic Sections
  schedule: ScheduleItem[];
  dressCode: DressCode;
  giftInfo: GiftInfo;
  
  // Feature Toggles
  showCountdown: boolean;
  showMusicPlayer: boolean;
  showGallery: boolean;
  showQrCode: boolean;
  showRsvp: boolean;
  showGuestBook: boolean;
  showLiveStream: boolean;
  liveStreamUrl?: string;

  // Interactive Content
  rsvps: RSVP[];
  wishes: Wish[];
  photoWallPhotos?: PhotoWallPhoto[];
  photoWallSettings?: PhotoWallSettings;
}

export interface Template {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  colorTheme: string;
  animationType: string;
  musicTitle: string;
  musicUrl: string;
  responsiveLayout: string;
  sections: string[];
  status: string;
  version: string;
  isPremium: boolean;
  sampleData: Partial<InvitationData>;
}

export interface ChangeRequest {
  id: string;
  requestedAt: string;
  note: string;
  status: 'Pending' | 'Applied' | 'Rejected';
  adminResponse?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  templateId: string;
  templateTitle: string;
  status: OrderStatus;
  createdAt: string;
  invitationData: InvitationData;
  uniqueSlug: string;
  changeRequests: ChangeRequest[];
  viewsCount: number;
  aiCallCount?: number;
  
  // Storage & Cloudinary Lifecycle (30 Days retention policy)
  storageExpiresAt?: string; // ISO string 30 days after creation
  storageWarningSent?: boolean; // Sent 5 days prior to expiration (at day 25)
  storageWarningSentAt?: string;
  storageStatus?: 'active' | 'warning' | 'expired' | 'deleted';
  cloudinaryFolder?: string;
  cloudinaryFilesCount?: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders?: number;
  activeInvitations?: number;
  lastOrderDate?: string;
  registeredAt?: string;
  associatedOrderIds?: string[];
  notes?: string;
}

export interface Analytics {
  totalViews: number;
  uniqueVisitors: number;
  totalRsvps: number;
  attendingCount: number;
  declinedCount: number;
  totalWishes: number;
  giftsClickedCount: number;
  viewsByDevice: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
}

export type AdminRole = 'Super Admin' | 'Manager' | 'Support' | 'Moderator' | 'Editor';

export type AdminInvitationStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export interface AdminInvitation {
  id: string;
  recipientName: string;
  recipientEmail: string;
  role: AdminRole;
  token: string;
  status: AdminInvitationStatus;
  createdAt: string;
  expiresAt: string;
  createdByName?: string;
  note?: string;
  sentViaEmail?: boolean;
  acceptedAt?: string;
}
