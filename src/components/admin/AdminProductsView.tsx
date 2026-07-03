import React, { useState } from "react";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Tag, 
  Edit, 
  Trash2, 
  Download, 
  RefreshCw, 
  UploadCloud,
  FileSpreadsheet
} from "lucide-react";
import { Product, ShippingOrigin, CurrencyConfig } from "../../types";

interface AdminProductsViewProps {
  products: Product[];
  currency: CurrencyConfig;
  formatPrice: (price: number) => string;
  onAddProduct: (prodData: any) => Promise<boolean>;
  onEditProduct: (id: string, updatedData: any) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
}

export default function AdminProductsView({
  products,
  currency,
  formatPrice,
  onAddProduct,
  onEditProduct,
  onDeleteProduct
}: AdminProductsViewProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [originFilter, setOriginFilter] = useState("all");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Gifts");
  const [originalPrice, setOriginalPrice] = useState("2500");
  const [discountedPrice, setDiscountedPrice] = useState("1800");
  const [origin, setOrigin] = useState<"BD" | "China">("BD");
  const [stockCount, setStockCount] = useState("45");
  const [shippingCost, setShippingCost] = useState("80");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");

  // Simulated import states
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("Gifts");
    setOriginalPrice("2500");
    setDiscountedPrice("1800");
    setOrigin("BD");
    setStockCount("45");
    setShippingCost("80");
    setImage("");
    setTags("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleCreateOrEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prodObj = {
      name,
      description,
      category,
      originalPrice: parseFloat(originalPrice),
      discountedPrice: parseFloat(discountedPrice),
      origin: origin === "China" ? ShippingOrigin.CHINA : ShippingOrigin.BANGLADESH,
      stockCount: parseInt(stockCount),
      shippingCost: parseInt(shippingCost),
      image: image || "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=400",
      tags: tags.split(",").map(t => t.trim()).filter(Boolean)
    };

    let success = false;
    if (editingId) {
      success = await onEditProduct(editingId, prodObj);
    } else {
      success = await onAddProduct(prodObj);
    }

    if (success) {
      resetForm();
    }
  };

  const handleStartEdit = (p: Product) => {
    setEditingId(p.id);
    setIsAdding(true);
    setName(p.name);
    setDescription(p.description);
    setCategory(p.category);
    setOriginalPrice(String(p.originalPrice));
    setDiscountedPrice(String(p.discountedPrice));
    setOrigin(p.origin === ShippingOrigin.CHINA ? "China" : "BD");
    setStockCount(String(p.stockCount));
    setShippingCost(String(p.shippingCost));
    setImage(p.image);
    setTags(p.tags.join(", "));
  };

  const simulateExcelImport = () => {
    setImportStatus("Reading spreadsheet bulk records...");
    setTimeout(() => {
      setImportStatus("Matching columns with inventory schema...");
      setTimeout(() => {
        // Mock add a product
        onAddProduct({
          name: "Direct Sourced Ceramic Gaiwan Matcha Tea Set",
          description: "An authentic, heat-retaining Chinese tea strainer and gaiwan drinking glass.",
          category: "Home & Kitchen",
          originalPrice: 3800,
          discountedPrice: 2400,
          origin: ShippingOrigin.CHINA,
          stockCount: 120,
          shippingCost: 150,
          image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400",
          tags: ["matcha", "tea", "traditional"]
        });
        setImportStatus("✅ Success! Registered Gaiwan Tea Set into China Factory Supplier Depot listing.");
        setTimeout(() => setImportStatus(null), 4000);
      }, 1500);
    }, 1200);
  };

  // Filter products logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    const matchesOrigin = originFilter === "all" || 
                          (originFilter === "BD" && p.origin === ShippingOrigin.BANGLADESH) ||
                          (originFilter === "China" && p.origin === ShippingOrigin.CHINA);

    return matchesSearch && matchesCategory && matchesOrigin;
  });

  return (
    <div className="space-y-6">
      {/* Search and filters controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row gap-3.5 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search items catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-[#E53935] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category drop */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3.5 rounded-xl outline-none"
          >
            <option value="all">📁 All Categories</option>
            <option value="Gifts">Gifts</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Kitchen">Home & Kitchen</option>
            <option value="Smart Gadgets">Smart Gadgets</option>
            <option value="Fashion">Fashion</option>
          </select>

          {/* Origin drop */}
          <select
            value={originFilter}
            onChange={(e) => setOriginFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs py-2 px-3.5 rounded-xl outline-none"
          >
            <option value="all">🌏 All Fulfillment Origins</option>
            <option value="BD">🇧🇩 BD Local Stock</option>
            <option value="China">🇨🇳 Ships Direct from China</option>
          </select>

          <button
            onClick={() => {
              resetForm();
              setIsAdding(true);
            }}
            className="ml-auto md:ml-0 bg-[#1C1C1E] hover:bg-[#E53935] text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Simulated Excel Upload Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
          <div>
            <h4 className="text-xs font-bold text-slate-700">Wholesale Sourcing Bulk Importer</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Directly map and import supplier spreadsheet lists into our active catalog database schema.</p>
          </div>
        </div>
        <div>
          <button
            onClick={simulateExcelImport}
            className="bg-white hover:bg-slate-100 text-slate-800 text-[11px] font-bold py-2 px-4 border border-slate-200 rounded-xl flex items-center gap-2 shadow-xs"
          >
            <UploadCloud className="w-4 h-4 text-[#E53935]" /> Import Supplier Sheet (.XLSX)
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-xs text-sky-800 animate-pulse font-medium">
          {importStatus}
        </div>
      )}

      {/* Product edit/add form */}
      {isAdding && (
        <form onSubmit={handleCreateOrEdit} className="bg-white border border-[#E53935]/20 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3">
            {editingId ? "✍️ Edit Product Metadata" : "🆕 Register New Catalog Sku"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product title"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs outline-none"
              >
                <option value="Gifts">Gifts</option>
                <option value="Electronics">Electronics</option>
                <option value="Home & Kitchen">Home & Kitchen</option>
                <option value="Smart Gadgets">Smart Gadgets</option>
                <option value="Fashion">Fashion</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Origin Warehouse</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs outline-none"
              >
                <option value="BD">Bangladesh Local Warehouse</option>
                <option value="China">China Supplier Hub (Imported)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Original BDT Price</label>
              <input
                type="number"
                required
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Discount Offer Price</label>
              <input
                type="number"
                required
                value={discountedPrice}
                onChange={(e) => setDiscountedPrice(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Stock Count (Units)</label>
              <input
                type="number"
                required
                value={stockCount}
                onChange={(e) => setStockCount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Fulfillment Delivery Cost (BDT)</label>
              <input
                type="number"
                required
                value={shippingCost}
                onChange={(e) => setShippingCost(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Product Main Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Comma Separated Tags</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. key, gadget, red"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3.5 text-xs outline-none focus:border-[#E53935]"
              />
            </div>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1.5">Description Specification Logs</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Supply specs details..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs outline-none focus:border-[#E53935] h-16"
            />
          </div>
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2 px-4 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#E53935] hover:bg-red-700 text-white text-xs font-bold py-2 px-5 rounded-xl text-center"
            >
              {editingId ? "Save Sku Changes" : "Create Product Sku"}
            </button>
          </div>
        </form>
      )}

      {/* Main Table view */}
      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#1C1C1E] text-white text-[10px] uppercase font-bold font-mono">
              <tr>
                <th className="py-3 px-4">Catalog Item Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Fulfillment Hub</th>
                <th className="py-3 px-4 text-right">Price Grid</th>
                <th className="py-3 px-4 text-right">Remaining Stock</th>
                <th className="py-3 px-4 text-center">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
              {filteredProducts.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                    <div>
                      <p className="font-semibold text-slate-800 line-clamp-1">{p.name}</p>
                      <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{p.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{p.category}</td>
                  <td className="py-3 px-4">
                    {p.origin === ShippingOrigin.BANGLADESH ? (
                      <span className="bg-emerald-50 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        🇧🇩 BD Warehouse
                      </span>
                    ) : (
                      <span className="bg-sky-50 text-sky-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                        🇨🇳 China Direct
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-bold text-slate-800 font-mono block">{formatPrice(p.discountedPrice)}</span>
                    <span className="text-[10px] line-through text-slate-400 font-mono">{formatPrice(p.originalPrice)}</span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold">
                    <span className={p.stockCount <= 10 ? "text-amber-500 bg-amber-50 px-2 py-0.5 rounded" : "text-slate-800"}>
                      {p.stockCount} left
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center items-center gap-1.5">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-1 text-slate-450 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-1 text-slate-450 hover:text-[#E53935] hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Sku"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
