# 📰 Invoice Builder — GUVI Capstone Project #2

A responsive, high-performance web application designed for small businesses and freelancers to generate, customize, print, and export professional tax invoices in real-time.

Built with **React 19**, **Vite**, **Tailwind CSS v4**, and **jsPDF**, this project fulfills all milestones and grading criteria of the **GUVI Full Stack Development Capstone #2**.

---

## 🌟 Key Features

### 1. ⚡ Live Reactive Calculations & State Management
- **Single Source of Truth**: Centralized state management in `App.jsx` handles sender, client, invoice metadata, and dynamic line items.
- **Instant Calculations**: Subtotal, GST/Tax (configurable %), and Grand Total calculate reactively on every keystroke without lag.
- **Dynamic Line Items CRUD**: Add unlimited items/services, edit description/quantity/rate inline, and remove individual rows with automatic recalculation.

### 2. 📄 1:1 Live A4 Preview & Professional Tax Invoice Layout
- **A4 Document Simulation**: True-to-life printed document view with standard Indian/Global tax invoice layout.
- **Header & Two-Row Metadata Box**: Bold business branding alongside boxed Invoice Number and Issue Date.
- **"Bill To" Customer Card**: Dedicated section displaying client name, email, and billing address.
- **Structured Items Table**: Clear tabular grid with vertical line separators for Index (`#`), Item Description, Quantity, Rate, and computed Amount.
- **Footer & Signatory**: Payment terms, UPI/Bank transfer notes, and an Authorized Signatory section.
- **Highlight Badge**: Prominent, high-contrast blue total amount for instant clarity.

### 3. 📥 1-Click PDF Export & Direct Browser Print
- **Pixel-Perfect Vector PDF Generation**: Powered by `jsPDF` for instant, lightweight, vector-rendered A4 PDFs generated in under 0.1 seconds without external server dependencies.
- **Clean `.pdf` File Naming**: Automatically sanitizes the invoice number to name downloads properly (e.g., `INV-001.pdf`), eliminating random GUID blob names.
- **Browser Print Ready**: Native `window.print()` integration with `@media print` CSS rules that hide forms and navigation, sending only the clean invoice sheet to the printer.

### 4. 💾 LocalStorage Persistence & Draft Protection
- **Auto-Save on Keystroke**: Automatically saves any edits into browser `localStorage`, ensuring work is never lost upon accidental refresh or tab close.
- **"New Invoice" Flow**: One-click action to reset client details and items for a new bill while preserving sender business information.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Declarative component UI and reactive state hooks (`useState`, `useEffect`) |
| **Vite 8** | Ultra-fast build tool and development server with Hot Module Replacement (HMR) |
| **Tailwind CSS v4** | Modern styling system for utility-first layout and print media styles |
| **jsPDF 4.2** | Client-side vector PDF generation matching the on-screen invoice 1:1 |
| **Lucide React** | Sleek, modern iconography |

---

## 📁 Project Architecture

```
invoice-builder/
├── public/                 # Static assets
├── src/
│   ├── Components/
│   │   ├── InvoiceForm.jsx      # Unified input form (Metadata, dynamic items CRUD, notes)
│   │   └── InvoicePreview.jsx   # Live on-screen A4 invoice sheet
│   ├── utils/
│   │   └── generatePdf.js       # 1:1 jsPDF vector export engine
│   ├── App.jsx                  # Root state store, calculations, localStorage, actions
│   ├── index.css                # Global styles, print media rules (@media print)
│   └── main.jsx                 # React root entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation & Local Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd "Invoice builder"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173` to view the application.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready bundle will be output to the `dist/` folder.

---

## 🎯 GUVI Evaluation Rubric Checklist

- [x] **Milestone 1**: State model and calculations (Subtotal, GST 18%, Grand Total).
- [x] **Milestone 2**: Unified input editor form with dynamic item addition/removal and live updates.
- [x] **Milestone 3**: Live responsive preview sheet reflecting user inputs in real-time.
- [x] **Milestone 4**: Persistence (`localStorage`), browser print (`window.print`), and 1-click PDF download (`.pdf`).
- [x] **Milestone 5**: Production code quality, zero console errors, responsive layout, and documentation.

---

## 📄 License
Created for GUVI Capstone Project evaluation.
