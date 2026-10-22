function InvoiceForm({ invoice, setInvoice}) {

    function handleInvoiceNumberChange(event) {
    
    setInvoice({
       ...invoice, 
       invoiceNumber: event.target.value
     });
    }

    function datehandle(event){

        setInvoice({...invoice, 
            invoiceDate: event.target.value});
    }

    function handleSenderNameChanged(event) {
        setInvoice({
            ...invoice,
            sender:{
                ...invoice.sender,
                name:event.target.value
            }
        })
    }

    function handlesenderEmailChange(event){
        setInvoice({
            ...invoice,
            sender:{ 
                ...invoice.sender,
                email: event.target.value
            }
        })
    }

    function handleSenderAddressChange(event) {
        setInvoice({
            ...invoice,
            sender: {
                ...invoice.sender,
                address: event.target.value
            }
        })
    }

    function handleClientNameChange(event) {
        setInvoice({
            ...invoice,
            client: {
                ...invoice.client,
                name: event.target.value
            }
        })
    }

    function handleClientEmailChange(event) {
        setInvoice({
            ...invoice,
            client: {
                ...invoice.client,
                email: event.target.value
            }
        })
    }

    function handleClientAddressChange(event) {
        setInvoice({
            ...invoice,
            client: {
                ...invoice.client,
                address: event.target.value
            }
        })
    }

    function handleItemChange(index, event){
        const updateditems = invoice.items.map((item, i) =>
            i === index ? { ...item, description: event.target.value } : item
        );
        setInvoice({
            ...invoice,
            items: updateditems
        });
    }

    function handleItemQuantityChange(index, event){
        const updateditems = invoice.items.map((item, i) =>
            i === index ? { ...item, quantity: event.target.value } : item
        );
        setInvoice({
            ...invoice,
            items: updateditems
        });
    }

    function handleItemPriceChange(index, event){
        const updateditems = invoice.items.map((item, i) =>
            i === index ? { ...item, unitPrice: event.target.value } : item
        );
        setInvoice({
            ...invoice,
            items: updateditems
        });
    }
    
    function handleAddItem(){
        const newitem = {
            id:Date.now(),
            description:"",
            quantity:1,
            unitPrice:0
        }

        setInvoice({
            ...invoice,
            items:[...invoice.items, newitem]
        })

    }

    function handleDeleteItem(indextoDelete){
        const updateditems = invoice.items.filter((items, index) => index !== indextoDelete);
        setInvoice({
            ...invoice,
            items:updateditems  
        })
    }

    function taxratechange(event){
        setInvoice({
            ...invoice,
            taxRate:event.target.value
        })
    }

    function handleNoteChange(event){
        setInvoice({
            ...invoice,
            notes:event.target.value
        })
    }
     
    return (

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            {/* Invoice Metadata: Number & Date Side-by-Side */}
            <div className="flex flex-wrap items-center gap-6 pb-2">
                {/* Invoice Number */}
                <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                        Invoice #:
                    </label>
                    <input
                        type="text"
                        placeholder="INV-001"
                        value={invoice.invoiceNumber}
                        onChange={handleInvoiceNumberChange}
                        className="w-32 px-2.5 py-1 border border-gray-300 rounded text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>

                {/* Invoice Date */}
                <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-600 uppercase whitespace-nowrap">
                        Date:
                    </label>
                    <input
                        type="date"
                        value={invoice.invoiceDate}
                        onChange={datehandle}
                        onClick={(e) => e.target.showPicker?.()}
                        className="w-36 px-2.5 py-1 border border-gray-300 rounded text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer bg-white"
                    />
                </div>
            </div>



          {/* Parties Involved: Client on Left, Sender on Right */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">

    {/* LEFT COLUMN: Client ("Bill To") */}
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">📍 Bill To (Client)</h3>
        
        <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Client Name</label>
            <input
                type="text"
                placeholder="Client / Company Name"
                value={invoice.client.name}
                onChange={handleClientNameChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>

        <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Client Email</label>
            <input
                type="text"
                placeholder="client@company.com"
                value={invoice.client.email}
                onChange={handleClientEmailChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>

        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Client Address</label>
            <input
                type="text"
                placeholder="Client Street Address"
                value={invoice.client.address}
                onChange={handleClientAddressChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    </div>

    {/* RIGHT COLUMN: Sender ("From") */}
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-800 text-sm mb-3">🏢 From (Your Business)</h3>
        
        <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Your Business Name</label>
            <input
                type="text"
                placeholder="Your Business Name"
                value={invoice.sender.name}
                onChange={handleSenderNameChanged}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>

        <div className="mb-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">Your Email</label>
            <input
                type="text"
                placeholder="billing@yourbiz.com"
                value={invoice.sender.email}
                onChange={handlesenderEmailChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>

        <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Your Address</label>
            <input
                type="text"
                placeholder="Your Street Address"
                value={invoice.sender.address}
                onChange={handleSenderAddressChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>
    </div>

</div>


          {/* Section: Items Table */}
<div className="mt-4">
        <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Items & Services</h3>
        
        {/* Small 2-digit Tax Box */}
        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-200">
            <span className="text-xs font-semibold text-gray-600">Tax:</span>
            <input
                type="number"
                value={invoice.taxRate}
                onChange={taxratechange}
                className="w-14 px-1.5 py-0.5 text-center font-medium border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-xs font-bold text-gray-500">%</span>
        </div>
    </div>


    {/* Table Column Headers */}
    <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase mb-2 px-1">
        <div className="col-span-6">Description</div>
        <div className="col-span-2">Qty</div>
        <div className="col-span-3">Price (₹)</div>
        <div className="col-span-1 text-center"></div>
    </div>

    {/* Each Item on ONE clean horizontal line with scrollable container for items */}
    <div className="border border-gray-200 rounded-md p-2 space-y-2 bg-gray-50/50 max-h-56 overflow-y-auto pr-1">   

    {invoice.items.map((items, index) => (
        <div key={items.id} 
        className="grid grid-cols-12 gap-2 items-center mb-2">
            
            {/* Description (takes 6 columns) */}
            <div className="col-span-6">
                <input
                    type="text"
                    placeholder="Item name / service"
                    value={items.description}
                    onChange={(event) => handleItemChange(index, event)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
            </div>
        
            {/* Quantity (takes 2 columns) */}
            <div className="col-span-2">
                <input
                    type="number"
                    value={items.quantity}
                    onChange={(event) => handleItemQuantityChange(index, event)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-center"
                />
            </div>

            {/* Price (takes 3 columns) */}
            <div className="col-span-3">
                <input
                    type="number"
                    value={items.unitPrice}
                    onChange={(event) => handleItemPriceChange(index, event)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
            </div>

            {/* Delete Button (takes 1 column) */}
            <div className="col-span-1 text-center">
                <button
                    type="button"
                    title="Delete item"
                    onClick={() => handleDeleteItem(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors text-sm font-bold"
                >
                    ✕
                </button>
            </div>

        </div>
    ))}
    </div>

    {/* Add Item Button - Compact Rectangle */}
    <div className="mt-2.5 flex justify-start">
        <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded border border-gray-300 shadow-sm transition-colors cursor-pointer"
        >
            ➕ Add Item
        </button>
    </div>
</div>

   
    
        {/* Notes */}
    <div className="mt-4">
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
            Notes
        </label>
        <input
            type="text"
            placeholder="e.g. Payment due in 15 days"
            value={invoice.notes}
            onChange={handleNoteChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
    </div>
    </div>
    
    );
}
    
export default InvoiceForm; 