/**
 * Utility functions for client-side WebP image conversion and thumbnail generation
 */

export async function convertFileToWebP(file: File, maxWidth = 1920, quality = 0.85): Promise<{ webpBlob: Blob; dataUrl: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('WebP conversion failed'));
            return;
          }
          const dataUrl = canvas.toDataURL('image/webp', quality);
          resolve({ webpBlob: blob, dataUrl });
        },
        'image/webp',
        quality
      );
    };

    img.onerror = () => reject(new Error('Image loading failed'));
    reader.onerror = () => reject(new Error('File reading failed'));

    reader.readAsDataURL(file);
  });
}

export async function createImageThumbnail(file: File, maxDim = 300, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/webp', quality));
    };

    img.onerror = () => reject(new Error('Image thumbnail generation failed'));
    reader.onerror = () => reject(new Error('File reading failed'));

    reader.readAsDataURL(file);
  });
}
