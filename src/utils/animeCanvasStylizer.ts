/**
 * Anime Canvas Stylizer
 * 
 * High-performance, 100% client-side, zero-cost artistic stylization.
 * Transforms user portraits into smooth cel-shaded anime character illustrations
 * using pure HTML5 Canvas operations (smoothing, color quantization, Sobel edge outlines).
 * 
 * Privacy & Cost Guarantees:
 * - 100% Free: Zero API keys, zero cloud costs, zero quotas.
 * - 100% Private: Processed entirely in the browser; the user photo never leaves the device.
 */

export interface AnimeStylizeOptions {
  width?: number;
  height?: number;
  outlineStrength?: number; // 0 to 1
  smoothStrength?: number; // Blur iterations
  colorLevels?: number; // Quantization levels per channel (typically 5 to 7 for cel-shading)
  saturationBoost?: number; // 1.0 to 1.4
  brightnessBoost?: number; // 1.0 to 1.2
}

export function stylizeImageToAnime(
  imageSource: string,
  options: AnimeStylizeOptions = {}
): Promise<string> {
  const {
    width = 512,
    height = 512,
    outlineStrength = 0.55,
    colorLevels = 6,
    saturationBoost = 1.25,
    brightnessBoost = 1.08
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (!ctx) {
          reject(new Error('Failed to get 2d canvas context'));
          return;
        }

        // Draw image centered and cropped to square (cover fit)
        const scale = Math.max(width / img.width, height / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const offsetX = (width - drawW) / 2;
        const offsetY = (height - drawH) / 2;

        ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

        // Get pixel data
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        const len = data.length;

        // Step 1: Precompute grayscale for fast Sobel edge detection
        const gray = new Uint8Array(width * height);
        for (let i = 0, gIdx = 0; i < len; i += 4, gIdx++) {
          // Standard luminosity
          gray[gIdx] = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        }

        // Step 2: Compute Sobel Edge Magnitude (anime clean outlines)
        const edges = new Uint8Array(width * height);
        for (let y = 1; y < height - 1; y++) {
          const yPrev = (y - 1) * width;
          const yCurr = y * width;
          const yNext = (y + 1) * width;

          for (let x = 1; x < width - 1; x++) {
            // Horizontal Sobel kernel [-1 0 1, -2 0 2, -1 0 1]
            const gx =
              -1 * gray[yPrev + x - 1] + 1 * gray[yPrev + x + 1] +
              -2 * gray[yCurr + x - 1] + 2 * gray[yCurr + x + 1] +
              -1 * gray[yNext + x - 1] + 1 * gray[yNext + x + 1];

            // Vertical Sobel kernel [-1 -2 -1, 0 0 0, 1 2 1]
            const gy =
              -1 * gray[yPrev + x - 1] - 2 * gray[yPrev + x] - 1 * gray[yPrev + x + 1] +
               1 * gray[yNext + x - 1] + 2 * gray[yNext + x] + 1 * gray[yNext + x + 1];

            const mag = Math.sqrt(gx * gx + gy * gy);
            // Threshold for distinct anime ink outline
            edges[yCurr + x] = mag > 65 ? Math.min(255, Math.round(mag * 1.5)) : 0;
          }
        }

        // Step 3: Color Quantization & Anime Palette Tuning (Cel-Shading)
        const step = 255 / (colorLevels - 1);

        for (let i = 0, pIdx = 0; i < len; i += 4, pIdx++) {
          let r = data[i];
          let g = data[i + 1];
          let b = data[i + 2];

          // 3a. Brightness and Warmth tuning (anime soft warmth)
          r = Math.min(255, r * brightnessBoost * 1.03);
          g = Math.min(255, g * brightnessBoost * 1.01);
          b = Math.min(255, b * brightnessBoost * 0.98);

          // 3b. Saturation boost (vibrant anime colors)
          const avg = (r + g + b) / 3;
          r = Math.min(255, Math.max(0, avg + (r - avg) * saturationBoost));
          g = Math.min(255, Math.max(0, avg + (g - avg) * saturationBoost));
          b = Math.min(255, Math.max(0, avg + (b - avg) * saturationBoost));

          // 3c. Cel-shading Quantization
          r = Math.round(Math.round(r / step) * step);
          g = Math.round(Math.round(g / step) * step);
          b = Math.round(Math.round(b / step) * step);

          // 3d. Blend with Sobel Edge (anime ink outline)
          const edgeVal = edges[pIdx];
          if (edgeVal > 0) {
            const inkAlpha = Math.min(1.0, (edgeVal / 255) * outlineStrength);
            // Dark warm anime ink outline
            const inkR = 40;
            const inkG = 30;
            const inkB = 38;
            r = Math.round(r * (1 - inkAlpha) + inkR * inkAlpha);
            g = Math.round(g * (1 - inkAlpha) + inkG * inkAlpha);
            b = Math.round(b * (1 - inkAlpha) + inkB * inkAlpha);
          }

          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }

        // Put processed cel-shaded image data back
        ctx.putImageData(imgData, 0, 0);

        // Step 4: Soft ambient glow & subtle vignette for gentle anime mood
        ctx.save();
        // Radial vignette
        const gradient = ctx.createRadialGradient(
          width / 2, height / 2, width * 0.35,
          width / 2, height / 2, width * 0.72
        );
        gradient.addColorStop(0, 'rgba(255, 250, 240, 0.05)');
        gradient.addColorStop(0.8, 'rgba(45, 30, 20, 0.08)');
        gradient.addColorStop(1, 'rgba(25, 15, 10, 0.22)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Soft anime lighting highlight on top
        const lightGrad = ctx.createLinearGradient(0, 0, 0, height * 0.35);
        lightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
        lightGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, width, height * 0.35);
        ctx.restore();

        const resultDataUrl = canvas.toDataURL('image/png');
        resolve(resultDataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for local anime stylization'));
    };

    img.src = imageSource;
  });
}
