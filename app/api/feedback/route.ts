import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// ============================================
// POST /api/feedback — Submit Message Feedback
// ============================================

export async function POST(req: Request) {
  try {
    const { sessionId, messageId, rating, comment } = await req.json();

    // Validate input
    if (!sessionId || !messageId || !rating) {
      return NextResponse.json(
        { error: "sessionId, messageId, and rating are required" },
        { status: 400 }
      );
    }

    if (!["up", "down"].includes(rating)) {
      return NextResponse.json(
        { error: 'Rating must be "up" or "down"' },
        { status: 400 }
      );
    }

    // Check if feedback already exists for this message
    const { data: existing } = await supabase
      .from("feedback")
      .select("id")
      .eq("message_id", messageId)
      .single();

    if (existing) {
      // Update existing feedback
      const { error: updateError } = await supabase
        .from("feedback")
        .update({ rating, comment: comment || null })
        .eq("message_id", messageId);

      if (updateError) {
        console.error("Feedback update error:", updateError);
        return NextResponse.json(
          { error: "Failed to update feedback" },
          { status: 500 }
        );
      }
    } else {
      // Insert new feedback
      const { error: insertError } = await supabase
        .from("feedback")
        .insert({
          session_id: sessionId,
          message_id: messageId,
          rating,
          comment: comment || null,
        });

      if (insertError) {
        console.error("Feedback insert error:", insertError);
        return NextResponse.json(
          { error: "Failed to save feedback" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
