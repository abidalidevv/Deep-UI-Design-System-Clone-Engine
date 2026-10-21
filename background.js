// background.js v2.3.0 - Resilient Background Service Worker for Design2MD Pro
// Handles throttled viewport captures with quota backoff retries

let lastCaptureTime = 0;
const MIN_CAPTURE_INTERVAL_MS = 650;

async function throttledCapture(windowId) {
  const now = Date.now();
  const elapsed = now - lastCaptureTime;
  if (elapsed < MIN_CAPTURE_INTERVAL_MS) {
    await new Promise(r => setTimeout(r, MIN_CAPTURE_INTERVAL_MS - elapsed));
  }

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    attempts++;
    try {
      const dataUrl = await new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab(windowId || null, { format: 'png' }, (res) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else if (!res) {
            reject(new Error('Empty capture received from tab'));
          } else {
            resolve(res);
          }
        });
      });
      lastCaptureTime = Date.now();
      return { dataUrl };
    } catch (err) {
      const isQuotaError = err.message && err.message.includes('MAX_CAPTURE_VISIBLE_TAB');
      if (isQuotaError && attempts < maxAttempts) {
        // Exponential backoff on Chrome quota limits
        await new Promise(r => setTimeout(r, 1000 * attempts));
      } else if (attempts >= maxAttempts) {
        return { error: err.message };
      } else {
        await new Promise(r => setTimeout(r, 500));
      }
    }
  }
  return { error: 'Capture failed after retries' };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'CAPTURE_TAB') {
    throttledCapture(message.windowId)
      .then(sendResponse)
      .catch(err => sendResponse({ error: err.message }));
    return true; // Keep message channel open for async response
  }
});
