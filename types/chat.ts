// ============================================
// ChatKu AI — Type Definitions
// ============================================

/** Represents a single chat message */
export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  createdAt?: string;
  model?: string;
  responseTimeMs?: number;
}

/** Represents a chat session */
export interface Session {
  id: string;
  title: string;
  messageCount: number;
  lastActiveAt: string;
  createdAt: string;
}

/** API request body for sending a chat message */
export interface ChatRequest {
  message: string;
  sessionId?: string;
  sessionToken: string;
}

/** API response for a chat message */
export interface ChatResponse {
  reply: string;
  sessionId: string;
  messageId: string;
  model: string;
  responseTimeMs: number;
}

/** API error response */
export interface ApiError {
  error: string;
  retryAfter?: number;
}

/** API response for session list */
export interface SessionsResponse {
  sessions: Session[];
}

/** API response for chat history */
export interface MessagesResponse {
  messages: Message[];
  nextCursor: string | null;
  hasMore: boolean;
}
