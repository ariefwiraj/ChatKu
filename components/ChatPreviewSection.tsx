"use client";

import { motion } from "framer-motion";
import { Bot, User } from "lucide-react";
import { useEffect, useState } from "react";

const previewMessages = [
  { role: "user", content: "Bisa jelaskan apa itu quantum computing dengan bahasa sederhana?" },
  { role: "bot", content: "Tentu! Bayangkan koin yang sedang berputar. Kalau komputer biasa melihat koin itu cuma sebagai 'Angka' atau 'Gambar' (1 atau 0), komputer kuantum melihat koin yang sedang berputar itu sebagai *keduanya* secara bersamaan sampai koinnya jatuh. Ini bikin komputer kuantum bisa mikir jauh lebih cepat untuk masalah tertentu!" },
  { role: "user", content: "Wah keren! Berarti bisa buat main game rata kanan dong? 😂" },
  { role: "bot", content: "Haha, sayangnya belum! 😅 Komputer kuantum lebih cocok buat ngitung rumus kimia rumit atau bikin password super aman, bukan buat rendering grafis game." }
];

export default function ChatPreviewSection() {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('chat-preview');
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          // Start animation when section is visible
          if (visibleMessages === 0) {
            let count = 0;
            const interval = setInterval(() => {
              count++;
              setVisibleMessages(count);
              if (count >= previewMessages.length) {
                clearInterval(interval);
              }
            }, 1200);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleMessages]);

  return (
    <section id="preview" className="py-24 px-4 relative z-10 overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 top-1/2 -z-10 bg-primary/5 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
      
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Mulai Chatting Tanpa Ribet</h2>
          <p className="text-muted text-lg">Coba lihat interaksi di bawah ini.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          id="chat-preview"
          className="w-full max-w-2xl rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-surface-elevated/50">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">ChatKu Bot</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                <span className="text-xs text-muted">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 md:p-6 flex flex-col gap-4 h-[380px] overflow-hidden relative">
            {previewMessages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ 
                  opacity: idx < visibleMessages ? 1 : 0, 
                  y: idx < visibleMessages ? 0 : 10,
                  scale: idx < visibleMessages ? 1 : 0.95
                }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"}`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={`p-3 rounded-2xl text-[15px] leading-relaxed ${msg.role === "user" ? "bg-primary text-white rounded-tr-none" : "bg-surface-elevated border border-border text-foreground rounded-tl-none"}`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {visibleMessages > 0 && visibleMessages < previewMessages.length && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 mr-auto items-center"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="flex gap-1.5 p-3 px-4 rounded-2xl rounded-tl-none bg-surface-elevated border border-border">
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                  <motion.div className="w-1.5 h-1.5 rounded-full bg-muted" animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
                </div>
              </motion.div>
            )}

            {/* Gradient overlay to simulate fadeout at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
