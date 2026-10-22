import { jsPDF } from 'jspdf';

/**
 * Pixel-precise 1:1 twin of the on-screen `InvoicePreview.jsx` component.
 * Reproduces the exact card container, typography, color palette, borders,
 * left-hand "Authorized Signatory", and blue Total Amount badge.
 */
export async function generateInvoicePDF(invoice, subtotal, taxAmount, total) {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  });

  // Currency string: 'Rs.' for ₹ to avoid PDF character corruption, or user's ASCII currency
  const curr = (invoice.currency === '₹' || !invoice.currency) ? 'Rs. ' : `${invoice.currency} `;

  // Page Dimensions & Sheet Coordinates (Card centered on A4)
  const sheetX = 15;
  const sheetY = 15;
  const sheetW = 180;
  const sheetRight = sheetX + sheetW; // 195mm
  const innerPad = 8;
  const contentX = sheetX + innerPad; // 23mm
  const contentRight = sheetRight - innerPad; // 187mm
  const contentW = contentRight - contentX; // 164mm

  // ==========================================
  // 1. HEADER: Sender Info (Left) & TAX INVOICE (Right)
  // ==========================================
  let curY = sheetY + innerPad + 4;

  // Sender Name (Bold uppercase, constrained)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(17, 24, 39); // text-gray-900
  const rawSenderName = (invoice.sender.name || 'Your Company Name').toUpperCase();
  const safeSenderName = rawSenderName.length > 40 ? rawSenderName.substring(0, 40) + '…' : rawSenderName;
  doc.text(safeSenderName, contentX, curY);

  // Sender Email & Address
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99); // text-gray-600
  const safeSenderEmail = (invoice.sender.email || 'company@email.com').substring(0, 45);
  doc.text(safeSenderEmail, contentX, curY + 5);

  doc.setTextColor(107, 114, 128); // text-gray-500
  const addrLines = doc.splitTextToSize((invoice.sender.address || 'Company Address').substring(0, 80), 75).slice(0, 2);
  doc.text(addrLines, contentX, curY + 9.5);

  // Right Header: TAX INVOICE
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(31, 41, 55); // text-gray-800
  doc.text('TAX INVOICE', contentRight, curY + 1, { align: 'right' });

  // Right Header: Two-Row Meta Box (Invoice No & Date)
  const metaBoxW = 55;
  const metaBoxX = contentRight - metaBoxW;
  const metaBoxY = curY + 4;
  const metaBoxH = 15;

  doc.setDrawColor(209, 213, 219); // border-gray-300
  doc.setLineWidth(0.3);

  // Row 1: Invoice No (Gray bg)
  doc.setFillColor(243, 244, 246); // bg-gray-100
  doc.rect(metaBoxX, metaBoxY, metaBoxW, 7.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(55, 65, 81); // text-gray-700
  doc.text('Invoice No:', metaBoxX + 3, metaBoxY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // text-gray-900
  doc.text(invoice.invoiceNumber || 'INV-001', contentRight - 3, metaBoxY + 5, { align: 'right' });

  // Row 2: Date (White bg)
  doc.setFillColor(255, 255, 255); // bg-white
  doc.rect(metaBoxX, metaBoxY + 7.5, metaBoxW, 7.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99); // text-gray-600
  doc.text('Date:', metaBoxX + 3, metaBoxY + 12.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // text-gray-900
  doc.text(invoice.invoiceDate || '—', contentRight - 3, metaBoxY + 12.5, { align: 'right' });

  // Header Dark Rule (border-b-2 border-gray-800)
  const headerLineY = Math.max(curY + 10 + (addrLines.length * 4.5), metaBoxY + metaBoxH + 4);
  doc.setDrawColor(31, 41, 55); // border-gray-800
  doc.setLineWidth(0.7);
  doc.line(contentX, headerLineY, contentRight, headerLineY);

  // ==========================================
  // 2. BILL TO (CUSTOMER DETAILS) BOX
  // ==========================================
  const billToY = headerLineY + 5;
  const billToH = 24;

  doc.setFillColor(249, 250, 251); // bg-gray-50
  doc.setDrawColor(229, 231, 235); // border-gray-200
  doc.setLineWidth(0.3);
  doc.roundedRect(contentX, billToY, contentW, billToH, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128); // text-gray-500
  doc.text('BILL TO (CUSTOMER DETAILS):', contentX + 3.5, billToY + 5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39); // text-gray-900
  const rawClientName = invoice.client.name || 'Client / Customer Name';
  const safeClientName = rawClientName.length > 45 ? rawClientName.substring(0, 45) + '…' : rawClientName;
  doc.text(safeClientName, contentX + 3.5, billToY + 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99); // text-gray-600
  const safeClientEmail = (invoice.client.email || 'client@email.com').substring(0, 45);
  doc.text(safeClientEmail, contentX + 3.5, billToY + 15.5);

  doc.setTextColor(107, 114, 128); // text-gray-500
  const clientAddr = (invoice.client.address || 'Client Billing Address').substring(0, 80);
  doc.text(clientAddr, contentX + 3.5, billToY + 20);

  // ==========================================
  // 3. ITEMS & SERVICES TABLE
  // ==========================================
  const tableY = billToY + billToH + 5;
  const colW = {
    num: 10,
    desc: contentW - (10 + 16 + 28 + 32), // dynamic width
    qty: 16,
    rate: 28,
    amount: 32
  };

  const colPos = {
    num: contentX,
    desc: contentX + colW.num,
    qty: contentX + colW.num + colW.desc,
    rate: contentX + colW.num + colW.desc + colW.qty,
    amount: contentRight - colW.amount
  };

  // Table Header (bg-gray-100 border border-gray-300)
  const headerH = 7.5;
  doc.setFillColor(243, 244, 246); // bg-gray-100
  doc.setDrawColor(209, 213, 219); // border-gray-300
  doc.setLineWidth(0.3);
  doc.rect(contentX, tableY, contentW, headerH, 'FD');

  // Vertical dividers in header
  doc.line(colPos.desc, tableY, colPos.desc, tableY + headerH);
  doc.line(colPos.qty, tableY, colPos.qty, tableY + headerH);
  doc.line(colPos.rate, tableY, colPos.rate, tableY + headerH);
  doc.line(colPos.amount, tableY, colPos.amount, tableY + headerH);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(55, 65, 81); // text-gray-700
  doc.text('#', colPos.num + (colW.num / 2), tableY + 5, { align: 'center' });
  doc.text('ITEM DESCRIPTION', colPos.desc + 3, tableY + 5);
  doc.text('QTY', colPos.qty + (colW.qty / 2), tableY + 5, { align: 'center' });
  doc.text(`RATE (${curr.trim()})`, colPos.amount - 3, tableY + 5, { align: 'right' });
  doc.text(`AMOUNT (${curr.trim()})`, contentRight - 3, tableY + 5, { align: 'right' });

  // Item Rows
  let rowY = tableY + headerH;
  const rowH = 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  invoice.items.forEach((item, index) => {
    const qty = Number(item.quantity) || 0;
    const rate = Number(item.unitPrice ?? item.price ?? 0);
    const amount = qty * rate;

    // Row outline
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(229, 231, 235); // divide-gray-200
    doc.rect(contentX, rowY, contentW, rowH, 'FD');

    // Vertical dividers in row
    doc.line(colPos.desc, rowY, colPos.desc, rowY + rowH);
    doc.line(colPos.qty, rowY, colPos.qty, rowY + rowH);
    doc.line(colPos.rate, rowY, colPos.rate, rowY + rowH);
    doc.line(colPos.amount, rowY, colPos.amount, rowY + rowH);

    // # Number
    doc.setTextColor(107, 114, 128); // text-gray-500
    doc.text(String(index + 1), colPos.num + (colW.num / 2), rowY + 5.5, { align: 'center' });

    // Description (truncate with ellipsis if wider than column)
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(17, 24, 39); // text-gray-900
    const maxDescW = colW.desc - 6;
    let descText = (item.description || 'Item description').trim();
    if (doc.getTextWidth(descText) > maxDescW) {
      while (doc.getTextWidth(descText + '…') > maxDescW && descText.length > 0) {
        descText = descText.slice(0, -1);
      }
      descText += '…';
    }
    doc.text(descText, colPos.desc + 3, rowY + 5.5);

    // Qty
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81); // text-gray-700
    doc.text(String(qty), colPos.qty + (colW.qty / 2), rowY + 5.5, { align: 'center' });

    // Rate
    doc.text(`${curr}${rate.toLocaleString('en-IN')}`, colPos.amount - 3, rowY + 5.5, { align: 'right' });

    // Amount (bold font-mono)
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39); // text-gray-900
    doc.text(`${curr}${amount.toLocaleString('en-IN')}`, contentRight - 3, rowY + 5.5, { align: 'right' });

    rowY += rowH;
  });

  // Table bottom border
  doc.setDrawColor(209, 213, 219);
  doc.line(contentX, rowY, contentRight, rowY);

  // ==========================================
  // 4. BOTTOM SECTION: Payment Notes & Calculations
  // ==========================================
  const bottomSectionY = rowY + 6;
  const leftColW = 82;
  const rightBoxW = 75;
  const rightBoxX = contentRight - rightBoxW;

  // --- LEFT SIDE: Payment Instructions & Notes ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128); // text-gray-500
  doc.text('PAYMENT INSTRUCTIONS & NOTES:', contentX, bottomSectionY + 3.5);

  const notesBoxY = bottomSectionY + 5.5;
  const notesBoxH = 24;

  doc.setFillColor(249, 250, 251); // bg-gray-50
  doc.setDrawColor(229, 231, 235); // border-gray-200
  doc.setLineWidth(0.3);
  doc.roundedRect(contentX, notesBoxY, leftColW, notesBoxH, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(75, 85, 99); // text-gray-600
  doc.text('•  Payment Terms: Due within 15 days', contentX + 3, notesBoxY + 5.5);
  doc.text('•  UPI / Bank: payments@upi or NEFT/IMPS', contentX + 3, notesBoxY + 11);

  if (invoice.notes) {
    doc.setDrawColor(229, 231, 235);
    doc.line(contentX + 3, notesBoxY + 14.5, contentX + leftColW - 3, notesBoxY + 14.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text('Note: ', contentX + 3, notesBoxY + 19.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 41, 55);
    const nLines = doc.splitTextToSize(invoice.notes.substring(0, 100), leftColW - 16).slice(0, 2);
    doc.text(nLines, contentX + 13, notesBoxY + 19.5);
  }

  // --- LEFT SIDE: Authorized Signatory under notes ---
  const signatoryLineY = notesBoxY + notesBoxH + 16;
  const signatoryW = 44; // w-44 in Tailwind
  const signatoryX = contentX + (leftColW / 2) - (signatoryW / 2);

  doc.setDrawColor(209, 213, 219); // border-gray-300
  doc.setLineWidth(0.4);
  doc.line(signatoryX, signatoryLineY, signatoryX + signatoryW, signatoryLineY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128); // text-gray-500
  doc.text('Authorized Signatory', contentX + (leftColW / 2), signatoryLineY + 4.5, { align: 'center' });

  // --- RIGHT SIDE: Calculations Summary Box ---
  doc.setDrawColor(209, 213, 219); // border-gray-300
  doc.setLineWidth(0.3);

  // Row 1: Subtotal
  doc.setFillColor(255, 255, 255);
  doc.rect(rightBoxX, notesBoxY, rightBoxW, 7.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(75, 85, 99); // text-gray-600
  doc.text('Subtotal:', rightBoxX + 3.5, notesBoxY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // text-gray-900
  doc.text(`${curr}${subtotal.toLocaleString('en-IN')}`, contentRight - 3.5, notesBoxY + 5, { align: 'right' });

  // Row 2: GST / Tax
  doc.rect(rightBoxX, notesBoxY + 7.5, rightBoxW, 7.5, 'FD');
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99); // text-gray-600
  doc.text(`GST / Tax (${invoice.taxRate}%):`, rightBoxX + 3.5, notesBoxY + 12.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39); // text-gray-900
  doc.text(`${curr}${taxAmount.toLocaleString('en-IN')}`, contentRight - 3.5, notesBoxY + 12.5, { align: 'right' });

  // Row 3: Total Amount (bg-gray-100 with bold blue text)
  doc.setFillColor(243, 244, 246); // bg-gray-100
  doc.rect(rightBoxX, notesBoxY + 15, rightBoxW, 9, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(17, 24, 39); // text-gray-900
  doc.text('Total Amount:', rightBoxX + 3.5, notesBoxY + 20.8);

  // BLUE TOTAL (text-blue-700 = rgb(29, 78, 216))
  doc.setTextColor(29, 78, 216);
  doc.setFontSize(10.5);
  doc.text(`${curr}${total.toLocaleString('en-IN')}`, contentRight - 3.5, notesBoxY + 20.8, { align: 'right' });

  // ==========================================
  // 5. OUTER PAPER SHEET BORDER (Card framing matching preview)
  // ==========================================
  const totalContentH = Math.max(signatoryLineY + 12, notesBoxY + 36) - sheetY;
  doc.setDrawColor(209, 213, 219); // border-gray-300
  doc.setLineWidth(0.3);
  doc.roundedRect(sheetX, sheetY, sheetW, totalContentH, 2, 2, 'D');

  // Build filename from invoice number
  const rawNum = invoice.invoiceNumber ? String(invoice.invoiceNumber).trim() : 'INV-001';
  const cleanNum = rawNum.replace(/[/\\?%*:|"<>]/g, '_').replace(/\.pdf$/i, '');
  const fileName = `${cleanNum}.pdf`;

  // ── Native File System Access (Permanent Fix for Windows Chrome/Edge) ──
  // In Chromium/Windows, blob URLs often cause the browser to ignore the 'download'
  // attribute and save the file with the blob's UUID (e.g. 6d57f2d1-19b8-4bc6...).
  // window.showSaveFilePicker is the official Chromium API that prompts the native
  // Windows "Save As" dialog with the pre-filled filename and guaranteed .pdf extension.
  const pdfBlob = doc.output('blob');

  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [
          {
            description: 'PDF Document (*.pdf)',
            accept: {
              'application/pdf': ['.pdf']
            }
          }
        ]
      });

      const writable = await handle.createWritable();
      await writable.write(pdfBlob);
      await writable.close();

      return { fileName };
    } catch (err) {
      if (err.name === 'AbortError') {
        // User cancelled the save dialog
        return { fileName, cancelled: true };
      }
      console.warn('showSaveFilePicker encountered an error, falling back:', err);
    }
  }

  // Fallback for browsers that don't support showSaveFilePicker (e.g. Firefox)
  const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    if (document.body.contains(link)) {
      document.body.removeChild(link);
    }
    URL.revokeObjectURL(blobUrl);
  }, 10000);

  return { fileName };
}
