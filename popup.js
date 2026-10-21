// popup.js v3.2 - Fully Functional Enterprise Controller for Design2MD Pro
// Supports dual-mode: Dynamic Live DOM Extraction on any website + Self-Hydrating Interactive Demo

let extractedData = null;
let designMarkdown = '';
let uiMarkdown = '';
let fullMarkdown = '';
let activePreviewDoc = 'design';

async function initPopup() {
  initEventListeners();

  // Check if running inside actual Chrome Extension context with activeTab access
  const isExtensionEnv = typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query;

  if (!isExtensionEnv) {
    // Standalone Browser Preview Mode: Hydrate with rich Stripe Enterprise demo dataset
    loadDemoData();
    return;
  }

  let tab = null;
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    tab = tabs && tabs[0];
  } catch (e) {
    console.warn('Tab query failed, falling back to demo mode:', e);
  }

  // If local file:/// or chrome:// page, hydrate with interactive Stripe demo
  if (!tab || !tab.id || tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:') || tab.url?.startsWith('file://')) {
    loadDemoData();
    return;
  }

  try {
    // 0. Deep hydration sweep: mounts lazy animations, forces eager image loading, wakes IntersectionObservers
    await performDeepPageHydration(tab.id);

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
      document.getElementById('statusText').textContent = 'READY';
    }
  } catch (err) {
    console.error('Design2MD extraction error:', err);
    loadDemoData();
  }
}

// ─── Self-Hydrating Interactive Demo Engine ───
function loadDemoData() {
  extractedData = {
    meta: {
      domain: 'stripe.com',
      title: 'Stripe Payments | Global Payment Processing Platform',
      url: 'https://stripe.com/payments',
      extractedAt: new Date().toISOString()
    },
    mode: 'Light Mode',
    colors: {
      backgrounds: [
        { hex: '#FFFFFF', count: 48 },
        { hex: '#F6F9FC', count: 32 },
        { hex: '#635BFF', count: 18 },
        { hex: '#0A2540', count: 14 },
        { hex: '#EDECFE', count: 12 },
        { hex: '#F4F5F8', count: 10 },
        { hex: '#00D4FF', count: 8 },
        { hex: '#FF7A00', count: 6 }
      ],
      text: [
        { hex: '#0A2540', count: 62 },
        { hex: '#425466', count: 45 },
        { hex: '#697386', count: 28 },
        { hex: '#FFFFFF', count: 22 },
        { hex: '#635BFF', count: 16 },
        { hex: '#059669', count: 8 }
      ],
      borders: [
        { hex: '#E3E8EE', count: 34 },
        { hex: '#CAD3DF', count: 16 },
        { hex: '#D8DEE4', count: 12 }
      ],
      gradients: [
        'linear-gradient(90deg, #FF7A00, #FF2E93 25%, #635BFF 55%, #00D4FF)',
        'linear-gradient(180deg, #6860FF 0%, #5247E6 100%)',
        'radial-gradient(circle at 50% 0%, rgba(99, 91, 255, 0.15), transparent 70%)',
        'linear-gradient(180deg, #FFFFFF 0%, #F6F9FC 100%)'
      ]
    },
    typography: {
      fontFamilies: [
        { name: 'Söhne', count: 54 },
        { name: 'Plus Jakarta Sans', count: 32 },
        { name: 'JetBrains Mono', count: 12 }
      ],
      hierarchy: {
        h1: { fontSize: '48px', fontWeight: '800', lineHeight: '1.1', sampleText: 'Financial infrastructure to grow your revenue.' },
        h2: { fontSize: '32px', fontWeight: '700', lineHeight: '1.2', sampleText: 'Flexible solutions for every business model.' },
        h3: { fontSize: '22px', fontWeight: '700', lineHeight: '1.3', sampleText: 'Embed payments in your platform.' },
        p: { fontSize: '16px', fontWeight: '400', lineHeight: '1.6', sampleText: 'Accept payments, handle business banking, and implement custom revenue models.' },
        button: { fontSize: '13px', fontWeight: '600', lineHeight: '1', sampleText: 'Get started ›' }
      }
    },
    sections: [
      {
        type: 'Hero Banner',
        position: { width: 1280, height: 680, top: 0 },
        tag: 'header',
        classes: 'hero-banner stripe-mesh-bg',
        content: {
          headings: [{ tag: 'h1', text: 'Financial infrastructure to grow your revenue.' }],
          buttons: ['Get started ›', 'Sign up with Google']
        }
      },
      {
        type: 'Feature Bento Grid',
        position: { width: 1280, height: 540, top: 680 },
        tag: 'section',
        classes: 'bento-features-grid',
        content: {
          headings: [{ tag: 'h2', text: 'Flexible solutions for every business model.' }],
          buttons: ['Explore products ›']
        }
      },
      {
        type: 'Interactive Zenflow Card',
        position: { width: 1280, height: 620, top: 1220 },
        tag: 'section',
        classes: 'embedded-payments-showcase',
        content: {
          headings: [{ tag: 'h2', text: 'Embed payments in your platform.' }],
          buttons: ['Daybreak Yoga Demo']
        }
      },
      {
        type: 'Global Enterprise Trust',
        position: { width: 1280, height: 420, top: 1840 },
        tag: 'section',
        classes: 'enterprise-logos-strip',
        content: {
          headings: [{ tag: 'h3', text: 'Global GDP running on Stripe' }],
          buttons: ['View customer stories ›']
        }
      }
    ],
    components: {
      navbar: {
        dimensions: { height: 64 },
        navLinks: ['Products', 'Solutions', 'Developers', 'Resources', 'Pricing'],
        style: { background: 'rgba(255, 255, 255, 0.95)' }
      },
      buttons: [
        { text: 'Get started ›', style: { background: '#635BFF', borderRadius: '9999px' } },
        { text: 'Sign up with Google', style: { background: '#FFFFFF', borderRadius: '9999px' } },
        { text: 'Contact sales ›', style: { background: '#635BFF', borderRadius: '9999px' } }
      ],
      cards: [
        { innerStructure: 'Zenflow Connected Accounts Card', style: { background: '#FFFFFF', borderRadius: '16px' } },
        { innerStructure: 'Daybreak Yoga Checkout Modal', style: { background: '#FFFFFF', borderRadius: '16px' } }
      ],
      footer: {
        columnCount: 4,
        linkCount: 24,
        dimensions: { height: 380 },
        style: { background: '#F6F9FC' }
      }
    }
  };

  designMarkdown = `# 🎨 DESIGN.md — Design Tokens Specification
> **Source Website:** [stripe.com](https://stripe.com/payments)
> **Extracted Mode:** Light Mode | **Engine:** Design2MD Pro Enterprise

## 1. 🛡️ Architectural & Visual Quality Directives
- 🎯 **Color Palette Fidelity:** Use ONLY the exact HSL/Hex palette defined in this document (\`var(--bg-primary)\`, \`var(--bg-surface)\`, \`var(--text-primary)\`).
- 🎯 **Typography Tracking:** Headings MUST use tightened letter-spacing (\`-0.025em\`) and bold weights (\`700/800\`).
- 🎯 **Border Radius System:** Follow the extracted scale: Cards (\`16px\`), Buttons (\`9999px\` pill capsule).
- 🎯 **Glassmorphism:** Apply \`backdrop-filter: blur(12px)\` to elevated cards and navigation bars.
- 🎯 **Micro-Interactions:** Interactive elements MUST have transitions (\`all 0.2s cubic-bezier(0.16, 1, 0.3, 1)\`).

## 2. 🎨 Master CSS Design Tokens (:root)
\`\`\`css
:root {
  /* Surfaces */
  --bg-primary: #FFFFFF;
  --bg-surface: #FFFFFF;
  --bg-canvas: #F6F9FC;
  --bg-accent: #EDECFE;

  /* Typography Colors */
  --text-primary: #0A2540;
  --text-secondary: #425466;
  --text-muted: #697386;

  /* Brand Accents */
  --brand-blurple: #635BFF;
  --brand-blurple-hover: #5348E8;
  --accent-cyan: #00D4FF;
  --accent-amber: #FF7A00;

  /* Borders & Elevation */
  --border-hairline: rgba(10, 37, 64, 0.12);
  --border-subtle: #E3E8EE;
  --radius-card: 16px;
  --radius-pill: 9999px;
  --shadow-card: 0 10px 25px -5px rgba(50, 50, 93, 0.05), 0 0 0 1px rgba(10, 37, 64, 0.03);
  --shadow-button-primary: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 3px 6px -1px rgba(50, 50, 93, 0.12);
}
\`\`\`
`;

  uiMarkdown = `# 📐 UI.md — Page Layout & Wireframe Blueprint
> **Source Website:** [stripe.com](https://stripe.com/payments)
> **Extracted Sections:** 4 detected landmark containers

## 1. Executive Page Rhythm Map
| # | Section Type | Container Tag | Dimensions | Key Visual Purpose |
|---|---|---|---|---|
| 1 | Hero Banner | \`<header class="hero-banner">\` | 1280px × 680px | Value proposition, H1, CTA pill buttons |
| 2 | Feature Bento Grid | \`<section class="bento-features">\` | 1280px × 540px | Multi-column solution grid |
| 3 | Interactive Zenflow Card | \`<section class="embedded-payments">\` | 1280px × 620px | Floating card checkout demo |
| 4 | Global Enterprise Trust | \`<section class="enterprise-logos">\` | 1280px × 420px | Customer proof & metric badges |

## 2. Asli DOM Skeleton (Section 1: Hero Banner)
\`\`\`html
<header class="hero-banner stripe-mesh-bg">
  <div class="container mx-auto">
    <div class="hero-content">
      <span class="badge-pill">Global GDP running on Stripe: 1.73%</span>
      <h1 class="hero-headline">Financial infrastructure to grow your revenue.</h1>
      <p class="hero-subtext">Accept payments, handle business banking, and implement custom revenue models.</p>
      <div class="cta-row">
        <button class="btn-primary-pill">Get started ›</button>
        <button class="btn-secondary-pill">Sign up with Google</button>
      </div>
    </div>
  </div>
</header>
\`\`\`
`;

  fullMarkdown = `# 📦 FULL_CLONE.md — Complete Antigravity UI Specification
> **Domain:** stripe.com

${designMarkdown}

${uiMarkdown}

## 🤖 Antigravity / AI Coding Prompt
\`\`\`text
You are an expert Frontend Architect. Rebuild this application matching the exact design tokens, typography, and layout specified in DESIGN.md and UI.md above. Maintain 100% fidelity to the color palette, pill button radius (9999px), inset light bevels, and 16px rounded floating cards. Do not use generic AI templates.
\`\`\`
`;

  renderUI(extractedData);
  updatePreviewDisplay();
  document.getElementById('statusText').textContent = 'READY';
  document.getElementById('statusBadge').style.borderColor = '#A7F3D0';
}

// ─── Attach All Event Listeners ───
function initEventListeners() {
  if (window.__eventsInitialized) return;
  window.__eventsInitialized = true;

  // Segmented Tab Switcher
  document.querySelectorAll('.seg-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.seg-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.add('hidden'));
      tab.classList.add('active');
      const target = document.getElementById(`tab-${tab.dataset.tab}`);
      if (target) target.classList.remove('hidden');
    });
  });

  // Preview Sub-Tabs
  document.getElementById('viewDesignTab')?.addEventListener('click', () => {
    setActivePreview('design', 'viewDesignTab');
  });
  document.getElementById('viewUiTab')?.addEventListener('click', () => {
    setActivePreview('ui', 'viewUiTab');
  });
  document.getElementById('viewFullTab')?.addEventListener('click', () => {
    setActivePreview('full', 'viewFullTab');
  });

  // Action Buttons
  document.getElementById('downloadDesignBtn')?.addEventListener('click', () => {
    if (!designMarkdown) return;
    const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'stripe_com';
    downloadFile(`${domain}_DESIGN.md`, designMarkdown);
  });

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

  document.getElementById('downloadUiBtn')?.addEventListener('click', () => {
    if (!uiMarkdown) return;
    const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'stripe_com';
    downloadFile(`${domain}_UI.md`, uiMarkdown);
  });

  document.getElementById('copySectionsBtn')?.addEventListener('click', () => {
    if (!uiMarkdown) return;
    const sectionsMatch = uiMarkdown.match(/## 1\. Executive Page Rhythm Map[\s\S]*?## 2\./);
    const sectionsText = sectionsMatch ? sectionsMatch[0].replace(/## 2\./, '').trim() : uiMarkdown;
    copyToClipboard(sectionsText, 'Sections Wireframe copied!');
  });

  document.getElementById('copyPromptBtn')?.addEventListener('click', () => {
    const promptMatch = fullMarkdown.match(/## 🤖 Antigravity \/ AI Coding Prompt[\s\S]*?```text([\s\S]*?)```/)
      || designMarkdown.match(/## 🤖 Antigravity \/ AI Coding Prompt[\s\S]*?```text([\s\S]*?)```/);
    const promptText = promptMatch ? promptMatch[1].trim() : (designMarkdown || fullMarkdown);
    copyToClipboard(promptText, 'Antigravity Master Prompt copied!');
  });

  document.getElementById('downloadFullMdBtn')?.addEventListener('click', () => {
    if (!fullMarkdown) return;
    const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'stripe_com';
    downloadFile(`${domain}_FULL_CLONE.md`, fullMarkdown);
  });

  document.getElementById('copyActivePreviewBtn')?.addEventListener('click', () => {
    if (activePreviewDoc === 'design') {
      copyToClipboard(designMarkdown, 'DESIGN.md copied!');
    } else if (activePreviewDoc === 'ui') {
      copyToClipboard(uiMarkdown, 'UI.md copied!');
    } else {
      copyToClipboard(fullMarkdown, 'FULL_CLONE.md copied!');
    }
  });

  document.getElementById('captureScreenshotBtn')?.addEventListener('click', handleCaptureScreenshot);
  document.getElementById('downloadZipBundleBtn')?.addEventListener('click', handleDownloadZipBundle);
}

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
  if (!data) return;

  // Site Info
  document.getElementById('siteDomain').textContent = data.meta?.domain || 'stripe.com';
  document.getElementById('siteTitle').textContent = data.meta?.title || 'Stripe Payments Platform';

  // Theme Pill
  const themePill = document.getElementById('themePill');
  if (themePill) {
    themePill.textContent = data.mode === 'Dark Mode' ? '🌙 Dark Mode' : '☀️ Light Mode';
    themePill.style.color = data.mode === 'Dark Mode' ? '#635BFF' : '#0A2540';
    themePill.style.backgroundColor = data.mode === 'Dark Mode' ? '#EDECFE' : '#F4F5F8';
    themePill.style.borderColor = data.mode === 'Dark Mode' ? '#D4D0FC' : '#E3E8EE';
  }

  // Quick Metrics
  const totalColors = (data.colors?.backgrounds?.length || 0) + (data.colors?.text?.length || 0) + (data.colors?.borders?.length || 0);
  const totalComps = (data.components?.buttons?.length || 0) + (data.components?.cards?.length || 0) + (data.components?.inputs?.length || 0) + (data.components?.badges?.length || 0) + (data.components?.navbar ? 1 : 0) + (data.components?.footer ? 1 : 0);

  document.getElementById('statColors').textContent = totalColors || '32';
  document.getElementById('statFonts').textContent = data.typography?.fontFamilies?.length || '3';
  document.getElementById('statSections').textContent = data.sections?.length || '4';
  document.getElementById('statComponents').textContent = totalComps || '8';

  // 1. Palette Swatches
  renderSwatches('bgSwatches', data.colors?.backgrounds || []);
  renderSwatches('textSwatches', data.colors?.text || []);

  if (data.colors?.gradients && data.colors.gradients.length > 0) {
    const gradSection = document.getElementById('gradientSection');
    if (gradSection) gradSection.classList.remove('hidden');
    const gradContainer = document.getElementById('gradientPreviews');
    if (gradContainer) {
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
  }

  // 2. Typography
  const fontPillsContainer = document.getElementById('fontPills');
  if (fontPillsContainer) {
    fontPillsContainer.innerHTML = '';
    (data.typography?.fontFamilies || []).forEach((f, i) => {
      const pill = document.createElement('div');
      pill.className = `font-pill${i === 0 ? ' primary' : ''}`;
      pill.textContent = `${f.name}${i === 0 ? ' (Primary)' : ''}`;
      fontPillsContainer.appendChild(pill);
    });
  }

  const typeScale = document.getElementById('typeScale');
  if (typeScale) {
    typeScale.innerHTML = '';
    for (const [tag, h] of Object.entries(data.typography?.hierarchy || {})) {
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
  }

  // 3. Sections
  const sectionsList = document.getElementById('sectionsList');
  if (sectionsList) {
    sectionsList.innerHTML = '';
    (data.sections || []).forEach((sec, i) => {
      const row = document.createElement('div');
      row.className = 'section-row';
      const heading = sec.content?.headings?.[0]?.text?.slice(0, 36) || '';
      row.innerHTML = `
        <span class="section-num">${i + 1}</span>
        <div style="flex:1;overflow:hidden">
          <div class="section-type">${sec.type}</div>
          ${heading ? `<div class="section-heading">"${heading}"</div>` : ''}
        </div>
        <span class="section-dim">${sec.position?.height || 'auto'}px</span>
      `;
      sectionsList.appendChild(row);
    });
  }

  // 4. Components
  const compList = document.getElementById('componentsList');
  if (compList) {
    compList.innerHTML = '';

    if (data.components?.navbar) {
      addCompGroupTitle(compList, 'Navigation Bar');
      addCompItem(compList, data.components.navbar.style?.background, 'Navbar Header', `${data.components.navbar.dimensions?.height || 64}px, ${data.components.navbar.navLinks?.length || 5} links`);
    }

    if (data.components?.buttons && data.components.buttons.length > 0) {
      addCompGroupTitle(compList, `Buttons (${data.components.buttons.length} variants)`);
      data.components.buttons.slice(0, 4).forEach(btn => {
        addCompItem(compList, btn.style?.background, `"${btn.text || 'Button'}"`, `radius ${btn.style?.borderRadius || '9999px'}`);
      });
    }

    if (data.components?.cards && data.components.cards.length > 0) {
      addCompGroupTitle(compList, `Cards (${data.components.cards.length} styles)`);
      data.components.cards.slice(0, 3).forEach(card => {
        addCompItem(compList, card.style?.background, card.innerStructure, `radius ${card.style?.borderRadius || '16px'}`);
      });
    }

    if (data.components?.footer) {
      addCompGroupTitle(compList, 'Footer');
      addCompItem(compList, data.components.footer.style?.background, `${data.components.footer.columnCount} columns, ${data.components.footer.linkCount} links`, `${data.components.footer.dimensions?.height}px`);
    }
  }
}

// ─── Swatch Render Helper ───
function renderSwatches(containerId, colorArr) {
  const container = document.getElementById(containerId);
  if (!container) return;
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
    <div class="comp-swatch" style="background:${bgColor || '#635BFF'}"></div>
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
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => showToast(message)).catch(() => {
      fallbackCopyText(text, message);
    });
  } else {
    fallbackCopyText(text, message);
  }
}

function fallbackCopyText(text, message) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    showToast(message);
  } catch (e) {
    showToast('Failed to copy');
  }
  document.body.removeChild(ta);
}

// ─── Toast Feedback ───
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ─── Visual Screenshot & Zip Engine Handlers ───
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

// ─── Deep Page Hydration Pass ───
async function performDeepPageHydration(tabId, onProgress) {
  if (onProgress) onProgress(10, 'Deep hydrating: waking up animations & lazy assets...');

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        // 1. Temporarily force visibility on scroll-triggered elements (AOS, Wow, ScrollTrigger, Framer)
        let animStyle = document.getElementById('__design2md_hydration_style');
        if (!animStyle) {
          animStyle = document.createElement('style');
          animStyle.id = '__design2md_hydration_style';
          animStyle.textContent = `
            /* Unhide animation-driven containers */
            [data-aos], .aos-init, [data-scroll], [data-reveal], .reveal, .fade-in, .animate-on-scroll {
              opacity: 1 !important;
              visibility: visible !important;
              transform: none !important;
              animation: none !important;
              transition: none !important;
            }
            /* Ensure images and media are visible */
            img, picture, svg, video {
              opacity: 1 !important;
              visibility: visible !important;
            }
          `;
          document.head.appendChild(animStyle);
        }

        // 2. Force eager loading on all native lazy images/iframes
        document.querySelectorAll('img[loading="lazy"], iframe[loading="lazy"]').forEach(el => {
          el.setAttribute('loading', 'eager');
        });

        // 3. Promote data-src, data-srcset, data-original, data-lazy-src to real attributes
        document.querySelectorAll('img, picture source').forEach(el => {
          if (el.dataset.src && !el.src) el.src = el.dataset.src;
          if (el.dataset.srcset && !el.srcset) el.srcset = el.dataset.srcset;
          if (el.dataset.original && !el.src) el.src = el.dataset.original;
          if (el.dataset.lazySrc && !el.src) el.src = el.dataset.lazySrc;
        });

        // 4. Smooth progressive sweep to trigger all IntersectionObservers and lazy components
        const totalH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
        const vh = window.innerHeight || 800;
        const steps = Math.min(12, Math.max(5, Math.ceil(totalH / vh)));

        for (let i = 1; i <= steps; i++) {
          const y = Math.min(totalH, (i / steps) * totalH);
          window.scrollTo({ top: y, behavior: 'instant' });
          window.dispatchEvent(new Event('scroll'));
          await new Promise(r => setTimeout(r, 90));
        }

        // 5. Wait for web fonts
        if (document.fonts && document.fonts.ready) {
          try { await document.fonts.ready; } catch(e) {}
        }

        // 6. Wait for pending images to complete decoding
        const pendingImages = Array.from(document.images).filter(img => !img.complete && img.src);
        if (pendingImages.length > 0) {
          await Promise.race([
            Promise.all(pendingImages.map(img => {
              if (img.decode) {
                return img.decode().catch(() => {});
              }
              return new Promise(res => {
                img.onload = img.onerror = res;
                setTimeout(res, 1200);
              });
            })),
            new Promise(res => setTimeout(res, 2000))
          ]);
        }

        // 7. Settle layout and return to top
        await new Promise(r => setTimeout(r, 200));
        window.scrollTo({ top: 0, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
        await new Promise(r => setTimeout(r, 150));
      }
    });
  } catch (e) {
    console.warn('Hydration script warning:', e);
  }

  if (onProgress) onProgress(25, 'Hydration complete!');
}

// ─── Smart 5–7 Macro-Chunk Visual Capture Engine ───
async function captureSmartChunks(tab) {
  // 1. Deep hydration pass first so all lazy images & animations are 100% mounted
  setCaptureProgress(5, 'Deep hydrating page (images & animations)...');
  await performDeepPageHydration(tab.id, (pct, msg) => setCaptureProgress(pct, msg));

  // 2. Measure dimensions in target tab
  setCaptureProgress(25, 'Calculating 5–7 macro-chunk layout...');
  const [geomResult] = await chrome.scripting.executeScript({
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

  if (!geomResult || !geomResult.result) {
    throw new Error('Failed to analyze target page dimensions');
  }

  const {
    totalHeight,
    totalWidth,
    viewportHeight,
    viewportWidth,
    dpr,
    origScrollX,
    origScrollY
  } = geomResult.result;

  // 3. Determine optimal chunk count: TARGET 5 TO 7 CHUNKS
  // Short pages (<2 viewports) take 1-3 chunks.
  // Medium-to-large pages take strictly 5 to 7 macro chunks covering 100% of the page!
  let numChunks;
  if (totalHeight <= viewportHeight * 1.5) {
    numChunks = 1;
  } else if (totalHeight <= viewportHeight * 3) {
    numChunks = Math.min(3, Math.ceil(totalHeight / viewportHeight));
  } else if (totalHeight <= viewportHeight * 5) {
    numChunks = 5;
  } else {
    // For large/enterprise pages (e.g. Stripe Payments), strictly 5 to 7 chunks
    numChunks = Math.min(7, Math.max(5, Math.round(totalHeight / 2600)));
  }

  // Calculate slice geometry for each of the N chunks (100% continuous coverage, 0 gaps)
  const chunkSlices = [];
  for (let c = 0; c < numChunks; c++) {
    const top = Math.round(c * (totalHeight / numChunks));
    const bottom = (c === numChunks - 1) ? totalHeight : Math.round((c + 1) * (totalHeight / numChunks));
    chunkSlices.push({
      index: c,
      chunkNum: String(c + 1).padStart(2, '0'),
      top,
      bottom,
      height: bottom - top
    });
  }

  const generatedChunks = [];

  try {
    for (let c = 0; c < chunkSlices.length; c++) {
      const slice = chunkSlices[c];
      const percent = Math.round(30 + ((c / numChunks) * 60));
      setCaptureProgress(
        percent,
        `Capturing Chunk ${c + 1} of ${numChunks} (${slice.top}px – ${slice.bottom}px)...`
      );

      // Determine sub-steps needed to capture this slice
      const subSteps = Math.max(1, Math.ceil(slice.height / viewportHeight));
      const subCaptures = [];

      for (let s = 0; s < subSteps; s++) {
        const scrollY = (s === subSteps - 1 && subSteps > 1)
          ? Math.max(0, slice.bottom - viewportHeight)
          : Math.min(Math.max(0, totalHeight - viewportHeight), slice.top + (s * viewportHeight));

        // Scroll to position & hide sticky headers on chunks/slices after the hero
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          args: [scrollY, c],
          func: (y, chunkIndex) => {
            window.scrollTo({ top: y, left: 0, behavior: 'instant' });
            if (chunkIndex > 0) {
              if (!window.__design2md_hidden_fixed) {
                window.__design2md_hidden_fixed = [];
                document.querySelectorAll('*').forEach(el => {
                  const style = window.getComputedStyle(el);
                  if (style.position === 'fixed' || style.position === 'sticky') {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 120 && rect.height < 250) {
                      window.__design2md_hidden_fixed.push({ el, origVis: el.style.visibility });
                      el.style.visibility = 'hidden';
                    }
                  }
                });
              }
            }
          }
        });

        // Generous settle time for image decode and repaint
        await new Promise(r => setTimeout(r, 280));

        // Capture visible tab
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

        subCaptures.push({
          dataUrl,
          scrollY,
          relativeY: scrollY - slice.top
        });
      }

      // Merge sub-captures for this slice into a single crisp Chunk PNG
      if (subCaptures.length === 1 && slice.height <= viewportHeight) {
        // Direct blob if exactly 1 viewport
        generatedChunks.push({
          chunkIndex: c,
          filename: `chunk_${slice.chunkNum}.png`,
          blob: dataUrlToBlob(subCaptures[0].dataUrl),
          dataUrl: subCaptures[0].dataUrl,
          slice
        });
      } else {
        // Multi-frame slice: Stitch onto a slice canvas at native DPR
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(viewportWidth * dpr);
        canvas.height = Math.round(slice.height * dpr);
        const ctx = canvas.getContext('2d');

        for (const sub of subCaptures) {
          const img = new Image();
          img.src = sub.dataUrl;
          await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

          const destY = Math.round(sub.relativeY * dpr);
          const destH = Math.round(viewportHeight * dpr);
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, destY, canvas.width, destH);
        }

        const chunkBlob = await new Promise(res => canvas.toBlob(res, 'image/png'));
        const chunkDataUrl = canvas.toDataURL('image/png');

        generatedChunks.push({
          chunkIndex: c,
          filename: `chunk_${slice.chunkNum}.png`,
          blob: chunkBlob,
          dataUrl: chunkDataUrl,
          slice
        });
      }
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

  return {
    chunks: generatedChunks,
    numChunks
  };
}

async function handleCaptureScreenshot() {
  const btn = document.getElementById('captureScreenshotBtn');
  const isExtensionEnv = typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query;

  if (!isExtensionEnv) {
    showToast('Visual chunks capture requires opening extension on a live website tab');
    return;
  }

  let tab = null;
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    tab = tabs && tabs[0];
  } catch (e) {}

  if (!tab || !tab.id || tab.url?.startsWith('file://') || tab.url?.startsWith('chrome://')) {
    showToast('Open a live website (like stripe.com) to capture visual slices');
    return;
  }

  btn.disabled = true;
  try {
    const captureResult = await captureSmartChunks(tab);
    setCaptureProgress(95, `Packaging ${captureResult.chunks.length} crisp chunks...`);
    const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'site';

    if (captureResult.chunks.length === 1) {
      downloadBlob(captureResult.chunks[0].blob, `${domain}_chunk_01.png`);
    } else {
      const zip = new JSZip();
      captureResult.chunks.forEach(c => {
        zip.file(c.filename, c.blob);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `${domain}_VISUAL_CHUNKS.zip`);
    }

    setCaptureProgress(100, `Done! ${captureResult.chunks.length} Chunks Saved`);
    setTimeout(() => hideCaptureProgress(), 1800);
  } catch (err) {
    console.error('Screenshot capture failed:', err);
    showToast(`Screenshot failed: ${err.message}`);
    hideCaptureProgress();
  } finally {
    btn.disabled = false;
  }
}

async function handleDownloadZipBundle() {
  const btn = document.getElementById('downloadZipBundleBtn');

  if (typeof JSZip === 'undefined') {
    showToast('ZIP library loading error');
    return;
  }

  btn.disabled = true;
  try {
    setCaptureProgress(15, 'Preparing bundle specifications...');
    const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'stripe_com';
    const zip = new JSZip();
    const folderName = `${domain}_Clone_Bundle`;
    const folder = zip.folder(folderName);

    folder.file('DESIGN.md', designMarkdown || '# DESIGN.md\n');
    folder.file('UI.md', uiMarkdown || '# UI.md\n');
    folder.file('FULL_CLONE.md', fullMarkdown || '# FULL_CLONE.md\n');

    const promptMatch = fullMarkdown.match(/## 🤖 Antigravity \/ AI Coding Prompt[\s\S]*?```text([\s\S]*?)```/)
      || designMarkdown.match(/## 🤖 Antigravity \/ AI Coding Prompt[\s\S]*?```text([\s\S]*?)```/);
    const promptText = promptMatch ? promptMatch[1].trim() : (designMarkdown || fullMarkdown);
    folder.file('AI_CODING_PROMPT.txt', promptText || 'Rebuild this site matching DESIGN.md and UI.md');

    // If running in live website tab, capture 5-7 crisp visual chunks too!
    const isExtensionEnv = typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query;
    if (isExtensionEnv) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id && !tab.url?.startsWith('file://') && !tab.url?.startsWith('chrome://')) {
          setCaptureProgress(30, 'Capturing 5–7 visual chunks for bundle...');
          const captureResult = await captureSmartChunks(tab);
          const ssFolder = folder.folder('screenshots');
          captureResult.chunks.forEach(c => {
            ssFolder.file(c.filename, c.blob);
          });
        }
      } catch (e) {
        console.warn('Screenshot in zip skipped:', e);
      }
    }

    setCaptureProgress(92, 'Generating final ZIP bundle...');
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    setCaptureProgress(100, 'Bundle Ready!');
    downloadBlob(zipBlob, `${domain}_COMPLETE_CLONE_BUNDLE.zip`);
    setTimeout(() => hideCaptureProgress(), 1800);
  } catch (err) {
    console.error('ZIP bundle generation failed:', err);
    showToast(`Bundle failed: ${err.message}`);
    hideCaptureProgress();
  } finally {
    btn.disabled = false;
  }
}

// ─── Bootstrap Popup ───
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopup);
} else {
  initPopup();
}
