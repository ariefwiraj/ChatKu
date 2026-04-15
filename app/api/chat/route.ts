import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateChatResponse, estimateTokenCount } from "@/lib/gemini";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";

// ============================================
// POST /api/chat — Send Message to AI
// ============================================

export async function POST(req: Request) {
  const startTime = Date.now();

  try {
    // 1. Parse request body
    const body = await req.json();
    const { message, sessionId, sessionToken } = body;

    // 2. Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (!sessionToken || typeof sessionToken !== "string") {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    // 3. Check rate limit
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please wait before sending another message.",
          retryAfter: rateLimitResult.retryAfterSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.retryAfterSeconds.toString(),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // 4. Create or retrieve session
    let activeSessionId = sessionId;

    if (!activeSessionId) {
      // Create a new session
      const { data: newSession, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          session_token: sessionToken,
          title: message.slice(0, 50),
        })
        .select("id")
        .single();

      if (sessionError) {
        console.error("Session creation error:", sessionError);
        return NextResponse.json(
          { error: "Failed to create session" },
          { status: 500 }
        );
      }

      activeSessionId = newSession.id;
    } else {
      // Verify session belongs to this token
      const { data: existingSession, error: verifyError } = await supabase
        .from("sessions")
        .select("id")
        .eq("id", activeSessionId)
        .eq("session_token", sessionToken)
        .single();

      if (verifyError || !existingSession) {
        return NextResponse.json(
          { error: "Session not found or unauthorized" },
          { status: 404 }
        );
      }
    }

    // 5. Save user message to database
    const userTokenCount = estimateTokenCount(message);

    const { error: userMsgError } = await supabase.from("messages").insert({
      session_id: activeSessionId,
      role: "user",
      content: message,
      token_count: userTokenCount,
    });

    if (userMsgError) {
      console.error("User message save error:", userMsgError);
    }

    // 6. Load conversation history for context
    const { data: historyMessages } = await supabase
      .from("messages")
      .select("role, content")
      .eq("session_id", activeSessionId)
      .order("created_at", { ascending: true });

    // Build history (excluding the message we just inserted, which is the last one)
    const conversationHistory = (historyMessages || []).slice(0, -1);

    // 7. Call Gemini API
    const { text: replyText, model } = await generateChatResponse(
      message,
      conversationHistory
    );

    const responseTimeMs = Date.now() - startTime;
    const botTokenCount = estimateTokenCount(replyText);

    // 8. Save bot response to database
    const { data: botMsg, error: botMsgError } = await supabase
      .from("messages")
      .insert({
        session_id: activeSessionId,
        role: "bot",
        content: replyText,
        token_count: botTokenCount,
        response_time_ms: responseTimeMs,
        model_used: model,
      })
      .select("id")
      .single();

    if (botMsgError) {
      console.error("Bot message save error:", botMsgError);
    }

    // 9. Return response
    return NextResponse.json(
      {
        reply: replyText,
        sessionId: activeSessionId,
        messageId: botMsg?.id || null,
        model,
        responseTimeMs,
      },
      {
        headers: {
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);

    // Handle Gemini-specific errors
    if (error instanceof Error) {
      if (error.message.includes("SAFETY")) {
        return NextResponse.json(
          { error: "Response was blocked by safety filters. Please rephrase your message." },
          { status: 400 }
        );
      }

      if (error.message.includes("quota") || error.message.includes("429")) {
        return NextResponse.json(
          {
            error: "AI service is temporarily busy. Please try again in a moment.",
            retryAfter: 30,
          },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
