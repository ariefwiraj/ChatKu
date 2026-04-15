"use client";

import { motion } from "framer-motion";
import { Zap, Brain, MessageSquareHeart } from "lucide-react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Cepat & Ringan",
    description: "Tanpa perlu login atau registrasi ribet. Langsung buka web dan ketik pertanyaanmu dalam hitungan detik."
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Powered by Gemini",
    description: "Didukung oleh kecerdasan buatan Gemini API yang mampu memahami konteks, menulis kode, hingga membuat puisi."
  },
  {
    icon: <MessageSquareHeart className="w-6 h-6" />,
    title: "Chat Natural",
    description: "Antarmuka yang bersih dan interaktif membuat obrolan terasa seperti sedang berdiskusi dengan seorang ahli."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Kenapa Menggunakan ChatKu?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-muted text-lg max-w-2xl mx-auto"
          >
            Didesain untuk kepraktisan, kecepatan, dan kenyamanan tanpa mengorbankan kecerdasan.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
            >
              <FeatureCard 
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
