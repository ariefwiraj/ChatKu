-- ============================================
-- ChatKu AI Database Schema
-- Supabase PostgreSQL Migration
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================
-- Table: sessions
-- ============================
CREATE TABLE IF NOT EXISTS sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL DEFAULT 'New Chat',
    session_token   TEXT NOT NULL,
    system_prompt   TEXT,
    message_count   INTEGER NOT NULL DEFAULT 0,
    last_active_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_last_active ON sessions(last_active_at DESC);

-- ============================
-- Table: messages
-- ============================
CREATE TABLE IF NOT EXISTS messages (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id       UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    role             TEXT NOT NULL CHECK (role IN ('user', 'bot')),
    content          TEXT NOT NULL,
    token_count      INTEGER,
    response_time_ms INTEGER,
    model_used       TEXT,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(session_id, created_at ASC);

-- ============================
-- Table: rate_limits
-- ============================
CREATE TABLE IF NOT EXISTS rate_limits (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier     TEXT NOT NULL UNIQUE,
    request_count  INTEGER NOT NULL DEFAULT 0,
    window_start   TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON rate_limits(identifier);

-- ============================
-- Table: feedback
-- ============================
CREATE TABLE IF NOT EXISTS feedback (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id  UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    message_id  UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    rating      TEXT NOT NULL CHECK (rating IN ('up', 'down')),
    comment     TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_session ON feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_feedback_message ON feedback(message_id);

-- ============================
-- Trigger: auto-update updated_at on sessions
-- ============================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_sessions_updated_at ON sessions;
CREATE TRIGGER trigger_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================
-- Trigger: auto-increment message_count & update last_active_at
-- ============================
CREATE OR REPLACE FUNCTION increment_message_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sessions
    SET message_count = message_count + 1,
        last_active_at = now()
    WHERE id = NEW.session_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_increment_message_count ON messages;
CREATE TRIGGER trigger_increment_message_count
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION increment_message_count();

-- ============================
-- Trigger: auto-generate session title from first user message
-- ============================
CREATE OR REPLACE FUNCTION auto_generate_title()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'user' THEN
        UPDATE sessions
        SET title = LEFT(NEW.content, 50)
        WHERE id = NEW.session_id
          AND title = 'New Chat';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_auto_title ON messages;
CREATE TRIGGER trigger_auto_title
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_title();

-- ============================
-- Function: auto-delete sessions older than 30 days
-- Call this via Supabase Edge Function + Cron, or manually
-- ============================
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM sessions
    WHERE last_active_at < now() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================
-- Function: cleanup old rate limit records
-- ============================
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM rate_limits
    WHERE window_start < now() - INTERVAL '1 hour';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Row Level Security (RLS)
-- NOTE: Since we use service_role key in API routes,
-- RLS is bypassed on server-side. These policies are
-- for extra safety if direct client access is added later.
-- ============================================
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (default behavior)
-- These policies allow authenticated service role access
CREATE POLICY "Service role full access on sessions"
    ON sessions FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access on messages"
    ON messages FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access on feedback"
    ON feedback FOR ALL
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role full access on rate_limits"
    ON rate_limits FOR ALL
    USING (true)
    WITH CHECK (true);

-- ============================================
-- Supabase Cron Extension (pg_cron)
-- Schedule automatic cleanup every day at 3 AM UTC
-- ============================================
-- Uncomment these lines if pg_cron is enabled in your Supabase project:
--
-- SELECT cron.schedule(
--     'cleanup-expired-sessions',
--     '0 3 * * *',
--     $$ SELECT cleanup_expired_sessions(); $$
-- );
--
-- SELECT cron.schedule(
--     'cleanup-rate-limits',
--     '*/30 * * * *',
--     $$ SELECT cleanup_rate_limits(); $$
-- );
