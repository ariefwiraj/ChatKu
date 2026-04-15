"use client";

import { useState, useCallback } from "react";
import { Message } from "@/types/chat";

// ============================================
// useChat — Chat Logic with Session Support
// ============================================

interface UseChatOptions {
  sessionToken: string;
  initialSessionId?: string;
}

export function useChat({ sessionToken, initialSessionId }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load messages for an existing session.
   */
  const loadSession = useCallback(
    async (targetSessionId: string) => {
      if (!sessionToken) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/sessions/${targetSessionId}/messages`,
          {
            headers: {
              "x-session-token": sessionToken,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to load session messages");
        }

        const data = await response.json();
        setMessages(data.messages);
        setSessionId(targetSessionId);
      } catch (err) {
        console.error("Error loading session:", err);
        setError("Gagal memuat riwayat chat. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    },
    [sessionToken]
  );

  /**
   * Send a new message and get AI response.
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!sessionToken || !content.trim()) return;

      // Add user message to UI immediately
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            sessionId,
            sessionToken,
          }),
        });

        if (response.status === 429) {
          const data = await response.json();
          throw new Error(
            data.error || "Terlalu banyak permintaan. Mohon tunggu sebentar."
          );
        }

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Gagal mendapatkan respons dari AI");
        }

        const data = await response.json();

        // Update session ID if this was a new session
        if (data.sessionId && !sessionId) {
          setSessionId(data.sessionId);
        }

        const botMessage: Message = {
          id: data.messageId || (Date.now() + 1).toString(),
          role: "bot",
          content: data.reply,
          model: data.model,
          responseTimeMs: data.responseTimeMs,
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, botMessage]);
      } catch (err) {
        console.error("Chat error:", err);
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Mohon maaf, terjadi kesalahan. Silakan coba lagi.";

        setError(errorMsg);

        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          content: errorMsg,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, sessionToken]
  );

  /**
   * Start a new chat (reset messages and session).
   */
  const newChat = useCallback(() => {
    setMessages([]);
    setSessionId(undefined);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    sessionId,
    error,
    sendMessage,
    loadSession,
    newChat,
  };
}
