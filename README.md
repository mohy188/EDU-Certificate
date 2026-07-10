# Professional Certificate Generator - EDU Training Centre Ltd

A professional, production-ready Single Page Application (SPA) built for **EDU Training Centre Ltd** to generate, customize, print, and download high-quality A4 training certificates.

## 🎯 Project Overview

This tool allows administrators of EDU Training Centre Ltd (a UK-based training provider) to generate emergency first aid training certificates. It maintains standard regulatory body texts and corporate brand compliance while offering a highly flexible and interactive client-side signature editing suite.

### 🌟 Key Features

- **Brand-Compliant Design**: Utilizes the EDU Training Centre Ltd official brand colors (Vibrant Blue, Crimson Red, Charcoal Black) with premium serif typography (Lora) and high-contrast styling.
- **Editable Fields**:
  - **Learner Name**: Automatically styled and capitalized in real-time.
  - **Course Date**: Configurable date field (formats into standard UK `DD/MM/YYYY` format).
  - **Trainer Signature**: Drag-and-drop or file upload signature region.
- **Advanced Signature Editing Suite**:
  - **Drag & Drop Positioning**: Relocate the signature anywhere inside the signature segment.
  - **Dynamic Resizing**: Scale the signature while maintaining original aspect ratios and PNG transparency.
  - **Background Removal (AI)**: Adaptive client-side canvas thresholding and edge feathering to isolate pen strokes.
  - **Make White Transparent**: Targeted luminance filtering for quick white background removal.
  - **Reset Original**: Easily restore the uploaded signature to its raw state.
- **Print & PDF Export**:
  - **Prone Print Layouts (`@media print`)**: Hides controls, sidebars, and background elements, fitting only the certificate canvas perfectly onto a physical A4 sheet.
  - **High-Resolution PDF**: Captures the certificate at 300+ DPI (scale: 3) for crisp, clean vector text and sharp signature lines in a standard A4 format (210mm x 297mm).

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Client-side Single Page Application (SPA) running entirely in the browser.
- **Framework**: React (Vite, JS/JSX)
- **Styling**: Native CSS3 (Strictly no Tailwind, Bootstrap, or Tailwind-related loaders).
- **Libraries**:
  - `html2canvas` (DPI scaling for PDF snapshot)
  - `jspdf` (A4 standard document container compilation)
  - `react-dropzone` (File dragging area)
  - `react-rnd` (Drag-and-resize wrapper)
  - `lucide-react` (Crisp SVG micro-icons)

---

## 📁 Directory Structure

```
├── public/
│   ├── logo.png               # EDU Training Centre Ltd Logo
│   └── faib.png               # First Aid Industry Body (FAIB) Logo
│
├── src/
│   ├── components/
│   │   ├── Certificate.jsx         # A4 layout render & interactive signature Rnd box
│   │   ├── ControlPanel.jsx        # Sidebar controls (Name, Date, Action Buttons)
│   │   ├── SignatureUploader.jsx   # Drag & drop upload area with background tools
│   │   ├── Toolbar.jsx             # Scale/zoom preview controls
│   │   └── PdfGenerator.jsx        # High-res PDF rendering loading overlay
│   │
│   ├── utils/
│   │   ├── pdf.js                  # jsPDF canvas screenshot and filename helper
│   │   ├── backgroundRemoval.js    # Canvas-level adaptive color keying and smoothing
│   │   └── helpers.js              # Date formatters (numeric / elegant text)
│   │
│   ├── App.jsx                     # State orchestrator & layout root
│   ├── main.jsx                    # React index mount
│   └── styles.css                  # Global styles, variables, & print media queries
│
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Running the Application

### Development
To launch the interactive dev server:
```bash
npm install
npm run dev
```
The server will boot on port `3000` (externally accessible).

### Production Build
To compile the highly optimized build for static deployment:
```bash
npm run build
```
This produces static assets in the `/dist` directory. This project is 100% compatible with static hosting environments (Vercel, Netlify, Cloud Run, etc.) and requires no backend or environment key declarations to execute.
