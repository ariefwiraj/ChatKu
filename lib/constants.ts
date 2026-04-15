// ============================================
// ChatKu AI — Shared Constants
// ============================================

/** Gemini model to use (free tier) */
export const GEMINI_MODEL = "gemini-2.5-flash-lite";

/** Maximum messages to send as conversation context to Gemini */
export const MAX_CONTEXT_MESSAGES = 20;

/** Maximum message length (characters) */
export const MAX_MESSAGE_LENGTH = 4000;

/** Default session title before auto-generation */
export const DEFAULT_SESSION_TITLE = "New Chat";

/** Rate limiting defaults */
export const RATE_LIMIT = {
  MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "10", 10),
  WINDOW_SECONDS: parseInt(process.env.RATE_LIMIT_WINDOW_SECONDS || "60", 10),
};

/** Session auto-delete threshold (in days) */
export const SESSION_EXPIRY_DAYS = 30;

/** System prompt for the AI */
export const SYSTEM_PROMPT = `Kamu adalah ChatKu AI, asisten AI yang ramah, cerdas, dan membantu. 
Kamu bisa menjawab berbagai pertanyaan dalam Bahasa Indonesia maupun Bahasa Inggris.
Berikan jawaban yang informatif, akurat, dan mudah dipahami.
Jika kamu tidak yakin dengan jawabannya, katakan dengan jujur.
Gunakan format markdown untuk jawaban yang lebih terstruktur jika diperlukan.`;

/** Pagination defaults */
export const PAGINATION = {
  DEFAULT_LIMIT: 50,
  MAX_LIMIT: 100,
};
