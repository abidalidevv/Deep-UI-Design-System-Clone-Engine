// extractor.js - v2.5 Deep Web Design Clone Engine
// Extracts EVERYTHING needed to replicate a website's exact visual design
// Produces a comprehensive DESIGN.md optimized for Antigravity & AI coding assistants

function extractDesignSystem() {
  // ─── Utility Helpers ──────────────────────────
  function rgbToHex(rgbStr) {
    if (!rgbStr || rgbStr === 'transparent' || rgbStr === 'rgba(0, 0, 0, 0)') return null;
    const match = rgbStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return null;
    return `#${[match[1], match[2], match[3]].map(v => parseInt(v).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
  }

  function getLuminance(hex) {
    if (!hex || hex.length < 7) return 0.5;
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  function cleanText(txt) {
    return (txt || '').replace(/\s+/g, ' ').trim();
  }

  function getElStyle(el) {
    try { return window.getComputedStyle(el); } catch (e) { return null; }
  }

  function isVisible(el) {
    if (!el) return false;
    if (el.tagName === 'BODY' || el.tagName === 'HTML') return true;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  }

  function describeRect(el) {
    const r = el.getBoundingClientRect();
    return { width: Math.round(r.width), height: Math.round(r.height), top: Math.round(r.top + window.scrollY) };
  }

  function extractFullStyle(el) {
    const s = getElStyle(el);
    if (!s) return null;
    return {
      background: rgbToHex(s.backgroundColor),
      backgroundImage: (s.backgroundImage && s.backgroundImage !== 'none') ? s.backgroundImage : null,
      color: rgbToHex(s.color),
      fontFamily: s.fontFamily?.split(',')[0].replace(/['"]/g, '').trim(),
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: s.lineHeight,
      letterSpacing: s.letterSpacing !== 'normal' ? s.letterSpacing : null,
      textTransform: s.textTransform !== 'none' ? s.textTransform : null,
      textDecoration: s.textDecorationLine !== 'none' ? s.textDecorationLine : null,
      padding: s.padding,
      margin: s.margin,
      borderRadius: s.borderRadius !== '0px' ? s.borderRadius : null,
      border: s.borderWidth !== '0px' ? `${s.borderWidth} ${s.borderStyle} ${rgbToHex(s.borderColor) || ''}`.trim() : null,
      boxShadow: s.boxShadow !== 'none' ? s.boxShadow : null,
      backdropFilter: (s.backdropFilter && s.backdropFilter !== 'none') ? s.backdropFilter : (s.webkitBackdropFilter && s.webkitBackdropFilter !== 'none') ? s.webkitBackdropFilter : null,
      display: s.display,
      flexDirection: s.display === 'flex' ? s.flexDirection : null,
      flexWrap: (s.display === 'flex' && s.flexWrap !== 'nowrap') ? s.flexWrap : null,
      alignItems: (s.display === 'flex' || s.display === 'grid') ? s.alignItems : null,
      justifyContent: (s.display === 'flex' || s.display === 'grid') ? s.justifyContent : null,
      gap: (s.gap && s.gap !== 'normal' && s.gap !== '0px') ? s.gap : null,
      gridTemplateColumns: s.display === 'grid' ? s.gridTemplateColumns : null,
      gridTemplateRows: (s.display === 'grid' && s.gridTemplateRows !== 'none') ? s.gridTemplateRows : null,
      maxWidth: (s.maxWidth && s.maxWidth !== 'none') ? s.maxWidth : null,
      width: (s.width && s.width !== 'auto') ? s.width : null,
      height: (s.height && s.height !== 'auto') ? s.height : null,
      position: (s.position && s.position !== 'static') ? s.position : null,
      zIndex: (s.zIndex && s.zIndex !== 'auto') ? s.zIndex : null,
      top: (s.top && s.top !== 'auto') ? s.top : null,
      bottom: (s.bottom && s.bottom !== 'auto') ? s.bottom : null,
      left: (s.left && s.left !== 'auto') ? s.left : null,
      right: (s.right && s.right !== 'auto') ? s.right : null,
      overflow: (s.overflow !== 'visible') ? s.overflow : null,
      opacity: s.opacity !== '1' ? s.opacity : null,
      transform: (s.transform && s.transform !== 'none') ? s.transform : null,
      transition: (s.transition && s.transition !== 'all 0s ease 0s' && s.transition !== 'none 0s ease 0s') ? s.transition : null
    };
  }

  function cleanStyle(obj) {
    if (!obj) return {};
    const cleaned = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v !== null && v !== undefined && v !== '' && v !== 'none' && v !== '0px') {
        cleaned[k] = v;
      }
    }
    return cleaned;
  }

  // ─── Real Trimmed DOM Skeleton Generator ──────────────────────────
  function buildTrimmedDOMSkeleton(rootEl, maxDepth = 4) {
    function walk(node, depth) {
      if (!node || depth > maxDepth) return '';
      if (node.nodeType === Node.TEXT_NODE) return '';
      if (node.nodeType !== Node.ELEMENT_NODE) return '';

      const tag = node.tagName.toLowerCase();
      if (['script', 'style', 'noscript', 'iframe', 'template'].includes(tag)) return '';
      if (node.offsetWidth === 0 && node.offsetHeight === 0 && tag !== 'svg') return '';

      const indent = '  '.repeat(depth);
      const classes = node.className && typeof node.className === 'string' ? node.className.trim() : '';
      const classAttr = classes ? ` class="${classes.split(/\s+/).slice(0, 5).join(' ')}"` : '';
      const idAttr = node.id ? ` id="${node.id}"` : '';

      if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
        const textPreview = cleanText(node.innerText).slice(0, 40);
        const hint = textPreview ? ` "${textPreview}"` : '';
        return `${indent}<${tag}${idAttr}${classAttr}>[${tag.toUpperCase()}${hint}]</${tag}>\n`;
      }

      if (tag === 'p') {
        const textPreview = cleanText(node.innerText).slice(0, 35);
        const hint = textPreview ? ` "${textPreview}..."` : '';
        return `${indent}<p${idAttr}${classAttr}>[Paragraph${hint}]</p>\n`;
      }

      if (tag === 'button' || (tag === 'a' && (classes.includes('btn') || classes.includes('button')))) {
        const textPreview = cleanText(node.innerText).slice(0, 30);
        const hint = textPreview ? ` "${textPreview}"` : ' CTA';
        return `${indent}<${tag}${idAttr}${classAttr}>[Button:${hint}]</${tag}>\n`;
      }

      if (tag === 'img') {
        const w = node.offsetWidth || node.width;
        const h = node.offsetHeight || node.height;
        return `${indent}<img${idAttr}${classAttr} src="[Image: ${w}x${h}]" alt="[Image]"/>\n`;
      }

      if (tag === 'svg') {
        const w = node.getAttribute('width') || node.offsetWidth || 24;
        const h = node.getAttribute('height') || node.offsetHeight || 24;
        return `${indent}<svg${idAttr}${classAttr} width="${w}" height="${h}">[SVG Icon]</svg>\n`;
      }

      if (['input', 'textarea', 'select'].includes(tag)) {
        const type = node.type || tag;
        const ph = node.placeholder ? ` placeholder="[${node.placeholder}]"` : '';
        return `${indent}<${tag} type="${type}"${idAttr}${classAttr}${ph}/>\n`;
      }

      const children = Array.from(node.children);
      if (children.length === 0) {
        const txt = cleanText(node.innerText);
        if (txt && txt.length < 50) {
          return `${indent}<${tag}${idAttr}${classAttr}>[Text: "${txt.slice(0, 30)}"]</${tag}>\n`;
        }
        return `${indent}<${tag}${idAttr}${classAttr}></${tag}>\n`;
      }

      let inner = '';
      const cappedChildren = children.slice(0, 6);
      cappedChildren.forEach(child => {
        inner += walk(child, depth + 1);
      });
      if (children.length > 6) {
        inner += `${indent}  <!-- ... +${children.length - 6} more sibling items ... -->\n`;
      }

      return `${indent}<${tag}${idAttr}${classAttr}>\n${inner}${indent}</${tag}>\n`;
    }

    return walk(rootEl, 0).trim();
  }

  // ─── Framework & Tailwind Detection ──────────────────────────
  function detectFrameworks() {
    const fw = {
      tailwind: false,
      tailwindClassCount: 0,
      tailwindSamples: [],
      bootstrap: false,
      shadcnRadix: false,
      materialUI: false
    };

    const allNodes = Array.from(document.querySelectorAll('*')).slice(0, 1000);
    const tailwindRegex = /^(p[xytrbl]?-\d+|m[xytrbl]?-\d+|bg-\w+-\d+|text-\w+-\d+|flex|grid|gap-\d+|rounded-(?:sm|md|lg|xl|2xl|full)|border-\w+|shadow-(?:sm|md|lg|xl|2xl)|items-center|justify-between|w-full|h-screen|max-w-\w+)$/;
    const twClasses = new Set();

    allNodes.forEach(el => {
      if (el.className && typeof el.className === 'string') {
        const classes = el.className.split(/\s+/);
        classes.forEach(c => {
          if (tailwindRegex.test(c)) {
            fw.tailwindClassCount++;
            twClasses.add(c);
          }
          if (c.startsWith('btn-') || c.startsWith('col-') || c === 'container-fluid') fw.bootstrap = true;
          if (c.startsWith('Mui') || c.startsWith('css-')) fw.materialUI = true;
          if (c.startsWith('radix-') || el.hasAttribute('data-radix-collection-item')) fw.shadcnRadix = true;
        });
      }
    });

    if (fw.tailwindClassCount >= 15) {
      fw.tailwind = true;
      fw.tailwindSamples = Array.from(twClasses).slice(0, 20);
    }

    return fw;
  }

  // ─── Stylesheet Pseudo-Class Parser (:hover, :focus) ──────────────
  function extractPseudoStates() {
    const pseudoRules = {
      buttons: [],
      links: [],
      cards: []
    };

    try {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of (sheet.cssRules || [])) {
            if (rule.selectorText && rule.selectorText.includes(':hover')) {
              const sel = rule.selectorText;
              const style = rule.style;
              if (!style) continue;

              const change = {};
              ['background', 'backgroundColor', 'color', 'borderColor', 'transform', 'boxShadow', 'opacity'].forEach(prop => {
                const val = style.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase());
                if (val) change[prop] = val;
              });

              if (Object.keys(change).length > 0) {
                if (sel.includes('btn') || sel.includes('button')) {
                  pseudoRules.buttons.push({ selector: sel.slice(0, 60), state: ':hover', change });
                } else if (sel.includes('card') || sel.includes('tile')) {
                  pseudoRules.cards.push({ selector: sel.slice(0, 60), state: ':hover', change });
                } else if (sel.includes('a') || sel.includes('nav')) {
                  pseudoRules.links.push({ selector: sel.slice(0, 60), state: ':hover', change });
                }
              }
            }
          }
        } catch (e) { /* cross-origin rules ignored */ }
      }
    } catch (e) {}

    pseudoRules.buttons = pseudoRules.buttons.slice(0, 5);
    pseudoRules.cards = pseudoRules.cards.slice(0, 4);
    pseudoRules.links = pseudoRules.links.slice(0, 4);
    return pseudoRules;
  }

  // ─── Main Data Object ──────────────────────────
  const result = {
    meta: {
      title: document.title || 'Untitled Page',
      url: window.location.href,
      domain: window.location.hostname,
      favicon: document.querySelector('link[rel*="icon"]')?.href || null,
      themeColor: document.querySelector('meta[name="theme-color"]')?.content || null,
      description: document.querySelector('meta[name="description"]')?.content || null,
      viewport: document.querySelector('meta[name="viewport"]')?.content || null,
      timestamp: new Date().toISOString(),
      pageHeight: Math.max(document.body.scrollHeight, document.documentElement.scrollHeight),
      pageWidth: document.documentElement.clientWidth
    },
    mode: 'Light Mode',
    cssVariables: {},
    synthesizedTokens: {},
    colors: { backgrounds: [], text: [], borders: [], accents: [], gradients: [] },
    typography: { fontFamilies: [], externalFonts: [], hierarchy: {} },
    layout: { containerMaxWidth: null, breakpoints: [], spacingTokens: [] },
    sections: [],
    components: {
      navbar: null,
      hero: null,
      buttons: [],
      cards: [],
      inputs: [],
      links: [],
      badges: [],
      footer: null
    },
    framework: detectFrameworks(),
    pseudoStates: extractPseudoStates(),
    darkThemeVariables: {},
    animations: { transitions: [], keyframes: [] },
    icons: { library: null, samples: [] },
    images: { treatments: [] },
    shadows: [],
    radii: [],
    blurEffects: []
  };

  // ─── 1. Theme Detection ──────────────────────────
  const bodyStyle = getElStyle(document.body);
  const htmlStyle = getElStyle(document.documentElement);
  const bodyBg = rgbToHex(bodyStyle?.backgroundColor) || rgbToHex(htmlStyle?.backgroundColor) || '#FFFFFF';
  result.mode = getLuminance(bodyBg) < 0.4 ? 'Dark Mode' : 'Light Mode';

  // ─── 2. CSS Custom Properties (:root + theme classes) ─────────────
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of (sheet.cssRules || [])) {
          if (!rule.selectorText) continue;
          const sel = rule.selectorText.toLowerCase();
          const isThemeDark = sel.includes('dark') || sel.includes('theme="dark"') || sel.includes('theme=\'dark\'');
          const isRootOrGlobal = sel === ':root' || sel === 'html' || sel === 'body' || sel === ':root, :host';

          if (isRootOrGlobal || isThemeDark) {
            for (let i = 0; i < rule.style.length; i++) {
              const prop = rule.style[i];
              if (prop && prop.startsWith('--')) {
                const val = rule.style.getPropertyValue(prop).trim();
                if (val) {
                  if (isThemeDark) {
                    result.darkThemeVariables[prop] = val;
                  } else {
                    result.cssVariables[prop] = val;
                  }
                }
              }
            }
          }
        }
      } catch (e) { /* cross-origin */ }
    }
  } catch (e) {}

  // ─── 3. Extract Animations & Keyframes ──────────────────────────
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of (sheet.cssRules || [])) {
          if (rule instanceof CSSKeyframesRule) {
            let frames = [];
            for (let i = 0; i < rule.cssRules.length; i++) {
              const f = rule.cssRules[i];
              frames.push({ key: f.keyText, props: f.cssText });
            }
            result.animations.keyframes.push({
              name: rule.name,
              frames: frames.slice(0, 4)
            });
          }
        }
      } catch (e) { /* cross-origin */ }
    }
  } catch (e) {}

  // ─── 4. Detect External Font Imports ──────────────────────────
  const fontSources = new Set();
  document.querySelectorAll('link[rel="stylesheet"], link[as="style"], link[rel="preconnect"]').forEach(link => {
    if (link.href && (link.href.includes('fonts.googleapis.com') || link.href.includes('fonts.bunny.net') || link.href.includes('typekit.net') || link.href.includes('use.fontawesome') || link.href.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome'))) {
      fontSources.add(link.href);
    }
  });
  document.querySelectorAll('style').forEach(style => {
    const text = style.textContent || '';
    const imports = text.match(/@import\s+url\(['"](.*?)['"]\)/g);
    if (imports) imports.forEach(imp => {
      const url = imp.match(/url\(['"]?(.*?)['"]?\)/)?.[1];
      if (url && url.includes('fonts')) fontSources.add(url);
    });
  });
  result.typography.externalFonts = Array.from(fontSources);

  // ─── 5. Icon Library Detection ──────────────────────────
  const iconDetectors = [
    { name: 'Lucide Icons', selectors: ['[class*="lucide"]', 'svg[class*="lucide"]'] },
    { name: 'Heroicons', selectors: ['svg[class*="heroicon"]', '[data-slot]'] },
    { name: 'Font Awesome', selectors: ['.fa, .fas, .far, .fab, .fa-solid, .fa-regular, .fa-brands, [class*="fa-"]'] },
    { name: 'Material Icons', selectors: ['.material-icons, .material-symbols-outlined, .material-symbols-rounded'] },
    { name: 'Phosphor Icons', selectors: ['[class*="ph-"], .ph'] },
    { name: 'Tabler Icons', selectors: ['.tabler-icon, [class*="ti-"]'] },
    { name: 'Feather Icons', selectors: ['[class*="feather"], svg.feather'] },
    { name: 'Bootstrap Icons', selectors: ['.bi, [class*="bi-"]'] },
    { name: 'Remix Icons', selectors: ['.ri, [class*="ri-"]'] },
    { name: 'Ionicons', selectors: ['ion-icon'] }
  ];
  for (const detector of iconDetectors) {
    for (const sel of detector.selectors) {
      try {
        const found = document.querySelectorAll(sel);
        if (found.length > 0) {
          result.icons.library = detector.name;
          Array.from(found).slice(0, 6).forEach(ic => {
            const cls = ic.className?.baseVal || ic.className || '';
            result.icons.samples.push(cls.toString().trim().slice(0, 60));
          });
          break;
        }
      } catch (e) {}
    }
    if (result.icons.library) break;
  }
  if (!result.icons.library) {
    const svgs = document.querySelectorAll('svg');
    if (svgs.length > 5) {
      result.icons.library = 'Inline SVG Icons';
      result.icons.samples = [`${svgs.length} inline SVG elements found on page`];
    }
  }

  // ─── 6. Deep Scan of Elements ──────────────────────────
  const colorCounts = { bg: {}, text: {}, border: {} };
  const fontCount = {};
  const shadowSet = new Set();
  const radiusSet = new Set();
  const gapSet = new Set();
  const gradientSet = new Set();
  const transitionSet = new Set();
  const spacingValues = new Set();

  const allElements = Array.from(document.querySelectorAll('*')).slice(0, 2500);

  allElements.forEach(el => {
    if (el.offsetWidth === 0 && el.offsetHeight === 0) return;
    const style = getElStyle(el);
    if (!style) return;

    // Colors
    const bgHex = rgbToHex(style.backgroundColor);
    if (bgHex) colorCounts.bg[bgHex] = (colorCounts.bg[bgHex] || 0) + 1;

    const tcHex = rgbToHex(style.color);
    if (tcHex) colorCounts.text[tcHex] = (colorCounts.text[tcHex] || 0) + 1;

    const bcHex = rgbToHex(style.borderColor);
    if (bcHex && style.borderWidth !== '0px') colorCounts.border[bcHex] = (colorCounts.border[bcHex] || 0) + 1;

    // Gradients
    if (style.backgroundImage && style.backgroundImage.includes('gradient')) {
      gradientSet.add(style.backgroundImage);
    }

    // Fonts
    const ff = style.fontFamily;
    if (ff) {
      const cleanFf = ff.split(',')[0].replace(/['"]/g, '').trim();
      if (cleanFf && !['inherit', 'initial', 'unset'].includes(cleanFf)) {
        fontCount[cleanFf] = (fontCount[cleanFf] || 0) + 1;
      }
    }

    // Shadows
    if (style.boxShadow && style.boxShadow !== 'none') shadowSet.add(style.boxShadow);

    // Radii
    if (style.borderRadius && style.borderRadius !== '0px') radiusSet.add(style.borderRadius);

    // Gaps
    if (style.gap && style.gap !== 'normal' && style.gap !== '0px') gapSet.add(style.gap);

    // Spacing
    ['padding', 'paddingTop', 'paddingBottom', 'marginTop', 'marginBottom'].forEach(prop => {
      const val = style[prop];
      if (val && val !== '0px' && val !== 'auto') spacingValues.add(val);
    });

    // Transitions
    if (style.transition && style.transition !== 'all 0s ease 0s' && style.transition !== 'none 0s ease 0s') {
      transitionSet.add(style.transition);
    }

    // Backdrop filter
    const bf = style.backdropFilter || style.webkitBackdropFilter;
    if (bf && bf !== 'none') result.blurEffects.push(bf);
  });

  // Compile top colors
  result.colors.backgrounds = Object.entries(colorCounts.bg).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([hex, count]) => ({ hex, count, luminance: getLuminance(hex) }));
  result.colors.text = Object.entries(colorCounts.text).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([hex, count]) => ({ hex, count }));
  result.colors.borders = Object.entries(colorCounts.border).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([hex, count]) => ({ hex, count }));
  result.colors.gradients = Array.from(gradientSet).slice(0, 8);

  // Compile fonts
  result.typography.fontFamilies = Object.entries(fontCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, count]) => ({ name, count }));

  // Typography hierarchy
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'button', 'a', 'span', 'label'].forEach(tag => {
    const el = document.querySelector(tag);
    if (el && isVisible(el)) {
      const s = getElStyle(el);
      if (s) {
        result.typography.hierarchy[tag] = {
          fontFamily: s.fontFamily?.split(',')[0].replace(/['"]/g, '').trim(),
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          lineHeight: s.lineHeight,
          letterSpacing: s.letterSpacing !== 'normal' ? s.letterSpacing : null,
          textTransform: s.textTransform !== 'none' ? s.textTransform : null,
          fontFeatureSettings: (s.fontFeatureSettings && s.fontFeatureSettings !== 'normal') ? s.fontFeatureSettings : null,
          textWrap: (s.textWrap && s.textWrap !== 'auto') ? s.textWrap : null,
          color: rgbToHex(s.color),
          sampleText: cleanText(el.innerText).slice(0, 80)
        };
      }
    }
  });

  // Body font feature settings
  const bodyComputedStyle = getElStyle(document.body);
  if (bodyComputedStyle?.fontFeatureSettings && bodyComputedStyle.fontFeatureSettings !== 'normal') {
    result.typography.globalFontFeatures = bodyComputedStyle.fontFeatureSettings;
  }

  // Compile sets & aggregated spacing scale
  result.shadows = Array.from(shadowSet).slice(0, 8);
  result.radii = Array.from(radiusSet).slice(0, 10);
  result.animations.transitions = Array.from(transitionSet).slice(0, 8);

  // Group numeric pixel spacing values
  const pxSpacingMap = {};
  spacingValues.forEach(val => {
    const match = val.match(/^(\d+(?:\.\d+)?)px$/);
    if (match) {
      const num = Math.round(parseFloat(match[1]));
      if (num > 0 && num <= 160) {
        pxSpacingMap[num] = (pxSpacingMap[num] || 0) + 1;
      }
    }
  });
  const sortedCommonSpacing = Object.keys(pxSpacingMap).map(Number).sort((a, b) => a - b);
  result.layout.spacingTokens = sortedCommonSpacing.length > 0
    ? sortedCommonSpacing.map(n => `${n}px`).slice(0, 12)
    : Array.from(spacingValues).sort().slice(0, 12);
  result.layout.baseGrid = sortedCommonSpacing.some(n => n === 8 || n === 16 || n === 24) ? '8px Grid System' : '4px Grid System';

  // ─── 7. Extract Media Query Breakpoints ──────────────────────────
  const breakpointSet = new Set();
  try {
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of (sheet.cssRules || [])) {
          if (rule instanceof CSSMediaRule) {
            const media = rule.conditionText || rule.media?.mediaText || '';
            const widthMatch = media.match(/\((?:min|max)-width:\s*(\d+(?:\.\d+)?(?:px|em|rem))\)/g);
            if (widthMatch) widthMatch.forEach(m => breakpointSet.add(m));
          }
        }
      } catch (e) { /* cross-origin */ }
    }
  } catch (e) {}
  result.layout.breakpoints = Array.from(breakpointSet).slice(0, 8);

  // ─── 8. Container Max Width ──────────────────────────
  const containerSelectors = ['main', '.container', '#container', '[class*="wrapper"]', '[class*="container"]', '[class*="content"]', '[class*="layout"]'];
  for (const sel of containerSelectors) {
    try {
      const el = document.querySelector(sel);
      if (el) {
        const s = getElStyle(el);
        if (s?.maxWidth && s.maxWidth !== 'none') {
          result.layout.containerMaxWidth = s.maxWidth;
          break;
        }
      }
    } catch (e) {}
  }

  // ─── 9. Page Section Analysis (Robust unwrapping of main/root) ─────
  const rawSections = [];
  
  // 1. Explicit landmarks
  document.querySelectorAll('header, nav, section, footer, [role="banner"], [role="contentinfo"]').forEach(el => {
    if (el.offsetWidth > 150 && el.offsetHeight > 40) rawSections.push(el);
  });

  // 2. Direct children of main or major container that act as sections
  const mainWrapper = document.querySelector('main, [role="main"], #root > div, #__next > div') || document.body;
  if (mainWrapper && mainWrapper !== document.body) {
    Array.from(mainWrapper.children).forEach(child => {
      const tag = child.tagName.toLowerCase();
      if (!['header', 'nav', 'footer', 'script', 'style'].includes(tag) && child.offsetHeight > 100 && child.offsetWidth > 250) {
        rawSections.push(child);
      }
    });
  }

  // 3. Class-based section candidates
  document.querySelectorAll('[class*="hero"], [class*="banner"], [class*="feature"], [class*="pricing"], [class*="testimonial"], [class*="cta"], [class*="showcase"], [class*="faq"], [class*="about"], [class*="service"]').forEach(el => {
    if (el.offsetWidth > 250 && el.offsetHeight > 60) rawSections.push(el);
  });

  // Sort vertically by top offset
  const sortedRaw = Array.from(new Set(rawSections)).sort((a, b) => {
    const aTop = a.getBoundingClientRect().top + window.scrollY;
    const bTop = b.getBoundingClientRect().top + window.scrollY;
    return aTop - bTop;
  });

  // Filter out giant monolithic wrappers (like body or main itself) if they contain other candidate sections
  const totalPageHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
  const candidates = sortedRaw.filter(el => {
    const h = el.offsetHeight;
    if (h > totalPageHeight * 0.75 && (el.tagName === 'MAIN' || el.tagName === 'BODY' || el.id === 'root' || el.id === '__next')) {
      return false;
    }
    return true;
  });

  // Deduplicate nested elements
  const processedSections = [];
  const usedRanges = [];

  candidates.forEach(el => {
    const rect = el.getBoundingClientRect();
    const absTop = Math.round(rect.top + window.scrollY);
    const absHeight = Math.round(rect.height);
    const absBottom = absTop + absHeight;

    // Check if covered by an existing section
    const alreadyCovered = usedRanges.some(ur => (absTop >= ur.top + 10 && absBottom <= ur.bottom - 10));
    if (alreadyCovered && el.tagName.toLowerCase() !== 'section') return;

    const s = getElStyle(el);
    if (!s) return;

    const classes = (el.className || '').toString().toLowerCase();
    const tag = el.tagName.toLowerCase();
    const id = (el.id || '').toLowerCase();
    let sectionType = 'Content Section';

    if (tag === 'header' || tag === 'nav' || classes.includes('header') || classes.includes('navbar') || classes.includes('nav')) sectionType = 'Navigation / Header';
    else if (classes.includes('hero') || classes.includes('banner') || classes.includes('jumbotron') || absTop < 600) sectionType = 'Hero Section';
    else if (classes.includes('feature')) sectionType = 'Features / Bento Grid';
    else if (classes.includes('pricing') || classes.includes('plan')) sectionType = 'Pricing Section';
    else if (classes.includes('testimonial') || classes.includes('review') || classes.includes('quote')) sectionType = 'Testimonials & Social Proof';
    else if (classes.includes('cta') || classes.includes('call-to-action')) sectionType = 'Call to Action (CTA) Banner';
    else if (classes.includes('logo') || classes.includes('client') || classes.includes('partner') || classes.includes('trust')) sectionType = 'Logo Cloud / Trust Bar';
    else if (classes.includes('about')) sectionType = 'About Section';
    else if (classes.includes('faq') || classes.includes('accordion')) sectionType = 'FAQ Section';
    else if (classes.includes('demo') || classes.includes('interactive') || classes.includes('preview')) sectionType = 'Product Demo / Preview';
    else if (tag === 'footer' || classes.includes('footer') || el.getAttribute('role') === 'contentinfo') sectionType = 'Footer';

    const children = Array.from(el.children).filter(c => c.offsetWidth > 0 && c.offsetHeight > 0);

    const headings = Array.from(el.querySelectorAll('h1, h2, h3')).slice(0, 3).map(h => ({
      tag: h.tagName.toLowerCase(),
      text: cleanText(h.innerText).slice(0, 120)
    }));

    const paragraphs = Array.from(el.querySelectorAll('p')).slice(0, 2).map(p => cleanText(p.innerText).slice(0, 150));

    const sectionButtons = Array.from(el.querySelectorAll('button, a[class*="btn"], a[class*="button"], [role="button"]'))
      .filter(b => b.offsetWidth > 30 && b.offsetHeight > 20)
      .slice(0, 4)
      .map(btn => {
        const bs = getElStyle(btn);
        return {
          text: cleanText(btn.innerText).slice(0, 40),
          style: cleanStyle({
            background: rgbToHex(bs?.backgroundColor),
            color: rgbToHex(bs?.color),
            padding: bs?.padding,
            borderRadius: bs?.borderRadius !== '0px' ? bs?.borderRadius : null,
            border: bs?.borderWidth !== '0px' ? `${bs.borderWidth} ${bs.borderStyle} ${rgbToHex(bs.borderColor)}` : null
          })
        };
      });

    const sectionImages = Array.from(el.querySelectorAll('img, video, picture'))
      .filter(im => im.offsetWidth > 50 && im.offsetHeight > 50)
      .slice(0, 3)
      .map(im => {
        const is = getElStyle(im);
        return {
          dimensions: `${im.offsetWidth}x${im.offsetHeight}`,
          borderRadius: is?.borderRadius !== '0px' ? is?.borderRadius : null,
          objectFit: is?.objectFit !== 'fill' ? is?.objectFit : null,
          boxShadow: is?.boxShadow !== 'none' ? is?.boxShadow : null
        };
      });

    let layoutType = s.display;
    let columnInfo = null;
    if (s.display === 'grid' && s.gridTemplateColumns) {
      const cols = s.gridTemplateColumns.split(/\s+/).length;
      columnInfo = `${cols}-column grid (${s.gridTemplateColumns})`;
    } else if (s.display === 'flex') {
      columnInfo = `Flexbox ${s.flexDirection || 'row'}, gap: ${s.gap || '0'}, align: ${s.alignItems || 'stretch'}, justify: ${s.justifyContent || 'flex-start'}`;
    }

    if (!columnInfo) {
      for (const child of children.slice(0, 3)) {
        const cs = getElStyle(child);
        if (cs?.display === 'grid' && cs.gridTemplateColumns) {
          const cols = cs.gridTemplateColumns.split(/\s+/).length;
          columnInfo = `Inner ${cols}-column grid (${cs.gridTemplateColumns})`;
          layoutType = 'grid (inner)';
          break;
        } else if (cs?.display === 'flex') {
          columnInfo = `Inner Flexbox ${cs.flexDirection || 'row'}, gap: ${cs.gap || '0'}`;
          layoutType = 'flex (inner)';
          break;
        }
      }
    }

    processedSections.push({
      type: sectionType,
      tag: tag,
      classes: classes.slice(0, 100),
      id: id || null,
      position: { width: Math.round(rect.width), height: absHeight, top: absTop },
      style: cleanStyle({
        background: rgbToHex(s.backgroundColor),
        backgroundImage: (s.backgroundImage && s.backgroundImage !== 'none') ? s.backgroundImage.slice(0, 200) : null,
        color: rgbToHex(s.color),
        padding: s.padding,
        margin: (s.margin && s.margin !== '0px') ? s.margin : null,
        maxWidth: (s.maxWidth && s.maxWidth !== 'none') ? s.maxWidth : null,
        position: (s.position && s.position !== 'static') ? s.position : null,
        zIndex: (s.zIndex && s.zIndex !== 'auto') ? s.zIndex : null,
        overflow: (s.overflow && s.overflow !== 'visible') ? s.overflow : null,
        textAlign: s.textAlign !== 'start' ? s.textAlign : null,
        borderBottom: (s.borderBottomWidth !== '0px') ? `${s.borderBottomWidth} ${s.borderBottomStyle} ${rgbToHex(s.borderBottomColor)}` : null,
        backdropFilter: (s.backdropFilter && s.backdropFilter !== 'none') ? s.backdropFilter : null
      }),
      layout: { type: layoutType, details: columnInfo },
      domSkeleton: buildTrimmedDOMSkeleton(el, 4),
      childCount: children.length,
      content: {
        headings: headings,
        paragraphs: paragraphs,
        buttons: sectionButtons,
        imageCount: sectionImages.length,
        imageTreatments: sectionImages
      }
    });

    usedRanges.push({ top: absTop, bottom: absBottom });
  });

  result.sections = processedSections.slice(0, 14);

  // ─── 10. Detailed Component Extraction ──────────────────────────

  // NAVBAR
  const navEl = document.querySelector('header, nav, [class*="header"], [class*="navbar"], [role="banner"]');
  if (navEl && isVisible(navEl)) {
    const navLinks = Array.from(navEl.querySelectorAll('a')).filter(a => isVisible(a)).slice(0, 8);
    const logo = navEl.querySelector('img, svg, [class*="logo"]');

    result.components.navbar = {
      style: cleanStyle(extractFullStyle(navEl)),
      dimensions: describeRect(navEl),
      hasLogo: !!logo,
      logoWidth: logo ? logo.offsetWidth : null,
      navLinks: navLinks.map(a => ({
        text: cleanText(a.innerText).slice(0, 30),
        style: cleanStyle({
          color: rgbToHex(getElStyle(a)?.color),
          fontSize: getElStyle(a)?.fontSize,
          fontWeight: getElStyle(a)?.fontWeight
        })
      })),
      hasCTA: !!navEl.querySelector('button, a[class*="btn"], a[class*="button"], [class*="cta"]'),
      ctaText: cleanText(navEl.querySelector('button, a[class*="btn"], a[class*="button"], [class*="cta"]')?.innerText || '').slice(0, 30)
    };
  }

  // HERO SECTION
  const heroEl = document.querySelector('[class*="hero"], [class*="banner"], [class*="jumbotron"]')
    || document.querySelector('main > section:first-child, main > div:first-child');
  if (heroEl && isVisible(heroEl)) {
    const heroH1 = heroEl.querySelector('h1');
    const heroP = heroEl.querySelector('p');
    const heroBtns = Array.from(heroEl.querySelectorAll('button, a[class*="btn"], a[class*="button"]')).filter(b => isVisible(b)).slice(0, 3);
    const heroImg = heroEl.querySelector('img, video, svg');

    result.components.hero = {
      style: cleanStyle(extractFullStyle(heroEl)),
      dimensions: describeRect(heroEl),
      headline: heroH1 ? {
        text: cleanText(heroH1.innerText).slice(0, 150),
        style: cleanStyle({
          fontSize: getElStyle(heroH1)?.fontSize,
          fontWeight: getElStyle(heroH1)?.fontWeight,
          lineHeight: getElStyle(heroH1)?.lineHeight,
          letterSpacing: getElStyle(heroH1)?.letterSpacing !== 'normal' ? getElStyle(heroH1)?.letterSpacing : null,
          color: rgbToHex(getElStyle(heroH1)?.color),
          textAlign: getElStyle(heroH1)?.textAlign
        })
      } : null,
      subheadline: heroP ? {
        text: cleanText(heroP.innerText).slice(0, 200),
        style: cleanStyle({
          fontSize: getElStyle(heroP)?.fontSize,
          fontWeight: getElStyle(heroP)?.fontWeight,
          color: rgbToHex(getElStyle(heroP)?.color)
        })
      } : null,
      buttons: heroBtns.map(btn => ({
        text: cleanText(btn.innerText).slice(0, 40),
        style: cleanStyle(extractFullStyle(btn))
      })),
      hasImage: !!heroImg,
      imagePosition: heroImg ? (heroImg.getBoundingClientRect().left > heroEl.getBoundingClientRect().width / 2 ? 'right' : 'center/below') : null
    };
  }

  // BUTTONS
  const allBtns = Array.from(document.querySelectorAll('button, a[class*="btn"], a[class*="button"], [role="button"]'))
    .filter(b => isVisible(b) && b.offsetWidth > 30)
    .slice(0, 12);

  const seenBtnStyles = new Set();
  allBtns.forEach(btn => {
    const s = getElStyle(btn);
    const key = `${rgbToHex(s?.backgroundColor)}-${rgbToHex(s?.color)}-${s?.borderRadius}`;
    if (seenBtnStyles.has(key)) return;
    seenBtnStyles.add(key);

    result.components.buttons.push({
      text: cleanText(btn.innerText).slice(0, 40),
      tag: btn.tagName.toLowerCase(),
      style: cleanStyle(extractFullStyle(btn)),
      hoverHint: s?.transition || null
    });
  });

  // CARDS
  const cardEls = Array.from(document.querySelectorAll('[class*="card"], article, [class*="tile"], [class*="box"]:not(select):not(input)'))
    .filter(c => isVisible(c) && c.offsetWidth > 120 && c.offsetHeight > 80)
    .slice(0, 6);

  const seenCardStyles = new Set();
  cardEls.forEach(card => {
    const s = getElStyle(card);
    const key = `${rgbToHex(s?.backgroundColor)}-${s?.borderRadius}-${s?.boxShadow}`;
    if (seenCardStyles.has(key)) return;
    seenCardStyles.add(key);

    const hasImg = !!card.querySelector('img');
    const hasHeading = !!card.querySelector('h2, h3, h4');
    const hasText = !!card.querySelector('p');

    result.components.cards.push({
      style: cleanStyle(extractFullStyle(card)),
      dimensions: describeRect(card),
      hasImage: hasImg,
      hasHeading: hasHeading,
      hasText: hasText,
      innerStructure: `${hasImg ? 'Image + ' : ''}${hasHeading ? 'Heading + ' : ''}${hasText ? 'Text' : ''}`.replace(/ \+ $/, '') || 'Container'
    });
  });

  // INPUTS
  const inputEls = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], input:not([type]), textarea, select'))
    .filter(el => isVisible(el))
    .slice(0, 5);

  inputEls.forEach(inp => {
    const s = getElStyle(inp);
    result.components.inputs.push({
      type: inp.type || inp.tagName.toLowerCase(),
      placeholder: inp.placeholder || null,
      style: cleanStyle({
        background: rgbToHex(s?.backgroundColor),
        color: rgbToHex(s?.color),
        border: s?.borderWidth !== '0px' ? `${s.borderWidth} ${s.borderStyle} ${rgbToHex(s.borderColor)}` : null,
        borderRadius: s?.borderRadius !== '0px' ? s?.borderRadius : null,
        padding: s?.padding,
        fontSize: s?.fontSize
      })
    });
  });

  // BADGES
  const badgeEls = Array.from(document.querySelectorAll('[class*="badge"], [class*="tag"], [class*="pill"], [class*="chip"]'))
    .filter(el => isVisible(el) && el.offsetWidth < 250 && el.offsetHeight < 50)
    .slice(0, 4);

  badgeEls.forEach(badge => {
    const s = getElStyle(badge);
    result.components.badges.push({
      text: cleanText(badge.innerText).slice(0, 30),
      style: cleanStyle({
        background: rgbToHex(s?.backgroundColor),
        color: rgbToHex(s?.color),
        padding: s?.padding,
        borderRadius: s?.borderRadius,
        fontSize: s?.fontSize,
        fontWeight: s?.fontWeight,
        border: s?.borderWidth !== '0px' ? `${s.borderWidth} ${s.borderStyle} ${rgbToHex(s.borderColor)}` : null
      })
    });
  });

  // FOOTER
  const footerEl = document.querySelector('footer, [class*="footer"], [role="contentinfo"]');
  if (footerEl && isVisible(footerEl)) {
    const footerLinks = Array.from(footerEl.querySelectorAll('a')).filter(a => isVisible(a)).length;
    const footerCols = Array.from(footerEl.children).filter(c => c.offsetWidth > 50 && c.offsetHeight > 30);

    result.components.footer = {
      style: cleanStyle(extractFullStyle(footerEl)),
      dimensions: describeRect(footerEl),
      linkCount: footerLinks,
      columnCount: footerCols.length,
      hasSocialIcons: !!(footerEl.querySelector('[class*="social"], [class*="twitter"], [class*="linkedin"], [class*="github"], [class*="facebook"], [class*="instagram"]')),
      hasCopyright: !!(footerEl.innerText?.match(/©|copyright|all rights/i)),
      hasNewsletter: !!(footerEl.querySelector('input[type="email"], [class*="newsletter"], [class*="subscribe"]'))
    };
  }

  // ─── 11. Image Treatments ──────────────────────────
  const imgEls = Array.from(document.querySelectorAll('img')).filter(im => isVisible(im) && im.offsetWidth > 80).slice(0, 8);
  const imgStyleSet = new Set();
  imgEls.forEach(img => {
    const s = getElStyle(img);
    const treatment = cleanStyle({
      borderRadius: s?.borderRadius !== '0px' ? s?.borderRadius : null,
      objectFit: s?.objectFit !== 'fill' ? s?.objectFit : null,
      boxShadow: s?.boxShadow !== 'none' ? s?.boxShadow : null,
      aspectRatio: s?.aspectRatio !== 'auto' ? s?.aspectRatio : null,
      border: s?.borderWidth !== '0px' ? `${s.borderWidth} ${s.borderStyle} ${rgbToHex(s.borderColor)}` : null
    });
    const key = JSON.stringify(treatment);
    if (!imgStyleSet.has(key) && Object.keys(treatment).length > 0) {
      imgStyleSet.add(key);
      result.images.treatments.push(treatment);
    }
  });

  // ─── 12. Synthesize Clean Semantic Design Tokens ─────────────────────
  const isDark = result.mode === 'Dark Mode';
  const c = result.colors;
  const t = result.typography;
  const h1 = t.hierarchy.h1 || {};
  const h2 = t.hierarchy.h2 || {};
  const p = t.hierarchy.p || {};

  result.synthesizedTokens = {
    '--bg-primary': c.backgrounds[0]?.hex || (isDark ? '#0A0D14' : '#FFFFFF'),
    '--bg-surface': c.backgrounds[1]?.hex || (isDark ? '#141824' : '#F8FAFC'),
    '--bg-surface-elevated': c.backgrounds[2]?.hex || (isDark ? '#1E2436' : '#FFFFFF'),
    '--text-primary': c.text[0]?.hex || (isDark ? '#F8FAFC' : '#0F172A'),
    '--text-secondary': c.text[1]?.hex || (isDark ? '#94A3B8' : '#475569'),
    '--text-muted': c.text[2]?.hex || (isDark ? '#64748B' : '#94A3B8'),
    '--border-subtle': c.borders[0]?.hex || (isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0'),
    '--border-highlight': c.borders[1]?.hex || (isDark ? 'rgba(255, 255, 255, 0.16)' : '#CBD5E1'),
    '--accent-primary': result.components.buttons[0]?.style?.background || (isDark ? '#6366F1' : '#4F46E5'),
    '--accent-gradient': c.gradients[0] || 'linear-gradient(135deg, #6366F1 0%, #A855F7 100%)',
    '--font-sans': `"${t.fontFamilies[0]?.name || 'Inter'}", -apple-system, BlinkMacSystemFont, sans-serif`,
    '--font-size-h1': h1.fontSize || '56px',
    '--font-weight-h1': h1.fontWeight || '800',
    '--letter-spacing-h1': h1.letterSpacing || '-0.025em',
    '--font-size-h2': h2.fontSize || '36px',
    '--font-weight-h2': h2.fontWeight || '700',
    '--font-size-body': p.fontSize || '16px',
    '--line-height-body': p.lineHeight || '1.6',
    '--radius-sm': result.radii[0] || '6px',
    '--radius-md': result.radii[1] || '12px',
    '--radius-lg': result.radii[2] || '20px',
    '--radius-pill': '9999px',
    '--shadow-card': result.shadows[0] || (isDark ? '0 4px 24px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.06)'),
    '--shadow-elevated': result.shadows[1] || (isDark ? '0 12px 40px rgba(0, 0, 0, 0.6)' : '0 12px 32px rgba(0, 0, 0, 0.1)'),
    '--container-max-width': result.layout.containerMaxWidth || '1200px',
    '--backdrop-blur': result.blurEffects[0] || 'blur(16px)',
    '--transition-smooth': result.animations.transitions[0] || 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  return result;
}


// ─── MODULAR MARKDOWN GENERATORS v3.0 ─────────────────

// 1. DESIGN.md — Pure Design System, Tokens, Colors, Fonts, & Micro-Interactions
function generateDesignTokensMD(data) {
  const m = data.meta;
  const c = data.colors;
  const t = data.typography;
  const comp = data.components;
  const lay = data.layout;
  const tok = data.synthesizedTokens || {};

  let md = '';
  md += `# 🎨 Design System & Visual Tokens Specification\n`;
  md += `## Target Style: ${m.title}\n\n`;
  md += `> **Source Website:** [${m.domain}](${m.url})  \n`;
  md += `> **Extraction Date:** ${new Date(m.timestamp).toLocaleDateString()}  \n`;
  md += `> **Visual Theme:** \`${data.mode}\`  \n`;
  md += `> **Role:** Master Design System file (\`DESIGN.md\`) to apply this exact visual aesthetic to any tool or website.  \n\n`;
  md += `---\n\n`;

  // 1. Dynamic Architectural Directives (Extracted from live DOM)
  md += `## 1. 🛡️ Architectural & Visual Quality Directives\n\n`;
  md += `> **ATTENTION AI CODING AGENT:** When building or styling code for this project, you MUST adhere strictly to the actual design tokens and visual architecture extracted from **${m.domain}**. Do NOT revert to standard, unstyled, or generic AI templates.\n\n`;
  md += `- 🎯 **Color Palette Fidelity:** Use ONLY the exact HSL/Hex palette defined in this document (\`var(--bg-primary)\`, \`var(--bg-surface)\`, \`var(--text-primary)\`). Do not invent saturated default blues or grays.\n`;
  md += `- 🎯 **Typography Tracking:** Headings MUST use tightened letter-spacing (\`${tok['--letter-spacing-h1'] || '-0.025em'}\`) and bold weights (\`${tok['--font-weight-h1'] || '700/800'}\`). Un-tracked headings look amateur.\n`;
  if (data.framework?.tailwind) {
    md += `- 🎯 **Framework Detected:** \`Tailwind CSS\` detected (${data.framework.tailwindClassCount} utilities). You may use Tailwind utility classes corresponding to the design tokens below.\n`;
  }
  if (data.radii.length > 0) {
    md += `- 🎯 **Border Radius System:** Follow the extracted scale: Cards (\`${tok['--radius-md'] || '12px'}\`), Buttons (\`${tok['--radius-sm'] || '6px'}\`).\n`;
  }
  if (tok['--backdrop-blur']) {
    md += `- 🎯 **Glassmorphism:** Apply \`backdrop-filter: ${tok['--backdrop-blur']}\` to elevated cards and navigation bars.\n`;
  }
  md += `- 🎯 **Micro-Interactions:** Interactive elements MUST have transitions (\`${tok['--transition-smooth'] || 'all 0.2s ease'}\`) matching the pseudo-states documented below.\n\n`;

  // 2. Master CSS Design Tokens (:root block)
  md += `## 2. 🎨 Master CSS Design Tokens (\`:root\` Variables)\n\n`;
  md += `> Drop this complete block into your root CSS file (\`index.css\` or \`globals.css\`). All components should reference these variables.\n\n`;
  md += `\`\`\`css\n`;
  md += `:root {\n`;
  md += `  /* ── Background & Surface Palette ── */\n`;
  md += `  --bg-primary: ${tok['--bg-primary']};\n`;
  md += `  --bg-surface: ${tok['--bg-surface']};\n`;
  md += `  --bg-surface-elevated: ${tok['--bg-surface-elevated']};\n`;
  md += `\n`;
  md += `  /* ── Typography & Text Colors ── */\n`;
  md += `  --text-primary: ${tok['--text-primary']};\n`;
  md += `  --text-secondary: ${tok['--text-secondary']};\n`;
  md += `  --text-muted: ${tok['--text-muted']};\n`;
  md += `\n`;
  md += `  /* ── Borders & Highlights ── */\n`;
  md += `  --border-subtle: ${tok['--border-subtle']};\n`;
  md += `  --border-highlight: ${tok['--border-highlight']};\n`;
  md += `\n`;
  md += `  /* ── Brand Accents & Gradients ── */\n`;
  md += `  --accent-primary: ${tok['--accent-primary']};\n`;
  md += `  --accent-gradient: ${tok['--accent-gradient']};\n`;
  md += `\n`;
  md += `  /* ── Typography Scale & Weights ── */\n`;
  md += `  --font-sans: ${tok['--font-sans']};\n`;
  md += `  --font-size-h1: ${tok['--font-size-h1']};\n`;
  md += `  --font-weight-h1: ${tok['--font-weight-h1']};\n`;
  md += `  --letter-spacing-h1: ${tok['--letter-spacing-h1']};\n`;
  md += `  --font-size-h2: ${tok['--font-size-h2']};\n`;
  md += `  --font-weight-h2: ${tok['--font-weight-h2']};\n`;
  md += `  --font-size-body: ${tok['--font-size-body']};\n`;
  md += `  --line-height-body: ${tok['--line-height-body']};\n`;
  md += `\n`;
  md += `  /* ── Shape, Spacing & Elevation ── */\n`;
  md += `  --radius-sm: ${tok['--radius-sm']};\n`;
  md += `  --radius-md: ${tok['--radius-md']};\n`;
  md += `  --radius-lg: ${tok['--radius-lg']};\n`;
  md += `  --radius-pill: ${tok['--radius-pill']};\n`;
  md += `  --shadow-card: ${tok['--shadow-card']};\n`;
  md += `  --shadow-elevated: ${tok['--shadow-elevated']};\n`;
  md += `  --container-max-width: ${tok['--container-max-width']};\n`;
  md += `  --backdrop-blur: ${tok['--backdrop-blur']};\n`;
  md += `  --transition-smooth: ${tok['--transition-smooth']};\n`;
  md += `}\n`;
  md += `\`\`\`\n\n`;

  // 3. Color Palette
  md += `## 3. Complete Color Palette Breakdown\n\n`;
  md += `### Surface & Background Tones\n`;
  md += `| # | Hex Code | Tone | Recommended Role |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  c.backgrounds.forEach((bg, i) => {
    const roles = ['Base page canvas', 'Card surface & tiles', 'Elevated surface / flyout menus', 'Alternate section stripe', 'Disabled / muted surface'];
    md += `| ${i + 1} | \`${bg.hex}\` | ${bg.luminance < 0.3 ? '🌙 Dark' : bg.luminance < 0.7 ? '🌤 Mid' : '☀️ Light'} | ${roles[i] || 'Secondary surface'} |\n`;
  });
  md += `\n`;

  md += `### Text & Foreground Tones\n`;
  md += `| # | Hex Code | Recommended Role |\n`;
  md += `| :--- | :--- | :--- |\n`;
  c.text.forEach((tc, i) => {
    const roles = ['Primary headings & prominent copy', 'Standard body copy & descriptions', 'Muted metadata & captions', 'Interactive links & breadcrumbs', 'Disabled text'];
    md += `| ${i + 1} | \`${tc.hex}\` | ${roles[i] || 'Supporting text'} |\n`;
  });
  md += `\n`;

  if (c.borders.length > 0) {
    md += `### Border & Outline Tones\n`;
    c.borders.forEach(b => { md += `- \`${b.hex}\` (scanned ${b.count}x across elements)\n`; });
    md += `\n`;
  }

  if (c.gradients.length > 0) {
    md += `### Brand Gradients\n`;
    c.gradients.forEach((g, i) => {
      md += `**Gradient ${i + 1}:**\n\`\`\`css\nbackground: ${g};\n\`\`\`\n`;
    });
    md += `\n`;
  }

  // 4. Typography
  md += `## 4. Typography System\n\n`;
  if (t.externalFonts.length > 0) {
    md += `### Font Imports (Add to HTML \`<head>\`)\n\`\`\`html\n`;
    t.externalFonts.forEach(f => { md += `<link href="${f}" rel="stylesheet">\n`; });
    md += `\`\`\`\n\n`;
  }

  md += `### Detected Font Families\n`;
  t.fontFamilies.forEach((f, i) => {
    md += `${i + 1}. **\`${f.name}\`** — used ${f.count}x on page${i === 0 ? ' *(Primary Font)*' : ''}\n`;
  });
  md += `\n`;

  md += `### Typography Scale & Hierarchy\n`;
  md += `| Tag | Font Family | Size | Weight | Line Height | Tracking | Color | Sample Preview |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  for (const [tag, h] of Object.entries(t.hierarchy)) {
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'button'].includes(tag)) {
      md += `| \`<${tag}>\` | \`${h.fontFamily}\` | \`${h.fontSize}\` | \`${h.fontWeight}\` | \`${h.lineHeight}\` | \`${h.letterSpacing || 'normal'}\` | \`${h.color || 'inherit'}\` | ${h.sampleText ? `"${h.sampleText.slice(0, 35)}…"` : '—'} |\n`;
    }
  }
  md += `\n`;

  // 5. Spacing, Elevation & Glassmorphism
  md += `## 5. Spacing, Elevation & Glassmorphism\n\n`;
  md += `- **Max Content Width:** \`${lay.containerMaxWidth || '1200px'}\`\n`;
  if (data.radii.length > 0) {
    md += `\n### Border Radius Values\n`;
    data.radii.forEach(r => { md += `- \`${r}\`\n`; });
  }
  if (data.shadows.length > 0) {
    md += `\n### Elevation / Box Shadows\n`;
    data.shadows.forEach((s, i) => { md += `- **Level ${i + 1}:** \`${s}\`\n`; });
  }
  if (data.blurEffects.length > 0) {
    md += `\n### Glassmorphism / Backdrop Blurs\n`;
    const uniqueBlurs = [...new Set(data.blurEffects)];
    uniqueBlurs.forEach(b => { md += `- \`backdrop-filter: ${b};\`\n`; });
  }
  md += `\n`;

  // 6. Component Styling Tokens
  md += `## 6. Component Styling Tokens (Buttons, Cards, Badges)\n\n`;
  md += `### Button Styles\n\`\`\`css\n`;
  md += `.btn {\n`;
  md += `  display: inline-flex; align-items: center; justify-content: center; gap: 8px;\n`;
  md += `  padding: ${comp.buttons[0]?.style?.padding || '12px 22px'};\n`;
  md += `  border-radius: var(--radius-sm); font-family: var(--font-sans);\n`;
  md += `  font-size: 14px; font-weight: 600; text-decoration: none; cursor: pointer;\n`;
  md += `  transition: var(--transition-smooth);\n`;
  md += `}\n`;
  md += `.btn-primary {\n`;
  md += `  background: var(--accent-primary); color: #FFFFFF; border: none;\n`;
  md += `  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);\n`;
  md += `}\n`;
  md += `.btn-primary:hover {\n`;
  md += `  opacity: 0.92; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);\n`;
  md += `}\n`;
  md += `.btn-outline {\n`;
  md += `  background: transparent; color: var(--text-primary); border: 1px solid var(--border-subtle);\n`;
  md += `}\n`;
  md += `.btn-outline:hover {\n`;
  md += `  background: var(--bg-surface); border-color: var(--border-highlight);\n`;
  md += `}\n`;
  md += `\`\`\`\n\n`;

  md += `### Card Styles\n\`\`\`css\n`;
  md += `.card {\n`;
  md += `  background: var(--bg-surface); border: 1px solid var(--border-subtle);\n`;
  md += `  border-radius: var(--radius-md); padding: 28px; box-shadow: var(--shadow-card);\n`;
  md += `  display: flex; flex-direction: column; gap: 14px; transition: var(--transition-smooth);\n`;
  md += `}\n`;
  md += `.card:hover {\n`;
  md += `  border-color: var(--border-highlight); box-shadow: var(--shadow-elevated); transform: translateY(-2px);\n`;
  md += `}\n`;
  md += `\`\`\`\n\n`;

  // 7. Animations
  md += `## 7. Animations & Micro-Interactions\n\n`;
  if (data.animations.transitions.length > 0) {
    md += `### Smooth Transitions\n`;
    data.animations.transitions.forEach(t => { md += `- \`${t}\`\n`; });
    md += `\n`;
  }
  if (data.animations.keyframes.length > 0) {
    md += `### Keyframe Animations\n`;
    data.animations.keyframes.forEach(kf => {
      md += `**\`@keyframes ${kf.name}\`:**\n\`\`\`css\n`;
      kf.frames.forEach(f => { md += `${f.props}\n`; });
      md += `\`\`\`\n`;
    });
    md += `\n`;
  }

  // 8. AI Prompt
  md += `---\n\n`;
  md += `## 🤖 Antigravity / AI Coding Prompt: Apply This Design System\n\n`;
  md += `> Copy this prompt into Antigravity to build any web application using this exact design aesthetic:\n\n`;
  md += `\`\`\`text\n`;
  md += `Build my web application using the EXACT visual design system and aesthetic of ${m.domain}.\n`;
  md += `Do NOT use generic or default styles. Adhere strictly to the design tokens and rules below:\n\n`;
  md += `DESIGN TOKENS:\n`;
  md += `- Visual Mode: ${data.mode}\n`;
  md += `- Canvas Background: ${tok['--bg-primary'] || c.backgrounds[0]?.hex}\n`;
  md += `- Surface/Card Background: ${tok['--bg-surface'] || c.backgrounds[1]?.hex}\n`;
  md += `- Elevated Background: ${tok['--bg-surface-elevated'] || c.backgrounds[2]?.hex || '#1E2436'}\n`;
  md += `- Primary Text: ${tok['--text-primary'] || c.text[0]?.hex}\n`;
  md += `- Secondary/Muted Text: ${tok['--text-secondary'] || c.text[1]?.hex}\n`;
  md += `- Subtle Border: ${tok['--border-subtle']}\n`;
  md += `- Highlight Border: ${tok['--border-highlight']}\n`;
  md += `- Primary Accent: ${tok['--accent-primary']}\n`;
  md += `- Accent Gradient: ${tok['--accent-gradient']}\n`;
  md += `- Font Family: ${tok['--font-sans']}\n`;
  md += `- Heading 1: ${tok['--font-size-h1']}, weight ${tok['--font-weight-h1']}, tracking ${tok['--letter-spacing-h1']}\n`;
  md += `- Heading 2: ${tok['--font-size-h2']}, weight ${tok['--font-weight-h2']}\n`;
  md += `- Body: ${tok['--font-size-body']}, line-height ${tok['--line-height-body']}\n`;
  md += `- Border Radius: Cards (${tok['--radius-md']}), Buttons (${tok['--radius-sm']}), Pills (${tok['--radius-pill']})\n`;
  md += `- Elevation Shadow: ${tok['--shadow-card']}\n`;
  md += `- Max Container Width: ${tok['--container-max-width']}\n`;
  if (data.blurEffects.length > 0) md += `- Glassmorphism: backdrop-filter: ${data.blurEffects[0]}\n`;
  md += `- Smooth Transitions: ${tok['--transition-smooth']}\n`;
  md += `\n`;
  md += `QUALITY RULES:\n`;
  md += `1. Add subtle 1px border highlights to all cards.\n`;
  md += `2. Add hover micro-interactions (translateY(-2px) + shadow) to all cards and buttons.\n`;
  md += `3. Tighten letter-spacing on headings for modern polish.\n`;
  md += `4. Ensure generous padding on all sections.\n`;
  md += `\`\`\`\n`;

  return md;
}


// 2. UI.md — Page Structure, Section-by-Section Wireframe Blueprint, & Component HTML/CSS
function generateUILayoutMD(data) {
  const m = data.meta;
  const comp = data.components;
  const lay = data.layout;
  const tok = data.synthesizedTokens || {};

  let md = '';
  md += `# 📐 UI Structure & Section-by-Section Wireframe Blueprint\n`;
  md += `## Page Architecture Clone: ${m.title}\n\n`;
  md += `> **Source Website:** [${m.domain}](${m.url})  \n`;
  md += `> **Extraction Date:** ${new Date(m.timestamp).toLocaleDateString()}  \n`;
  md += `> **Total Sections Analyzed:** ${data.sections.length} distinct landmarks  \n`;
  md += `> **Page Dimensions:** ${m.pageWidth}px wide × ${m.pageHeight}px total scroll height  \n`;
  md += `> **Role:** Master UI Blueprint file (\`UI.md\`) to replicate the exact layout, section order, component structure, and wireframe rhythm.  \n\n`;
  md += `---\n\n`;

  // 1. Executive Page Rhythm Map
  md += `## 1. Executive Page Rhythm Map (Top to Bottom)\n\n`;
  md += `| # | Section Name | HTML Element | Height | Layout Type | Primary Heading |\n`;
  md += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
  data.sections.forEach((sec, idx) => {
    const heading = sec.content.headings[0]?.text?.slice(0, 40) || '—';
    md += `| ${idx + 1} | **${sec.type}** | \`<${sec.tag}>\` | ${sec.position.height}px | ${sec.layout.type || 'block'} | "${heading}" |\n`;
  });
  md += `\n`;

  // 2. Section-by-Section Detailed Blueprint
  md += `## 2. Section-by-Section Detailed Blueprint\n\n`;
  md += `> This provides the exact structural layout of every landmark from top to bottom. Follow this sequence to rebuild the page wireframe.\n\n`;

  data.sections.forEach((sec, idx) => {
    const chunkNum = String(idx + 1).padStart(2, '0');
    md += `### Section ${idx + 1}: ${sec.type}\n`;
    md += `> 📸 **Visual Chunk Reference:** \`screenshots/chunk_${chunkNum}.png\` (crisp 1:1 slice for AI visual inspection)\n\n`;
    md += `- **HTML Container:** \`<${sec.tag}>\`${sec.id ? ` id=\`${sec.id}\`` : ''}${sec.classes ? ` class=\`${sec.classes.slice(0, 80)}\`` : ''}\n`;
    md += `- **Dimensions & Position:** ${sec.position.width}px × ${sec.position.height}px (starts at y=${sec.position.top}px)\n`;

    const styleEntries = Object.entries(sec.style);
    if (styleEntries.length > 0) {
      md += `- **Key Styles & Positioning:**\n\`\`\`css\n`;
      styleEntries.forEach(([k, v]) => {
        const cssProp = k.replace(/([A-Z])/g, '-$1').toLowerCase();
        md += `${cssProp}: ${v};\n`;
      });
      md += `\`\`\`\n`;
    }

    if (sec.layout.details) {
      md += `- **Layout Grid/Flex:** ${sec.layout.details}\n`;
    }
    md += `- **Direct Child Elements:** ${sec.childCount} elements\n`;

    if (sec.domSkeleton) {
      md += `\n#### 🧱 Asli DOM Tree Skeleton (Structural Blueprint)\n\`\`\`html\n${sec.domSkeleton}\n\`\`\`\n`;
    }

    if (sec.content.headings.length > 0) {
      md += `\n- **Headings Detected:**\n`;
      sec.content.headings.forEach(h => { md += `  - \`<${h.tag}>\`: "${h.text}"\n`; });
    }
    if (sec.content.buttons.length > 0) {
      md += `- **Buttons & CTAs:**\n`;
      sec.content.buttons.forEach(b => {
        md += `  - "${b.text}" → \`bg: ${b.style.background || 'transparent'}\`, \`color: ${b.style.color || 'inherit'}\`, \`radius: ${b.style.borderRadius || '0'}\`\n`;
      });
    }
    if (sec.content.imageCount > 0) {
      md += `- **Visual Media:** ${sec.content.imageCount} image/graphic element(s)\n`;
    }
    md += `\n`;
  });

  // 3. Ready-to-Use Component Code Starters
  md += `## 3. 🛠️ Ready-to-Use UI Component Code Starters\n\n`;

  // Navbar
  md += `### 3.1 Navigation Bar Component\n\n`;
  md += `\`\`\`html\n`;
  md += `<nav class="navbar">\n`;
  md += `  <div class="navbar-container">\n`;
  md += `    <a href="#" class="navbar-logo"><span>BrandLogo</span></a>\n`;
  md += `    <div class="navbar-links">\n`;
  if (comp.navbar?.navLinks?.length > 0) {
    comp.navbar.navLinks.slice(0, 5).forEach(l => {
      md += `      <a href="#" class="nav-link">${l.text || 'Link'}</a>\n`;
    });
  } else {
    md += `      <a href="#" class="nav-link">Features</a>\n`;
    md += `      <a href="#" class="nav-link">Solutions</a>\n`;
    md += `      <a href="#" class="nav-link">Pricing</a>\n`;
  }
  md += `    </div>\n`;
  md += `    <div class="navbar-actions">\n`;
  md += `      <button class="btn btn-primary">${comp.navbar?.ctaText || 'Get Started'}</button>\n`;
  md += `    </div>\n`;
  md += `  </div>\n`;
  md += `</nav>\n`;
  md += `\`\`\`\n\n`;

  md += `\`\`\`css\n`;
  md += `.navbar {\n`;
  md += `  position: sticky; top: 0; z-index: 100; width: 100%;\n`;
  md += `  background: ${comp.navbar?.style?.background || 'rgba(10, 13, 20, 0.8)'};\n`;
  md += `  backdrop-filter: var(--backdrop-blur); -webkit-backdrop-filter: var(--backdrop-blur);\n`;
  md += `  border-bottom: 1px solid var(--border-subtle);\n`;
  md += `}\n`;
  md += `.navbar-container {\n`;
  md += `  max-width: var(--container-max-width); margin: 0 auto; padding: 0 24px;\n`;
  md += `  height: ${comp.navbar?.dimensions?.height || 64}px; display: flex; align-items: center; justify-content: space-between;\n`;
  md += `}\n`;
  md += `.navbar-logo { font-size: 18px; font-weight: 700; color: var(--text-primary); text-decoration: none; }\n`;
  md += `.navbar-links { display: flex; align-items: center; gap: 28px; }\n`;
  md += `.nav-link { font-size: 14px; font-weight: 500; color: var(--text-secondary); text-decoration: none; transition: var(--transition-smooth); }\n`;
  md += `.nav-link:hover { color: var(--text-primary); }\n`;
  md += `\`\`\`\n\n`;

  // Hero Section
  md += `### 3.2 Hero Section Component\n\n`;
  md += `\`\`\`html\n`;
  md += `<section class="hero-section">\n`;
  md += `  <div class="hero-container">\n`;
  md += `    <div class="hero-badge"><span class="badge-dot"></span><span>New Release &rarr;</span></div>\n`;
  md += `    <h1 class="hero-title">${comp.hero?.headline?.text || 'Build the Future of Modern Software'}</h1>\n`;
  md += `    <p class="hero-subtitle">${comp.hero?.subheadline?.text || 'Powerful, scalable, and intuitive tooling designed to accelerate engineering velocity.'}</p>\n`;
  md += `    <div class="hero-cta-group">\n`;
  md += `      <button class="btn btn-primary">${comp.hero?.buttons[0]?.text || 'Get Started'}</button>\n`;
  md += `      <button class="btn btn-outline">${comp.hero?.buttons[1]?.text || 'Book a Demo'}</button>\n`;
  md += `    </div>\n`;
  md += `  </div>\n`;
  md += `</section>\n`;
  md += `\`\`\`\n\n`;

  // Bento Feature Card
  md += `### 3.3 Bento / Feature Card Component\n\n`;
  md += `\`\`\`html\n`;
  md += `<div class="card">\n`;
  md += `  <div class="card-icon-wrapper">\n`;
  md += `    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n`;
  md += `      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>\n`;
  md += `    </svg>\n`;
  md += `  </div>\n`;
  md += `  <h3 class="card-title">Lightning Performance</h3>\n`;
  md += `  <p class="card-description">Architected for instantaneous responses and ultra-low latency worldwide.</p>\n`;
  md += `</div>\n`;
  md += `\`\`\`\n\n`;

  // Footer
  md += `### 3.4 Footer Component\n\n`;
  md += `\`\`\`html\n`;
  md += `<footer class="footer">\n`;
  md += `  <div class="footer-container">\n`;
  md += `    <div class="footer-brand">\n`;
  md += `      <h3>BrandLogo</h3>\n`;
  md += `      <p>Building high-performance software for high-velocity teams.</p>\n`;
  md += `    </div>\n`;
  md += `    <div class="footer-bottom">\n`;
  md += `      <span>&copy; ${new Date().getFullYear()} ${m.domain}. All rights reserved.</span>\n`;
  md += `    </div>\n`;
  md += `  </div>\n`;
  md += `</footer>\n`;
  md += `\`\`\`\n\n`;

  // 4. Responsive Breakpoints
  md += `## 4. Responsive Breakpoints & Layout Container\n\n`;
  md += `- **Max Content Width:** \`${lay.containerMaxWidth || '1200px'}\`\n`;
  if (lay.breakpoints.length > 0) {
    md += `- **Responsive Media Breakpoints:** ${lay.breakpoints.map(b => `\`${b}\``).join(', ')}\n`;
  }
  md += `\n`;

  // 5. AI Prompt
  md += `---\n\n`;
  md += `## 🤖 Antigravity / AI Coding Prompt: Clone This Page Structure\n\n`;
  md += `> Copy this prompt into Antigravity to build the exact page layout and section rhythm of ${m.domain}:\n\n`;
  md += `\`\`\`text\n`;
  md += `Build a complete web page layout that replicates the EXACT section structure and rhythm of ${m.domain}.\n`;
  md += `Follow this top-to-bottom section sequence:\n\n`;
  data.sections.forEach((sec, i) => {
    md += `${i + 1}. ${sec.type}`;
    if (sec.content.headings[0]) md += ` — "${sec.content.headings[0].text.slice(0, 50)}"`;
    md += ` (${sec.layout.type || 'block'} layout, height ~${sec.position.height}px)\n`;
  });
  md += `\n`;
  md += `Use the HTML component starters provided in UI.md for the navbar, hero, cards, and footer.\n`;
  md += `Maintain generous section padding, container max-width (${tok['--container-max-width']}), and clean responsive layouts.\n`;
  md += `\`\`\`\n`;

  return md;
}


// 3. FULL_CLONE.md — Comprehensive All-in-One Spec (DESIGN tokens + UI sections)
function generateFullCloneMD(data) {
  const designMD = generateDesignTokensMD(data);
  const uiMD = generateUILayoutMD(data);

  let md = '';
  md += `# 🚀 Complete Web Design & UI Clone Specification (All-in-One)\n`;
  md += `## Complete Blueprint for: ${data.meta.title}\n\n`;
  md += `> **Source Website:** [${data.meta.domain}](${data.meta.url})  \n`;
  md += `> **Extraction Date:** ${new Date(data.meta.timestamp).toLocaleDateString()}  \n`;
  md += `> **Includes:** Complete Design System (Tokens, Colors, Typography) + Complete UI Blueprint (Sections, Wireframes, Components)\n\n`;
  md += `---\n\n`;

  // Append Design section
  md += designMD;
  md += `\n\n---\n\n`;
  // Append UI section
  md += uiMD;

  return md;
}

// Backward compatibility alias
function generateMarkdownSpec(data) {
  return generateFullCloneMD(data);
}

