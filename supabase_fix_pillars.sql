-- Fix: Disable RLS on pillars table (public read-only data)
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
