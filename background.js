// background.js v2.3.1 - Resilient Background Service Worker for Design2MD Pro
// Handles throttled viewport captures with quota backoff retries and popup-close cleanup

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

  if (message.action === 'CLEANUP') {
    if (message.tabId) {
      chrome.scripting.executeScript({
        target: { tabId: message.tabId },
        func: () => {
          window.__design2md_cancelled = true;
          if (window.__design2md_state) {
            const s = window.__design2md_state;
            const styleEl = document.getElementById(s.hydrationStyleId || '__design2md_hydration_style');
            if (styleEl) styleEl.remove();

            if (s.modifiedInlineStyles && Array.isArray(s.modifiedInlineStyles)) {
              s.modifiedInlineStyles.forEach(({ el, prop, oldValue, setValue }) => {
                try {
                  // Only restore if the current inline value is still what we set it to
                  if (el && el.style && el.style[prop] === setValue) {
                    el.style[prop] = oldValue;
                  }
                } catch (e) {}
              });
            }

            if (s.hiddenFixedElements && Array.isArray(s.hiddenFixedElements)) {
              s.hiddenFixedElements.forEach(({ el, origVis }) => {
                try { if (el && el.style) el.style.visibility = origVis; } catch (e) {}
              });
            }

            if (s.originalScroll) {
              try { window.scrollTo({ top: s.originalScroll.y, left: s.originalScroll.x, behavior: 'instant' }); } catch (e) {}
            }

            delete window.__design2md_state;
          }
        }
      }).then(() => sendResponse({ cleaned: true })).catch(err => sendResponse({ error: err.message }));
      return true;
    }
    sendResponse({ cleaned: false });
    return true;
  }
});
