import { Order, Template, Customer, RSVP, Wish, ChangeRequest, AdminInvitation } from '../types';
import { INITIAL_ORDERS, INITIAL_TEMPLATES, INITIAL_CUSTOMERS } from '../data/mockData';

const ORDERS_KEY = 'aistudio_invitations_orders_v1';
const TEMPLATES_KEY = 'aistudio_invitations_templates_v1';
const CUSTOMERS_KEY = 'aistudio_invitations_customers_v1';
const ADMIN_INVITATIONS_KEY = 'aistudio_admin_invitations_v1';

const INITIAL_ADMIN_INVITATIONS: AdminInvitation[] = [
  {
    id: 'adm-inv-101',
    recipientName: 'Бат-Эрдэнэ',
    recipientEmail: 'bat.erdene@zallaga.mn',
    role: 'Manager',
    token: 'adm_tok_9918231a',
    status: 'pending',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 48).toISOString(),
    createdByName: 'Ерөнхий Админ',
    note: 'Маркетинг багийн захиалга хариуцсан менежерээр урьж байна.',
    sentViaEmail: true
  },
  {
    id: 'adm-inv-102',
    recipientName: 'Саруул',
    recipientEmail: 'saruul.customer@zallaga.mn',
    role: 'Support',
    token: 'adm_tok_8827361b',
    status: 'accepted',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 24).toISOString(),
    createdByName: 'Систем Админ',
    note: 'Харилцагчийн дэмжлэг болон чат систем хариуцна.',
    sentViaEmail: true,
    acceptedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  }
];

export const getStoredAdminInvitations = (): AdminInvitation[] => {
  try {
    const raw = localStorage.getItem(ADMIN_INVITATIONS_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_INVITATIONS_KEY, JSON.stringify(INITIAL_ADMIN_INVITATIONS));
      return INITIAL_ADMIN_INVITATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse admin invitations', e);
    return INITIAL_ADMIN_INVITATIONS;
  }
};

export const saveStoredAdminInvitations = (invitations: AdminInvitation[]): void => {
  try {
    localStorage.setItem(ADMIN_INVITATIONS_KEY, JSON.stringify(invitations));
  } catch (e) {
    console.error('Failed to save admin invitations', e);
  }
};

export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse stored orders', e);
    return INITIAL_ORDERS;
  }
};

export const saveStoredOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save orders', e);
  }
};

export const getStoredTemplates = (): Template[] => {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (!raw) {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(INITIAL_TEMPLATES));
      return INITIAL_TEMPLATES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(INITIAL_TEMPLATES));
      return INITIAL_TEMPLATES;
    }

    // Keep exactly one editable template for every public event category.
    const normalized = INITIAL_TEMPLATES.map((primary) =>
      parsed.find((template: Template) => template.category === primary.category) || primary
    );
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (e) {
    console.error('Failed to parse templates', e);
    return INITIAL_TEMPLATES;
  }
};

export const saveStoredTemplates = (templates: Template[]): void => {
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  } catch (e) {
    console.error('Failed to save templates', e);
  }
};

export const getStoredCustomers = (): Customer[] => {
  try {
    const raw = localStorage.getItem(CUSTOMERS_KEY);
    if (!raw) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse customers', e);
    return INITIAL_CUSTOMERS;
  }
};

export const saveStoredCustomers = (customers: Customer[]): void => {
  try {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  } catch (e) {
    console.error('Failed to save customers', e);
  }
};

// Helper to generate secure random unique slugs
export const generateSecureSlug = (prefix = 'urilga'): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let randomStr = '';
  for (let i = 0; i < 8; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${randomStr}`;
};

// Helper to update a specific order by ID
export const updateOrderInStorage = (updatedOrder: Order): Order[] => {
  const current = getStoredOrders();
  const idx = current.findIndex(o => o.id === updatedOrder.id);
  if (idx !== -1) {
    current[idx] = updatedOrder;
  } else {
    current.unshift(updatedOrder);
  }
  saveStoredOrders(current);
  return current;
};

// Helper for Guest RSVP submission
export const addRsvpToOrder = (orderId: string, rsvpData: Omit<RSVP, 'id' | 'submittedAt'>): Order | null => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const newRsvp: RSVP = {
    ...rsvpData,
    id: 'rsvp-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    submittedAt: new Date().toISOString()
  };

  order.invitationData.rsvps = [newRsvp, ...(order.invitationData.rsvps || [])];
  updateOrderInStorage(order);
  return order;
};

// Helper for Guest Wish submission
export const addWishToOrder = (orderId: string, wishData: Omit<Wish, 'id' | 'submittedAt'>): Order | null => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const newWish: Wish = {
    ...wishData,
    id: 'wish-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    submittedAt: new Date().toISOString()
  };

  order.invitationData.wishes = [newWish, ...(order.invitationData.wishes || [])];
  updateOrderInStorage(order);
  return order;
};

// Helper for Customer Change Request submission
export const addChangeRequestToOrder = (orderId: string, note: string): Order | null => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const newCr: ChangeRequest = {
    id: 'cr-' + Date.now(),
    requestedAt: new Date().toISOString(),
    note,
    status: 'Pending'
  };

  order.changeRequests = [newCr, ...(order.changeRequests || [])];
  updateOrderInStorage(order);
  return order;
};

// Helper to increment view count
export const incrementOrderViews = (orderId: string): void => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.viewsCount = (order.viewsCount || 0) + 1;
    updateOrderInStorage(order);
  }
};

// Photo Wall Helpers (V2.2)
export const addPhotoToPhotoWall = (
  orderId: string,
  photoData: {
    uploaderName: string;
    uploaderPhone?: string;
    imageUrl: string;
    thumbnailUrl?: string;
    imageHash?: string;
    similarityMatchId?: string;
    similarityPercent?: number;
    caption?: string;
    status?: 'pending' | 'approved' | 'rejected';
  }
): Order | null => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const requireApproval = order.invitationData.photoWallSettings?.requireApproval ?? true;
  const initialStatus = photoData.status || (requireApproval ? 'pending' : 'approved');

  const newPhoto = {
    id: 'pw-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
    uploaderName: photoData.uploaderName,
    uploaderPhone: photoData.uploaderPhone,
    imageUrl: photoData.imageUrl,
    thumbnailUrl: photoData.thumbnailUrl || photoData.imageUrl,
    imageHash: photoData.imageHash,
    similarityMatchId: photoData.similarityMatchId,
    similarityPercent: photoData.similarityPercent,
    caption: photoData.caption,
    status: initialStatus,
    submittedAt: new Date().toISOString(),
    likesCount: 0
  };

  const existing = order.invitationData.photoWallPhotos || [];
  order.invitationData.photoWallPhotos = [newPhoto, ...existing];
  updateOrderInStorage(order);
  return order;
};

export const updatePhotoWallStatus = (
  orderId: string,
  photoId: string,
  newStatus: 'pending' | 'approved' | 'rejected'
): Order | null => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order || !order.invitationData.photoWallPhotos) return null;

  order.invitationData.photoWallPhotos = order.invitationData.photoWallPhotos.map(p => {
    if (p.id === photoId) {
      return { ...p, status: newStatus };
    }
    return p;
  });

  updateOrderInStorage(order);
  return order;
};

export const batchApprovePendingPhotos = (orderId: string): Order | null => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order || !order.invitationData.photoWallPhotos) return null;

  order.invitationData.photoWallPhotos = order.invitationData.photoWallPhotos.map(p => ({
    ...p,
    status: 'approved'
  }));

  updateOrderInStorage(order);
  return order;
};

export const deletePhotoWallPhoto = (orderId: string, photoId: string): Order | null => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order || !order.invitationData.photoWallPhotos) return null;

  order.invitationData.photoWallPhotos = order.invitationData.photoWallPhotos.filter(p => p.id !== photoId);

  updateOrderInStorage(order);
  return order;
};

export const togglePhotoWallLike = (orderId: string, photoId: string): Order | null => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order || !order.invitationData.photoWallPhotos) return null;

  order.invitationData.photoWallPhotos = order.invitationData.photoWallPhotos.map(p => {
    if (p.id === photoId) {
      return { ...p, likesCount: (p.likesCount || 0) + 1 };
    }
    return p;
  });

  updateOrderInStorage(order);
  return order;
};

export const updatePhotoWallSettingsInStorage = (
  orderId: string,
  settings: Partial<NonNullable<Order['invitationData']['photoWallSettings']>>
): Order | null => {
  const orders = getStoredOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return null;

  const currentSettings = order.invitationData.photoWallSettings || {
    enabled: true,
    enableAfterEventStarts: false,
    requireApproval: true,
    enableDuplicateFilter: true,
    enableLiveScreen: true
  };

  order.invitationData.photoWallSettings = {
    ...currentSettings,
    ...settings
  };

  updateOrderInStorage(order);
  return order;
};

