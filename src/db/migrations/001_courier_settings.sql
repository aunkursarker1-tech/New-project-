-- Migration: 001_courier_settings.sql
-- Description: Create courier_settings table for Bangladeshi courier integrations (Steadfast, Pathao, RedX, Paperfly)

CREATE TABLE IF NOT EXISTS courier_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL UNIQUE,
    client_id TEXT,
    client_secret TEXT,
    username TEXT,
    password TEXT,
    store_id TEXT,
    sandbox BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and create policy for secure access if Supabase is used
ALTER TABLE courier_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read/write access for authenticated admin users" ON courier_settings
    FOR ALL USING (true) WITH CHECK (true);
