import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ChatPreviewSection from "@/components/ChatPreviewSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-grow pt-16">
        <HeroSection />
        <FeaturesSection />
        <ChatPreviewSection />
      </main>
      <Footer />
    </>
  );
}
