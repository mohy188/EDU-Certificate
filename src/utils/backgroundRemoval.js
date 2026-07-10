/**
 * Client-side background removal and transparency tools using HTML5 Canvas.
 * These functions run entirely in the browser for maximum speed and security.
 */

/**
 * Removes the background of an image using adaptive thresholding and edge feathering.
 * This acts as a robust, client-side AI background remover for signatures.
 * @param {string} imageSrc - Base64 or URL of the source image
 * @param {number} threshold - Threshold value for background detection (0-255)
 * @returns {Promise<string>} - Promise resolving to a base64 encoded PNG
 */
export async function removeBackgroundAI(imageSrc, threshold = 185) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Step 1: Compute brightness histogram to find the main paper background peak
      // Paper is usually light, representing the largest peak in the light range
      const histogram = new Array(256).fill(0);
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a > 0) {
          const br = Math.round((r + g + b) / 3);
          histogram[br]++;
        }
      }
      
      let bgPeak = 255;
      let maxCount = 0;
      // Sample peaks in the lighter half (110 - 255) to find paper background
      for (let b = 110; b < 256; b++) {
        if (histogram[b] > maxCount) {
          maxCount = histogram[b];
          bgPeak = b;
        }
      }
      
      // The adaptive threshold dynamically shifts depending on how light/grey the paper background is
      const adaptiveThreshold = Math.max(130, bgPeak - 45);
      
      // Step 2: Extract background target color from corners
      const corners = [
        getPixel(data, 0, 0, canvas.width),
        getPixel(data, canvas.width - 1, 0, canvas.width),
        getPixel(data, 0, canvas.height - 1, canvas.width),
        getPixel(data, canvas.width - 1, canvas.height - 1, canvas.width)
      ];
      
      let bgR = 0, bgG = 0, bgB = 0;
      corners.forEach(c => {
        bgR += c.r;
        bgG += c.g;
        bgB += c.b;
      });
      bgR /= 4;
      bgG /= 4;
      bgB /= 4;

      // Step 3: Iterate through pixels and apply high-contrast transparent masking
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        
        if (a === 0) continue;

        // Calculate color distance to sampled corner color
        const dist = Math.sqrt(
          Math.pow(r - bgR, 2) + 
          Math.pow(g - bgG, 2) + 
          Math.pow(b - bgB, 2)
        );
        
        const brightness = (r + g + b) / 3;
        const maxCh = Math.max(r, g, b);
        const minCh = Math.min(r, g, b);
        const saturation = maxCh - minCh;
        
        // Pixel is background if:
        // - Brightness is above adaptive threshold
        // - OR color is extremely close to the corner background color (dist < 70)
        // - OR it's light and desaturated (grayish shadow on paper: brightness > 125, saturation < 25)
        const isBg = (brightness >= adaptiveThreshold) || 
                     (dist < 70) || 
                     (brightness > 125 && saturation < 25) ||
                     (r > adaptiveThreshold - 15 && g > adaptiveThreshold - 15 && b > adaptiveThreshold - 15);
        
        if (isBg) {
          data[i + 3] = 0; // 100% transparent background
        } else {
          // This is signature ink. Smooth edges and boost dark intensity (making it look like scanned ink)
          const transitionZone = 20;
          if (brightness > adaptiveThreshold - transitionZone) {
            // Smoothly feather borders to avoid jagged edges
            const factor = (adaptiveThreshold - brightness) / transitionZone;
            data[i + 3] = Math.max(0, Math.min(255, Math.round(a * Math.pow(factor, 1.5))));
            
            // Darken/boost ink contrast
            data[i] = Math.max(0, Math.round(r * 0.45));
            data[i + 1] = Math.max(0, Math.round(g * 0.45));
            data[i + 2] = Math.max(0, Math.round(b * 0.45));
          } else {
            // Solid dark rich ink pixels
            data[i + 3] = 255;
            
            // Check if ink was blue or black/dark
            const isBlueInk = (b > r + 15 && b > g + 10);
            if (isBlueInk) {
              // Enhance to beautiful sharp solid dark royal blue
              data[i] = Math.max(0, Math.round(r * 0.2));
              data[i + 1] = Math.max(0, Math.round(g * 0.3));
              data[i + 2] = Math.max(0, Math.round(b * 0.85)); // Keep rich blue channel high
            } else {
              // Enhance to solid clean crisp black ink
              const scale = 0.25;
              data[i] = Math.max(0, Math.round(r * scale));
              data[i + 1] = Math.max(0, Math.round(g * scale));
              data[i + 2] = Math.max(0, Math.round(b * scale));
            }
          }
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });
}

/**
 * Specifically targets white/off-white background pixels connected to the borders and makes them transparent.
 * This preserves interior white shapes (like the curve inside the FAIB cross) while removing outer background.
 * @param {string} imageSrc - Base64 or URL of the source image
 * @param {number} tolerance - Tolerance range (0-255) where 255 is pure white
 * @returns {Promise<string>} - Promise resolving to a base64 encoded PNG
 */
export async function makeWhiteTransparent(imageSrc, tolerance = 215) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const width = canvas.width;
      const height = canvas.height;
      
      const queue = [];
      const visited = new Uint8Array(width * height); // 0: unvisited, 1: background, 2: visited non-bg
      
      const isWhitePixel = (idx) => {
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];
        if (a === 0) return false;
        
        const brightness = (r + g + b) / 3;
        const maxCh = Math.max(r, g, b);
        const minCh = Math.min(r, g, b);
        const saturation = maxCh - minCh;
        
        return (brightness >= tolerance) || 
               (r > tolerance && g > tolerance && b > tolerance) ||
               (brightness > 130 && saturation < 15);
      };

      // Seed queue with all white border pixels
      for (let x = 0; x < width; x++) {
        const posTop = x;
        if (isWhitePixel(posTop * 4)) {
          visited[posTop] = 1;
          queue.push(posTop);
        }
        const posBottom = (height - 1) * width + x;
        if (isWhitePixel(posBottom * 4)) {
          visited[posBottom] = 1;
          queue.push(posBottom);
        }
      }
      for (let y = 0; y < height; y++) {
        const posLeft = y * width;
        if (!visited[posLeft] && isWhitePixel(posLeft * 4)) {
          visited[posLeft] = 1;
          queue.push(posLeft);
        }
        const posRight = y * width + (width - 1);
        if (!visited[posRight] && isWhitePixel(posRight * 4)) {
          visited[posRight] = 1;
          queue.push(posRight);
        }
      }

      // BFS connected background search
      let head = 0;
      while (head < queue.length) {
        const curr = queue[head++];
        const cx = curr % width;
        const cy = Math.floor(curr / width);
        
        const neighbors = [
          { x: cx - 1, y: cy },
          { x: cx + 1, y: cy },
          { x: cx, y: cy - 1 },
          { x: cx, y: cy + 1 }
        ];
        
        for (const n of neighbors) {
          if (n.x >= 0 && n.x < width && n.y >= 0 && n.y < height) {
            const pos = n.y * width + n.x;
            if (visited[pos] === 0) {
              if (isWhitePixel(pos * 4)) {
                visited[pos] = 1;
                queue.push(pos);
              } else {
                visited[pos] = 2;
              }
            }
          }
        }
      }

      // Make outer background transparent, keep logo colors completely original
      for (let pos = 0; pos < width * height; pos++) {
        const idx = pos * 4;
        if (visited[pos] === 1) {
          // It is connected outer background
          let isBoundary = false;
          const cx = pos % width;
          const cy = Math.floor(pos / width);
          
          if (cx > 0 && visited[pos - 1] !== 1) isBoundary = true;
          if (cx < width - 1 && visited[pos + 1] !== 1) isBoundary = true;
          if (cy > 0 && visited[pos - width] !== 1) isBoundary = true;
          if (cy < height - 1 && visited[pos + width] !== 1) isBoundary = true;

          if (isBoundary) {
            data[idx + 3] = Math.round(data[idx + 3] * 0.35); // Soft border blend
          } else {
            data[idx + 3] = 0; // Transparent
          }
        } else {
          // Solid logo colors
          data[idx] = data[idx];
          data[idx + 1] = data[idx + 1];
          data[idx + 2] = data[idx + 2];
        }
      }
      
      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = (err) => reject(err);
    img.src = imageSrc;
  });
}

// Helper to extract pixel colors
function getPixel(data, x, y, width) {
  const index = (y * width + x) * 4;
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
    a: data[index + 3]
  };
}
