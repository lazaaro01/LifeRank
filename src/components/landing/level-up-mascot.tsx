"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type LevelUpMascotProps = {
  className?: string;
};

export function LevelUpMascot({ className }: LevelUpMascotProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={cn("text-primary", className)}
    >
      <motion.svg
        viewBox="0 0 220 240"
        fill="none"
        className="h-full w-full"
        animate={{ y: [0, -10, 0], rotate: [0, -2, 0, 2, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* body */}
        <ellipse
          cx="105"
          cy="130"
          rx="46"
          ry="54"
          stroke="currentColor"
          strokeWidth="4"
        />

        {/* face */}
        <circle cx="90" cy="115" r="4" fill="currentColor" />
        <circle cx="118" cy="115" r="4" fill="currentColor" />
        <path
          d="M88 134 Q104 148 122 132"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* raised arm */}
        <path
          d="M140 118 C 162 108, 170 88, 168 66"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* resting arm */}
        <path
          d="M66 130 C 48 138, 42 152, 46 166"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* legs */}
        <path
          d="M84 178 C 80 194, 76 202, 68 208"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M126 178 C 130 194, 134 202, 142 208"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* shoes */}
        <path
          d="M60 208 L76 208"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M134 208 L150 208"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* star above raised hand */}
        <motion.path
          d="M168 34 L172.5 45.5 L185 47 L175.5 55 L178.5 67 L168 60.5 L157.5 67 L160.5 55 L151 47 L163.5 45.5 Z"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
          fill="none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "168px 50px" }}
        />

        {/* sparkles */}
        <motion.path
          d="M40 90 L44 100 L40 110 L36 100 Z"
          fill="currentColor"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.path
          d="M182 140 L186 150 L182 160 L178 150 Z"
          fill="currentColor"
          animate={{ opacity: [0.2, 0.8, 0.2] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.1,
          }}
        />
      </motion.svg>
    </motion.div>
  );
}
