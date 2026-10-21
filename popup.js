// popup.js v3.0 - Controller for Design2MD Pro
// Manages distinct DESIGN.md and UI.md generation, luxury tabs, and 1-click clipboard actions

let extractedData = null;
let designMarkdown = '';
let uiMarkdown = '';
let fullMarkdown = '';
let activePreviewDoc = 'design';

document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id || tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://') || tab.url?.startsWith('about:')) {
    document.getElementById('siteDomain').textContent = 'System Page';
    document.getElementById('siteTitle').textContent = 'Open a regular website to inspect';
    document.getElementById('themePill').textContent = 'N/A';
    document.getElementById('statusText').textContent = 'IDLE';
    document.getElementById('statusBadge').style.borderColor = 'rgba(255,255,255,0.1)';
    return;
  }

  try {
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
  themePill.style.color = data.mode === 'Dark Mode' ? '#C4B5FD' : '#FDE047';
  themePill.style.borderColor = data.mode === 'Dark Mode' ? 'rgba(139, 92, 246, 0.35)' : 'rgba(234, 179, 8, 0.35)';

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
