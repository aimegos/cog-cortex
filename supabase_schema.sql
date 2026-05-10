-- The Cognitive Cortex (V1) - Supabase SQL Schema
-- This schema handles life pillars, playbooks, XP tracking, and the "Mood Vector" logic.

-- 1. Pillars: Global Categories
CREATE TABLE IF NOT EXISTS pillars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- Career, Health, Lifestyle, etc.
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    base_color TEXT NOT NULL, -- Hex code for the category color
    icon TEXT, -- Lucide icon name
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Playbooks: The "Recipes" or Blueprints
CREATE TABLE IF NOT EXISTS playbooks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    objective TEXT,
    google_drive_id TEXT, -- ID of the linked Markdown file
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
    completion_score INT DEFAULT 0 CHECK (completion_score <= 100),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Inputs Tracker: Data capture log for XP
CREATE TABLE IF NOT EXISTS inputs_tracker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    pillar_id UUID REFERENCES pillars(id) ON DELETE SET NULL,
    input_type TEXT CHECK (input_type IN ('voice', 'photo', 'text', 'mastery')),
    xp_value INT DEFAULT 10,
    metadata JSONB, -- Store processing info or snippet
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. User Preferences: User's UI state and Sprite attributes
CREATE TABLE IF NOT EXISTS user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_xp INT DEFAULT 0,
    active_archetype TEXT DEFAULT 'gardener' CHECK (active_archetype IN ('architect', 'game_player', 'gardener')),
    sprite_tier INT DEFAULT 0, -- 0: Spore, 1: Spark, 2: Kin, 3: Architect
    last_interaction TIMESTAMPTZ DEFAULT NOW(),
    theme_preference TEXT DEFAULT 'system'
);

-- 5. Mood Vector Logic: Calculate weighted color mix
-- This function aggregates XP by pillar color to determine the Sprite's current "vibe".
CREATE OR REPLACE FUNCTION get_user_mood_color(target_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    result_color TEXT;
    r_total FLOAT := 0;
    g_total FLOAT := 0;
    b_total FLOAT := 0;
    xp_sum INT := 0;
    pillar_record RECORD;
    p_xp INT;
    p_r INT; p_g INT; p_b INT;
BEGIN
    -- Sum total XP for weighted calculation
    SELECT COALESCE(SUM(xp_value), 0) INTO xp_sum
    FROM inputs_tracker
    WHERE user_id = target_user_id;

    IF xp_sum = 0 THEN
        RETURN '#FFFFFF'; -- Default white if no XP
    END IF;

    -- Iterate through pillars to calculate weighted average
    FOR pillar_record IN SELECT id, base_color FROM pillars LOOP
        -- Get XP for this specific pillar
        SELECT COALESCE(SUM(xp_value), 0) INTO p_xp
        FROM inputs_tracker
        WHERE user_id = target_user_id AND pillar_id = pillar_record.id;

        IF p_xp > 0 THEN
            -- Extract RGB from hex (assuming #RRGGBB format)
            p_r := ('x' || lpad(substring(pillar_record.base_color from 2 for 2), 8, '0'))::bit(32)::int;
            p_g := ('x' || lpad(substring(pillar_record.base_color from 4 for 2), 8, '0'))::bit(32)::int;
            p_b := ('x' || lpad(substring(pillar_record.base_color from 6 for 2), 8, '0'))::bit(32)::int;

            -- Weighted sum
            r_total := r_total + (p_r * (p_xp::FLOAT / xp_sum));
            g_total := g_total + (p_g * (p_xp::FLOAT / xp_sum));
            b_total := b_total + (p_b * (p_xp::FLOAT / xp_sum));
        END IF;
    END LOOP;

    -- Default to balanced prismatic if very low distributions, 
    -- but here we just return the weighted hex
    result_color := '#' || 
        lpad(to_hex(ROUND(r_total)::int), 2, '0') || 
        lpad(to_hex(ROUND(g_total)::int), 2, '0') || 
        lpad(to_hex(ROUND(b_total)::int), 2, '0');

    RETURN result_color;
END;
$$;

-- 6. Trigger for Total XP and Sprite Tiering
CREATE OR REPLACE FUNCTION update_user_xp_level()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_preferences
    SET total_xp = total_xp + NEW.xp_value,
        sprite_tier = CASE 
            WHEN (total_xp + NEW.xp_value) < 500 THEN 0
            WHEN (total_xp + NEW.xp_value) < 2500 THEN 1
            WHEN (total_xp + NEW.xp_value) < 7500 THEN 2
            ELSE 3
        END,
        last_interaction = NOW()
    WHERE user_id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_xp_gain
    AFTER INSERT ON inputs_tracker
    FOR EACH ROW
    EXECUTE FUNCTION update_user_xp_level();

-- 7. Add Seed Data for Pillars
INSERT INTO pillars (name, slug, description, base_color, icon) VALUES
('Essentials', 'essentials', 'Core tech stack, passwords, and administrative must-dos.', '#64748b', 'shield'),
('Career', 'career', 'Client leads, project deliverables, and networking.', '#06b6d4', 'briefcase'),
('Lifestyle', 'lifestyle', 'Household management, groceries, and travel.', '#f59e0b', 'home'),
('Health', 'health', 'Medical appointments, insurance, and nutrient tracking.', '#10b981', 'heart'),
('Fulfillment', 'fulfillment', 'Personal growth, hobbies, and learning.', '#a855f7', 'zap'),
('Relationships', 'relationships', 'Family milestones, kids appointments, and network management.', '#ec4899', 'users')
ON CONFLICT DO NOTHING;

-- 8. Row Level Security (RLS)
-- Pillars are public read-only data
ALTER TABLE pillars DISABLE ROW LEVEL SECURITY;

ALTER TABLE playbooks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own playbooks" ON playbooks
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE inputs_tracker ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own inputs" ON inputs_tracker
    FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own preferences" ON user_preferences
    FOR ALL USING (auth.uid() = user_id);
