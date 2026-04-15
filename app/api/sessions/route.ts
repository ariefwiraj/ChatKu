import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ============================================
// GET /api/sessions — List Sessions
// POST /api/sessions — Create New Session
// ============================================

/**
 * GET /api/sessions
 * Returns all sessions for the given session token.
 */
export async function GET(req: Request) {
  try {
    const sessionToken = req.headers.get("x-session-token");

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("id, title, message_count, last_active_at, created_at")
      .eq("session_token", sessionToken)
      .order("last_active_at", { ascending: false });

    if (error) {
      console.error("Sessions fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch sessions" },
        { status: 500 }
      );
    }

    // Transform snake_case to camelCase for frontend
    const formattedSessions = (sessions || []).map((s) => ({
      id: s.id,
      title: s.title,
      messageCount: s.message_count,
      lastActiveAt: s.last_active_at,
      createdAt: s.created_at,
    }));

    return NextResponse.json({ sessions: formattedSessions });
  } catch (error) {
    console.error("Sessions API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sessions
 * Creates a new empty session.
 */
export async function POST(req: Request) {
  try {
    const { sessionToken } = await req.json();

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    const { data: session, error } = await supabase
      .from("sessions")
      .insert({
        session_token: sessionToken,
      })
      .select("id, title, message_count, last_active_at, created_at")
      .single();

    if (error) {
      console.error("Session creation error:", error);
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: session.id,
      title: session.title,
      messageCount: session.message_count,
      lastActiveAt: session.last_active_at,
      createdAt: session.created_at,
    });
  } catch (error) {
    console.error("Sessions API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
