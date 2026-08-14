/**
 * Image Processing Utility for Photo Wall (V2.2)
 * Features:
 * 1. Convert image to optimized WebP format
 * 2. Generate compact WebP thumbnails
 * 3. Calculate 64-bit Perceptual Image Hash (dHash / pHash algorithm, OpenCV imagehash equivalent)
 * 4. Duplicate comparison via Hamming distance algorithm
 */

export interface ProcessedImageResult {
  fullWebPUrl: string;
  thumbnailWebPUrl: string;
  imageHash: string;
}

/**
 * Reads a File object as HTMLImageElement
 */
export const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

/**
 * Converts image to WebP format with optional scaling
 */
export const convertToWebP = (
  img: HTMLImageElement,
  maxWidth: number = 1600,
  maxHeight: number = 1600,
  quality: number = 0.85
): string => {
  const canvas = document.createElement('canvas');
  let width = img.width;
  let height = img.height;

  // Scale down maintaining aspect ratio if larger than bounds
  if (width > maxWidth || height > maxHeight) {
    if (width / height > maxWidth / maxHeight) {
      height = Math.round((height * maxWidth) / width);
      width = maxWidth;
    } else {
      width = Math.round((width * maxHeight) / height);
      height = maxHeight;
    }
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  // Fill black/transparent backdrop if needed
  ctx.drawImage(img, 0, 0, width, height);

  try {
    return canvas.toDataURL('image/webp', quality);
  } catch (err) {
    console.warn('WebP conversion fallback to jpeg:', err);
    return canvas.toDataURL('image/jpeg', quality);
  }
};

/**
 * Generates compact WebP thumbnail
 */
export const generateWebPThumbnail = (
  img: HTMLImageElement,
  maxSize: number = 360,
  quality: number = 0.70
): string => {
  return convertToWebP(img, maxSize, maxSize, quality);
};

/**
 * Computes 64-bit Perceptual Difference Hash (dHash) on 9x8 grayscale canvas matrix
 * (Compatible with Python OpenCV + imagehash.dhash)
 */
export const computePerceptualHash = (img: HTMLImageElement): string => {
  const canvas = document.createElement('canvas');
  // 9 columns x 8 rows allows comparing adjacent pixels horizontally (8 x 8 = 64 comparisons)
  canvas.width = 9;
  canvas.height = 8;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '0000000000000000';

  ctx.drawImage(img, 0, 0, 9, 8);
  const imageData = ctx.getImageData(0, 0, 9, 8);
  const data = imageData.data;

  // Convert to 9x8 grayscale matrix
  const grays: number[][] = [];
  for (let y = 0; y < 8; y++) {
    const row: number[] = [];
    for (let x = 0; x < 9; x++) {
      const idx = (y * 9 + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Standard luminance formula
      const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
      row.push(gray);
    }
    grays.push(row);
  }

  // Calculate difference bit string (1 if left pixel < right pixel else 0)
  let binaryString = '';
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      binaryString += grays[y][x] < grays[y][x + 1] ? '1' : '0';
    }
  }

  // Convert 64-bit binary string into 16-character hex string
  let hexString = '';
  for (let i = 0; i < 64; i += 4) {
    const nibble = binaryString.substr(i, 4);
    hexString += parseInt(nibble, 2).toString(16);
  }

  return hexString;
};

/**
 * Calculates Hamming Distance between two hex hash strings
 */
export const calculateHammingDistance = (hash1: string, hash2: string): number => {
  if (!hash1 || !hash2 || hash1.length !== hash2.length) return 64;

  let distance = 0;
  for (let i = 0; i < hash1.length; i++) {
    const val1 = parseInt(hash1[i], 16);
    const val2 = parseInt(hash2[i], 16);
    let xorVal = val1 ^ val2;

    // Count set bits
    while (xorVal > 0) {
      distance += xorVal & 1;
      xorVal >>= 1;
    }
  }

  return distance;
};

/**
 * Checks if new image is a duplicate of any existing photo in the gallery
 * Hamming distance <= 10 out of 64 bits = threshold for high similarity (~85%+ match)
 */
export const checkDuplicateImage = (
  newHash: string,
  existingPhotos: { id: string; imageHash?: string }[],
  maxDistanceThreshold: number = 10
): { isDuplicate: boolean; matchId?: string; similarityPercent: number } => {
  if (!newHash || existingPhotos.length === 0) {
    return { isDuplicate: false, similarityPercent: 0 };
  }

  let bestMatchId: string | undefined;
  let minDistance = 64;

  for (const photo of existingPhotos) {
    if (!photo.imageHash) continue;
    const dist = calculateHammingDistance(newHash, photo.imageHash);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatchId = photo.id;
    }
  }

  const similarityPercent = Math.max(0, Math.round(((64 - minDistance) / 64) * 100));

  if (minDistance <= maxDistanceThreshold) {
    return {
      isDuplicate: true,
      matchId: bestMatchId,
      similarityPercent
    };
  }

  return {
    isDuplicate: false,
    matchId: bestMatchId,
    similarityPercent
  };
};

/**
 * Complete pipeline for processing an uploaded photo
 */
export const processUploadedPhoto = async (
  file: File
): Promise<ProcessedImageResult> => {
  const img = await loadImageFromFile(file);
  const fullWebPUrl = convertToWebP(img, 1600, 1600, 0.85);
  const thumbnailWebPUrl = generateWebPThumbnail(img, 360, 0.70);
  const imageHash = computePerceptualHash(img);

  return {
    fullWebPUrl,
    thumbnailWebPUrl,
    imageHash
  };
};
