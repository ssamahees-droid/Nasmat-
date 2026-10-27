/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * cardCanvasGenerator.ts
 * High-resolution HTML5 Canvas rendering engine for «نسمة حياة» identity & introductory cards.
 * Generates crisp 1080x1350 (or 1080x1080) PNG images suitable for social sharing, messaging, and print.
 */

export type CardThemeId = 'emerald' | 'cream' | 'night';

export interface CardConfig {
  theme: CardThemeId;
  tagline: string;
  senderName?: string;
  appUrl?: string;
  logoUrl?: string;
}

export interface CardThemeColors {
  bgGradientStart: string;
  bgGradientEnd: string;
  borderColor: string;
  innerBorderColor: string;
  goldAccent: string;
  titleColor: string;
  subtitleColor: string;
  bodyColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  footerBg: string;
  footerText: string;
}

export const CARD_THEMES: Record<CardThemeId, { name: string; icon: string; colors: CardThemeColors }> = {
  emerald: {
    name: 'زمردي ملكي وذهب',
    icon: '👑',
    colors: {
      bgGradientStart: '#143D32',
      bgGradientEnd: '#092119',
      borderColor: '#D4AF37',
      innerBorderColor: 'rgba(212, 175, 55, 0.4)',
      goldAccent: '#E5C058',
      titleColor: '#FFFFFF',
      subtitleColor: '#A9C5A0',
      bodyColor: '#F0EDE2',
      badgeBg: 'rgba(23, 79, 63, 0.65)',
      badgeBorder: 'rgba(169, 197, 160, 0.35)',
      badgeText: '#E2EFE7',
      footerBg: 'rgba(9, 33, 25, 0.85)',
      footerText: '#A9C5A0'
    }
  },
  cream: {
    name: 'هدوء الفجر والسكينة',
    icon: '🌸',
    colors: {
      bgGradientStart: '#FAF7F0',
      bgGradientEnd: '#ECE7D8',
      borderColor: '#174F3F',
      innerBorderColor: 'rgba(183, 131, 39, 0.5)',
      goldAccent: '#B78327',
      titleColor: '#174F3F',
      subtitleColor: '#23785B',
      bodyColor: '#292F2B',
      badgeBg: '#FFFFFF',
      badgeBorder: '#D5DED7',
      badgeText: '#174F3F',
      footerBg: '#E2EFE7',
      footerText: '#174F3F'
    }
  },
  night: {
    name: 'ليل السكينة والنجوم',
    icon: '✨',
    colors: {
      bgGradientStart: '#101B15',
      bgGradientEnd: '#060B08',
      borderColor: '#38BDF8',
      innerBorderColor: 'rgba(56, 189, 248, 0.35)',
      goldAccent: '#F59E0B',
      titleColor: '#F9FAFB',
      subtitleColor: '#93C5FD',
      bodyColor: '#E5E7EB',
      badgeBg: 'rgba(255, 255, 255, 0.08)',
      badgeBorder: 'rgba(255, 255, 255, 0.15)',
      badgeText: '#F3F4F6',
      footerBg: 'rgba(0, 0, 0, 0.5)',
      footerText: '#9CA3AF'
    }
  }
};

/**
 * Helper to wrap Arabic text on canvas
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine ? `${currentLine} ${words[i]}` : words[i];
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

/**
 * Loads an image with promise and fallback
 */
function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Renders the complete identity card on an HTML5 canvas
 */
export async function renderIdentityCardToCanvas(
  config: CardConfig,
  targetWidth = 1080,
  targetHeight = 1350
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');

  const themeConfig = CARD_THEMES[config.theme] || CARD_THEMES.emerald;
  const c = themeConfig.colors;

  // 1. Background Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, targetHeight);
  bgGrad.addColorStop(0, c.bgGradientStart);
  bgGrad.addColorStop(1, c.bgGradientEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // Subtle ambient glow circles
  const glow1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 400);
  glow1.addColorStop(0, 'rgba(212, 175, 55, 0.12)');
  glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  const glow2 = ctx.createRadialGradient(targetWidth - 200, targetHeight - 300, 10, targetWidth - 200, targetHeight - 300, 450);
  glow2.addColorStop(0, 'rgba(35, 120, 91, 0.16)');
  glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, targetWidth, targetHeight);

  // 2. Outer and Inner Decorative Borders
  const pad = 44;
  ctx.strokeStyle = c.borderColor;
  ctx.lineWidth = 4;
  ctx.strokeRect(pad, pad, targetWidth - pad * 2, targetHeight - pad * 2);

  const innerPad = pad + 16;
  ctx.strokeStyle = c.innerBorderColor;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(innerPad, innerPad, targetWidth - innerPad * 2, targetHeight - innerPad * 2);

  // Corner decorative marks
  const cornerSize = 28;
  const corners = [
    { x: innerPad + 6, y: innerPad + 6 },
    { x: targetWidth - innerPad - 6, y: innerPad + 6 },
    { x: innerPad + 6, y: targetHeight - innerPad - 6 },
    { x: targetWidth - innerPad - 6, y: targetHeight - innerPad - 6 }
  ];
  ctx.fillStyle = c.goldAccent;
  for (const corner of corners) {
    ctx.beginPath();
    ctx.arc(corner.x, corner.y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = c.goldAccent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(corner.x, corner.y, 14, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 3. Logo Rendering (centered at top)
  const logoSize = 160;
  const logoCenterX = targetWidth / 2;
  const logoCenterY = 210;

  // Outer logo glow halo
  const logoHalo = ctx.createRadialGradient(logoCenterX, logoCenterY, logoSize / 2, logoCenterX, logoCenterY, logoSize);
  logoHalo.addColorStop(0, 'rgba(212, 175, 55, 0.3)');
  logoHalo.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = logoHalo;
  ctx.beginPath();
  ctx.arc(logoCenterX, logoCenterY, logoSize, 0, Math.PI * 2);
  ctx.fill();

  const logoImg = await loadImage(config.logoUrl || '/logo.jpg');
  if (logoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(logoCenterX, logoCenterY, logoSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(logoImg, logoCenterX - logoSize / 2, logoCenterY - logoSize / 2, logoSize, logoSize);
    ctx.restore();

    // Circular border around logo
    ctx.strokeStyle = c.borderColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(logoCenterX, logoCenterY, logoSize / 2, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Stylized emblem fallback
    ctx.fillStyle = c.badgeBg;
    ctx.beginPath();
    ctx.arc(logoCenterX, logoCenterY, logoSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = c.borderColor;
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = c.goldAccent;
    ctx.font = 'bold 70px "Cairo", "Tajawal", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🌿', logoCenterX, logoCenterY);
  }

  // 4. App Title & Subtitle
  let currentY = 350;
  ctx.textAlign = 'center';

  // Arabic Title
  ctx.font = '900 64px "Cairo", "Tajawal", sans-serif';
  ctx.fillStyle = c.titleColor;
  ctx.fillText('نَسْمَةُ حَيَاة', logoCenterX, currentY);

  // English Subtitle
  currentY += 46;
  ctx.font = '700 24px "Cairo", "Tajawal", sans-serif';
  ctx.fillStyle = c.goldAccent;
  ctx.letterSpacing = '3px';
  ctx.fillText('NESMAT AL-HAYAT · MENTAL WELLNESS', logoCenterX, currentY);

  // Verification Pill
  currentY += 42;
  const badgeText = '⭐ مبادرة عربية إنسانية موثوقة للاهتمام بالصحة النفسية';
  ctx.font = 'bold 22px "Cairo", "Tajawal", sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 48;
  const badgeHeight = 44;

  ctx.fillStyle = c.badgeBg;
  ctx.strokeStyle = c.badgeBorder;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(logoCenterX - badgeWidth / 2, currentY - badgeHeight / 2, badgeWidth, badgeHeight, 22);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = c.badgeText;
  ctx.textBaseline = 'middle';
  ctx.fillText(badgeText, logoCenterX, currentY);

  // 5. Divider with diamond
  currentY += 45;
  ctx.strokeStyle = c.innerBorderColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(logoCenterX - 220, currentY);
  ctx.lineTo(logoCenterX - 30, currentY);
  ctx.moveTo(logoCenterX + 30, currentY);
  ctx.lineTo(logoCenterX + 220, currentY);
  ctx.stroke();

  ctx.fillStyle = c.goldAccent;
  ctx.beginPath();
  ctx.arc(logoCenterX, currentY, 6, 0, Math.PI * 2);
  ctx.fill();

  // 6. Main Introductory Tagline / Message
  currentY += 60;
  ctx.font = 'bold 34px "Cairo", "Tajawal", sans-serif';
  ctx.fillStyle = c.bodyColor;
  ctx.textBaseline = 'alphabetic';

  const wrappedLines = wrapText(ctx, config.tagline, targetWidth - 220);
  const lineHeight = 54;
  for (const line of wrappedLines) {
    ctx.fillText(line, logoCenterX, currentY);
    currentY += lineHeight;
  }

  // Sender Dedication (if present)
  if (config.senderName && config.senderName.trim()) {
    currentY += 20;
    ctx.font = 'italic 600 24px "Cairo", "Tajawal", sans-serif';
    ctx.fillStyle = c.goldAccent;
    ctx.fillText(`إهداء بكل محبة ومساندة من: ${config.senderName.trim()}`, logoCenterX, currentY);
    currentY += 20;
  }

  // 7. Core Pillars Grid (4 Badges)
  currentY += 40;
  const pillars = [
    { title: 'واحة التنفس والسكينة', icon: '🍃', desc: 'تمارين 432Hz لتهدئة الأعصاب' },
    { title: 'استوديو تفكيك الأفكار', icon: '🧠', desc: 'تطبيق فكّر المعرفي السلوكي' },
    { title: 'مكتبة المعرفة والكتيب', icon: '📖', desc: 'أدلة علمية معتمدة من WHO' },
    { title: 'بستان الألعاب والألغاز', icon: '🧩', desc: 'شفرة نسمة وألغاز التركيب' }
  ];

  const colWidth = (targetWidth - 220 - 24) / 2;
  const rowHeight = 90;
  const startX = 110;

  pillars.forEach((p, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const boxX = startX + col * (colWidth + 24);
    const boxY = currentY + row * (rowHeight + 16);

    ctx.fillStyle = c.badgeBg;
    ctx.strokeStyle = c.badgeBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, colWidth, rowHeight, 18);
    ctx.fill();
    ctx.stroke();

    // Icon
    ctx.font = '32px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(p.icon, boxX + colWidth - 20, boxY + 54);

    // Pillar Title
    ctx.font = 'bold 24px "Cairo", "Tajawal", sans-serif';
    ctx.fillStyle = c.titleColor;
    ctx.textAlign = 'right';
    ctx.fillText(p.title, boxX + colWidth - 68, boxY + 40);

    // Pillar Desc
    ctx.font = '18px "Cairo", "Tajawal", sans-serif';
    ctx.fillStyle = c.subtitleColor;
    ctx.fillText(p.desc, boxX + colWidth - 68, boxY + 68);
  });

  currentY += (rowHeight + 16) * 2 + 30;

  // 8. Official App URL Box
  const rawUrl = config.appUrl || (typeof window !== 'undefined' ? window.location.origin : 'https://nesmat-alhayat.web.app');
  const displayUrl = rawUrl.replace(/^https?:\/\//, '');

  const urlBoxWidth = targetWidth - 220;
  const urlBoxHeight = 72;
  const urlBoxX = 110;
  const urlBoxY = targetHeight - 190;

  ctx.fillStyle = c.footerBg;
  ctx.strokeStyle = c.borderColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(urlBoxX, urlBoxY, urlBoxWidth, urlBoxHeight, 20);
  ctx.fill();
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 24px "Cairo", "Tajawal", monospace';
  ctx.fillStyle = c.goldAccent;
  ctx.fillText(`🔗 الرابط المعتمد: ${displayUrl}`, logoCenterX, urlBoxY + urlBoxHeight / 2);

  // 9. Footer Guarantee Note
  ctx.font = '19px "Cairo", "Tajawal", sans-serif';
  ctx.fillStyle = c.footerText;
  ctx.fillText('🌿 تطبيق عربي آمن ومجاني 100% · يعمل بكامل مزاياه دون إنترنت وبخصوصية مطلقة', logoCenterX, targetHeight - 74);

  return canvas;
}

/**
 * Downloads a canvas as a PNG file
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename = 'nesmat-alhayat-identity-card.png') {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }, 'image/png');
}

/**
 * Shares canvas directly via Web Share API as a file
 */
export async function shareCanvasImage(
  canvas: HTMLCanvasElement,
  title = 'تطبيق نسمة حياة | Nesma Hayat',
  text = '🌿 مساحة عربية للاهتمام بنفسك وفهم مشاعرك والعناية بصحتك النفسية برفق ووعي.',
  url?: string
): Promise<{ success: boolean; method: 'file' | 'link' | 'clipboard' }> {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        resolve({ success: false, method: 'clipboard' });
        return;
      }

      const file = new File([blob], 'nesmat-alhayat-card.png', { type: 'image/png' });
      const targetUrl = url || (typeof window !== 'undefined' ? window.location.origin : 'https://nesmat-alhayat.web.app');

      // 1. Try native Web Share API with file
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title,
            text,
            url: targetUrl
          });
          resolve({ success: true, method: 'file' });
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            resolve({ success: false, method: 'file' });
            return;
          }
        }
      }

      // 2. Try native Web Share without file
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare({ title, text, url: targetUrl })) {
        try {
          await navigator.share({ title, text, url: targetUrl });
          downloadCanvasAsPng(canvas);
          resolve({ success: true, method: 'link' });
          return;
        } catch (_) {}
      }

      // 3. Fallback: Copy to clipboard & trigger download
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(`${title}\n${text}\n${targetUrl}`);
        }
        downloadCanvasAsPng(canvas);
        resolve({ success: true, method: 'clipboard' });
      } catch (_) {
        downloadCanvasAsPng(canvas);
        resolve({ success: true, method: 'clipboard' });
      }
    }, 'image/png');
  });
}
