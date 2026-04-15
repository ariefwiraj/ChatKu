import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { PAGINATION } from "@/lib/constants";

// ============================================
// GET /api/sessions/[id]/messages — Chat History
// ============================================

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = req.headers.get("x-session-token");
    const { id: sessionId } = params;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    // Parse query params
    const url = new URL(req.url);
    const cursor = url.searchParams.get("cursor");
    const limit = Math.min(
      parseInt(url.searchParams.get("limit") || String(PAGINATION.DEFAULT_LIMIT), 10),
      PAGINATION.MAX_LIMIT
    );

    // Verify session belongs to this token
    const { data: session, error: verifyError } = await supabase
      .from("sessions")
      .select("id")
      .eq("id", sessionId)
      .eq("session_token", sessionToken)
      .single();

    if (verifyError || !session) {
      return NextResponse.json(
        { error: "Session not found or unauthorized" },
        { status: 404 }
      );
    }

    // Build query
    let query = supabase
      .from("messages")
      .select("id, role, content, model_used, response_time_ms, created_at")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })
      .limit(limit + 1); // Fetch one extra to determine if there are more

    // Apply cursor-based pagination
    if (cursor) {
      const { data: cursorMsg } = await supabase
        .from("messages")
        .select("created_at")
        .eq("id", cursor)
        .single();

      if (cursorMsg) {
        query = query.gt("created_at", cursorMsg.created_at);
      }
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error("Messages fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    const allMessages = messages || [];
    const hasMore = allMessages.length > limit;
    const resultMessages = hasMore ? allMessages.slice(0, limit) : allMessages;

    // Transform to frontend format
    const formattedMessages = resultMessages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      model: m.model_used,
      responseTimeMs: m.response_time_ms,
      createdAt: m.created_at,
    }));

    const nextCursor = hasMore
      ? resultMessages[resultMessages.length - 1]?.id || null
      : null;

    return NextResponse.json({
      messages: formattedMessages,
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error("Messages API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
