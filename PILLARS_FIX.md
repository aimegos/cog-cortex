# Quick Fix: Pillars Not Loading

## Problem
The capture buttons on the front yard show "no entry" because the pillars table is blocked by RLS (Row Level Security). The pillars exist in the database but can't be read by the app.

## Solution (2 minutes)

1. Go to **Supabase Dashboard** → **SQL Editor**  
   https://app.supabase.co/projects/ipgfwlqxjkcyvrefppmg/sql/new

2. **Copy and paste this entire code block:**

```sql
-- Disable RLS on pillars (public read-only data)
ALTER TABLE pillars DISABLE ROW LEVEL SECURITY;

-- Insert pillar seed data
INSERT INTO pillars (name, slug, description, base_color, icon) VALUES
('Essentials', 'essentials', 'Core tech stack, passwords, and administrative must-dos.', '#64748b', 'shield'),
('Career', 'career', 'Client leads, project deliverables, and networking.', '#06b6d4', 'briefcase'),
('Lifestyle', 'lifestyle', 'Household management, groceries, and travel.', '#f59e0b', 'home'),
('Health', 'health', 'Medical appointments, insurance, and nutrient tracking.', '#10b981', 'heart'),
('Fulfillment', 'fulfillment', 'Personal growth, hobbies, and learning.', '#a855f7', 'zap'),
('Relationships', 'relationships', 'Family milestones, kids appointments, and network management.', '#ec4899', 'users')
ON CONFLICT DO NOTHING;
```

3. Click **Run** (Ctrl+Enter)

4. **Refresh your browser** at your Vercel deployment URL

5. ✅ Pillars should now load and capture buttons should be active

## Verify

```sql
-- Check pillars loaded:
SELECT COUNT(*) FROM pillars;
-- Should return: 6
```

## Root Cause

The `supabase_schema.sql` was missing `ALTER TABLE pillars DISABLE ROW LEVEL SECURITY;`. RLS was blocking all reads unless you had specific permissions. This has been fixed in the latest commit.
