"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store";
import { ordersApi } from "@/lib/api";
import toast from "react-hot-toast";

type SendMethod = "whatsapp" | "email" | null;

function F({
  label,
  half,
  children,
}: {
  label: string;
  half?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={half ? "" : "md:col-span-2"}>
      <label className="text-[0.48rem] tracking-widest uppercase text-[var(--mid)] block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const [placing, setPlacing] = useState(false);
  const [method, setMethod] = useState<SendMethod>(null);

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const subtotal = total();
  const shipping = subtotal >= 999 ? 0 : 60;
  const grandTotal = subtotal + shipping;

  if (!items.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--beige)]">
        <div className="text-center">
          <p className="font-serif text-2xl text-[var(--text)] mb-4">
            Your bag is empty
          </p>
          <Link href="/shop" className="btn-primary inline-block">
            Shop Now
          </Link>
        </div>
      </div>
    );

  function validate() {
    const req = ["name", "phone", "line1", "city", "state", "pincode"] as const;
    for (const f of req) {
      if (!address[f].trim()) {
        toast.error(`Please fill in your ${f}`);
        return false;
      }
    }
    if (address.pincode.length !== 6) {
      toast.error("Enter a valid 6-digit pincode");
      return false;
    }
    if (!method) {
      toast.error("Choose WhatsApp or Email to send your order");
      return false;
    }
    return true;
  }

  async function handlePlaceOrder(chosen: "whatsapp" | "email") {
    setMethod(chosen);
    if (!validate()) return;
    setPlacing(true);

    try {
      const data = await ordersApi.create({
        items: items.map((i) => ({
          productId: i.product.id,
          name: i.product.name,
          image: i.product.images[0],
          size: i.size,
          qty: i.qty,
          price: i.product.price,
        })),
        address,
        paymentMethod: chosen,
        subtotal,
        shipping,
        total: grandTotal,
      });

      clearCart();
      toast.success(
        "Order placed! Opening " +
        (chosen === "whatsapp" ? "WhatsApp" : "Email") +
        "...",
      );

      if (chosen === "whatsapp") window.open(data.waLink, "_blank");
      else window.location.href = data.emailLink;

      router.push(`/order-success?id=${data.orderId}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[var(--offwhite)]">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="mb-10">
          <div className="section-label">Checkout</div>
          <h1 className="font-serif text-4xl font-normal text-[var(--text)]">
            Complete Your Order
          </h1>
        </div>

        <div className="grid md:grid-cols-[1fr_380px] gap-8 items-start">
          {/* LEFT — Address */}
          <div className="border border-[var(--border)] p-6 bg-[var(--offwhite)]">
            <h2 className="text-[0.55rem] tracking-widest uppercase text-[var(--gold)] mb-5">
              Delivery Address
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <F label="Full Name">
                <input
                  value={address.name}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAddress((prev) => ({ ...prev, name: v }));
                  }}
                  className="input-base"
                  placeholder="Aryan Kumar"
                  autoComplete="name"
                />
              </F>
              <F label="Phone Number" half>
                <input
                  value={address.phone}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAddress((prev) => ({ ...prev, phone: v }));
                  }}
                  className="input-base"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  inputMode="tel"
                />
              </F>
              <F label="Pincode" half>
                <input
                  value={address.pincode}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAddress((prev) => ({ ...prev, pincode: v }));
                  }}
                  className="input-base"
                  placeholder="110001"
                  maxLength={6}
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
              </F>
              <F label="Address Line 1">
                <input
                  value={address.line1}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAddress((prev) => ({ ...prev, line1: v }));
                  }}
                  className="input-base"
                  placeholder="Flat / House / Street"
                  autoComplete="address-line1"
                />
              </F>
              <F label="Address Line 2 (optional)">
                <input
                  value={address.line2}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAddress((prev) => ({ ...prev, line2: v }));
                  }}
                  className="input-base"
                  placeholder="Area / Landmark"
                  autoComplete="address-line2"
                />
              </F>
              <F label="City" half>
                <input
                  value={address.city}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAddress((prev) => ({ ...prev, city: v }));
                  }}
                  className="input-base"
                  placeholder="New Delhi"
                  autoComplete="address-level2"
                />
              </F>
              <F label="State" half>
                <input
                  value={address.state}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAddress((prev) => ({ ...prev, state: v }));
                  }}
                  className="input-base"
                  placeholder="Delhi"
                  autoComplete="address-level1"
                />
              </F>
            </div>

            {/* HOW IT WORKS */}
            <div className="mt-8 p-4 bg-[var(--beige)] border border-[var(--border)]">
              <p className="text-[0.55rem] tracking-widest uppercase text-[var(--gold)] mb-3">
                How ordering works
              </p>
              <div className="space-y-2">
                {[
                  ["1", "Fill your address above"],
                  ["2", "Click WhatsApp or Email below"],
                  ["3", "Your order details open pre-filled — just hit send"],
                  ["4", "We confirm & share UPI/bank details for payment"],
                  ["5", "Order ships after payment confirmation"],
                ].map(([n, t]) => (
                  <div key={n} className="flex items-start gap-3">
                    <span className="text-[var(--gold)] text-[0.55rem] font-medium w-4 flex-shrink-0">
                      {n}.
                    </span>
                    <span className="text-[0.62rem] text-[var(--mid)]">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* SEND BUTTONS */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePlaceOrder("whatsapp")}
                disabled={placing}
                className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white text-[0.6rem] tracking-[0.18em] uppercase font-medium hover:bg-[#1ebe5d] transition-colors disabled:opacity-50"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {placing && method === "whatsapp" ? "Placing..." : "Order via WhatsApp"}
              </button>

              <button
                onClick={() => handlePlaceOrder("email")}
                disabled={placing}
                className="flex items-center justify-center gap-2 py-4 bg-[var(--text)] text-[var(--offwhite)] text-[0.6rem] tracking-[0.18em] uppercase font-medium hover:bg-[var(--gold)] transition-colors disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                {placing && method === "email" ? "Placing..." : "Order via Email"}
              </button>
            </div>

            <p className="text-center text-[0.5rem] text-[var(--light)] tracking-widest uppercase mt-3">
              Payment collected after order confirmation · UPI / Bank Transfer
            </p>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="border border-[var(--border)] p-6 sticky top-24 bg-[var(--offwhite)]">
            <h2 className="text-[0.55rem] tracking-widest uppercase text-[var(--gold)] mb-5">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-14 h-18 bg-[var(--beige)] flex-shrink-0 overflow-hidden"
                    style={{ height: 72 }}
                  >
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      width={56}
                      height={72}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-[0.9rem] text-[var(--text)] leading-tight truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[0.48rem] tracking-widest uppercase text-[var(--light)] mt-0.5">
                      {item.size} · Qty {item.qty}
                    </p>
                    <p className="text-[0.65rem] font-medium text-[var(--text)] mt-1">
                      ₹{(item.product.price * item.qty).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t border-[var(--border)]">
              <div className="flex justify-between text-[0.6rem] text-[var(--mid)]">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[0.6rem] text-[var(--mid)]">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-green-600" : ""}>
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-[var(--border)]">
                <span className="text-[0.58rem] tracking-widest uppercase text-[var(--text)]">
                  Total
                </span>
                <span className="font-serif text-xl text-[var(--text)]">
                  ₹{grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-5 p-3 bg-[var(--beige)] text-center">
              <p className="text-[0.52rem] text-[var(--mid)] leading-relaxed">
                Pay via{" "}
                <strong className="font-medium text-[var(--text)]">
                  UPI / Bank Transfer
                </strong>{" "}
                after we confirm your order on WhatsApp or Email
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
