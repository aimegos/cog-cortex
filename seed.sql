-- Supabase/PostgreSQL Seed Script for Cognitive Cortex V2
-- This script sets up the core tables for Pillars, Playbooks, and XP Logging

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Pillars Table
CREATE TABLE IF NOT EXISTS pillars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    icon TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Playbooks Table
CREATE TABLE IF NOT EXISTS playbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pillar_id UUID REFERENCES pillars(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    archetype TEXT DEFAULT 'seeker',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create XP Logs Table
CREATE TABLE IF NOT EXISTS xp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount INTEGER NOT NULL DEFAULT 0,
    activity TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Seed Initial Data (Matching the Hobbit/V2 aesthetic)
INSERT INTO pillars (name, icon, description) VALUES
('Orchard', 'Trees', 'Core career and growth strategy roots.'),
('Apothecary', 'Flask', 'Health, wellness, and mindful restoration.'),
('The Lab', 'Zap', 'Rapid experimentation and innovation sparks.');

-- 6. Helper: XP Trigger Placeholder
-- In a real Supabase environment, you might use a Database Function or Edge Function
-- to update a 'user_profile' mood based on xp_logs frequency.
-- For now, this schema provides the data structure.
