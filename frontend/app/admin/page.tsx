"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

type Section = "overview" | "products" | "upload" | "orders";
const SIZES_LIST = ["XS", "S", "M", "L", "XL", "XXL"];

interface Product {
  id: string;
  name: string;
  category: string;
  fit: string;
  price: number;
  original_price: number | null;
  badge: string;
  sizes: string[];
  stock: number;
  images: string[];
  description: string;
  fabric: string;
  is_active: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(false);

  const [section, setSection] = useState<Section>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [revenue, setRevenue] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [imgUrls, setImgUrls] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    category: "men",
    fit: "oversized",
    price: "",
    originalPrice: "",
    stock: "",
    fabric: "",
    description: "",
    badge: "",
    sizes: [] as string[],
  });

  // ── Auth check ──────────────────────────────────────────────
  useEffect(() => {
    const saved = sessionStorage.getItem("dnr-admin-pw");
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (authenticated && password) {
      fetchProducts();
      fetchOrders();
    }
  }, [authenticated, password]);

  async function handleLogin() {
    setChecking(true);
    const ok = await adminApi.verifyPassword(password);
    if (ok) {
      sessionStorage.setItem("dnr-admin-pw", password);
      setAuthenticated(true);
      toast.success("Welcome, admin ✦");
    } else {
      toast.error("Invalid password");
    }
    setChecking(false);
  }

  function handleLogout() {
    sessionStorage.removeItem("dnr-admin-pw");
    setAuthenticated(false);
    setPassword("");
  }

  // ── Data fetching ───────────────────────────────────────────
  async function fetchProducts() {
    try {
      const data = await adminApi.getProducts(password);
      setProducts(data.products || []);
    } catch {
      toast.error("Failed to load products");
    }
  }

  async function fetchOrders() {
    try {
      const data = await adminApi.getOrders(password);
      setOrders(data.orders || []);
      setRevenue(data.revenue || 0);
    } catch {
      toast.error("Failed to load orders");
    }
  }

  function toggleSize(s: string) {
    setForm((f) => ({
      ...f,
      sizes: f.sizes.includes(s) ? f.sizes.filter((x) => x !== s) : [...f.sizes, s],
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const data = await adminApi.uploadImages(password, files);
      setImgUrls((prev) => [...prev, ...data.urls]);
      toast.success(`${files.length} image(s) uploaded ✦`);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    if (!form.name || !form.price) {
      toast.error("Name and price required");
      return;
    }
    if (!imgUrls.length) {
      toast.error("Upload at least one image");
      return;
    }
    try {
      await adminApi.createProduct(password, {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        stock: Number(form.stock) || 10,
        sizes: form.sizes.length ? form.sizes : ["S", "M", "L"],
        images: imgUrls,
      });
      toast.success(`${form.name} listed! ✦`);
      setForm({
        name: "", category: "men", fit: "oversized",
        price: "", originalPrice: "", stock: "",
        fabric: "", description: "", badge: "", sizes: [],
      });
      setImgUrls([]);
      fetchProducts();
      setSection("products");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this product? This cannot be undone.")) return;
    try {
      await adminApi.deleteProduct(password, id);
      toast.success("Product deleted");
      fetchProducts();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleToggleActive(product: Product) {
    try {
      await adminApi.updateProduct(password, product.id, { is_active: !product.is_active });
      toast.success(product.is_active ? "Product hidden from shop" : "Product visible in shop");
      fetchProducts();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleStockUpdate(product: Product, newStock: number) {
    if (isNaN(newStock) || newStock < 0) {
      toast.error("Enter a valid stock number");
      return;
    }
    try {
      await adminApi.updateProduct(password, product.id, { stock: newStock });
      toast.success(`Stock updated to ${newStock}`);
      fetchProducts();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  // ── Password Gate ───────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--beige)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[380px] bg-[var(--offwhite)] border border-[var(--border)] p-10"
        >
          <div className="text-center mb-6">
            <p className="font-serif text-2xl tracking-[0.25em] text-[var(--text)]">
              DUST<span className="text-[var(--gold)]">·</span>N
              <span className="text-[var(--gold)]">·</span>RARE
            </p>
            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-[var(--light)] mt-1">
              Admin Dashboard
            </p>
          </div>
          <div className="h-px bg-[var(--border)] mb-6" />
          <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--mid)] mb-1.5">
            Admin Password
          </label>
          <input
            className="input-base mb-4"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />
          <button
            onClick={handleLogin}
            disabled={checking || !password}
            className="w-full py-3 bg-[var(--text)] text-[var(--offwhite)] text-[0.58rem] tracking-[0.2em] uppercase font-medium hover:bg-[var(--gold)] transition-colors disabled:opacity-50"
          >
            {checking ? "Verifying..." : "Access Dashboard"}
          </button>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────
  const nav: { key: Section; icon: string; label: string }[] = [
    { key: "overview", icon: "▦", label: "Dashboard" },
    { key: "orders", icon: "◫", label: "Orders" },
    { key: "products", icon: "◈", label: "Products" },
    { key: "upload", icon: "⊕", label: "Add Product" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* SIDEBAR */}
      <aside className="w-56 bg-[var(--text)] flex flex-col flex-shrink-0 sticky top-0 h-screen">
        <div className="px-5 py-6 border-b border-white/10">
          <p className="font-serif text-base tracking-[0.2em] text-white">
            DUST<span className="text-[var(--gold)]">·</span>N
            <span className="text-[var(--gold)]">·</span>RARE
          </p>
          <p className="text-[0.42rem] tracking-[0.25em] uppercase text-white/30 mt-0.5">
            Admin Dashboard
          </p>
        </div>
        <nav className="flex-1 py-4">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => setSection(item.key)}
              className={`w-full flex items-center gap-3 px-5 py-3 text-[0.58rem] tracking-[0.1em] uppercase transition-all ${
                section === item.key
                  ? "bg-[var(--gold)]/20 text-[var(--gold)] border-l-2 border-[var(--gold)]"
                  : "text-white/50 hover:text-white/85 hover:bg-white/5"
              }`}
            >
              <span className="text-sm w-4">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-white/10">
          <p className="text-[0.48rem] tracking-widest text-white/30 mb-2 px-1">
            Admin
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-2 border border-white/10 text-[0.5rem] tracking-widest uppercase text-white/40 hover:text-white/75 hover:border-white/25 transition-all"
          >
            ← Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 bg-[var(--offwhite)] overflow-y-auto">
        <div className="flex justify-between items-center px-8 py-5 bg-[var(--offwhite)] border-b border-[var(--border)] sticky top-0 z-10">
          <h1 className="font-serif text-xl text-[var(--text)] capitalize">
            {section === "upload" ? "Add Product" : section}
          </h1>
          <button
            onClick={() => { fetchProducts(); fetchOrders(); }}
            className="text-[0.48rem] tracking-widest uppercase border border-[var(--border)] px-3 py-1.5 text-[var(--mid)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
          >
            ↻ Refresh
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {/* ── OVERVIEW ── */}
            {section === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Revenue", val: `₹${revenue.toLocaleString()}`, sub: "Confirmed+ orders", color: "text-green-600" },
                    { label: "Orders", val: String(orders.length), sub: "Total orders", color: "text-blue-600" },
                    { label: "Products", val: String(products.length), sub: `${products.filter((p) => p.stock <= 4).length} low stock`, color: "text-yellow-600" },
                    { label: "Pending", val: String(orders.filter(o => o.status === 'placed').length), sub: "Need confirmation", color: "text-orange-600" },
                  ].map((c) => (
                    <div key={c.label} className="bg-[var(--offwhite)] border border-[var(--border)] p-5">
                      <p className="text-[0.5rem] tracking-[0.25em] uppercase text-[var(--light)] mb-2">{c.label}</p>
                      <p className="font-serif text-3xl text-[var(--text)]">{c.val}</p>
                      <p className={`text-[0.52rem] mt-1 ${c.color}`}>{c.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Low Stock Alert */}
                {products.filter(p => p.stock <= 4 && p.is_active).length > 0 && (
                  <div className="mb-4 p-4 border border-yellow-200 bg-yellow-50">
                    <p className="text-[0.52rem] tracking-widest uppercase text-yellow-700 font-medium mb-2">⚠ Low Stock Alert</p>
                    <div className="flex flex-wrap gap-2">
                      {products.filter(p => p.stock <= 4 && p.is_active).map(p => (
                        <span key={p.id} className="text-[0.5rem] bg-yellow-100 text-yellow-800 px-2 py-1">
                          {p.name} — {p.stock} left
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[var(--offwhite)] border border-[var(--border)] overflow-x-auto">
                  <div className="px-5 py-4 border-b border-[var(--border)]">
                    <span className="text-[0.52rem] tracking-[0.2em] uppercase text-[var(--mid)]">Recent Orders</span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Order", "Customer", "Total", "Method", "Status"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[0.48rem] tracking-[0.25em] uppercase text-[var(--light)] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o: any, i: number) => (
                        <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--beige)]/30 transition-colors">
                          <td className="px-4 py-3 text-[0.63rem] font-medium text-[var(--text)]">{o.order_id}</td>
                          <td className="px-4 py-3 text-[0.63rem] text-[var(--mid)]">{o.customer_name || "—"}</td>
                          <td className="px-4 py-3 text-[0.63rem] text-[var(--mid)]">₹{o.total?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-[0.63rem] text-[var(--mid)] capitalize">{o.payment_method || "—"}</td>
                          <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-[0.6rem] tracking-widest uppercase text-[var(--light)]">
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── PRODUCTS ── */}
            {section === "products" && (
              <motion.div key="products" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[0.6rem] tracking-widest uppercase text-[var(--mid)]">{products.length} products</span>
                  <button onClick={() => setSection("upload")} className="btn-primary">+ Add New</button>
                </div>
                <div className="bg-[var(--offwhite)] border border-[var(--border)] overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Image", "Product", "Category", "Price", "Stock", "Status", "Visible", "Actions"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[0.48rem] tracking-[0.25em] uppercase text-[var(--light)] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <ProductRow
                          key={p.id}
                          product={p}
                          onDelete={() => handleDelete(p.id)}
                          onToggleActive={() => handleToggleActive(p)}
                          onStockUpdate={(stock) => handleStockUpdate(p, stock)}
                        />
                      ))}
                      {!products.length && (
                        <tr><td colSpan={8} className="text-center py-12 text-[0.6rem] tracking-widest uppercase text-[var(--light)]">No products yet. Add your first piece →</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── UPLOAD ── */}
            {section === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-[var(--offwhite)] border border-[var(--border)] p-6 max-w-3xl">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* IMAGE UPLOAD */}
                    <div className="md:col-span-2">
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--mid)] mb-2">Product Images</label>
                      <label className="block border-2 border-dashed border-[var(--border)] p-10 text-center cursor-pointer hover:border-[var(--gold)] hover:bg-[var(--beige)] transition-all">
                        <div className="text-3xl text-[var(--light)] mb-2">⊕</div>
                        <p className="text-[0.58rem] tracking-widest uppercase text-[var(--mid)]">
                          {uploading ? "Uploading..." : "Click to upload images"}
                        </p>
                        <p className="text-[0.5rem] text-[var(--light)] mt-1">Front · Back · Detail · On-Model (max 5MB each)</p>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                      </label>

                      {imgUrls.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-3">
                          {imgUrls.map((url, i) => (
                            <div key={i} className="relative w-16 h-20 overflow-hidden border border-[var(--border)] group">
                              <Image src={url} alt="" fill className="object-cover" />
                              <button
                                onClick={() => setImgUrls((u) => u.filter((_, j) => j !== i))}
                                className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[0.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* TEXT FIELDS */}
                    {[
                      { label: "Product Name", key: "name", type: "text", placeholder: "e.g. Void Oversized Jacket" },
                      { label: "Price (₹)", key: "price", type: "number", placeholder: "2500" },
                      { label: "Original Price (₹)", key: "originalPrice", type: "number", placeholder: "3500 (leave blank if no sale)" },
                      { label: "Stock Quantity", key: "stock", type: "number", placeholder: "15" },
                      { label: "Fabric & Details", key: "fabric", type: "text", placeholder: "240 GSM Cotton · Soft-washed finish" },
                    ].map((f) => (
                      <div key={f.key}>
                        <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--mid)] mb-1.5">{f.label}</label>
                        <input
                          className="input-base"
                          type={f.type}
                          placeholder={f.placeholder}
                          value={(form as any)[f.key]}
                          onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
                        />
                      </div>
                    ))}

                    {/* SELECTS */}
                    <div>
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--mid)] mb-1.5">Category</label>
                      <select className="input-base" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="surplus">Surplus</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--mid)] mb-1.5">Fit Type</label>
                      <select className="input-base" value={form.fit} onChange={(e) => setForm((f) => ({ ...f, fit: e.target.value }))}>
                        <option value="oversized">Oversized</option>
                        <option value="regular">Regular</option>
                        <option value="slim">Slim</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--mid)] mb-1.5">Badge</label>
                      <select className="input-base" value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}>
                        <option value="">None</option>
                        <option value="New">New</option>
                        <option value="Limited">Limited</option>
                        <option value="Drop 01">Drop 01</option>
                        <option value="Surplus">Surplus</option>
                      </select>
                    </div>

                    {/* SIZES */}
                    <div>
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--mid)] mb-1.5">Available Sizes</label>
                      <div className="flex gap-2 flex-wrap">
                        {SIZES_LIST.map((s) => (
                          <button
                            key={s} type="button" onClick={() => toggleSize(s)}
                            className={`w-10 h-10 border text-[0.55rem] font-medium transition-all ${
                              form.sizes.includes(s)
                                ? "border-[var(--text)] bg-[var(--text)] text-[var(--offwhite)]"
                                : "border-[var(--border)] text-[var(--mid)] hover:border-[var(--text)]"
                            }`}
                          >{s}</button>
                        ))}
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="md:col-span-2">
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--mid)] mb-1.5">Product Description</label>
                      <textarea
                        className="input-base resize-none h-24"
                        placeholder="Describe the piece — vibe, inspiration, styling notes..."
                        value={form.description}
                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      />
                    </div>

                    {/* SUBMIT */}
                    <div className="md:col-span-2">
                      <button onClick={handleSubmit} disabled={uploading} className="btn-primary px-8 py-4 text-sm disabled:opacity-50">
                        List Product →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── ORDERS ── */}
            {section === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-[var(--offwhite)] border border-[var(--border)] overflow-x-auto">
                  <div className="px-5 py-4 border-b border-[var(--border)] flex justify-between items-center">
                    <span className="text-[0.52rem] tracking-[0.2em] uppercase text-[var(--mid)]">All Orders ({orders.length})</span>
                    <span className="text-[0.5rem] text-[var(--light)]">Revenue from confirmed orders: <strong className="text-[var(--gold)]">₹{revenue.toLocaleString()}</strong></span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Order", "Date", "Customer", "Phone", "Total", "Tracking", "Status", "Action"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[0.48rem] tracking-[0.25em] uppercase text-[var(--light)] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((o: any) => (
                          <tr key={o.id} className="border-b border-[var(--border)] hover:bg-[var(--beige)]/30 transition-colors">
                            <td className="px-4 py-3 text-[0.63rem] font-medium text-[var(--text)]">{o.order_id}</td>
                            <td className="px-4 py-3 text-[0.6rem] text-[var(--mid)]">
                              {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </td>
                            <td className="px-4 py-3 text-[0.63rem] text-[var(--mid)]">{o.customer_name || "—"}</td>
                            <td className="px-4 py-3 text-[0.6rem] text-[var(--mid)]">{o.customer_phone || "—"}</td>
                            <td className="px-4 py-3 text-[0.65rem] font-medium text-[var(--text)]">₹{o.total?.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <input
                                defaultValue={o.tracking_number || ""}
                                onBlur={async (e) => {
                                  try {
                                    await adminApi.updateOrder(password, o.id, { tracking_number: e.target.value });
                                    toast.success("Tracking updated");
                                    fetchOrders();
                                  } catch { toast.error("Failed to update tracking"); }
                                }}
                                placeholder="Tracking #"
                                className="w-24 border border-[var(--border)] text-[0.5rem] px-2 py-1 bg-transparent text-[var(--mid)] outline-none focus:border-[var(--gold)]"
                              />
                            </td>
                            <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                            <td className="px-4 py-3">
                              <select
                                defaultValue={o.status}
                                onChange={async (e) => {
                                  try {
                                    await adminApi.updateOrder(password, o.id, { status: e.target.value });
                                    toast.success("Status updated");
                                    fetchOrders();
                                  } catch { toast.error("Failed to update status"); }
                                }}
                                className="border border-[var(--border)] text-[0.5rem] px-2 py-1 bg-transparent text-[var(--mid)] outline-none focus:border-[var(--gold)]"
                              >
                                {["placed", "confirmed", "packed", "shipped", "delivered", "cancelled"].map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-[0.6rem] tracking-widest uppercase text-[var(--light)]">
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// ── Product Row with inline stock edit ──────────────────────
function ProductRow({
  product,
  onDelete,
  onToggleActive,
  onStockUpdate,
}: {
  product: Product;
  onDelete: () => void;
  onToggleActive: () => void;
  onStockUpdate: (stock: number) => void;
}) {
  const [stockVal, setStockVal] = useState(String(product.stock));

  return (
    <tr className="border-b border-[var(--border)] hover:bg-[var(--beige)]/30 transition-colors">
      <td className="px-4 py-3">
        <div className="w-10 h-14 overflow-hidden bg-[var(--beige)]">
          {product.images?.[0] && (
            <Image src={product.images[0]} alt={product.name} width={40} height={56} className="object-cover w-full h-full" />
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-serif text-[0.9rem] text-[var(--text)]">{product.name}</p>
        <p className="text-[0.48rem] text-[var(--light)] uppercase tracking-wider mt-0.5">{product.fit}</p>
      </td>
      <td className="px-4 py-3 text-[0.62rem] text-[var(--mid)] capitalize">{product.category}</td>
      <td className="px-4 py-3 text-[0.65rem] font-medium">
        <span>₹{product.price.toLocaleString()}</span>
        {product.original_price && (
          <span className="line-through text-[var(--light)] ml-1 text-[0.55rem]">₹{product.original_price.toLocaleString()}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={stockVal}
            onChange={(e) => setStockVal(e.target.value)}
            onBlur={() => onStockUpdate(Number(stockVal))}
            className={`w-14 border text-[0.6rem] px-2 py-1 bg-transparent outline-none focus:border-[var(--gold)] ${
              product.stock <= 4 ? "border-yellow-400 text-yellow-700" : "border-[var(--border)] text-[var(--mid)]"
            }`}
          />
        </div>
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={product.stock > 0 ? "active" : "oos"} />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onToggleActive}
          className={`text-[0.44rem] tracking-widest uppercase px-2.5 py-1 border transition-all ${
            product.is_active
              ? "border-green-300 text-green-600 hover:bg-red-50 hover:border-red-300 hover:text-red-500"
              : "border-red-200 text-red-400 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
          }`}
        >
          {product.is_active ? "Visible" : "Hidden"}
        </button>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onDelete}
          className="text-[0.48rem] tracking-widest uppercase border border-[var(--border)] px-2 py-1 text-[var(--mid)] hover:border-red-400 hover:text-red-400 transition-all"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

// ── Status Badge Component ──────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    placed: "bg-yellow-50 text-yellow-700",
    confirmed: "bg-blue-50 text-blue-700",
    packed: "bg-indigo-50 text-indigo-700",
    shipped: "bg-[var(--sage)]/40 text-green-700",
    delivered: "bg-[var(--gold)]/15 text-yellow-800",
    cancelled: "bg-red-50 text-red-500",
    active: "bg-green-50 text-green-600",
    oos: "bg-red-50 text-red-400",
  };
  return (
    <span className={`text-[0.44rem] tracking-widest uppercase px-2.5 py-1 ${colors[status] || "bg-gray-50 text-gray-500"}`}>
      {status}
    </span>
  );
}
