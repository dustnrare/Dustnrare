"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store";
import toast from "react-hot-toast";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQty,
    total,
    count,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleCheckout() {
    if (items.length === 0) {
      toast.error("Your bag is empty");
      return;
    }
    closeCart();
    window.location.href = "/checkout";
  }
  // 
  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            onClick={closeCart}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              ease: [0.25, 0.46, 0.45, 0.94],
              duration: 0.45,
            }}
            className="fixed top-0 right-0 h-screen w-full md:w-[420px] bg-[var(--bg-elevated)] z-[201] border-l border-[var(--border)] flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-5 border-b border-[var(--border)]">
              <span className="font-serif text-xl text-[var(--text)]">
                Your Bag
              </span>
              <button
                onClick={closeCart}
                className="text-[0.55rem] tracking-widest uppercase text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {!mounted || items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                  <span className="font-serif text-5xl text-[var(--surface)]">
                    ◯
                  </span>
                  <p className="text-[0.6rem] tracking-widest uppercase text-[var(--text-muted)]">
                    Your bag is empty
                  </p>
                  <button onClick={closeCart} className="btn-outline mt-4">
                    Browse Collection
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-0">
                  {items.map((item, i) => (
                    <motion.div
                      key={`${item.product.id}-${item.size}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-4 py-4 border-b border-[var(--border)]"
                    >
                      <div className="w-[70px] h-[90px] overflow-hidden bg-[var(--surface)] flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          width={70}
                          height={90}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-[0.95rem] text-[var(--text)] leading-tight mb-1">
                          {item.product.name}
                        </p>
                        <p className="text-[0.5rem] tracking-widest uppercase text-[var(--text-muted)] mb-2">
                          Size: {item.size}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-[var(--border)]">
                            <button
                              onClick={() =>
                                updateQty(
                                  item.product.id,
                                  item.size,
                                  item.qty - 1,
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-colors text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-[0.7rem] font-medium text-[var(--text)]">
                              {item.qty}
                            </span>
                            <button
                              onClick={() =>
                                updateQty(
                                  item.product.id,
                                  item.size,
                                  item.qty + 1,
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--surface)] hover:text-[var(--gold)] transition-colors text-sm"
                            >
                              +
                            </button>
                          </div>
                          <span className="text-[0.8rem] font-medium text-[var(--gold)]">
                            ₹{(item.product.price * item.qty).toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.product.id, item.size)
                          }
                          className="text-[0.48rem] tracking-widest uppercase text-[var(--text-muted)] hover:text-red-400 transition-colors mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-[var(--border)]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[0.55rem] tracking-widest uppercase text-[var(--text-muted)]">
                    Subtotal
                  </span>
                  <span className="font-serif text-xl text-[var(--gold)]">
                    ₹{total().toLocaleString()}
                  </span>
                </div>
                <button
                  className="w-full py-4 bg-[var(--gold)] text-[var(--bg)] text-[0.6rem] tracking-[0.22em] uppercase font-medium hover:bg-[var(--gold-light)] transition-all duration-500 mb-2 relative overflow-hidden"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
                <p className="text-center text-[0.5rem] text-[var(--text-muted)] tracking-widest uppercase">
                  ✓ Free shipping above ₹999 &nbsp;·&nbsp; ✓ Pay via UPI
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
