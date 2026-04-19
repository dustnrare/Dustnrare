"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { adminApi } from "@/lib/api";
import toast from "react-hot-toast";

type Section = "overview" | "products" | "upload" | "orders" | "lookbook" | "coupons" | "testimonials";
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

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order: number;
  max_uses: number;
  used_count: number;
  is_active: boolean;
  expires_at: string | null;
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
  const [lookbook, setLookbook] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Coupon form
  const [couponForm, setCouponForm] = useState({
    code: "",
    discount_type: "percentage" as 'percentage' | 'flat',
    discount_value: "",
    min_order: "",
    max_uses: "",
    expires_at: "",
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
      fetchLookbook();
      fetchCoupons();
      fetchTestimonials();
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
      const res = await fetch('/api/admin/orders', {
        headers: { 'x-admin-password': password },
      })
      if (res.status === 401) {
        toast.error('Admin password rejected')
        return
      }
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        toast.error(`Orders API error: ${errData.message || res.status}`)
        return
      }
      const data = await res.json()
      setOrders(data.orders || [])
      setRevenue(data.revenue || 0)
    } catch (err: any) {
      console.error('Orders fetch error:', err)
      toast.error('Failed to load orders')
    }
  }

  async function fetchLookbook() {
    try {
      const data = await adminApi.getLookbook(password);
      setLookbook(data);
    } catch {
      toast.error("Failed to load lookbook");
    }
  }

  async function fetchCoupons() {
    try {
      const data = await adminApi.getCoupons(password);
      setCoupons(data);
    } catch {
      toast.error("Failed to load coupons");
    }
  }

  async function fetchTestimonials() {
    try {
      const data = await adminApi.getTestimonials(password);
      setTestimonials(data);
    } catch {
      toast.error("Failed to load testimonials");
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

  // Coupon handlers
  async function handleCreateCoupon() {
    if (!couponForm.code || !couponForm.discount_value) {
      toast.error("Code and value are required"); return;
    }
    try {
      await adminApi.createCoupon(password, {
        code: couponForm.code,
        discount_type: couponForm.discount_type,
        discount_value: Number(couponForm.discount_value),
        min_order: couponForm.min_order ? Number(couponForm.min_order) : 0,
        max_uses: couponForm.max_uses ? Number(couponForm.max_uses) : -1,
        expires_at: couponForm.expires_at || undefined,
      });
      toast.success("Coupon created ✦");
      setCouponForm({ code: "", discount_type: "percentage", discount_value: "", min_order: "", max_uses: "", expires_at: "" });
      fetchCoupons();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleToggleCoupon(coupon: Coupon) {
    try {
      await adminApi.updateCoupon(password, coupon.id, { is_active: !coupon.is_active });
      toast.success(coupon.is_active ? "Coupon deactivated" : "Coupon activated");
      fetchCoupons();
    } catch { toast.error("Failed"); }
  }

  async function handleDeleteCoupon(id: string) {
    if (!confirm("Delete this coupon?")) return;
    try {
      await adminApi.deleteCoupon(password, id);
      toast.success("Coupon deleted");
      fetchCoupons();
    } catch { toast.error("Failed"); }
  }

  // ── Password Gate ───────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[380px] bg-[var(--bg-elevated)] border border-[var(--border)] p-10"
        >
          <div className="text-center mb-6">
            <p className="font-serif text-2xl tracking-[0.25em] text-[var(--text)]">
              DUST<span className="text-[var(--gold)]">·</span>N
              <span className="text-[var(--gold)]">·</span>RARE
            </p>
            <p className="text-[0.5rem] tracking-[0.3em] uppercase text-[var(--text-muted)] mt-1">
              Admin Dashboard
            </p>
          </div>
          <div className="h-px bg-[var(--border)] mb-6" />
          <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">
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
            className="w-full py-3 bg-[var(--gold)] text-[var(--bg)] text-[0.58rem] tracking-[0.2em] uppercase font-medium hover:bg-[var(--gold-light)] transition-colors disabled:opacity-50"
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
    { key: "coupons", icon: "✦", label: "Coupons" },
    { key: "lookbook", icon: "◭", label: "Lookbook" },
    { key: "testimonials", icon: "T", label: "Testimonials" },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative">
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[var(--bg)] text-[var(--text)] sticky top-0 z-50 border-b border-[var(--border)]">
        <p className="font-serif tracking-[0.2em] text-sm">DUST·N·RARE <span className="text-[var(--gold)]">Admin</span></p>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-xl text-[var(--gold)]">
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`${menuOpen ? "flex" : "hidden"} md:flex w-full md:w-56 bg-[var(--bg)] flex-col flex-shrink-0 md:sticky md:top-0 h-auto md:h-screen absolute md:relative z-40 border-r border-[var(--border)]`}>
        <div className="px-5 py-6 border-b border-[var(--border)] hidden md:block">
          <p className="font-serif text-base tracking-[0.2em] text-[var(--text)]">
            DUST<span className="text-[var(--gold)]">·</span>N
            <span className="text-[var(--gold)]">·</span>RARE
          </p>
          <p className="text-[0.42rem] tracking-[0.25em] uppercase text-[var(--text-muted)] mt-0.5">
            Admin Dashboard
          </p>
        </div>
        <nav className="flex-1 py-4">
          {nav.map((item) => (
            <button
              key={item.key}
              onClick={() => { setSection(item.key); setMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-5 py-4 overflow-hidden text-[0.58rem] tracking-[0.1em] uppercase transition-all ${section === item.key
                ? "bg-[var(--gold)]/10 text-[var(--gold)] border-l-2 border-[var(--gold)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-soft)] hover:bg-[var(--surface)]"
                }`}
            >
              <span className="text-sm w-4">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-[var(--border)]">
          <p className="text-[0.48rem] tracking-widest text-[var(--text-muted)] mb-2 px-1">
            Admin
          </p>
          <button
            onClick={handleLogout}
            className="w-full py-2 border border-[var(--border)] text-[0.5rem] tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]/30 transition-all"
          >
            ← Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 bg-[var(--bg-elevated)] overflow-y-auto">
        <div className="flex justify-between items-center px-8 py-5 bg-[var(--bg-elevated)] border-b border-[var(--border)] sticky top-0 z-10">
          <h1 className="font-serif text-xl text-[var(--text)] capitalize">
            {section === "upload" ? "Add Product" : section}
          </h1>
          <button
            onClick={() => { fetchProducts(); fetchOrders(); fetchCoupons(); }}
            className="text-[0.48rem] tracking-widest uppercase border border-[var(--border)] px-3 py-1.5 text-[var(--text-muted)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
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
                    { label: "Revenue", val: `₹${revenue.toLocaleString()}`, sub: "Confirmed+ orders", color: "text-green-500" },
                    { label: "Orders", val: String(orders.length), sub: "Total orders", color: "text-blue-400" },
                    { label: "Products", val: String(products.length), sub: `${products.filter((p) => p.stock <= 4).length} low stock`, color: "text-[var(--gold)]" },
                    { label: "Coupons", val: String(coupons.filter(c => c.is_active).length), sub: "Active codes", color: "text-purple-400" },
                  ].map((c) => (
                    <div key={c.label} className="bg-[var(--surface)] border border-[var(--border)] p-5">
                      <p className="text-[0.5rem] tracking-[0.25em] uppercase text-[var(--text-muted)] mb-2">{c.label}</p>
                      <p className="font-serif text-3xl text-[var(--text)]">{c.val}</p>
                      <p className={`text-[0.52rem] mt-1 ${c.color}`}>{c.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Low Stock Alert */}
                {products.filter(p => p.stock <= 4 && p.is_active).length > 0 && (
                  <div className="mb-4 p-4 border border-[var(--gold)]/20 bg-[var(--gold)]/5">
                    <p className="text-[0.52rem] tracking-widest uppercase text-[var(--gold)] font-medium mb-2">⚠ Low Stock Alert</p>
                    <div className="flex flex-wrap gap-2">
                      {products.filter(p => p.stock <= 4 && p.is_active).map(p => (
                        <span key={p.id} className="text-[0.5rem] bg-[var(--surface)] text-[var(--gold)] px-2 py-1 border border-[var(--border)]">
                          {p.name} — {p.stock} left
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
                  <div className="px-5 py-4 border-b border-[var(--border)]">
                    <span className="text-[0.52rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">Recent Orders</span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Order", "Customer", "Total", "Method", "Status"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[0.48rem] tracking-[0.25em] uppercase text-[var(--text-muted)] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o: any, i: number) => (
                        <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--bg)]/30 transition-colors">
                          <td className="px-4 py-3 text-[0.63rem] font-medium text-[var(--text)]">{o.order_id}</td>
                          <td className="px-4 py-3 text-[0.63rem] text-[var(--text-soft)]">{o.customer_name || "—"}</td>
                          <td className="px-4 py-3 text-[0.63rem] text-[var(--gold)]">₹{o.total?.toLocaleString()}</td>
                          <td className="px-4 py-3 text-[0.63rem] text-[var(--text-soft)] capitalize">{o.payment_method || "—"}</td>
                          <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">
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
                  <span className="text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">{products.length} products</span>
                  <button onClick={() => setSection("upload")} className="btn-primary text-[0.5rem] px-4 py-2">+ Add New</button>
                </div>
                <div className="bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Image", "Product", "Category", "Price", "Stock", "Status", "Visible", "Actions"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[0.48rem] tracking-[0.25em] uppercase text-[var(--text-muted)] font-medium">{h}</th>
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
                        <tr><td colSpan={8} className="text-center py-12 text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">No products yet. Add your first piece →</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── UPLOAD ── */}
            {section === "upload" && (
              <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-[var(--surface)] border border-[var(--border)] p-6 max-w-3xl">
                  <div className="grid md:grid-cols-2 gap-5">
                    {/* IMAGE UPLOAD */}
                    <div className="md:col-span-2">
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-2">Product Images</label>
                      <label className="block border-2 border-dashed border-[var(--border)] p-10 text-center cursor-pointer hover:border-[var(--gold)] hover:bg-[var(--bg)] transition-all">
                        <div className="text-3xl text-[var(--text-muted)] mb-2">⊕</div>
                        <p className="text-[0.58rem] tracking-widest uppercase text-[var(--text-muted)]">
                          {uploading ? "Uploading..." : "Click to upload images"}
                        </p>
                        <p className="text-[0.5rem] text-[var(--text-muted)] mt-1">Front · Back · Detail · On-Model (max 5MB each)</p>
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
                        <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">{f.label}</label>
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
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Category</label>
                      <select className="input-base bg-transparent" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                        <option value="surplus">Surplus</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Fit Type</label>
                      <select className="input-base bg-transparent" value={form.fit} onChange={(e) => setForm((f) => ({ ...f, fit: e.target.value }))}>
                        <option value="oversized">Oversized</option>
                        <option value="regular">Regular</option>
                        <option value="slim">Slim</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Badge</label>
                      <select className="input-base bg-transparent" value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}>
                        <option value="">None</option>
                        <option value="New">New</option>
                        <option value="Limited">Limited</option>
                        <option value="Drop 01">Drop 01</option>
                        <option value="Surplus">Surplus</option>
                      </select>
                    </div>

                    {/* SIZES */}
                    <div>
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Available Sizes</label>
                      <div className="flex gap-2 flex-wrap">
                        {SIZES_LIST.map((s) => (
                          <button
                            key={s} type="button" onClick={() => toggleSize(s)}
                            className={`w-10 h-10 border text-[0.55rem] font-medium transition-all ${form.sizes.includes(s)
                              ? "border-[var(--gold)] bg-[var(--gold)] text-[var(--bg)]"
                              : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--gold)]"
                              }`}
                          >{s}</button>
                        ))}
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="md:col-span-2">
                      <label className="block text-[0.5rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Product Description</label>
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
                <div className="bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
                  <div className="px-5 py-4 border-b border-[var(--border)] flex justify-between items-center">
                    <span className="text-[0.52rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">All Orders ({orders.length})</span>
                    <span className="text-[0.5rem] text-[var(--text-muted)]">Revenue: <strong className="text-[var(--gold)]">₹{revenue.toLocaleString()}</strong></span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Order", "Date", "Customer", "Phone", "Total", "Tracking", "Status", "Action"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[0.48rem] tracking-[0.25em] uppercase text-[var(--text-muted)] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((o: any) => (
                          <tr key={o.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)]/30 transition-colors">
                            <td className="px-4 py-3 text-[0.63rem] font-medium text-[var(--text)]">{o.order_id}</td>
                            <td className="px-4 py-3 text-[0.6rem] text-[var(--text-soft)]">
                              {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                            </td>
                            <td className="px-4 py-3 text-[0.63rem] text-[var(--text-soft)]">{o.customer_name || "—"}</td>
                            <td className="px-4 py-3 text-[0.6rem] text-[var(--text-soft)]">{o.customer_phone || "—"}</td>
                            <td className="px-4 py-3 text-[0.65rem] font-medium text-[var(--gold)]">₹{o.total?.toLocaleString()}</td>
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
                                className="w-24 border border-[var(--border)] text-[0.5rem] px-2 py-1 bg-transparent text-[var(--text-soft)] outline-none focus:border-[var(--gold)]"
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
                                className="border border-[var(--border)] text-[0.5rem] px-2 py-1 bg-transparent text-[var(--text-soft)] outline-none focus:border-[var(--gold)]"
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
                          <td colSpan={8} className="text-center py-12 text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── COUPONS ── */}
            {section === "coupons" && (
              <motion.div key="coupons" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Create form */}
                <div className="bg-[var(--surface)] border border-[var(--border)] p-6 mb-6 max-w-3xl">
                  <h3 className="text-[0.55rem] tracking-widest uppercase text-[var(--gold)] mb-4">Create New Coupon</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Code</label>
                      <input
                        value={couponForm.code}
                        onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                        className="input-base text-[0.6rem]"
                        placeholder="WELCOME20"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Type</label>
                      <select
                        value={couponForm.discount_type}
                        onChange={e => setCouponForm(f => ({ ...f, discount_type: e.target.value as any }))}
                        className="input-base text-[0.6rem] bg-transparent"
                      >
                        <option value="percentage">Percentage (%)</option>
                        <option value="flat">Flat (₹)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Value</label>
                      <input
                        type="number"
                        value={couponForm.discount_value}
                        onChange={e => setCouponForm(f => ({ ...f, discount_value: e.target.value }))}
                        className="input-base text-[0.6rem]"
                        placeholder={couponForm.discount_type === 'percentage' ? '20' : '500'}
                      />
                    </div>
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Min Order (₹)</label>
                      <input
                        type="number"
                        value={couponForm.min_order}
                        onChange={e => setCouponForm(f => ({ ...f, min_order: e.target.value }))}
                        className="input-base text-[0.6rem]"
                        placeholder="0 (no minimum)"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Max Uses</label>
                      <input
                        type="number"
                        value={couponForm.max_uses}
                        onChange={e => setCouponForm(f => ({ ...f, max_uses: e.target.value }))}
                        className="input-base text-[0.6rem]"
                        placeholder="Unlimited (-1)"
                      />
                    </div>
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Expires At</label>
                      <input
                        type="date"
                        value={couponForm.expires_at}
                        onChange={e => setCouponForm(f => ({ ...f, expires_at: e.target.value }))}
                        className="input-base text-[0.6rem]"
                      />
                    </div>
                  </div>
                  <button onClick={handleCreateCoupon} className="btn-primary mt-4 px-6 py-3 text-[0.5rem]">
                    Create Coupon ✦
                  </button>
                </div>

                {/* Coupons list */}
                <div className="bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
                  <div className="px-5 py-4 border-b border-[var(--border)]">
                    <span className="text-[0.52rem] tracking-[0.2em] uppercase text-[var(--text-muted)]">{coupons.length} coupons</span>
                  </div>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Code", "Type", "Value", "Min Order", "Used/Max", "Expires", "Status", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[0.48rem] tracking-[0.25em] uppercase text-[var(--text-muted)] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map(c => (
                        <tr key={c.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)]/30 transition-colors">
                          <td className="px-4 py-3 text-[0.7rem] font-semibold text-[var(--gold)] tracking-widest">{c.code}</td>
                          <td className="px-4 py-3 text-[0.6rem] text-[var(--text-soft)] capitalize">{c.discount_type}</td>
                          <td className="px-4 py-3 text-[0.65rem] font-medium text-[var(--text)]">
                            {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                          </td>
                          <td className="px-4 py-3 text-[0.6rem] text-[var(--text-soft)]">
                            {c.min_order > 0 ? `₹${c.min_order.toLocaleString()}` : '—'}
                          </td>
                          <td className="px-4 py-3 text-[0.6rem] text-[var(--text-soft)]">
                            {c.used_count} / {c.max_uses === -1 ? '∞' : c.max_uses}
                          </td>
                          <td className="px-4 py-3 text-[0.55rem] text-[var(--text-muted)]">
                            {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleCoupon(c)}
                              className={`text-[0.44rem] tracking-widest uppercase px-2.5 py-1 border transition-all ${c.is_active
                                ? "border-green-500/30 text-green-400 hover:border-red-400/30 hover:text-red-400"
                                : "border-red-500/30 text-red-400 hover:border-green-400/30 hover:text-green-400"
                                }`}
                            >
                              {c.is_active ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleDeleteCoupon(c.id)}
                              className="text-[0.48rem] tracking-widest uppercase border border-[var(--border)] px-2 py-1 text-[var(--text-muted)] hover:border-red-400 hover:text-red-400 transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {!coupons.length && (
                        <tr>
                          <td colSpan={8} className="text-center py-12 text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">
                            No coupons yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── LOOKBOOK ── */}
            {section === "lookbook" && (
              <motion.div key="lookbook" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">{lookbook.length} shoots</span>
                </div>
                
                {/* UPLOAD FORM */}
                <div className="bg-[var(--surface)] border border-[var(--border)] p-5 mb-8">
                  <h3 className="text-[0.55rem] tracking-widest uppercase text-[var(--gold)] mb-4">Add a new look</h3>
                  <div className="grid md:grid-cols-[1fr_2fr_1fr] gap-4 items-end">
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Image File (1)</label>
                      <input type="file" onChange={handleImageUpload} disabled={uploading} className="block w-full text-[0.55rem] py-1 text-[var(--text-soft)]" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <div>
                         <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Title</label>
                         <input id="l-title" type="text" className="input-base text-[0.6rem]" placeholder="Look 01 — Sand" />
                       </div>
                       <div>
                         <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Description/Sub</label>
                         <input id="l-sub" type="text" className="input-base text-[0.6rem]" placeholder="Void Jacket + Ash Trouser" />
                       </div>
                    </div>
                    <button
                      onClick={async () => {
                         const title = (document.getElementById('l-title') as HTMLInputElement)?.value;
                         const sub = (document.getElementById('l-sub') as HTMLInputElement)?.value;
                         if (!imgUrls[0] || !title) return toast.error('Upload image and add title');
                         try {
                           await adminApi.createLookbookItem(password, { 
                             title, 
                             sub, 
                             image_url: imgUrls[imgUrls.length - 1], 
                             sort_order: lookbook.length + 1 
                           });
                           toast.success('Lookbook updated!');
                           setImgUrls([]); fetchLookbook();
                         } catch (e: any) { toast.error(e.message); }
                      }}
                      className="btn-primary w-full py-3"
                    >Submit</button>
                  </div>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Image", "Title", "Sub", "Date", "Action"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[0.48rem] tracking-[0.25em] uppercase text-[var(--text-muted)] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lookbook.length > 0 ? (
                        lookbook.map((l: any) => (
                          <tr key={l.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)]/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="w-10 h-14 bg-[var(--bg)]">
                                <Image src={l.image_url} alt="" width={40} height={56} className="object-cover w-full h-full" />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[0.63rem] font-medium text-[var(--text)]">{l.title}</td>
                            <td className="px-4 py-3 text-[0.6rem] text-[var(--text-soft)]">{l.sub || "—"}</td>
                            <td className="px-4 py-3 text-[0.55rem] text-[var(--text-muted)]">
                              {new Date(l.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                               <button onClick={async () => {
                                 if(!confirm('Delete lookbook shoot?')) return;
                                 try { 
                                   await adminApi.deleteLookbookItem(password, l.id); 
                                   toast.success('Deleted shoot'); 
                                   fetchLookbook(); 
                                 } catch { toast.error('Failed to delete') }
                               }} className="text-[0.48rem] tracking-widest uppercase border border-[var(--border)] px-2 py-1 text-[var(--text-muted)] hover:border-red-400 hover:text-red-400 transition-all">
                                 Delete
                               </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">
                            No lookbook entries
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ── TESTIMONIALS ── */}
            {section === "testimonials" && (
              <motion.div key="testimonials" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Create form */}
                <div className="bg-[var(--surface)] border border-[var(--border)] p-6 mb-6 max-w-3xl">
                  <h3 className="text-[0.55rem] tracking-widest uppercase text-[var(--gold)] mb-4">Add a Testimonial</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Author</label>
                      <input id="t-author" type="text" className="input-base text-[0.6rem]" placeholder="e.g. Aryan K." />
                    </div>
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Location</label>
                      <input id="t-location" type="text" className="input-base text-[0.6rem]" placeholder="e.g. New Delhi" />
                    </div>
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Product</label>
                      <input id="t-product" type="text" className="input-base text-[0.6rem]" placeholder="e.g. Void Oversized Jacket" />
                    </div>
                    <div>
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Stars (1-5)</label>
                      <input id="t-stars" type="number" min="1" max="5" defaultValue="5" className="input-base text-[0.6rem]" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[0.45rem] tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5">Text</label>
                      <textarea id="t-text" className="input-base text-[0.6rem] resize-none h-20" placeholder="Their review..." />
                    </div>
                  </div>
                  <button onClick={async () => {
                    const author = (document.getElementById('t-author') as HTMLInputElement)?.value;
                    const location = (document.getElementById('t-location') as HTMLInputElement)?.value;
                    const product = (document.getElementById('t-product') as HTMLInputElement)?.value;
                    const stars = (document.getElementById('t-stars') as HTMLInputElement)?.value;
                    const text = (document.getElementById('t-text') as HTMLTextAreaElement)?.value;
                    
                    if (!author || !text || !product || !location || !stars) {
                      toast.error('Please fill all fields');
                      return;
                    }

                    try {
                      await adminApi.createTestimonial(password, { author, location, product, text, stars: Number(stars) });
                      toast.success('Testimonial Added!');
                      (document.getElementById('t-author') as HTMLInputElement).value = '';
                      (document.getElementById('t-location') as HTMLInputElement).value = '';
                      (document.getElementById('t-product') as HTMLInputElement).value = '';
                      (document.getElementById('t-text') as HTMLTextAreaElement).value = '';
                      fetchTestimonials();
                    } catch (e: any) {
                      toast.error(e.message);
                    }
                  }} className="btn-primary mt-4 px-6 py-3 text-[0.5rem]">
                    Add Testimonial ✦
                  </button>
                </div>

                <div className="bg-[var(--surface)] border border-[var(--border)] overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[var(--border)]">
                        {["Stars", "Author", "Product", "Review", "Status", "Action"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[0.48rem] tracking-[0.25em] uppercase text-[var(--text-muted)] font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {testimonials.length > 0 ? (
                        testimonials.map((t: any) => (
                          <tr key={t.id} className="border-b border-[var(--border)] hover:bg-[var(--bg)]/30 transition-colors">
                            <td className="px-4 py-3 text-[0.6rem] text-[var(--gold)]">
                              {"★".repeat(t.stars)}
                            </td>
                            <td className="px-4 py-3 text-[0.63rem] font-medium text-[var(--text)]">
                              {t.author} <p className="text-[0.5rem] tracking-wider uppercase text-[var(--text-muted)]">{t.location}</p>
                            </td>
                            <td className="px-4 py-3 text-[0.55rem] tracking-widest uppercase text-[var(--gold)]">{t.product}</td>
                            <td className="px-4 py-3 text-[0.6rem] text-[var(--text-soft)] max-w-xs truncate italic">&quot;{t.text}&quot;</td>
                            <td className="px-4 py-3">
                              <button onClick={async () => {
                                try {
                                  await adminApi.updateTestimonial(password, t.id, { is_active: !t.is_active });
                                  toast.success(t.is_active ? 'Testimonial Hidden' : 'Testimonial Visible');
                                  fetchTestimonials();
                                } catch { toast.error('Failed'); }
                              }} className={`text-[0.44rem] tracking-widest uppercase px-2.5 py-1 border transition-all ${t.is_active ? "border-green-500/30 text-green-400" : "border-red-500/30 text-red-400"}`}>
                                {t.is_active ? "Visible" : "Hidden"}
                              </button>
                            </td>
                            <td className="px-4 py-3">
                               <button onClick={async () => {
                                 if(!confirm('Delete this testimonial?')) return;
                                 try { 
                                   await adminApi.deleteTestimonial(password, t.id); 
                                   toast.success('Deleted'); 
                                   fetchTestimonials(); 
                                 } catch { toast.error('Failed to delete') }
                               }} className="text-[0.48rem] tracking-widest uppercase border border-[var(--border)] px-2 py-1 text-[var(--text-muted)] hover:border-red-400 hover:text-red-400 transition-all">
                                 Delete
                               </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">
                            No testimonials yet
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
    <tr className="border-b border-[var(--border)] hover:bg-[var(--bg)]/30 transition-colors">
      <td className="px-4 py-3">
        <div className="w-10 h-14 overflow-hidden bg-[var(--bg)]">
          {product.images?.[0] && (
            <Image src={product.images[0]} alt={product.name} width={40} height={56} className="object-cover w-full h-full" />
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <p className="font-serif text-[0.9rem] text-[var(--text)]">{product.name}</p>
        <p className="text-[0.48rem] text-[var(--text-muted)] uppercase tracking-wider mt-0.5">{product.fit}</p>
      </td>
      <td className="px-4 py-3 text-[0.62rem] text-[var(--text-soft)] capitalize">{product.category}</td>
      <td className="px-4 py-3 text-[0.65rem] font-medium">
        <span className="text-[var(--gold)]">₹{product.price.toLocaleString()}</span>
        {product.original_price && (
          <span className="line-through text-[var(--text-muted)] ml-1 text-[0.55rem]">₹{product.original_price.toLocaleString()}</span>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={stockVal}
            onChange={(e) => setStockVal(e.target.value)}
            onBlur={() => onStockUpdate(Number(stockVal))}
            className={`w-14 border text-[0.6rem] px-2 py-1 bg-transparent outline-none focus:border-[var(--gold)] ${product.stock <= 4 ? "border-[var(--gold)]/50 text-[var(--gold)]" : "border-[var(--border)] text-[var(--text-soft)]"
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
          className={`text-[0.44rem] tracking-widest uppercase px-2.5 py-1 border transition-all ${product.is_active
            ? "border-green-500/30 text-green-400 hover:border-red-400/30 hover:text-red-400"
            : "border-red-500/30 text-red-400 hover:border-green-400/30 hover:text-green-400"
            }`}
        >
          {product.is_active ? "Visible" : "Hidden"}
        </button>
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onDelete}
          className="text-[0.48rem] tracking-widest uppercase border border-[var(--border)] px-2 py-1 text-[var(--text-muted)] hover:border-red-400 hover:text-red-400 transition-all"
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
    placed: "bg-yellow-900/30 text-yellow-400",
    confirmed: "bg-blue-900/30 text-blue-400",
    packed: "bg-indigo-900/30 text-indigo-400",
    shipped: "bg-green-900/30 text-green-400",
    delivered: "bg-[var(--gold)]/15 text-[var(--gold)]",
    cancelled: "bg-red-900/30 text-red-400",
    active: "bg-green-900/30 text-green-400",
    oos: "bg-red-900/30 text-red-400",
  };
  return (
    <span className={`text-[0.44rem] tracking-widest uppercase px-2.5 py-1 ${colors[status] || "bg-[var(--surface)] text-[var(--text-muted)]"}`}>
      {status}
    </span>
  );
}
