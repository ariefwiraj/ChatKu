"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";

export default function TypingIndicator() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="flex gap-3 max-w-[85%] sm:max-w-[75%] mr-auto"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 bg-primary/20 text-primary">
        <Bot className="w-5 h-5" />
      </div>
      
      <div className="py-4 px-4 rounded-2xl rounded-tl-none bg-surface-elevated border border-border shadow-sm flex items-center gap-1.5">
        <motion.div 
          className="w-1.5 h-1.5 rounded-full bg-primary/60" 
          animate={{ y: [0, -5, 0] }} 
          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }} 
        />
        <motion.div 
          className="w-1.5 h-1.5 rounded-full bg-primary/60" 
          animate={{ y: [0, -5, 0] }} 
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15, ease: "easeInOut" }} 
        />
        <motion.div 
          className="w-1.5 h-1.5 rounded-full bg-primary/60" 
          animate={{ y: [0, -5, 0] }} 
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3, ease: "easeInOut" }} 
        />
      </div>
    </motion.div>
  );
}
