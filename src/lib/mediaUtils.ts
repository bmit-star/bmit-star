// Utility functions for media normalization, YouTube audio embedding, and URL generation

/**
 * Extracts a Google Drive File ID from various Drive sharing/viewing URLs
 */
export function extractGoogleDriveId(url: string): string | null {
  if (!url) return null;
  
  // Format 1: drive.google.com/file/d/FILE_ID/view...
  const matchFileD = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD) return matchFileD[1];

  // Format 2: drive.google.com/open?id=FILE_ID or uc?id=FILE_ID
  const matchIdParam = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam) return matchIdParam[1];

  // Format 3: drive.google.com/uc?export=view&id=FILE_ID
  const matchUc = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (matchUc) return matchUc[1];

  return null;
}

/**
 * Normalizes an image URL from Google Drive, Pinterest, or standard CDN
 * so it renders cleanly in <img> tags and background-images without source exposure/redirection issues.
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) return 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
  const trimmed = url.trim();

  // Handle Google Drive Links
  const driveId = extractGoogleDriveId(trimmed);
  if (driveId) {
    // lh3.googleusercontent.com provides direct, high-quality image embedding without Google Drive UI branding
    return `https://lh3.googleusercontent.com/d/${driveId}`;
  }

  // Handle Pinterest Pin Page URLs (e.g. pinterest.com/pin/1234567)
  if (trimmed.includes('pinterest.com/pin/') && !trimmed.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
    // If it's a pinterest pin page, try converting to direct i.pinimg link or fallback gracefully
    // Usually i.pinimg.com links are direct, but if pin page is passed, we handle it:
    return trimmed; 
  }

  return trimmed;
}

/**
 * Extracts YouTube 11-character Video ID from various YouTube URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function extractYouTubeVideoId(url: string | undefined | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

/**
 * Checks if a given music/video URL is a YouTube link
 */
export function isYouTubeUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return Boolean(extractYouTubeVideoId(url));
}

/**
 * Generates a clean, short public invitation URL for guests and clients
 */
export function getShortInvitationUrl(uniqueSlug: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://zallaga.art';
  return `${origin}/invent/${encodeURIComponent(uniqueSlug)}`;
}
