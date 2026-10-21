// popup.js v3.0 - Controller for Design2MD Pro
// Manages distinct DESIGN.md and UI.md generation, luxury tabs, and 1-click clipboard actions

let extractedData = null;
let designMarkdown = '';
let uiMarkdown = '';
let fullMarkdown = '';
let activePreviewDoc = 'design';

document.addEventListener('DOMContentLoaded', async () => {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    document.getElementById('siteDomain').textContent = 'UI Preview Mode';
    document.getElementById('siteTitle').textContent = 'Click Design2MD extension icon in Chrome toolbar to inspect sites';
    document.getElementById('themePill').textContent = 'Enterprise';
    document.getElementById('statusText').textContent = 'PREVIEW';
    document.getElementById('statusBadge').style.borderColor = '#E3E8EE';
    return;
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id || tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:') || tab.url?.startsWith('file://')) {
    document.getElementById('siteDomain').textContent = 'System / Local Page';
    document.getElementById('siteTitle').textContent = 'Open an HTTP / HTTPS website to inspect';
    document.getElementById('themePill').textContent = 'N/A';
    document.getElementById('statusText').textContent = 'IDLE';
    document.getElementById('statusBadge').style.borderColor = '#E3E8EE';
    return;
  }

  try {
    // 0. Pre-scroll page down & up to mount lazy-loaded DOM sections & SPAs
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: async () => {
          const orig = window.scrollY;
          window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'instant' });
          await new Promise(r => setTimeout(r, 60));
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });
          await new Promise(r => setTimeout(r, 60));
          window.scrollTo({ top: orig, behavior: 'instant' });
        }
      });
    } catch (e) {}

    // 1. Inject extraction engine
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['extractor.js']
    });

    // 2. Run extraction and generate all 3 modular markdown documents
    const [execResult] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const data = extractDesignSystem();
        const designMD = generateDesignTokensMD(data);
        const uiMD = generateUILayoutMD(data);
        const fullMD = generateFullCloneMD(data);
        return { data, designMD, uiMD, fullMD };
      }
    });

    if (execResult && execResult.result) {
      extractedData = execResult.result.data;
      designMarkdown = execResult.result.designMD;
      uiMarkdown = execResult.result.uiMD;
      fullMarkdown = execResult.result.fullMD;

      renderUI(extractedData);
      updatePreviewDisplay();
    }
  } catch (err) {
    console.error('Design2MD extraction error:', err);
    document.getElementById('siteDomain').textContent = 'Access Restricted';
    document.getElementById('siteTitle').textContent = err.message || 'Cannot inspect this page';
    document.getElementById('statusText').textContent = 'ERROR';
  }
});

// ─── Segmented Tab Switcher ───
document.querySelectorAll('.seg-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.seg-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
    tab.classList.add('active');
    const target = document.getElementById(`tab-${tab.dataset.tab}`);
    if (target) target.classList.remove('hidden');
  });
});

// ─── Preview Sub-Tabs ───
document.getElementById('viewDesignTab')?.addEventListener('click', () => {
  setActivePreview('design', 'viewDesignTab');
});
document.getElementById('viewUiTab')?.addEventListener('click', () => {
  setActivePreview('ui', 'viewUiTab');
});
document.getElementById('viewFullTab')?.addEventListener('click', () => {
  setActivePreview('full', 'viewFullTab');
});

function setActivePreview(docType, btnId) {
  activePreviewDoc = docType;
  document.querySelectorAll('.preview-doc-tab').forEach(b => b.classList.remove('active'));
  document.getElementById(btnId)?.classList.add('active');
  updatePreviewDisplay();
}

function updatePreviewDisplay() {
  const codeEl = document.getElementById('previewCode');
  if (!codeEl) return;
  if (activePreviewDoc === 'design') {
    codeEl.textContent = designMarkdown || '// No DESIGN.md extracted yet';
  } else if (activePreviewDoc === 'ui') {
    codeEl.textContent = uiMarkdown || '// No UI.md extracted yet';
  } else {
    codeEl.textContent = fullMarkdown || '// No FULL_CLONE.md extracted yet';
  }
}

// ─── Render Extracted Data into Popup UI ───
function renderUI(data) {
  // Site Info
  document.getElementById('siteDomain').textContent = data.meta.domain || 'Domain unknown';
  document.getElementById('siteTitle').textContent = data.meta.title || 'Untitled Page';

  // Theme Pill
  const themePill = document.getElementById('themePill');
  themePill.textContent = data.mode === 'Dark Mode' ? '🌙 Dark Mode' : '☀️ Light Mode';
  themePill.style.color = data.mode === 'Dark Mode' ? '#635BFF' : '#0A2540';
  themePill.style.backgroundColor = data.mode === 'Dark Mode' ? '#EDECFE' : '#F4F5F8';
  themePill.style.borderColor = data.mode === 'Dark Mode' ? '#D4D0FC' : '#E3E8EE';

  // Quick Metrics
  const totalColors = data.colors.backgrounds.length + data.colors.text.length + data.colors.borders.length;
  const totalComps = data.components.buttons.length + data.components.cards.length + data.components.inputs.length + data.components.badges.length + (data.components.navbar ? 1 : 0) + (data.components.footer ? 1 : 0);

  document.getElementById('statColors').textContent = totalColors;
  document.getElementById('statFonts').textContent = data.typography.fontFamilies.length;
  document.getElementById('statSections').textContent = data.sections.length;
  document.getElementById('statComponents').textContent = totalComps;

  // 1. Palette Swatches
  renderSwatches('bgSwatches', data.colors.backgrounds);
  renderSwatches('textSwatches', data.colors.text);

  if (data.colors.gradients.length > 0) {
    const gradSection = document.getElementById('gradientSection');
    gradSection.classList.remove('hidden');
    const gradContainer = document.getElementById('gradientPreviews');
    gradContainer.innerHTML = '';
    data.colors.gradients.slice(0, 4).forEach(g => {
      const div = document.createElement('div');
      div.className = 'gradient-preview';
      div.style.background = g;
      div.title = 'Click to copy gradient CSS';
      div.addEventListener('click', () => copyToClipboard(`background: ${g};`, 'Gradient CSS copied!'));
      gradContainer.appendChild(div);
    });
  }

  // 2. Typography
  const fontPillsContainer = document.getElementById('fontPills');
  fontPillsContainer.innerHTML = '';
  data.typography.fontFamilies.forEach((f, i) => {
    const pill = document.createElement('div');
    pill.className = `font-pill${i === 0 ? ' primary' : ''}`;
    pill.textContent = `${f.name}${i === 0 ? ' (Primary)' : ''}`;
    fontPillsContainer.appendChild(pill);
  });

  const typeScale = document.getElementById('typeScale');
  typeScale.innerHTML = '';
  for (const [tag, h] of Object.entries(data.typography.hierarchy)) {
    if (!['h1', 'h2', 'h3', 'p', 'button'].includes(tag)) continue;
    const row = document.createElement('div');
    row.className = 'type-row';
    row.innerHTML = `
      <span class="type-tag">&lt;${tag}&gt;</span>
      <span class="type-size">${h.fontSize}</span>
      <span class="type-sample">${h.sampleText || '—'}</span>
    `;
    typeScale.appendChild(row);
  }

  // 3. Sections
  const sectionsList = document.getElementById('sectionsList');
  sectionsList.innerHTML = '';
  data.sections.forEach((sec, i) => {
    const row = document.createElement('div');
    row.className = 'section-row';
    const heading = sec.content.headings[0]?.text?.slice(0, 36) || '';
    row.innerHTML = `
      <span class="section-num">${i + 1}</span>
      <div style="flex:1;overflow:hidden">
        <div class="section-type">${sec.type}</div>
        ${heading ? `<div class="section-heading">"${heading}"</div>` : ''}
      </div>
      <span class="section-dim">${sec.position.height}px</span>
    `;
    sectionsList.appendChild(row);
  });

  // 4. Components
  const compList = document.getElementById('componentsList');
  compList.innerHTML = '';

  if (data.components.navbar) {
    addCompGroupTitle(compList, 'Navigation Bar');
    addCompItem(compList, data.components.navbar.style.background, 'Navbar Header', `${data.components.navbar.dimensions.height}px, ${data.components.navbar.navLinks.length} links`);
  }

  if (data.components.buttons.length > 0) {
    addCompGroupTitle(compList, `Buttons (${data.components.buttons.length} variants)`);
    data.components.buttons.slice(0, 4).forEach(btn => {
      addCompItem(compList, btn.style.background, `"${btn.text || 'Button'}"`, `radius ${btn.style.borderRadius || '0'}`);
    });
  }

  if (data.components.cards.length > 0) {
    addCompGroupTitle(compList, `Cards (${data.components.cards.length} styles)`);
    data.components.cards.slice(0, 3).forEach(card => {
      addCompItem(compList, card.style.background, card.innerStructure, `radius ${card.style.borderRadius || '0'}`);
    });
  }

  if (data.components.footer) {
    addCompGroupTitle(compList, 'Footer');
    addCompItem(compList, data.components.footer.style.background, `${data.components.footer.columnCount} columns, ${data.components.footer.linkCount} links`, `${data.components.footer.dimensions.height}px`);
  }
}

// ─── Swatch Render Helper ───
function renderSwatches(containerId, colorArr) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  colorArr.slice(0, 8).forEach(c => {
    const item = document.createElement('div');
    item.className = 'swatch-item';
    item.title = `Click to copy ${c.hex}`;
    item.innerHTML = `
      <div class="swatch-circle" style="background-color:${c.hex}"></div>
      <span class="swatch-hex">${c.hex}</span>
    `;
    item.addEventListener('click', () => copyToClipboard(c.hex, `Copied ${c.hex}!`));
    container.appendChild(item);
  });
}

function addCompGroupTitle(parent, title) {
  const el = document.createElement('div');
  el.className = 'comp-group-title';
  el.textContent = title;
  parent.appendChild(el);
}

function addCompItem(parent, bgColor, label, detail) {
  const el = document.createElement('div');
  el.className = 'comp-item';
  el.innerHTML = `
    <div class="comp-swatch" style="background:${bgColor || '#333'}"></div>
    <span class="comp-label">${label}</span>
    <span class="comp-detail">${detail}</span>
  `;
  parent.appendChild(el);
}

// ─── File Downloader ───
function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast(`Downloaded ${filename}!`);
}

// ─── Clipboard Helper ───
function copyToClipboard(text, message = 'Copied to clipboard!') {
  navigator.clipboard.writeText(text).then(() => showToast(message)).catch(err => console.error(err));
}

// ─── Toast Feedback ───
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ─── BUTTON EVENT LISTENERS ───

// 1. Download DESIGN.md
document.getElementById('downloadDesignBtn')?.addEventListener('click', () => {
  if (!designMarkdown) return;
  const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'site';
  downloadFile(`${domain}_DESIGN.md`, designMarkdown);
});

// 2. Copy :root CSS
document.getElementById('copyTokensBtn')?.addEventListener('click', () => {
  if (!designMarkdown) return;
  const tokenMatch = designMarkdown.match(/## 2\. 🎨 Master CSS Design Tokens[\s\S]*?```css([\s\S]*?)```/);
  const tokenText = tokenMatch ? tokenMatch[1].trim() : '';
  if (tokenText) {
    copyToClipboard(tokenText, 'CSS :root tokens copied!');
  } else {
    copyToClipboard(designMarkdown, 'DESIGN.md copied!');
  }
});

// 3. Download UI.md (Sections Blueprint)
document.getElementById('downloadUiBtn')?.addEventListener('click', () => {
  if (!uiMarkdown) return;
  const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'site';
  downloadFile(`${domain}_UI.md`, uiMarkdown);
});

// 4. Copy Sections Blueprint
document.getElementById('copySectionsBtn')?.addEventListener('click', () => {
  if (!uiMarkdown) return;
  const sectionsMatch = uiMarkdown.match(/## 1\. Executive Page Rhythm Map[\s\S]*?## 3\./);
  const sectionsText = sectionsMatch ? sectionsMatch[0].replace(/## 3\./, '').trim() : uiMarkdown;
  copyToClipboard(sectionsText, 'Sections Wireframe copied!');
});

// 5. Copy Antigravity AI Prompt
document.getElementById('copyPromptBtn')?.addEventListener('click', () => {
  const promptMatch = fullMarkdown.match(/## 🤖 Antigravity \/ AI Coding Prompt[\s\S]*?```text([\s\S]*?)```/)
    || designMarkdown.match(/## 🤖 Antigravity \/ AI Coding Prompt[\s\S]*?```text([\s\S]*?)```/);
  const promptText = promptMatch ? promptMatch[1].trim() : (designMarkdown || fullMarkdown);
  copyToClipboard(promptText, 'Antigravity Master Prompt copied!');
});

// 6. Download Full Clone Spec (.md)
document.getElementById('downloadFullMdBtn')?.addEventListener('click', () => {
  if (!fullMarkdown) return;
  const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'site';
  downloadFile(`${domain}_FULL_CLONE.md`, fullMarkdown);
});

// 7. Copy Active Preview
document.getElementById('copyActivePreviewBtn')?.addEventListener('click', () => {
  if (activePreviewDoc === 'design') {
    copyToClipboard(designMarkdown, 'DESIGN.md copied!');
  } else if (activePreviewDoc === 'ui') {
    copyToClipboard(uiMarkdown, 'UI.md copied!');
  } else {
    copyToClipboard(fullMarkdown, 'FULL_CLONE.md copied!');
  }
});

// ─── VISUAL SCREENSHOT & ZIP BUNDLE ENGINE ───

function setCaptureProgress(percent, statusText) {
  const container = document.getElementById('captureProgressContainer');
  const bar = document.getElementById('captureProgressBar');
  const text = document.getElementById('captureProgressStatus');
  if (!container || !bar || !text) return;
  container.classList.remove('hidden');
  bar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  text.textContent = statusText;
}

function hideCaptureProgress() {
  const container = document.getElementById('captureProgressContainer');
  if (container) container.classList.add('hidden');
}

function dataUrlToBlob(dataUrl) {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)[1];
  const bstr = atob(parts[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  showToast(`Downloaded ${filename}!`);
}

async function captureFullPageScreenshot(tab) {
  setCaptureProgress(5, 'Analyzing page geometry...');

  // 1. Measure dimensions in target tab
  const [infoResult] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const origScrollY = window.scrollY;
      const origScrollX = window.scrollX;
      const body = document.body;
      const html = document.documentElement;

      const totalHeight = Math.max(
        body.scrollHeight, html.scrollHeight,
        body.offsetHeight, html.offsetHeight,
        body.clientHeight, html.clientHeight
      );
      const totalWidth = Math.max(
        body.scrollWidth, html.scrollWidth,
        window.innerWidth
      );
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dpr = window.devicePixelRatio || 1;

      return {
        totalHeight,
        totalWidth,
        viewportHeight,
        viewportWidth,
        dpr,
        origScrollX,
        origScrollY
      };
    }
  });

  if (!infoResult || !infoResult.result) {
    throw new Error('Could not calculate page dimensions');
  }

  const {
    totalHeight,
    totalWidth,
    viewportHeight,
    viewportWidth,
    dpr,
    origScrollX,
    origScrollY
  } = infoResult.result;

  const numSteps = Math.max(1, Math.ceil(totalHeight / viewportHeight));
  const rawChunks = [];

  try {
    for (let step = 0; step < numSteps; step++) {
      const scrollY = (step === numSteps - 1 && numSteps > 1)
        ? Math.max(0, totalHeight - viewportHeight)
        : step * viewportHeight;

      setCaptureProgress(
        Math.round((step / numSteps) * 75) + 5,
        `Capturing crisp slice ${step + 1} of ${numSteps}...`
      );

      // Scroll and hide sticky header on chunks > 0
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [scrollY, step],
        func: (y, stepIndex) => {
          window.scrollTo({ top: y, left: 0, behavior: 'instant' });
          if (stepIndex > 0) {
            if (!window.__design2md_hidden_fixed) {
              window.__design2md_hidden_fixed = [];
              document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.position === 'fixed' || style.position === 'sticky') {
                  const rect = el.getBoundingClientRect();
                  if (rect.top <= 120 && rect.height < 200) {
                    window.__design2md_hidden_fixed.push({ el, origVis: el.style.visibility });
                    el.style.visibility = 'hidden';
                  }
                }
              });
            }
          }
        }
      });

      // Brief pause for lazy load images / repaint
      await new Promise(r => setTimeout(r, 260));

      // Capture visible tab chunk at native resolution
      const dataUrl = await new Promise((resolve, reject) => {
        chrome.tabs.captureVisibleTab(null, { format: 'png' }, (res) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else if (!res) {
            reject(new Error('Empty capture received'));
          } else {
            resolve(res);
          }
        });
      });

      rawChunks.push({ dataUrl, y: scrollY, step });
    }
  } finally {
    // Always restore page scroll & sticky headers
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [origScrollX, origScrollY],
      func: (origX, origY) => {
        window.scrollTo({ top: origY, left: origX, behavior: 'instant' });
        if (window.__design2md_hidden_fixed) {
          window.__design2md_hidden_fixed.forEach(item => {
            item.el.style.visibility = item.origVis;
          });
          delete window.__design2md_hidden_fixed;
        }
      }
    });
  }

  // Convert each chunk to an individual high-res PNG Blob (no downscaling mush!)
  const chunkList = rawChunks.map((chunk, i) => {
    const filename = `chunk_${String(i + 1).padStart(2, '0')}.png`;
    return {
      step: chunk.step,
      filename,
      blob: dataUrlToBlob(chunk.dataUrl),
      dataUrl: chunk.dataUrl,
      y: chunk.y
    };
  });

  // 2. Stitch chunks onto Canvas for optional master overview (safeguarded against OOM)
  setCaptureProgress(82, 'Generating master stitched preview...');
  let stitchedBlob = null;

  try {
    let canvasDpr = dpr;
    if (totalHeight * canvasDpr > 16384) {
      canvasDpr = Math.min(1.0, 16384 / totalHeight);
    }
    const maxDimension = 16384;
    const targetWidth = Math.min(maxDimension, Math.round(viewportWidth * canvasDpr));
    const targetHeight = Math.min(maxDimension, Math.round(totalHeight * canvasDpr));

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      for (let i = 0; i < rawChunks.length; i++) {
        const chunk = rawChunks[i];
        const img = new Image();
        img.src = chunk.dataUrl;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        const destY = Math.round(chunk.y * canvasDpr);
        const destHeight = Math.round(viewportHeight * canvasDpr);
        ctx.drawImage(img, 0, 0, img.width, img.height, 0, destY, canvas.width, destHeight);
      }

      setCaptureProgress(94, 'Encoding stitched image...');
      stitchedBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    }
  } catch (canvasErr) {
    console.warn('Stitched canvas generation skipped (page height exceeds memory):', canvasErr);
    // Visual chunks are still 100% safe and intact in chunkList!
  }

  return {
    chunks: chunkList,
    stitchedBlob
  };
}

// 8. Capture Crisp Visual Chunks
document.getElementById('captureScreenshotBtn')?.addEventListener('click', async () => {
  const btn = document.getElementById('captureScreenshotBtn');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  btn.disabled = true;
  try {
    const captureResult = await captureFullPageScreenshot(tab);
    setCaptureProgress(98, 'Packaging crisp visual chunks...');
    const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'site';

    if (captureResult.chunks.length === 1) {
      downloadBlob(captureResult.chunks[0].blob, `${domain}_chunk_01.png`);
    } else {
      const zip = new JSZip();
      captureResult.chunks.forEach(c => {
        zip.file(c.filename, c.blob);
      });
      if (captureResult.stitchedBlob) {
        zip.file('FULL_STITCHED_OVERVIEW.png', captureResult.stitchedBlob);
      }
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `${domain}_VISUAL_CHUNKS.zip`);
    }

    setCaptureProgress(100, 'Chunks Ready!');
    setTimeout(() => hideCaptureProgress(), 1800);
  } catch (err) {
    console.error('Screenshot capture failed:', err);
    showToast(`Screenshot failed: ${err.message}`);
    hideCaptureProgress();
  } finally {
    btn.disabled = false;
  }
});

// 9. Download Complete Clone ZIP Bundle (DESIGN.md + UI.md + screenshots/ + PROMPT)
document.getElementById('downloadZipBundleBtn')?.addEventListener('click', async () => {
  const btn = document.getElementById('downloadZipBundleBtn');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return;

  if (typeof JSZip === 'undefined') {
    showToast('ZIP library loading error');
    return;
  }

  btn.disabled = true;
  try {
    // Step A: Capture visual chunks
    const captureResult = await captureFullPageScreenshot(tab);

    // Step B: Build AI Master prompt
    setCaptureProgress(96, 'Bundling files into ZIP archive...');
    const promptMatch = fullMarkdown.match(/## 🤖 Antigravity \/ AI Coding Prompt[\s\S]*?```text([\s\S]*?)```/)
      || designMarkdown.match(/## 🤖 Antigravity \/ AI Coding Prompt[\s\S]*?```text([\s\S]*?)```/);
    const promptText = promptMatch ? promptMatch[1].trim() : (designMarkdown || fullMarkdown);

    const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'site';

    // Step C: Package ZIP with JSZip
    const zip = new JSZip();
    const folderName = `${domain}_Clone_Bundle`;
    const folder = zip.folder(folderName);

    folder.file('DESIGN.md', designMarkdown || '# DESIGN.md\n');
    folder.file('UI.md', uiMarkdown || '# UI.md\n');
    folder.file('FULL_CLONE.md', fullMarkdown || '# FULL_CLONE.md\n');
    folder.file('AI_CODING_PROMPT.txt', promptText || 'Rebuild this site matching DESIGN.md and UI.md');

    // Add screenshots directory with INDIVIDUAL CRISP CHUNKS!
    const ssFolder = folder.folder('screenshots');
    captureResult.chunks.forEach(c => {
      ssFolder.file(c.filename, c.blob);
    });
    if (captureResult.stitchedBlob) {
      ssFolder.file('FULL_STITCHED_PAGE.png', captureResult.stitchedBlob);
    }

    setCaptureProgress(99, 'Generating ZIP package...');
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    setCaptureProgress(100, 'Clone Bundle Ready!');
    downloadBlob(zipBlob, `${domain}_COMPLETE_CLONE_BUNDLE.zip`);
    setTimeout(() => hideCaptureProgress(), 2000);
  } catch (err) {
    console.error('ZIP bundle generation failed:', err);
    showToast(`Bundle failed: ${err.message}`);
    hideCaptureProgress();
  } finally {
    btn.disabled = false;
  }
});

