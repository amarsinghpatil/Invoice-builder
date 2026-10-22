import React from 'react';

export default function InvoicePreview({ invoice, subtotal, taxAmount, total }) {
  return (

    <div className="sticky top-6">
      {/* Top action header (hidden on print and PDF) */}
      <div className="flex justify-between items-center mb-3 no-print">
        <h2 className="text-base font-bold text-gray-700">Official Invoice Preview</h2>
        <span className="text-xs font-semibold px-2.5 py-0.5 bg-green-100 text-green-800 rounded">
          Print Ready
        </span>
      </div>

      {/* Official Invoice Sheet */}
      <div 
        id="invoice-preview" 
        className="bg-white p-8 rounded border border-gray-300 shadow-sm text-gray-800 text-xs font-sans"
      >
        {/* 1. Header: Business Info on Left, TAX INVOICE details on Right */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 uppercase">
              {invoice.sender.name || 'Your Company Name'}
            </h1>
            <p className="text-gray-600 mt-1">{invoice.sender.email || 'company@email.com'}</p>
            <p className="text-gray-500 whitespace-pre-line mt-0.5">{invoice.sender.address || 'Company Address'}</p>
          </div>

          <div className="text-right">
            <h2 className="text-2xl font-black text-gray-800 tracking-wider mb-2">TAX INVOICE</h2>
            <div className="border border-gray-300 rounded overflow-hidden text-left">
              <div className="bg-gray-100 px-3 py-1 font-semibold text-gray-700 border-b border-gray-300 flex justify-between gap-4">
                <span>Invoice No:</span>
                <span className="font-mono text-gray-900 font-bold">{invoice.invoiceNumber || 'INV-001'}</span>
              </div>
              <div className="px-3 py-1 bg-white flex justify-between gap-4">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">{invoice.invoiceDate || '—'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Client Details: Bill To Box */}
        <div className="bg-gray-50 border border-gray-200 rounded p-3 mb-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
            Bill To (Customer Details):
          </p>
          <p className="text-sm font-bold text-gray-900">{invoice.client.name || 'Client / Customer Name'}</p>
          <p className="text-gray-600 mt-0.5">{invoice.client.email || 'client@email.com'}</p>
          <p className="text-gray-500 whitespace-pre-line mt-0.5">{invoice.client.address || 'Client Billing Address'}</p>
        </div>

        {/* 3. Items & Services Table with Formal Borders (scrollable on screen, full view on print) */}
        <div className="border border-gray-300 rounded overflow-hidden mb-5 max-h-64 overflow-y-auto print:max-h-none print:overflow-visible">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-gray-100 text-gray-700 font-semibold text-[11px] uppercase border-b border-gray-300">
                <th className="py-2 px-3 w-10 text-center border-r border-gray-300">#</th>
                <th className="py-2 px-3 border-r border-gray-300">Item Description</th>
                <th className="py-2 px-3 w-16 text-center border-r border-gray-300">Qty</th>
                <th className="py-2 px-3 w-24 text-right border-r border-gray-300">Rate ({invoice.currency})</th>
                <th className="py-2 px-3 w-28 text-right">Amount ({invoice.currency})</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {invoice.items.map((item, index) => {
                const rate = Number(item.unitPrice ?? item.price ?? 0);
                const qty = Number(item.quantity) || 0;
                const itemTotal = qty * rate;
                return (
                  <tr key={item.id || index} className="hover:bg-gray-50/50">
                    <td className="py-2 px-3 text-center text-gray-500 border-r border-gray-200">
                      {index + 1}
                    </td>
                    <td className="py-2 px-3 text-gray-900 font-medium border-r border-gray-200">
                      {item.description || <span className="text-gray-300 italic">No description</span>}
                    </td>
                    <td className="py-2 px-3 text-center text-gray-700 border-r border-gray-200">
                      {item.quantity}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-700 font-mono border-r border-gray-200">
                      {invoice.currency}{rate.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-900 font-mono font-bold">
                      {invoice.currency}{itemTotal.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. Bottom Area: Notes on Left, Totals Box on Right */}
        <div className="grid grid-cols-2 gap-6 items-start pt-2">
          {/* Terms & Notes */}
                   {/* Payment Instructions & Notes */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
              Payment Instructions & Notes:
            </p>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-[11px] text-gray-600 space-y-1">
              <p>• <span className="font-semibold text-gray-700">Payment Terms:</span> Due within 15 days</p>
              <p>• <span className="font-semibold text-gray-700">UPI / Bank:</span> payments@upi or NEFT/IMPS</p>
              {invoice.notes && (
                <p className="pt-1.5 mt-1 text-gray-800 border-t border-gray-200">
                  <span className="font-semibold text-gray-700">Note:</span> {invoice.notes}
                </p>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-gray-300 w-44 text-center text-[10px] text-gray-500 font-medium">
              Authorized Signatory
            </div>
          </div>

          {/* Calculations Summary Box */}
          <div className="border border-gray-300 rounded overflow-hidden">
            <div className="flex justify-between py-1.5 px-3 border-b border-gray-200 text-gray-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium text-gray-900">{invoice.currency}{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1.5 px-3 border-b border-gray-200 text-gray-600">
              <span>GST / Tax ({invoice.taxRate}%):</span>
              <span className="font-mono font-medium text-gray-900">{invoice.currency}{taxAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 px-3 bg-gray-100 font-bold text-gray-900 text-sm">
              <span>Total Amount:</span>
              <span className="font-mono text-blue-700">{invoice.currency}{total.toLocaleString()}</span>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
