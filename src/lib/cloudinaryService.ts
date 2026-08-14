import { Order } from '../types';
import { authenticatedFetch } from './authenticatedFetch';

export interface CloudinaryConfig {
  success: boolean;
  cloudName: string;
  retentionDays: number; // 30
  warningDaysBeforeExpiration: number; // 5
  status: string;
  folderPrefix: string;
  message: string;
}

export interface CloudinaryUploadResult {
  success: boolean;
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  folder: string;
  createdAt: string;
  error?: string;
}

export interface RetentionCheckResult {
  success: boolean;
  timestamp: string;
  checkedCount: number;
  processedOrders: (Order & {
    storageExpiresAt: string;
    daysRemaining: number;
    notificationTriggered?: string | null;
  })[];
  logs: string[];
}

/**
 * Cloudinary Storage & 30-Day Retention Policy Service
 */
export class CloudinaryService {
  /**
   * Uploads base64 or File object to Cloudinary under order's storage folder
   */
  static async uploadImage(image: string | File, orderId: string = 'general'): Promise<CloudinaryUploadResult> {
    try {
      let imageData: string;

      if (typeof image === 'string') {
        imageData = image;
      } else {
        imageData = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (e) => reject(e);
          reader.readAsDataURL(image);
        });
      }

      const response = await authenticatedFetch('/api/cloudinary/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imageData,
          orderId,
          folderName: `zallaga_invitations/${orderId}`
        })
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Cloudinary руу файл хуулахад алдаа гарлаа.');
      }

      return data;
    } catch (err: any) {
      console.error('CloudinaryService uploadImage error:', err);
      return {
        success: false,
        url: typeof image === 'string' && image.startsWith('data:') ? image : '',
        publicId: '',
        format: 'webp',
        bytes: 0,
        folder: `zallaga_invitations/${orderId}`,
        createdAt: new Date().toISOString(),
        error: err?.message || 'Сүлжээний алдаа'
      };
    }
  }

  /**
   * Evaluates 30-day storage retention policy and triggers 5-day prior warnings
   */
  static async checkStorageRetention(orders: Order[]): Promise<RetentionCheckResult | null> {
    try {
      const response = await authenticatedFetch('/api/cloudinary/cleanup-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orders })
      });
      return await response.json();
    } catch (err) {
      console.error('CloudinaryService checkStorageRetention error:', err);
      return null;
    }
  }

  /**
   * Retrieves server Cloudinary storage policy configuration
   */
  static async getConfig(): Promise<CloudinaryConfig | null> {
    try {
      const response = await authenticatedFetch('/api/cloudinary/config');
      return await response.json();
    } catch (err) {
      console.error('CloudinaryService getConfig error:', err);
      return null;
    }
  }

  /**
   * Deletes all resources in order's Cloudinary storage folder
   */
  static async deleteFolder(orderId: string): Promise<boolean> {
    try {
      const response = await authenticatedFetch(`/api/cloudinary/folder/${orderId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      return Boolean(data.success);
    } catch (err) {
      console.error('CloudinaryService deleteFolder error:', err);
      return false;
    }
  }

  /**
   * Calculates retention time metrics for a given order
   */
  static getOrderStorageInfo(order: Order) {
    const createdAtMs = new Date(order.createdAt || Date.now()).getTime();
    const RETENTION_MS = 30 * 24 * 60 * 60 * 1000; // 30 Days
    const expiresAtMs = createdAtMs + RETENTION_MS;
    const nowMs = Date.now();
    const remainingMs = expiresAtMs - nowMs;
    const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));
    const ageDays = Math.floor((nowMs - createdAtMs) / (1000 * 60 * 60 * 24));

    const isWarning = remainingDays <= 5 && remainingDays > 0;
    const isExpired = remainingDays === 0;

    return {
      createdAt: new Date(createdAtMs).toLocaleDateString('mn-MN'),
      expiresAt: new Date(expiresAtMs).toLocaleDateString('mn-MN'),
      remainingDays,
      ageDays,
      isWarning,
      isExpired,
      status: isExpired ? 'expired' : isWarning ? 'warning' : 'active'
    };
  }
}
