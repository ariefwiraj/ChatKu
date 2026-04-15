import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ============================================
// DELETE /api/sessions/[id] — Delete Session
// ============================================

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = req.headers.get("x-session-token");
    const { id } = params;

    if (!sessionToken) {
      return NextResponse.json(
        { error: "Session token is required" },
        { status: 400 }
      );
    }

    // Verify session belongs to this token, then delete
    const { data: session, error: verifyError } = await supabase
      .from("sessions")
      .select("id")
      .eq("id", id)
      .eq("session_token", sessionToken)
      .single();

    if (verifyError || !session) {
      return NextResponse.json(
        { error: "Session not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete session (cascade will remove messages and feedback)
    const { error: deleteError } = await supabase
      .from("sessions")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Session delete error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Session delete API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
