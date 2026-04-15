"use client";

import { useState, useCallback } from "react";
import { Session } from "@/types/chat";

// ============================================
// useSessions — Session List Management
// ============================================

/**
 * Manages the list of chat sessions for the current user.
 */
export function useSessions(sessionToken: string) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Fetch all sessions for the current token.
   */
  const fetchSessions = useCallback(async () => {
    if (!sessionToken) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/sessions", {
        headers: {
          "x-session-token": sessionToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sessions");
      }

      const data = await response.json();
      setSessions(data.sessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken]);

  /**
   * Delete a session by ID.
   */
  const deleteSession = useCallback(
    async (sessionId: string) => {
      if (!sessionToken) return;

      try {
        const response = await fetch(`/api/sessions/${sessionId}`, {
          method: "DELETE",
          headers: {
            "x-session-token": sessionToken,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to delete session");
        }

        // Remove from local state
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        return true;
      } catch (error) {
        console.error("Error deleting session:", error);
        return false;
      }
    },
    [sessionToken]
  );

  return {
    sessions,
    isLoading,
    fetchSessions,
    deleteSession,
  };
}
