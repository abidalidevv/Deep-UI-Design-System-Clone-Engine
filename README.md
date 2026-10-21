# 🚀 Design2MD Pro v2.1 — Deep UI & Design System Clone Engine

<div align="center">

[![Release](https://img.shields.io/badge/Release-v2.1%20Enterprise-635BFF?style=for-the-badge&logo=stripe&logoColor=white)](https://github.com/abidalidevv/Deep-UI-Design-System-Clone-Engine/releases)
[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blue?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![AI Ready](https://img.shields.io/badge/AI%20Ready-Antigravity%20•%20Cursor%20•%20Claude-00D4FF?style=for-the-badge&logo=openai&logoColor=white)](https://github.com/abidalidevv/Deep-UI-Design-System-Clone-Engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Deep-clone any website's visual design system (`DESIGN.md`), section wireframe (`UI.md`), and native-resolution visual screenshot slices (`screenshots/`) into production-ready specifications for Antigravity, Cursor, Claude, and AI coding assistants.**

[⚡ Quick Overview](#-why-design2md-pro) • [📦 Installation](#-installation-guide-15-seconds) • [📖 How to Use](#-how-to-use-step-by-step-guide) • [🇵🇰 اردو گائیڈ (Roman Urdu)](#-urdu--roman-urdu-guide-istimaal-karne-ka-tareeqa) • [🤖 Prompting AI](#-how-to-prompt-ai-assistants) • [✨ What's New in v2.1](#-whats-new-in-release-v21)

</div>

---

## ⚡ Why Design2MD Pro? (The Anti-AI Template Engine)

When AI coding assistants (like Antigravity, Cursor, or Claude) build web applications from a simple prompt, they almost always produce generic, flat templates with saturated blue buttons, un-tracked default typography, and boxy wireframes.

**Design2MD Pro completely eliminates the "generic AI look"** by extracting the exact design tokens, DOM skeletons, and visual rhythms of world-class flagship websites (such as **Stripe**, **Linear**, **Apple**, and **Vercel**):

```
Target Website (e.g., Stripe / Linear)
                 │
                 ▼  (1-Click Scan via Design2MD Pro)
  ┌──────────────────────────────┼──────────────────────────────┐
  │                              │                              │
  ▼                              ▼                              ▼
🎨 DESIGN.md                   📐 UI.md                   📸 Visual Chunks & ZIP
• Master :root CSS tokens      • Executive Page Rhythm Map    • 1:1 Crisp Viewport Slices
• Exact Palette (Surfaces,     • Asli DOM Tree Skeletons      • Zero Downscaling Blur
  Text, Borders, Accents)        with placeholder tags        • Complete ZIP Archive
• Typography Hierarchy &       • Flexbox, Grid, & Layering      (DESIGN + UI + Slices +
  Letter-Spacing Scale           (z-index, overflow, max-width) Prompt)
```

---

## 💎 The Four Output Artifacts Explained

| Artifact | File Name | What It Contains | When To Use It |
|---|---|---|---|
| 🎨 **Design Tokens Spec** | `[domain]_DESIGN.md` | Master `:root` CSS variables, exact color palette, typography hierarchy, font feature settings, component pseudo-states (`:hover`, `:focus`), and mathematical spacing scale. | When you want your website or dashboard to have the **exact colors, fonts, buttons, and visual styling** of the target site. |
| 📐 **UI Wireframe Spec** | `[domain]_UI.md` | Executive page rhythm map (section heights and order), **Asli DOM Tree Skeletons** per section, layout coordinates, flex/grid rules, and content placeholders. | When you want to clone the **exact page layout, section order, bento grids, and container structure**. |
| 📸 **Crisp Visual Slices** | `[domain]_VISUAL_CHUNKS.zip` | High-resolution individual viewport PNG slices (`chunk_01.png`, `chunk_02.png`, etc.) captured slice-by-slice at native display resolution. | When providing screenshots to Multimodal AI (Antigravity/Claude). **Prevents blurry downscaling** caused by 19,000px stitched images! |
| 📦 **All-In-One Bundle** | `[domain]_COMPLETE_CLONE_BUNDLE.zip` | Complete package: `DESIGN.md` + `UI.md` + `FULL_CLONE.md` + `AI_CODING_PROMPT.txt` + `screenshots/` directory containing all chunks. | The ultimate 1-click download. Drop this folder directly into your workspace or AI prompt! |

---

## 📦 Installation Guide (15 Seconds)

Compatible with **Google Chrome**, **Brave**, **Arc**, **Microsoft Edge**, and all Chromium browsers:

1. **Download or Clone the Repository:**
   ```bash
   git clone https://github.com/abidalidevv/Deep-UI-Design-System-Clone-Engine.git
   ```
   *(or download the ZIP and extract it to your preferred folder).*

2. **Open Extensions Manager:**
   In your Chrome browser URL bar, type:
   ```text
   chrome://extensions/
   ```

3. **Enable Developer Mode:**
   Toggle **ON** the switch labeled **"Developer mode"** in the top-right corner.

4. **Load the Extension:**
   - Click **"Load unpacked"** in the top-left corner.
   - Select the folder:
     ```text
     C:\Users\Ali\Desktop\clone ui\Deep-UI-Design-System-Clone-Engine
     ```
   - Click **Select Folder**.

5. **Pin to Toolbar:**
   Click the puzzle piece icon in your Chrome toolbar and **pin Design2MD Pro** for instant 1-click access.

---

## 📖 How to Use (Step-by-Step Guide)

### Workflow 1: Inspecting & Cloning a Live Website

1. **Open the Website:**
   Navigate to any website you want to clone or draw inspiration from (e.g., [stripe.com/payments](https://stripe.com/payments) or [linear.app](https://linear.app)).
2. **Open Design2MD Pro:**
   Click the Design2MD Pro icon in your browser toolbar.
3. **Instant Scan:**
   The extension will automatically pre-scroll to mount lazy sections, inspect the DOM tree, and render the **Stripe Enterprise Light Dashboard**.
4. **Choose Your Export:**
   - **Click "Download DESIGN.md ›"**: Downloads the design tokens and `:root` CSS.
   - **Click "Download UI.md ›"**: Downloads the page wireframe and DOM tree skeletons.
   - **Click "Visual Chunks (.zip) ›"**: Takes crisp, 1:1 viewport slices and bundles them into a zip file.
   - **Click "Clone ZIP Bundle ›"**: Packages all markdown specifications, master prompt, and screenshot chunks into a single ready-to-use archive.
   - **Click "Copy AI Master Prompt ›"**: Copies the prompt directly to your clipboard.

---

### Workflow 2: Standalone Interactive Browser Mode

You can also open `popup.html` directly in your browser:
```text
file:///C:/Users/Ali/Desktop/clone ui/Deep-UI-Design-System-Clone-Engine/popup.html
```
- The extension **self-hydrates** with a high-fidelity **Stripe Payments demo dataset**.
- Explore all 5 interactive tabs:
  - **Palette:** Click any color swatch to copy its Hex code.
  - **Type:** View primary fonts (`Söhne`, `Plus Jakarta Sans`) and typography sizes (`H1` to `<button>`).
  - **Sections:** View detected landmark containers and heights.
  - **Comps:** Inspect navbar, buttons, and floating glass cards.
  - **Preview:** Read and copy live `DESIGN.md` and `UI.md` code.

---

## 🇵🇰 Urdu / Roman Urdu Guide (Istimaal Karne Ka Tareeqa)

### Step 1: Extension Install Karein
1. Chrome mein `chrome://extensions` open karein.
2. Top-right corner se **"Developer mode"** ON karein.
3. Top-left se **"Load unpacked"** par click karein aur ye folder select karein:
   `C:\Users\Ali\Desktop\clone ui\Deep-UI-Design-System-Clone-Engine`
4. Toolbar mein puzzle icon se **Design2MD Pro** ko pin kar lein.

### Step 2: Kisi Bhi Website Ka Design Scan Karein
1. Jo website aapko pasand ho (jaise `stripe.com` ya `linear.app`), usay Chrome mein open karein.
2. Chrome toolbar se **Design2MD icon** par click karein.
3. Extension automatically page ko micro-scroll karke live DOM aur styling read kar legi.

### Step 3: Files Export Karein
- **🎨 Download DESIGN.md:** Is file mein saare colors, fonts, `:root` CSS variables, aur button hover states hote hain.
- **📐 Download UI.md:** Is file mein page ke saare sections ka structure (Hero, Bento Grid, Cards) aur **Asli DOM Skeleton** hota hai.
- **📸 Visual Chunks (.zip):** Lamba blurry screenshot lene ke bajaye page ko **1:1 crisp slices** mein kaat kar zip karta hai jo AI asaani se samajh sakti hai.
- **📦 Clone ZIP Bundle:** Ek hi click par `DESIGN.md`, `UI.md`, `FULL_CLONE.md`, `AI_CODING_PROMPT.txt`, aur `screenshots/` folder ko zip mein download karta hai.
- **🤖 Copy AI Master Prompt:** Antigravity / Cursor ke liye tayyar prompt copy karta hai.

### Step 4: AI Ko Kaise Dena Hai?
AI assistant (Antigravity / Cursor) ko ye prompt dein aur sath files attach karein:
> *"Attached DESIGN.md aur UI.md ke mutabiq meri application ka frontend build karo. Colors aur pill buttons ka radius bilkul same hona chahiye."*

---

## 🤖 How to Prompt AI Assistants (Antigravity, Cursor, Claude)

When prompting your AI assistant, pass the extracted markdown files and prompt:

```text
Build my web application using the exact visual aesthetic, color tokens, and layout 
defined in the attached DESIGN.md and UI.md specifications.

Mandatory Quality Rules:
1. Palette: Use ONLY the synthesized :root CSS variables from DESIGN.md.
2. Pill Buttons: Primary buttons must use border-radius: 9999px with inset light bevels 
   and smooth hover lifts.
3. Floating Cards: Cards must use 16px border-radius with subtle 1px hairline borders 
   and diffused elevation shadows.
4. Structure: Recreate the section rhythm and DOM skeleton layout from UI.md.
5. Zero Generic AI Look: Do NOT use default saturated blues (#2563EB) or un-tracked headings.
```

---

## ✨ What's New in Release v2.1

- 🎨 **Authentic Stripe Enterprise Light Theme:** Redesigned from the ground up with Stripe's luminous ambient pastel mesh background, pill capsule buttons (`border-radius: 9999px`), inset glass light-bevels, and floating translucent Zenflow cards.
- 📸 **Visual Chunking Engine:** Captures native 1080p/2K viewport slices (`chunk_01.png`, `chunk_02.png`) to solve the multimodal token downscaling blur problem.
- 🛡️ **Mega-Height Memory Safeguard:** Added memory-safe canvas allocation guards so 19,000px pages (like Stripe) capture flawlessly without memory crashes.
- 🧱 **Real Trimmed DOM Tree Skeletons:** Extracts true DOM hierarchy while stripping out raw content and replacing with semantic placeholders (`[Heading]`, `[Paragraph]`, `[Image]`).
- ⚡ **Dual-Mode Interactive Architecture:** Extension operates in both dynamic live extraction mode and standalone self-hydrating demo mode.
- 🎯 **Interactive Stripe Chevrons (`›`):** Refined button micro-interactions with animated right-pointing arrows.

---

## 🛠️ Project Structure

```text
Deep-UI-Design-System-Clone-Engine/
├── manifest.json       # Chrome Extension Manifest V3 configuration (v2.1.0)
├── popup.html          # Stripe Enterprise Light popup interface
├── popup.css           # Authentic Stripe design system, ambient mesh & pill styles
├── popup.js            # Controller: dual-mode engine, chunking & zip packager
├── extractor.js        # v2.5 Deep DOM inspection, skeleton parser & token synthesizer
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
