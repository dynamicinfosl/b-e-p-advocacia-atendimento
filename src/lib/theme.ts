// Utilities to extract colors from an image and apply theme variables

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const normalized = hex.replace('#', '').trim();
  const bigint = parseInt(normalized.length === 3 ? normalized.split('').map(c => c + c).join('') : normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max - min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const { r, g, b } = hexToRgb(hex);
  return rgbToHsl(r, g, b);
}

export function applyThemeFromPrimaryHex(hex: string): void {
  if (!hex) return;
  const { h, s, l } = hexToHsl(hex);
  applyThemeFromPrimaryHsl(h, s, l);
}

export function applyThemeFromPrimaryHsl(h: number, s: number, l: number): void {
  const root = document.documentElement;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
  const primary = `${h} ${clamp(s, 30, 95)}% ${clamp(l, 30, 55)}%`;
  const primaryHover = `${h} ${clamp(s, 30, 95)}% ${clamp(l - 8, 20, 50)}%`;
  const primaryMuted = `${h} ${clamp(Math.round(s * 0.7), 20, 80)}% ${clamp(l + 45, 60, 96)}%`;

  root.style.setProperty('--primary', primary);
  root.style.setProperty('--ring', primary);
  root.style.setProperty('--primary-hover', primaryHover);
  root.style.setProperty('--primary-muted', primaryMuted);
  root.style.setProperty('--gradient-primary', `linear-gradient(135deg, hsl(${primary}), hsl(${h} ${s}% ${clamp(l + 5, 35, 65)}%))`);
  root.style.setProperty('--shadow-primary', `0 10px 25px -5px hsl(${h} ${s}% ${l}% / 0.25)`);
  root.style.setProperty('--sidebar-ring', `${h} ${s}% ${l}%`);
}

// Simple dominant color extractor ignoring near-white/near-transparent pixels
export async function extractDominantHex(dataUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const size = 64; // downscale for performance
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        // ignore transparent and near-white
        if (a < 10) continue;
        if (r > 245 && g > 245 && b > 245) continue;
        rSum += r; gSum += g; bSum += b; count++;
      }
      if (!count) return resolve(null);
      const r = Math.round(rSum / count);
      const g = Math.round(gSum / count);
      const b = Math.round(bSum / count);
      const hex = `#${[r, g, b].map(v => v.toString(16).padStart(2, '0')).join('')}`;
      resolve(hex);
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

// Convert near-white pixels to transparent and return a PNG data URL
export async function makeWhiteBackgroundTransparent(
  dataUrl: string,
  threshold: number = 245
): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(null);
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        if (r >= threshold && g >= threshold && b >= threshold) {
          data[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

export async function applySavedThemeFromSettings(): Promise<void> {
  try {
    const raw = localStorage.getItem('companySettings');
    if (!raw) return;
    const parsed = JSON.parse(raw);
    const hex = parsed?.primaryColor as string | undefined;
    if (hex && hex !== '#3b82f6') {
      applyThemeFromPrimaryHex(hex);
      return;
    }

    // Se ainda estiver com a cor azul padrão, tenta extrair da logo salva
    const logo: string | undefined = parsed?.companyLogo;
    if (logo) {
      const extracted = await extractDominantHex(logo);
      if (extracted) {
        applyThemeFromPrimaryHex(extracted);
      }
    }
  } catch (_) {
    // ignore
  }
}


