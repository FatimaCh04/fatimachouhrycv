/**
 * Resize + re-encode profile picks so Supabase row + network decode stay small (faster loads).
 * Output JPEG by default; preserves transparency only if input is PNG with alpha (keeps PNG, still scaled).
 */
export async function compressProfileImage(file, { maxSide = 720, jpegQuality = 0.85 } = {}) {
  if (!file?.type?.startsWith?.('image/')) return null;
  try {
    const bitmap = await createImageBitmap(file);
    try {
      let w = bitmap.width;
      let h = bitmap.height;
      const scale = Math.min(1, maxSide / Math.max(w, h, 1));
      w = Math.max(1, Math.round(w * scale));
      h = Math.max(1, Math.round(h * scale));

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(bitmap, 0, 0, w, h);

      const mime = 'image/jpeg';
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, mime, jpegQuality));
      if (!blob) return null;
      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(blob);
      });
    } finally {
      bitmap.close?.();
    }
  } catch {
    return null;
  }
}
