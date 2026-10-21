# 🚀 Design2MD Pro v2.3.0 — Deep UI & Design System Clone Engine

<div align="center">

[![Release](https://img.shields.io/badge/Release-v2.3.0%20Enterprise-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://github.com/abidalidevv/Deep-UI-Design-System-Clone-Engine/releases)
[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blue?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![AI Ready](https://img.shields.io/badge/AI%20Ready-Antigravity%20•%20Cursor%20•%20Claude-00D4FF?style=for-the-badge&logo=openai&logoColor=white)](https://github.com/abidalidevv/Deep-UI-Design-System-Clone-Engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Extract measured design system tokens (`DESIGN.md`), structural wireframe blueprints (`UI.md`), and native viewport screenshot slices (`screenshots/`) from live production websites for AI coding assistants.**

[⚡ Overview](#-overview) • [📦 Installation](#-installation-guide) • [📖 How to Use](#-how-to-use-step-by-step-guide) • [🇵🇰 اردو گائیڈ (Roman Urdu)](#-urdu--roman-urdu-guide-istimaal-karne-ka-tareeqa) • [🤖 Prompting AI](#-how-to-prompt-ai-assistants) • [✨ What's New in v2.3.0](#-whats-new-in-release-v230)

</div>

---

## ⚡ Overview

When AI coding assistants (such as Antigravity, Cursor, or Claude) generate web applications from basic text prompts, they often fall back to generic styling patterns—default saturated colors, un-tracked typography, and basic wireframes.

**Design2MD Pro** captures the design tokens, DOM hierarchy, and visual layout directly from live production websites (such as **Stripe**, **Linear**, **Apple**, or **Vercel**):

```text
Target Production Website (e.g., Stripe / Linear)
                 │
                 ▼  (Live Inspection via Design2MD Pro)
  ┌──────────────────────────────┼──────────────────────────────┐
  │                              │                              │
  ▼                              ▼                              ▼
🎨 DESIGN.md                   📐 UI.md                   📸 Viewport Slices (.zip)
• Measured :root CSS tokens    • Landmark Rhythm Map          • 1:1 Crisp Viewport Slices
• Scanned Color Palette        • Structural DOM Skeletons     • Sticky Seam Suppression
• Typography & Tracking Scale    with placeholder content     • Complete ZIP Archive
• Measured :hover & Shadows    • Flex, Grid & Layering          (DESIGN + UI + Slices +
                                 (z-index, overflow, max-width)  AI Prompt)
```

---

## 💎 The Four Output Artifacts Explained

| Artifact | File Name | What It Contains | When To Use It |
|---|---|---|---|
| 🎨 **Design Tokens Spec** | `[domain]_DESIGN.md` | Measured `:root` CSS variables, exact color palette, typography hierarchy, font sources, component pseudo-states (`:hover`, `:focus`), and spacing/shadow values. | When you want your application to replicate the **exact colors, fonts, buttons, and visual styling** measured on the target site. |
| 📐 **UI Wireframe Spec** | `[domain]_UI.md` | Executive page rhythm map (section heights and sequence), **Structural DOM Skeletons** per section, layout coordinates, flex/grid properties, and semantic placeholders. | When you want to clone the **exact page layout, section hierarchy, bento grids, and container structures**. |
| 📸 **Viewport Slices** | `[domain]_VISUAL_CHUNKS.zip` | High-resolution native viewport slices (`chunk_01.png` to `chunk_N.png`) covering 100% of the page top-to-bottom with sticky/fixed element seam suppression. | When providing visual context to Multimodal AI models (Claude Vision, GPT-4o, Antigravity) without downscaling blur. |
| 📦 **All-In-One Bundle** | `[domain]_COMPLETE_CLONE_BUNDLE.zip` | Complete package: `DESIGN.md` + `UI.md` + `FULL_CLONE.md` + `AI_CODING_PROMPT.txt` + `screenshots/` directory containing all viewport slices. | The complete 1-click download package to drop directly into your workspace or AI prompt context. |

---

## 📦 Installation Guide

Compatible with **Google Chrome**, **Brave**, **Arc**, **Microsoft Edge**, and Chromium-based browsers:

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/abidalidevv/Deep-UI-Design-System-Clone-Engine.git
   ```

2. **Open Extensions Management:**
   In your browser URL bar, navigate to:
   ```text
   chrome://extensions/
   ```

3. **Enable Developer Mode:**
   Toggle **ON** the switch labeled **"Developer mode"** in the top-right corner.

4. **Load the Unpacked Extension:**
   - Click **"Load unpacked"** in the top-left corner.
   - Select the repository root folder (`Deep-UI-Design-System-Clone-Engine`).
   - Click **Select Folder**.

5. **Pin to Toolbar:**
   Click the Extensions puzzle icon in your browser toolbar and pin **Design2MD Pro** for quick access.

---

## 📖 How to Use (Step-by-Step Guide)

### Workflow 1: Inspecting & Cloning a Live Website

1. **Open the Website:**
   Navigate to any website you want to analyze or draw inspiration from (e.g., [stripe.com/payments](https://stripe.com/payments) or [linear.app](https://linear.app)).
2. **Open Design2MD Pro:**
   Click the Design2MD Pro icon in your browser toolbar.
3. **Automatic Extraction:**
   The extension extracts DOM tokens, color values, typography, and layout hierarchy directly from the untouched page.
4. **Choose Your Export:**
   - **Click "Download DESIGN.md ›"**: Exports design tokens and `:root` CSS variables.
   - **Click "Download UI.md ›"**: Exports the structural page wireframe and DOM skeletons.
   - **Click "Viewport Slices (.zip) ›"**: Hydrates lazy elements, hides sticky seams, and captures 1:1 viewport slices into a ZIP.
   - **Click "Clone ZIP Bundle ›"**: Packages all specifications, master AI prompt, and visual slices into an all-in-one ZIP.
   - **Click "Copy AI Master Prompt ›"**: Copies the AI prompt directly to your clipboard.

---

### Workflow 2: Standalone Interactive Browser Mode

You can also open `popup.html` directly in your browser:
- When opened outside the extension runtime, a **DEMO DATA** banner is visibly displayed.
- All export buttons are disabled to prevent exporting demo data as real site specifications.
- Allows browsing the UI layout and interface tabs in a sandbox environment.

---

## 🇵🇰 Urdu / Roman Urdu Guide (Istimaal Karne Ka Tareeqa)

### Step 1: Extension Install Karein
1. Chrome browser mein `chrome://extensions` open karein.
2. Top-right corner se **"Developer mode"** ON karein.
3. Top-left se **"Load unpacked"** par click karein aur `Deep-UI-Design-System-Clone-Engine` folder select karein.
4. Toolbar mein puzzle icon se **Design2MD Pro** ko pin kar lein.

### Step 2: Live Website Ka Design Scan Karein
1. Jo website aap clone karna chahte hain (jaise `stripe.com` ya `linear.app`), usay Chrome mein open karein.
2. Toolbar se **Design2MD icon** par click karein.
3. Extension live DOM se real styling, colors, aur typography measure kar legi.

### Step 3: Files Export Karein
- **🎨 Download DESIGN.md:** Is file mein page ke colors, fonts, `:root` CSS variables, aur button hover states hote hain.
- **📐 Download UI.md:** Is file mein page ke sections ka layout structure aur **DOM Skeleton** hota hai.
- **📸 Viewport Slices (.zip):** Page ko native viewport slices mein capture karke zip karta hai taake AI vision model clear context dekh sake.
- **📦 Clone ZIP Bundle:** Ek hi click par `DESIGN.md`, `UI.md`, `FULL_CLONE.md`, `AI_CODING_PROMPT.txt`, aur `screenshots/` folder ko zip mein download karta hai.
- **🤖 Copy AI Master Prompt:** AI coding assistant ke liye prompt clipboard par copy karta hai.

---

## 🤖 How to Prompt AI Assistants (Antigravity, Cursor, Claude)

When prompting your AI assistant, pass the extracted markdown files and visual slices with this prompt:

```text
Build my web application using the exact visual aesthetic, color tokens, and layout 
defined in the attached DESIGN.md and UI.md specifications.

Implementation Directives:
1. Palette: Use the synthesized :root CSS variables from DESIGN.md.
2. Typography: Match the measured font families, weights, and letter-spacing scale.
3. Component States: Implement the hover lifts and focus outlines specified in DESIGN.md.
4. Structure: Recreate the section sequence and DOM skeleton rhythm from UI.md.
5. Visual Reference: Consult the screenshots/ directory for high-resolution visual layout.
```

---

## ✨ What's New in Release v2.3.0

- 🛡️ **Untouched DOM Extraction First:** Extraction runs on the unaltered page before hydration styles touch the DOM, ensuring 100% authentic stylesheet values and animations are measured.
- 🌊 **Reversible Deep Page Hydration:** Sweeps the page at `0.8 × viewport` intervals without artificial step limits, promotes lazy images (including placeholder `src` variants), and unmasks inline opacity/visibility styles. Restores the user's original scroll position and removes injected styles in `finally`.
- ⚙️ **Background Service Worker Throttling:** Viewport captures are managed by a background service worker (`background.js`) enforcing >= 650ms intervals with exponential backoff on Chrome capture quota limits.
- 📐 **Clean Viewport Slicing:** Pages are sliced at native viewport dimensions (1440 × 900–1200px) with automatic seam suppression for top sticky headers (`top <= 120`) and bottom fixed widgets (`bottom >= innerHeight - 150`). The final slice is automatically cropped to page bottom.
- 🎨 **Strictly Measured Values (No Synthetic Defaults):** Removed all hardcoded CSS defaults and quality rules from generators. CSS variables and rules are only output if directly measured from the page.
- 🧱 **Section-Balanced Element Sampling:** Samples elements evenly across all landmarks (header to footer) to ensure footers, dialogs, and main sections are accurately represented.
- ⚠️ **Explicit Error Handling & Safe Demo Mode:** Suppresses silent fallback to demo data on errors; displays clear error messages and disables exports. Standalone browser preview displays a visible DEMO banner and is read-only.

---

## 🛠️ Project Structure

```text
Deep-UI-Design-System-Clone-Engine/
├── manifest.json       # Chrome Extension Manifest V3 configuration (v2.3.0)
├── background.js       # Background service worker: throttled tab capture & quota retry (v2.3.0)
├── popup.html          # Extension popup interface with Stripe Enterprise aesthetic
├── popup.css           # Popup stylesheet, layout styles, and demo banner
├── popup.js            # Popup controller: extraction, hydration, chunking & ZIP packaging (v2.3.0)
├── extractor.js        # Deep DOM inspection, balanced sampling & token synthesizer (v2.3.0)
├── jszip.min.js        # Client-side ZIP archive bundler
├── icons/              # Extension icons (16px, 48px, 128px)
└── README.md           # Master Documentation & User Guide
```

---

## 📄 License

Distributed under the **MIT License**. Free for personal and commercial projects.

<div align="center">
Built with ❤️ by <a href="https://github.com/abidalidevv">abidalidevv</a>
</div>
