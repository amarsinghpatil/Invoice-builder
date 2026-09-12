import { useState } from 'react'

const initialInvoiceState = {

  invoiceNumber:"INV-001",
  invoiceDate: "2024-01-01",
  currency:"₹",

  sender :{
    name: "",
    address:""
  },

  client : {
    name: "",
    address:""
  },

  items: [
    {
      id: 1,
      description:"Web Development",
      quantity: 1,
      unitPrice:5000
    }, 
    {
      id: 2,
      description:"App Development",
      quantity: 1,
      unitPrice:8000
    }, 
    {
      id :3,
      description:"Maintanace",
      quantity:2,
      unitPrice:500
    }

  ],

  taxRate: 18
  
};

function calculatesubtotal(items){
  let subtotal = 0;

  for ( let i = 0; i < items.length; i++){
    subtotal += items[i].quantity * items[i].unitPrice;
  } 

  return subtotal;
}


function App() {
  const [invoice, setInvoice] = useState(initialInvoiceState);
  const subtotal = calculatesubtotal(invoice.items);

  // Tax Amount Calculation
  const taxAmount = subtotal * (invoice.taxRate / 100);
  const total = subtotal + taxAmount;


  return (
    <>
     <div className="min-h-screen bg-[#f4f1ea] text-[#1c1917] p-8 font-sans">
        <h1 className="text-3xl font-serif font-bold mb-4">
        📰 Invoice Builder
      </h1>

      <div className="p-4 bg-white border border-[#d6d3d1] rounded-lg max-w-md">
        <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
        <p><strong>Date:</strong> {invoice.invoiceDate}</p>
        <p><strong>Currency:</strong> {invoice.currency}</p>
        <p><strong>GST Rate:</strong> {invoice.taxRate}%</p>
        <p><strong>Sub Total:</strong> {invoice.currency}{subtotal}</p>
        <p><strong>Tax Amount:</strong> {invoice.currency}{taxAmount}</p>
        <p><strong>Total:</strong> {invoice.currency}{total}</p>

        <div>
          
        </div>
      </div>
  </div>


    </> 
  );
}

export default App;
