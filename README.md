# 🚀 Design2MD Pro — UI & Design Clone Engine

<div align="center">

[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-blue?style=for-the-badge&logo=googlechrome&logoColor=white)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![AI Ready](https://img.shields.io/badge/AI%20Ready-Antigravity%20•%20Cursor%20•%20Claude-8B5CF6?style=for-the-badge&logo=openai&logoColor=white)](https://github.com/abidalidevv/Deep-UI-Design-System-Clone-Engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Clone any website's visual design system (`DESIGN.md`) and section wireframe (`UI.md`) into production-ready specifications for Antigravity, Cursor, Claude, and AI coding assistants.**

[Features](#-key-features) • [Installation](#-quick-installation-15-seconds) • [How to Use](#-how-to-use) • [Why Design2MD?](#-why-design2md-solves-the-generic-ai-look) • [AI Prompting](#-prompting-ai-assistants)

</div>

---

## ⚡ Why Design2MD? (Solves the "Generic AI Look")

When AI coding assistants build websites from scratch, they almost always produce flat, generic-looking templates with default blue buttons, un-tracked typography, and basic layouts.

**Design2MD completely eliminates the "generic AI look"** by extracting the exact design tokens and section rhythms of high-production websites (like Stripe, Linear, Vercel, Apple):

```
Target Website (e.g., Stripe / Linear)
                 │
                 ▼  (1-Click Scan via Design2MD)
  ┌──────────────────────────────┬──────────────────────────────┐
  │                              │                              │
  ▼                              ▼                              ▼
🎨 DESIGN.md                   📐 UI.md                   🤖 AI Master Prompt
• Master :root CSS tokens      • Top-to-bottom page rhythm    • Ready-to-paste prompt
• Semantic Color Palette       • Section-by-section layout    • Directs Antigravity to
• Typography Scale & Fonts     • Bento grid wireframes          replicate the exact
• Anti-AI Quality Directives   • HTML & CSS component code      aesthetic & depth
```

---

## 💎 Two Modular Specifications: `DESIGN.md` vs `UI.md`

| Feature | 🎨 `DESIGN.md` *(Tokens & Style)* | 📐 `UI.md` *(Sections & Wireframe)* |
| :--- | :--- | :--- |
| **Best For** | Applying this website's **aesthetic & colors** to your own app or tool. | Cloning the **exact page layout, sections & structure** of the website. |
| **Contents** | • Synthesized `:root` CSS variables<br>• Complete Color Palette (Surfaces, Text, Borders)<br>• Typography hierarchy (`H1` to `P`) & Font imports<br>• Border radius scale, shadows, glassmorphism<br>• Micro-interaction transitions & hover states<br>• **Anti-Generic AI Directives** | • **Executive Page Rhythm Map** (Sequence & heights)<br>• Section-by-section blueprint (Hero, Bento, FAQ, Footer)<br>• Container dimensions, Flex/Grid column counts<br>• Sample headings, copy, and visual media<br>• **Ready-to-Use HTML/CSS Component Starters** |
| **Export Action** | 📥 **Download DESIGN.md** or copy `:root CSS` | 📥 **Download UI.md** or copy sections wireframe |

---

## 🚀 Quick Installation (15 Seconds)

Works in **Google Chrome**, **Brave**, **Arc**, and **Microsoft Edge**:

1. Clone or download this repository:
   ```bash
   git clone https://github.com/abidalidevv/Deep-UI-Design-System-Clone-Engine.git
   ```
2. Open your browser and navigate to:
   ```text
   chrome://extensions/
   ```
3. In the top-right corner, toggle **ON** **"Developer mode"**.
4. In the top-left corner, click **"Load unpacked"**.
5. Select the repository directory:
   ```text
   C:\Users\Ali\.gemini\antigravity-ide\scratch\ui-spec-extractor-extension
   ```
6. **Done!** Click the puzzle icon in Chrome and **pin Design2MD** to your toolbar for instant 1-click access.

---

## 🎯 How to Use

1. Navigate to **any webpage** whose design or layout you admire (e.g. `stripe.com`, `linear.app`, `vercel.com`, `apple.com`).
2. Click the **Design2MD Pro** toolbar icon.
3. The popup automatically scans the page and displays:
   - **Active Target:** Site domain, page title, and Dark/Light mode detection.
   - **Dual Export Hub:** Dedicated buttons for `DESIGN.md` and `UI.md`.
   - **Interactive Tabs:** Clickable color swatches (with hex copy), typography scale, vertical sections timeline, and component specs.
4. Export with 1 click:
   - 🎨 Click **"Download DESIGN.md"** for design tokens and CSS variables.
   - 📐 Click **"Download UI.md"** for sections and page wireframes.
   - 🤖 Click **"Copy Antigravity Master Prompt"** for the ready-to-paste AI prompt.
   - 📦 Click **"Full Spec"** to download both in one single document.

---

## 🤖 Prompting AI Assistants (Antigravity, Cursor, Claude)

When creating or modifying your web application, provide the generated markdown file to your AI assistant:

```text
Build my web application using the exact visual aesthetic and design system 
described in the attached DESIGN.md.

Follow the section sequence and component structures from UI.md.
Strictly adhere to the synthesized :root CSS variables, typography letter-spacing,
1px card border highlights, and hover micro-interactions.
```

Your AI-generated website will look indistinguishable from a top-tier designer's work — with **zero generic AI template feel**!

---

## 🛠️ Project Structure

```
├── manifest.json       # Chrome Extension Manifest V3 configuration
├── popup.html          # Ultra-luxury popup interface (Raycast / Linear aesthetic)
├── popup.css           # Premium glassmorphic styling, obsidian theme & animations
├── popup.js            # Controller: dual markdown generators, tab manager & clipboard helpers
├── extractor.js        # v3.0 Deep Web Design Clone Engine (DOM analysis & token synthesis)
├── icons/              # Extension icons (16px, 48px, 128px)
└── README.md           # Documentation
```

---

## 📄 License

Distributed under the **MIT License**. Free for personal and commercial use.

---

<div align="center">
Built with ❤️ by <a href="https://github.com/abidalidevv">abidalidevv</a>
</div>
