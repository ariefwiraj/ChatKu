"use client";

import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">ChatKu</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#preview" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
              Preview
            </Link>
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center rounded-full bg-primary/10 px-5 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
            >
              Mulai Chat &rarr;
            </Link>
          </div>

          {/* Mobile CTA */}
          <div className="flex md:hidden">
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Chat
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
