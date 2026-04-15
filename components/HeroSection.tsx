"use client";

import { motion } from "framer-motion";
import CTAButton from "./ui/CTAButton";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-float opacity-50" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-border text-sm text-accent mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Powered by Gemini API
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground text-balance">
            Tanya Apa Saja ke AI <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-accent-gradient drop-shadow-sm">
              Tanpa Batas
            </span>
          </h1>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg sm:text-xl text-muted max-w-2xl mx-auto text-balance"
        >
          Chatbot cerdas yang siap membantu menyelesaikan tugasmu, menjawab pertanyaan rumit, 
          atau sekadar ngobrol santai kapan pun kamu mau.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <CTAButton href="/chat" variant="primary" className="w-full sm:w-auto px-8 py-4 text-lg">
            Mulai Chat Sekarang
          </CTAButton>
          <CTAButton href="#features" variant="secondary" className="w-full sm:w-auto px-8 py-4 text-lg">
            Pelajari Fitur
          </CTAButton>
        </motion.div>
      </div>

      {/* Fade out bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
}
