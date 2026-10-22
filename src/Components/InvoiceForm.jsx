function InvoiceForm({ invoice, setInvoice}) {

    function handleInvoiceNumberChange(event) {
        setInvoice({
            ...invoice, 
            invoiceNumber: event.target.value.slice(0, 20)
        });
    }

    function datehandle(event){
        setInvoice({
            ...invoice, 
            invoiceDate: event.target.value
        });
    }

    function handleSenderNameChanged(event) {
        setInvoice({
            ...invoice,
            sender: {
                ...invoice.sender,
                name: event.target.value.slice(0, 45)
            }
        });
    }

    function handlesenderEmailChange(event){
        setInvoice({
            ...invoice,
            sender: { 
                ...invoice.sender,
                email: event.target.value.slice(0, 45)
            }
        });
    }

    function handleSenderAddressChange(event) {
        setInvoice({
            ...invoice,
            sender: {
                ...invoice.sender,
                address: event.target.value.slice(0, 80)
            }
        });
    }

    function handleClientNameChange(event) {
        setInvoice({
            ...invoice,
            client: {
                ...invoice.client,
                name: event.target.value.slice(0, 45)
            }
        });
    }

    function handleClientEmailChange(event) {
        setInvoice({
            ...invoice,
            client: {
                ...invoice.client,
                email: event.target.value.slice(0, 45)
            }
        });
    }

    function handleClientAddressChange(event) {
        setInvoice({
            ...invoice,
            client: {
                ...invoice.client,
                address: event.target.value.slice(0, 80)
            }
        });
    }

    function handleItemChange(index, event){
        const updateditems = invoice.items.map((item, i) =>
            i === index ? { ...item, description: event.target.value.slice(0, 45) } : item
        );
        setInvoice({
            ...invoice,
            items: updateditems
        });
    }

    function handleItemQuantityChange(index, event){
        const val = event.target.value;
        const num = val === '' ? '' : Math.max(1, Math.min(9999, parseInt(val, 10) || 1));
        const updateditems = invoice.items.map((item, i) =>
            i === index ? { ...item, quantity: num } : item
        );
        setInvoice({
            ...invoice,
            items: updateditems
        });
    }

    function handleItemPriceChange(index, event){
        const val = event.target.value;
        const num = val === '' ? '' : Math.max(0, Math.min(9999999, parseFloat(val) || 0));
        const updateditems = invoice.items.map((item, i) =>
            i === index ? { ...item, unitPrice: num } : item
        );
        setInvoice({
            ...invoice,
            items: updateditems
        });
    }
    
    function handleAddItem(){
        if (invoice.items.length >= 8) {
            alert("Maximum 8 items allowed to guarantee a clean, uncompromised single-page A4 layout.");
            return;
        }
        const newitem = {
            id: Date.now(),
            description: "",
            quantity: 1,
            unitPrice: 0
        };

        setInvoice({
            ...invoice,
            items: [...invoice.items, newitem]
        });
    }

    function handleDeleteItem(indextoDelete){
        if (invoice.items.length <= 1) {
            // Keep at least one item row
            const resetItems = [{
                id: Date.now(),
                description: "",
                quantity: 1,
                unitPrice: 0
            }];
            setInvoice({
                ...invoice,
                items: resetItems
            });
            return;
        }
        const updateditems = invoice.items.filter((items, index) => index !== indextoDelete);
        setInvoice({
            ...invoice,
            items: updateditems  
        });
    }

    function taxratechange(event){
        const val = event.target.value;
        if (val === '') {
            setInvoice({ ...invoice, taxRate: '' });
            return;
        }
        const num = Math.max(0, Math.min(100, Math.round(Number(val) * 10) / 10));
        setInvoice({
            ...invoice,
            taxRate: num
        });
    }

    function handleNoteChange(event){
        setInvoice({
            ...invoice,
            notes: event.target.value.slice(0, 100)
        });
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
                        maxLength={20}
                        value={invoice.invoiceNumber}
                        onChange={handleInvoiceNumberChange}
                        className="w-36 px-2.5 py-1 border border-gray-300 rounded text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Client Name</label>
                <span className="text-[10px] text-gray-400">max 45</span>
            </div>
            <input
                type="text"
                placeholder="Client / Company Name"
                maxLength={45}
                value={invoice.client.name}
                onChange={handleClientNameChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>

        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Client Email</label>
                <span className="text-[10px] text-gray-400">max 45</span>
            </div>
            <input
                type="email"
                placeholder="client@company.com"
                maxLength={45}
                value={invoice.client.email}
                onChange={handleClientEmailChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>

        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Client Address</label>
                <span className="text-[10px] text-gray-400">max 80</span>
            </div>
            <input
                type="text"
                placeholder="Client Street Address"
                maxLength={80}
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
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Your Business Name</label>
                <span className="text-[10px] text-gray-400">max 45</span>
            </div>
            <input
                type="text"
                placeholder="Your Business Name"
                maxLength={45}
                value={invoice.sender.name}
                onChange={handleSenderNameChanged}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>

        <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Your Email</label>
                <span className="text-[10px] text-gray-400">max 45</span>
            </div>
            <input
                type="email"
                placeholder="billing@yourbiz.com"
                maxLength={45}
                value={invoice.sender.email}
                onChange={handlesenderEmailChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
        </div>

        <div>
            <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-medium text-gray-600">Your Address</label>
                <span className="text-[10px] text-gray-400">max 80</span>
            </div>
            <input
                type="text"
                placeholder="Your Street Address"
                maxLength={80}
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
        <h3 className="font-semibold text-gray-800">
            Items & Services <span className="text-xs font-normal text-gray-500">({invoice.items.length}/8 items)</span>
        </h3>
        
        {/* Small 2-digit Tax Box */}
        <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded border border-gray-200">
            <span className="text-xs font-semibold text-gray-600">Tax:</span>
            <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={invoice.taxRate}
                onChange={taxratechange}
                className="w-14 px-1.5 py-0.5 text-center font-medium border border-gray-300 rounded text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <span className="text-xs font-bold text-gray-500">%</span>
        </div>
    </div>

    {/* Table Column Headers */}
    <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase mb-2 px-1">
        <div className="col-span-6">Description <span className="text-[9px] lowercase font-normal">(max 45)</span></div>
        <div className="col-span-2 text-center">Qty</div>
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
                    maxLength={45}
                    value={items.description}
                    onChange={(event) => handleItemChange(index, event)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
            </div>
        
            {/* Quantity (takes 2 columns) */}
            <div className="col-span-2">
                <input
                    type="number"
                    min="1"
                    max="9999"
                    value={items.quantity}
                    onChange={(event) => handleItemQuantityChange(index, event)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-center font-mono"
                />
            </div>

            {/* Price (takes 3 columns) */}
            <div className="col-span-3">
                <input
                    type="number"
                    min="0"
                    max="9999999"
                    value={items.unitPrice}
                    onChange={(event) => handleItemPriceChange(index, event)}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-mono"
                />
            </div>

            {/* Delete Button (takes 1 column) */}
            <div className="col-span-1 text-center">
                <button
                    type="button"
                    title={invoice.items.length <= 1 ? "Reset item" : "Delete item"}
                    onClick={() => handleDeleteItem(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors text-sm font-bold cursor-pointer"
                >
                    ✕
                </button>
            </div>

        </div>
    ))}
    </div>

    {/* Add Item Button */}
    <div className="mt-2.5 flex justify-between items-center">
        <button
            type="button"
            onClick={handleAddItem}
            disabled={invoice.items.length >= 8}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border shadow-sm transition-colors ${
              invoice.items.length >= 8
                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                : "bg-white hover:bg-gray-100 text-gray-700 border-gray-300 cursor-pointer"
            }`}
        >
            {invoice.items.length >= 8 ? "🔒 8/8 Items (Max Limit)" : `➕ Add Item (${invoice.items.length}/8)`}
        </button>

        <span className="text-[11px] text-gray-400">
            A4 optimized: 1–8 items
        </span>
    </div>
</div>
    
    {/* Notes */}
    <div className="mt-4">
        <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-600 uppercase">
                Notes / Terms
            </label>
            <span className={`text-[10px] ${invoice.notes?.length >= 95 ? 'text-amber-600 font-bold' : 'text-gray-400'}`}>
                {invoice.notes?.length || 0}/100 chars
            </span>
        </div>
        <input
            type="text"
            placeholder="e.g. Payment due in 15 days via UPI / NEFT"
            maxLength={100}
            value={invoice.notes}
            onChange={handleNoteChange}
            className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
    </div>
    </div>
    
    );
}
    
export default InvoiceForm; 