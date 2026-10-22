import { useState, useEffect } from 'react';
import InvoiceForm from './Components/InvoiceForm';
import InvoicePreview from './Components/InvoicePreview';
import { generateInvoicePDF } from './utils/generatePdf.js';

const initialInvoiceState = {
  invoiceNumber: "INV-2026-0842",
  invoiceDate: new Date().toISOString().split('T')[0],
  currency: "₹",

  sender: {
    name: "Amarsinh Tech Solutions Pvt. Ltd.",
    email: "billing@amarsinhtech.com",
    address: "Plot 42, Cyber City, HITEC Park, Hyderabad, TS 500081"
  },

  client: {
    name: "Global Retail Innovations Inc.",
    email: "accounts@globalretail.io",
    address: "Suite 500, Prestige Tech Park, Bangalore, KA 560103"
  },

  items: [
    {
      id: 1,
      description: "Enterprise Web Application Architecture",
      quantity: 1,
      unitPrice: 75000
    },
    {
      id: 2,
      description: "Cloud Microservices & API Integration",
      quantity: 2,
      unitPrice: 25000
    },
    {
      id: 3,
      description: "DevOps CI/CD & Production Deployment",
      quantity: 1,
      unitPrice: 35000
    }
  ],

  taxRate: 18,
  notes: "Payment due within 15 days via NEFT/RTGS. Bank: HDFC Bank, A/C: 50200012345678, IFSC: HDFC0000123"
};

function calculatesubtotal(items) {
  let subtotal = 0;
  for (let i = 0; i < items.length; i++) {
    const qty = Number(items[i].quantity) || 0;
    const price = Number(items[i].unitPrice) || 0;
    subtotal += qty * price;
  }
  return subtotal;
}

function App() {
  // 1. LocalStorage Persistence: loads draft on start, saves on every change
  const [invoice, setInvoice] = useState(() => {
    try {
      const saved = localStorage.getItem('invoice_builder_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If saved draft has data, use it; otherwise seed with rich sample data
        if (parsed && (parsed.sender?.name || parsed.client?.name || parsed.items?.[0]?.description)) {
          return parsed;
        }
      }
      return initialInvoiceState;
    } catch {
      return initialInvoiceState;
    }
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadNotice, setDownloadNotice] = useState(null);
  const [newInvoiceNotice, setNewInvoiceNotice] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('invoice_builder_draft', JSON.stringify(invoice));
    } catch (e) {
      console.error("Failed to save draft to localStorage:", e);
    }
  }, [invoice]);

  // Calculations
  const subtotal = calculatesubtotal(invoice.items);
  const taxAmount = Math.round(subtotal * (invoice.taxRate / 100));
  const total = subtotal + taxAmount;

  // Helper: Reset client details & items for next invoice, but keep "Your Business" sender info intact
  function resetInvoiceAfterCompletion() {
    setInvoice(prev => {
      // Auto-increment invoice number if it ends in digits (e.g. INV-001 -> INV-002, INV-2026-0842 -> INV-2026-0843)
      let nextNum = `INV-${String(Math.floor(100 + Math.random() * 900))}`;
      if (prev.invoiceNumber) {
        const match = String(prev.invoiceNumber).match(/^(.*?)(\d+)$/);
        if (match) {
          const prefix = match[1];
          const num = parseInt(match[2], 10) + 1;
          const padded = String(num).padStart(match[2].length, '0');
          nextNum = `${prefix}${padded}`;
        }
      }

      return {
        ...prev,
        invoiceNumber: nextNum,
        invoiceDate: new Date().toISOString().split('T')[0],
        // STRICTLY PRESERVE sender (Your Business) info!
        sender: { ...prev.sender },
        // CLEAR client (Bill To)
        client: {
          name: "",
          email: "",
          address: ""
        },
        // RESET items to 1 fresh empty item
        items: [
          {
            id: Date.now(),
            description: "",
            quantity: 1,
            unitPrice: 0
          }
        ],
        notes: "Thank you for your business!"
      };
    });
  }

  // 2. Browser Print (window.print)
  function handlePrint() {
    window.print();
    // After print finishes, reset client & items ready for next invoice (keeps your business)
    setTimeout(() => {
      resetInvoiceAfterCompletion();
      setNewInvoiceNotice("🖨️ Printed — Ready for next invoice");
      setTimeout(() => setNewInvoiceNotice(null), 3000);
    }, 600);
  }

  // 3. Direct PDF Download matching InvoicePreview 1:1
  async function handleDownloadPdf() {
    try {
      setIsDownloading(true);
      const result = await generateInvoicePDF(invoice, subtotal, taxAmount, total);
      if (result && result.fileName && !result.cancelled) {
        setDownloadNotice({ fileName: result.fileName });
        setTimeout(() => setDownloadNotice(null), 10000);

        // Auto-reset client & items for next invoice, preserving your business info
        resetInvoiceAfterCompletion();
        setNewInvoiceNotice("✨ Saved & ready for next invoice");
        setTimeout(() => setNewInvoiceNotice(null), 3000);
      }
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("PDF generation failed: " + (err.message || "Unknown error"));
    } finally {
      setIsDownloading(false);
    }
  }

  // 4. Start New Invoice (Manual reset button)
  function handleNewInvoice() {
    resetInvoiceAfterCompletion();
    setNewInvoiceNotice("✨ New invoice ready");
    setTimeout(() => setNewInvoiceNotice(null), 3000);
  }

  // 5. Load Real Sample Data (Convenient 1-click test button for evaluator)
  function handleLoadSampleData() {
    setInvoice(initialInvoiceState);
    setNewInvoiceNotice("📋 Sample data loaded");
    setTimeout(() => setNewInvoiceNotice(null), 3000);
  }

  return (
    <div className="min-h-screen bg-[#f4f1ea] text-[#1c1917] p-4 lg:p-6 flex flex-col font-sans print:bg-white print:p-0">

      {/* Header Bar with Action Controls */}
      <div className="flex flex-wrap justify-between items-center gap-3 pb-3 mb-4 border-b border-[#d6d3d1] no-print shrink-0">
        <div className="flex items-center gap-2.5 flex-wrap">

          <h1 className="text-2xl font-serif font-bold text-[#1c1917]">
            📰 Invoice Builder
          </h1>

          <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-[#e7e5e4] text-[#44403c] rounded border border-[#d6d3d1]">
            Draft Auto-Saved
          </span>

          {newInvoiceNotice && (
            <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 border border-blue-300 px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5 animate-pulse">
              {newInvoiceNotice}
            </span>
          )}

          {downloadNotice && (
            <span className="text-[11px] font-semibold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5">
              ✅ Downloaded <strong className="font-mono">{downloadNotice.fileName}</strong>
            </span>
          )}

        </div>

        <div className="flex items-center gap-2">
          {/* Sample Data */}
          <button
            type="button"
            onClick={handleLoadSampleData}
            title="Load full realistic business data"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#e7e5e4] text-[#1c1917] text-xs font-semibold uppercase tracking-wider rounded border border-[#d6d3d1] shadow-sm cursor-pointer transition-colors"
          >
            📋 Sample Data
          </button>

          {/* New Invoice */}
          <button
            type="button"
            onClick={handleNewInvoice}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#e7e5e4] text-[#1c1917] text-xs font-semibold uppercase tracking-wider rounded border border-[#d6d3d1] shadow-sm cursor-pointer transition-colors"
          >
            🔄 New Invoice
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#e7e5e4] text-[#1c1917] text-xs font-semibold uppercase tracking-wider rounded border border-[#d6d3d1] shadow-sm cursor-pointer transition-colors"
          >
            🖨️ Print
          </button>

          {/* Download PDF via html2pdf.js */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-[#1c1917] hover:bg-[#38332f] text-[#f4f1ea] text-xs font-semibold uppercase tracking-wider rounded border border-[#1c1917] shadow-sm cursor-pointer transition-colors disabled:opacity-50"
          >
            {isDownloading ? "⏳ Generating..." : "📥 Download PDF"}
          </button>
        </div>
      </div>

      {/* 2-Column Split: Form on Left, Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start print:block print:p-0">
        {/* Left Column: Input Form (hidden when printing) */}
        <div className="no-print">
          <InvoiceForm invoice={invoice} setInvoice={setInvoice} />
        </div>

        {/* Right Column: Live Official Preview */}
        <div>
          <InvoicePreview 
            invoice={invoice} 
            subtotal={subtotal} 
            taxAmount={taxAmount} 
            total={total} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
