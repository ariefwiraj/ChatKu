"use client";

import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

// ============================================
// useSessionToken — Anonymous Browser Token
// ============================================

const STORAGE_KEY = "chatku-session-token";

/**
 * Manages an anonymous session token stored in localStorage.
 * This allows users to have persistent chat history without login.
 * Token is a UUID v4 generated on first visit.
 */
export function useSessionToken() {
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    // Check if token exists in localStorage
    let storedToken = localStorage.getItem(STORAGE_KEY);

    if (!storedToken) {
      storedToken = uuidv4();
      localStorage.setItem(STORAGE_KEY, storedToken);
    }

    setToken(storedToken);
  }, []);

  /**
   * Reset the token (creates a new anonymous identity).
   * This will effectively "forget" all chat history.
   */
  const resetToken = () => {
    const newToken = uuidv4();
    localStorage.setItem(STORAGE_KEY, newToken);
    setToken(newToken);
  };

  return { token, resetToken };
}
