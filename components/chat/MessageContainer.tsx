"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

interface MessageContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageContainer({ messages, isLoading }: MessageContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div 
      ref={scrollRef}
      className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center opacity-70">
            <h2 className="text-xl font-bold mb-2">Selamat Datang di ChatKu</h2>
            <p className="text-muted text-sm max-w-md text-balance">
              Mulai percakapan dengan mengetik pertanyaanmu di bawah. AI kami siap membantu!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
          ))
        )}
        
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  );
}
