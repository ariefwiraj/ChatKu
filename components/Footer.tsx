import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-12 px-4 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 grayscale opacity-70">
          <MessageSquare className="w-5 h-5 text-foreground" />
          <span className="font-bold text-lg tracking-tight text-foreground">ChatKu</span>
        </div>
        
        <p className="text-muted text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} ChatKu. Built with Next.js & Gemini API.
        </p>

        <div className="flex items-center gap-6 text-sm text-muted">
          <Link href="#" className="hover:text-foreground transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-foreground transition-colors">GitHub</Link>
        </div>
      </div>
    </footer>
  );
}
