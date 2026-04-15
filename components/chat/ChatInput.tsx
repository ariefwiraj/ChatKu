"use client";

// import { motion } from "framer-motion"; (removed to fix lint error)
import { SendHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 bg-surface/80 backdrop-blur-md border-t border-border">
      <div className="max-w-3xl mx-auto relative group">
        <form 
          onSubmit={handleSubmit}
          className="flex items-end gap-2 bg-surface-elevated border border-border rounded-2xl p-2 transition-all focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50"
        >
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya ChatKu apa saja..."
            rows={1}
            disabled={isLoading}
            className="flex-grow bg-transparent border-none focus:outline-none resize-none pt-3 pb-3 px-3 text-[15px] leading-relaxed hide-scrollbar disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center transition-all hover:bg-primary-hover disabled:bg-surface disabled:text-muted disabled:border disabled:border-border mb-0.5 mr-0.5"
          >
            <SendHorizontal className="w-5 h-5" />
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-[11px] text-muted">
            Tekan <kbd className="font-mono bg-surface px-1 py-0.5 rounded border border-border">Shift + Enter</kbd> untuk baris baru. ChatKu bisa saja membuat kesalahan.
          </p>
        </div>
      </div>
    </div>
  );
}
