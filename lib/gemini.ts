import { GoogleGenerativeAI, Content } from "@google/generative-ai";
import { GEMINI_MODEL, SYSTEM_PROMPT, MAX_CONTEXT_MESSAGES } from "./constants";

// ============================================
// ChatKu AI — Gemini Client & Helpers
// ============================================

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Database message shape (from Supabase).
 */
interface DbMessage {
  role: "user" | "bot";
  content: string;
}

/**
 * Convert database messages to Gemini conversation history format.
 * Gemini uses "user" and "model" roles.
 */
export function buildConversationHistory(messages: DbMessage[]): Content[] {
  // Take only the last N messages for context window
  const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

  return recentMessages.map((msg) => ({
    role: msg.role === "bot" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
}

/**
 * Generate a chat response from Gemini API (non-streaming).
 *
 * @param userMessage - The latest user message
 * @param conversationHistory - Previous messages for context
 * @returns The AI response text
 */
export async function generateChatResponse(
  userMessage: string,
  conversationHistory: DbMessage[] = []
): Promise<{ text: string; model: string }> {
  const model = genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction: SYSTEM_PROMPT,
  });

  // Build history from previous messages (excluding the current one)
  const history = buildConversationHistory(conversationHistory);

  const chat = model.startChat({
    history,
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  const text = response.text();

  return {
    text,
    model: GEMINI_MODEL,
  };
}

/**
 * Estimate token count for a given text.
 * Rough estimation: ~4 characters per token for English, ~2-3 for Indonesian.
 * This is a simple heuristic — Gemini's actual tokenizer may differ.
 */
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 3.5);
}
