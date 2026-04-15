"use client";

import Link from "next/link";
import { MessageSquare, ArrowLeft, MoreVertical } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border h-16 flex items-center px-4 justify-between">
      <div className="flex items-center gap-3">
        <Link 
          href="/" 
          className="p-2 -ml-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-1.5 rounded-lg">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-[15px] leading-tight">ChatKu Assistant</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
              <span className="text-xs text-muted font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      <button className="p-2 -mr-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-elevated transition-colors">
        <MoreVertical className="w-5 h-5" />
      </button>
    </header>
  );
}
