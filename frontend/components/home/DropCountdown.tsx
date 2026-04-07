"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Props {
  targetDate: string;
}

export default function DropCountdown({ targetDate }: Props) {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return;

      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    }

    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <section className="bg-[var(--text)] text-white py-28 px-6 text-center">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 0.6, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-[0.7rem] tracking-[0.4em] uppercase mb-6"
      >
        Next Drop
      </motion.p>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="font-serif text-[clamp(3rem,6vw,5rem)] leading-tight mb-12"
      >
        Drop <span className="italic text-[var(--gold)]">02</span>
      </motion.h2>

      {/* Countdown */}
      <div className="flex justify-center gap-8 md:gap-14 mb-14">
        {[
          { val: time.days, label: "D" },
          { val: time.hours, label: "H" },
          { val: time.minutes, label: "M" },
          { val: time.seconds, label: "S" },
        ].map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="font-mono text-[clamp(2.5rem,6vw,4.5rem)] font-semibold tracking-wider">
              {String(unit.val).padStart(2, "0")}
            </div>

            <div className="text-[0.65rem] tracking-[0.3em] text-white/40 mt-2">
              {unit.label}
            </div>
          </div>
        ))}
      </div>

      {/* Email */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center"
      >
        <div className="flex border-b border-white/20 w-full max-w-md">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent py-3 text-[0.75rem] outline-none placeholder:text-white/30"
          />

          <button className="text-[var(--gold)] text-[0.7rem] tracking-[0.3em] uppercase px-4 hover:text-white transition">
            Notify
          </button>
        </div>
      </motion.div>
    </section>
  );
}
