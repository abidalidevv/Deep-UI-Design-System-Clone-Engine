// popup.js v2.3.0 - Controller for Design2MD Pro
// Supports dynamic live DOM extraction on any website + explicit error states (no silent demo fallback)

let extractedData = null;
let designMarkdown = '';
let uiMarkdown = '';
let fullMarkdown = '';
let activePreviewDoc = 'design';

function showExtractionError(message) {
  document.getElementById('statusText').textContent = 'ERROR';
  const badge = document.getElementById('statusBadge');
  if (badge) {
    badge.style.borderColor = '#FCA5A5';
    badge.style.background = '#FEF2F2';
    badge.style.color = '#DC2626';
  }
  document.getElementById('siteDomain').textContent = 'Extraction Blocked / Failed';
  document.getElementById('siteTitle').textContent = message || 'Could not access DOM on this page';
  const pill = document.getElementById('themePill');
  if (pill) {
    pill.textContent = 'Unavailable';
    pill.style.background = '#F3F4F6';
    pill.style.color = '#9CA3AF';
  }

  // Explicitly disable all export buttons on error
  const exportBtnIds = [
    'downloadDesignBtn', 'copyTokensBtn', 'downloadUiBtn', 'copySectionsBtn',
    'copyPromptBtn', 'downloadFullMdBtn', 'copyActivePreviewBtn',
    'captureScreenshotBtn', 'downloadZipBundleBtn'
  ];
  exportBtnIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
    }
  });

  const previewEl = document.getElementById('previewCode');
  if (previewEl) {
    previewEl.textContent = `// Extraction Error:\n// ${message}\n// Please navigate to a live website (http:// or https://) and re-open the extension.`;
  }
}

function loadStandaloneDemo() {
  const banner = document.getElementById('demoBanner');
  if (banner) banner.classList.remove('hidden');

  document.getElementById('statusText').textContent = 'DEMO';
  const badge = document.getElementById('statusBadge');
  if (badge) {
    badge.style.borderColor = '#FCD34D';
    badge.style.background = '#FFFBEB';
    badge.style.color = '#B45309';
  }
  document.getElementById('siteDomain').textContent = 'standalone_preview.local';
  document.getElementById('siteTitle').textContent = 'Demo Mode (Open on live website to extract real DOM)';
  const pill = document.getElementById('themePill');
  if (pill) {
    pill.textContent = 'Preview Only';
    pill.style.background = '#FEF3C7';
    pill.style.color = '#92400E';
  }

  // Explicitly disable all export buttons in demo mode so fake data is never exported
  const exportBtnIds = [
    'downloadDesignBtn', 'copyTokensBtn', 'downloadUiBtn', 'copySectionsBtn',
    'copyPromptBtn', 'downloadFullMdBtn', 'copyActivePreviewBtn',
    'captureScreenshotBtn', 'downloadZipBundleBtn'
  ];
  exportBtnIds.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = true;
      btn.style.opacity = '0.4';
      btn.style.cursor = 'not-allowed';
      btn.title = 'Exports disabled in Demo Preview Mode';
    }
  });

  const previewEl = document.getElementById('previewCode');
  if (previewEl) {
    previewEl.textContent = `/* DEMO PREVIEW ONLY */\n/* Install extension in chrome://extensions and run on a live site to extract real design tokens and specs. */`;
  }
}

async function initPopup() {
  initEventListeners();

  const isExtensionEnv = typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query;

  if (!isExtensionEnv) {
    // Standalone Browser Preview Mode: Show prominent demo banner and make read-only
    loadStandaloneDemo();
    return;
  }

  let tab = null;
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    tab = tabs && tabs[0];
  } catch (e) {
    showExtractionError('Could not query active tab: ' + e.message);
    return;
  }

  if (!tab || !tab.id) {
    showExtractionError('No active browser tab found.');
    return;
  }

  // System pages restriction: show explicit error, never silent demo
  if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:') || tab.url?.startsWith('file://')) {
    const scheme = tab.url.split(':')[0];
    showExtractionError(`Browser security prevents extensions from running on ${scheme}:// pages. Please open a normal HTTP or HTTPS website.`);
    return;
  }

  try {
    // 1. Inject extraction engine directly onto untouched live page
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['extractor.js']
    });

    // 2. Extract DOM tokens & layouts BEFORE any hydration styles touch the page
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
    } else {
      showExtractionError('Extraction returned empty data from the page.');
    }
  } catch (err) {
    console.error('Design2MD extraction error:', err);
    showExtractionError(err.message || 'Script injection failed on this page.');
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

// ─── Background Service Worker Throttled Capture Helper ───
async function requestTabCapture(tab) {
  try {
    const res = await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ action: 'CAPTURE_TAB', windowId: tab.windowId }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (response && response.error) {
          reject(new Error(response.error));
        } else if (response && response.dataUrl) {
          resolve(response.dataUrl);
        } else {
          reject(new Error('Empty capture returned'));
        }
      });
    });
    return res;
  } catch (bgErr) {
    // Fallback: direct capture with 650ms minimum interval
    await new Promise(r => setTimeout(r, 650));
    return new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab(null, { format: 'png' }, (dataUrl) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else if (!dataUrl) {
          reject(new Error('Direct capture failed'));
        } else {
          resolve(dataUrl);
        }
      });
    });
  }
}

// ─── Reversible Deep Page Hydration Pass ───
async function performDeepPageHydration(tabId, onProgress) {
  if (onProgress) onProgress(10, 'Deep hydrating lazy assets & animations...');

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      func: async () => {
        const initialScrollY = window.scrollY;
        const initialScrollX = window.scrollX;

        // 1. Inject temporary hydration style (will be removed in finally)
        let animStyle = document.getElementById('__design2md_hydration_style');
        if (!animStyle) {
          animStyle = document.createElement('style');
          animStyle.id = '__design2md_hydration_style';
          animStyle.textContent = `
            [data-aos], .aos-init, [data-scroll], [data-reveal], .reveal, .fade-in, .animate-on-scroll {
              opacity: 1 !important;
              visibility: visible !important;
              transform: none !important;
              animation: none !important;
              transition: none !important;
            }
            img, picture, svg, video {
              opacity: 1 !important;
              visibility: visible !important;
            }
          `;
          document.head.appendChild(animStyle);
        }

        // 2. Unmask inline opacity:0 and visibility:hidden styles
        document.querySelectorAll('*').forEach(el => {
          if (el.style && el.style.opacity === '0') el.style.opacity = '1';
          if (el.style && el.style.visibility === 'hidden') el.style.visibility = 'visible';
        });

        // 3. Promote lazy images even if placeholder src exists
        document.querySelectorAll('img, picture source, iframe').forEach(el => {
          if (el.hasAttribute('loading')) el.setAttribute('loading', 'eager');
          const dSrc = el.dataset.src || el.dataset.lazySrc || el.dataset.original;
          if (dSrc) {
            if (!el.src || el.src.startsWith('data:') || el.src.includes('blank') || el.src.includes('placeholder') || el.src !== dSrc) {
              el.src = dSrc;
            }
          }
          const dSrcset = el.dataset.srcset || el.dataset.lazySrcset;
          if (dSrcset && (!el.srcset || el.srcset !== dSrcset)) {
            el.srcset = dSrcset;
          }
        });

        // 4. Progressive sweep: step = 0.8 * viewportHeight, NO artificial step cap
        const vh = window.innerHeight || 800;
        const stepSize = Math.max(300, Math.round(0.8 * vh));
        let curY = 0;

        while (curY < Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)) {
          curY += stepSize;
          window.scrollTo({ top: curY, behavior: 'instant' });
          window.dispatchEvent(new Event('scroll'));
          await new Promise(r => setTimeout(r, 75));
        }

        // 5. Await web fonts
        if (document.fonts && document.fonts.ready) {
          try { await document.fonts.ready; } catch(e) {}
        }

        // 6. Await pending images
        const pendingImages = Array.from(document.images).filter(img => !img.complete && img.src);
        if (pendingImages.length > 0) {
          await Promise.race([
            Promise.all(pendingImages.map(img => {
              if (img.decode) return img.decode().catch(() => {});
              return new Promise(res => { img.onload = img.onerror = res; setTimeout(res, 1000); });
            })),
            new Promise(res => setTimeout(res, 2000))
          ]);
        }

        // 7. Settle layout and restore scroll to original user position
        await new Promise(r => setTimeout(r, 150));
        window.scrollTo({ top: initialScrollY, left: initialScrollX, behavior: 'instant' });
        window.dispatchEvent(new Event('scroll'));
        await new Promise(r => setTimeout(r, 100));
      }
    });
  } catch (e) {
    console.warn('Hydration script warning:', e);
  }

  if (onProgress) onProgress(25, 'Hydration complete!');
}

// ─── Native Viewport Slices Capture Engine (1440 x 900–1200px) ───
async function captureViewportChunks(tab) {
  setCaptureProgress(5, 'Deep hydrating page...');

  // 1. Read initial state before anything touches the page
  const [initGeom] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => ({
      origX: window.scrollX,
      origY: window.scrollY,
      viewportHeight: window.innerHeight,
      viewportWidth: window.innerWidth,
      dpr: window.devicePixelRatio || 1
    })
  });

  const { origX, origY, viewportHeight, viewportWidth, dpr } = initGeom.result;

  // 2. Perform deep hydration
  await performDeepPageHydration(tab.id, (pct, msg) => setCaptureProgress(pct, msg));

  // 3. Target slice size: native viewport height (capped at 1200px max)
  const sliceHeight = Math.min(1200, Math.max(600, viewportHeight));

  // Re-measure full height after hydration
  const [sizeRes] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
  });
  let totalHeight = sizeRes.result || viewportHeight;

  const numChunks = Math.max(1, Math.ceil(totalHeight / sliceHeight));
  const generatedChunks = [];

  try {
    for (let i = 0; i < numChunks; i++) {
      const targetY = i * sliceHeight;
      const percent = Math.round(30 + ((i / numChunks) * 65));
      setCaptureProgress(percent, `Capturing viewport slice ${i + 1} of ${numChunks}...`);

      // Scroll to position, hide fixed/sticky elements on step > 0, re-measure page height
      const [stepInfo] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        args: [targetY, i, totalHeight],
        func: (y, stepIndex, currentTotalH) => {
          window.scrollTo({ top: y, left: 0, behavior: 'instant' });
          const actualY = window.scrollY;
          const freshHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

          // Hide fixed/sticky elements from step 1 onward (both top headers & bottom widgets)
          if (stepIndex > 0) {
            if (!window.__design2md_hidden_fixed) {
              window.__design2md_hidden_fixed = [];
              document.querySelectorAll('*').forEach(el => {
                const style = window.getComputedStyle(el);
                if (style.position === 'fixed' || style.position === 'sticky') {
                  const rect = el.getBoundingClientRect();
                  const isTopHeader = rect.top <= 120 && rect.height < 250;
                  const isBottomWidget = rect.bottom >= (window.innerHeight - 150) && rect.height < 250;
                  if (isTopHeader || isBottomWidget) {
                    window.__design2md_hidden_fixed.push({ el, origVis: el.style.visibility });
                    el.style.visibility = 'hidden';
                  }
                }
              });
            }
          }
          return { actualY, freshHeight };
        }
      });

      if (stepInfo?.result?.freshHeight && stepInfo.result.freshHeight > totalHeight) {
        totalHeight = stepInfo.result.freshHeight;
      }

      await new Promise(r => setTimeout(r, 260));

      // Throttled capture via background service worker
      const dataUrl = await requestTabCapture(tab);

      const actualY = stepInfo?.result?.actualY ?? targetY;
      const remainingHeight = totalHeight - actualY;

      // Crop the bottom of the last chunk if it's shorter than viewport
      if (remainingHeight < viewportHeight && i === numChunks - 1 && remainingHeight > 50) {
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = Math.round(viewportWidth * dpr);
        cropCanvas.height = Math.round(remainingHeight * dpr);
        const ctx = cropCanvas.getContext('2d');

        const img = new Image();
        img.src = dataUrl;
        await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });

        ctx.drawImage(img, 0, 0, img.width, Math.round(remainingHeight * dpr), 0, 0, cropCanvas.width, cropCanvas.height);
        const croppedBlob = await new Promise(res => cropCanvas.toBlob(res, 'image/png'));
        const chunkNum = String(i + 1).padStart(2, '0');
        generatedChunks.push({
          chunkIndex: i,
          filename: `chunk_${chunkNum}.png`,
          blob: croppedBlob
        });
      } else {
        const chunkBlob = dataUrlToBlob(dataUrl);
        const chunkNum = String(i + 1).padStart(2, '0');
        generatedChunks.push({
          chunkIndex: i,
          filename: `chunk_${chunkNum}.png`,
          blob: chunkBlob
        });
      }
    }
  } finally {
    // ALWAYS remove injected hydration style, restore sticky/fixed elements, and restore original scroll
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [origX, origY],
      func: (restoreX, restoreY) => {
        const style = document.getElementById('__design2md_hydration_style');
        if (style) style.remove();

        if (window.__design2md_hidden_fixed) {
          window.__design2md_hidden_fixed.forEach(item => {
            item.el.style.visibility = item.origVis;
          });
          delete window.__design2md_hidden_fixed;
        }

        window.scrollTo({ top: restoreY, left: restoreX, behavior: 'instant' });
      }
    });
  }

  return {
    chunks: generatedChunks,
    numChunks: generatedChunks.length
  };
}

async function handleCaptureScreenshot() {
  const btn = document.getElementById('captureScreenshotBtn');
  const isExtensionEnv = typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query;

  if (!isExtensionEnv) {
    showToast('Visual capture requires opening extension on a live website tab');
    return;
  }

  let tab = null;
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    tab = tabs && tabs[0];
  } catch (e) {}

  if (!tab || !tab.id || tab.url?.startsWith('file://') || tab.url?.startsWith('chrome://')) {
    showToast('Open a live website to capture visual slices');
    return;
  }

  btn.disabled = true;
  try {
    const captureResult = await captureViewportChunks(tab);
    setCaptureProgress(95, `Packaging ${captureResult.chunks.length} viewport slices...`);
    const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'target_site';

    if (captureResult.chunks.length === 1) {
      downloadBlob(captureResult.chunks[0].blob, `${domain}_chunk_01.png`);
    } else {
      const zip = new JSZip();
      captureResult.chunks.forEach(c => {
        zip.file(c.filename, c.blob);
      });
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(zipBlob, `${domain}_VIEWPORT_CHUNKS.zip`);
    }

    setCaptureProgress(100, `Done! ${captureResult.chunks.length} Slices Saved`);
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
    const domain = extractedData?.meta?.domain?.replace(/[^a-zA-Z0-9]/g, '_') || 'target_site';
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

    // Capture viewport-sized visual chunks
    const isExtensionEnv = typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query;
    if (isExtensionEnv) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id && !tab.url?.startsWith('file://') && !tab.url?.startsWith('chrome://')) {
          setCaptureProgress(30, 'Capturing viewport visual slices...');
          const captureResult = await captureViewportChunks(tab);
          const ssFolder = folder.folder('screenshots');
          captureResult.chunks.forEach(c => {
            ssFolder.file(c.filename, c.blob);
          });
        }
      } catch (ssErr) {
        console.warn('Screenshot in zip skipped due to error:', ssErr);
        folder.file('SCREENSHOT_NOTICE.txt', `Screenshots could not be captured: ${ssErr.message}\nAll markdown specifications (DESIGN.md, UI.md, FULL_CLONE.md) are complete.`);
        showToast(`Screenshots skipped: ${ssErr.message}`);
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

