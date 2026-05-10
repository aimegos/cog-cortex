import { useState, useEffect } from 'react';
import { Pillar, Playbook, UserPreferences, PillarSlug, Archetype, SpriteTier, InputType } from '../types';

// Initial Seed Data for Pillars
export const MOCK_PILLARS: Pillar[] = [
  { id: '1', name: 'Essentials', slug: PillarSlug.ESSENTIALS, description: 'Core tech stack, passwords, and administrative must-dos.', base_color: '#64748b', icon: 'Shield' },
  { id: '2', name: 'Career', slug: PillarSlug.CAREER, description: 'Client leads, project deliverables, and networking.', base_color: '#06b6d4', icon: 'Briefcase' },
  { id: '3', name: 'Lifestyle', slug: PillarSlug.LIFESTYLE, description: 'Household management, groceries, and travel.', base_color: '#f59e0b', icon: 'Home' },
  { id: '4', name: 'Health', slug: PillarSlug.HEALTH, description: 'Medical appointments, insurance, and nutrient tracking.', base_color: '#10b981', icon: 'Heart' },
  { id: '5', name: 'Fulfillment', slug: PillarSlug.FULFILLMENT, description: 'Personal growth, hobbies, and learning.', base_color: '#a855f7', icon: 'Zap' },
  { id: '6', name: 'Relationships', slug: PillarSlug.RELATIONSHIPS, description: 'Family milestones, kids appointments, and network management.', base_color: '#ec4899', icon: 'Users' },
];

export const useMockSupabase = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    user_id: 'user-123',
    total_xp: 150,
    active_archetype: Archetype.GARDENER,
    sprite_tier: SpriteTier.SPORE,
    last_interaction: new Date().toISOString(),
    theme_preference: 'dark',
    current_theme: 'dark',
  });

  const [pillars] = useState<Pillar[]>(MOCK_PILLARS);
  const [playbooks, setPlaybooks] = useState<Playbook[]>([
    {
      id: 'p1',
      user_id: 'user-123',
      pillar_id: '2',
      title: 'Client Lead Master',
      objective: 'Follow up every 48h',
      status: 'active',
      completion_score: 45,
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    },
    {
      id: 'p2',
      user_id: 'user-123',
      pillar_id: '4',
      title: 'Medical Insurance Mastery',
      objective: 'All cards digitised',
      status: 'draft',
      completion_score: 20,
      last_updated: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }
  ]);

  const [xpLog, setXpLog] = useState<{pillar_id: string, xp: number}[]>(() => [
    { pillar_id: '2', xp: 50 },
    { pillar_id: '4', xp: 50 },
    { pillar_id: '3', xp: 50 }
  ]);

  // Function to add XP
  const addXP = (pillar_id: string, amount: number, type: InputType) => {
    setXpLog(prev => [...prev, { pillar_id, xp: amount }]);
    setPreferences(prev => {
      const newTotal = prev.total_xp + amount;
      let newTier = prev.sprite_tier;
      if (newTotal < 500) newTier = SpriteTier.SPORE;
      else if (newTotal < 2500) newTier = SpriteTier.SPARK;
      else if (newTotal < 7500) newTier = SpriteTier.KIN;
      else newTier = SpriteTier.ARCHITECT;

      return {
        ...prev,
        total_xp: newTotal,
        sprite_tier: newTier,
        last_interaction: new Date().toISOString(),
      };
    });
  };

  // Calculate Mood Color based on pillars XP
  const getMoodColor = () => {
    if (xpLog.length === 0) return '#ffffff';
    
    const pillarXP: Record<string, number> = {};
    xpLog.forEach(log => {
      pillarXP[log.pillar_id] = (pillarXP[log.pillar_id] || 0) + log.xp;
    });

    const totalXpLogged = xpLog.reduce((acc, curr) => acc + curr.xp, 0);

    let r = 0, g = 0, b = 0;

    Object.entries(pillarXP).forEach(([pid, xp]) => {
      const pillar = pillars.find(p => p.id === pid);
      if (pillar) {
        const hex = pillar.base_color.replace('#', '');
        const pr = parseInt(hex.substring(0, 2), 16);
        const pg = parseInt(hex.substring(2, 4), 16);
        const pb = parseInt(hex.substring(4, 6), 16);

        const weight = xp / totalXpLogged;
        r += pr * weight;
        g += pg * weight;
        b += pb * weight;
      }
    });

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  return {
    preferences,
    setPreferences,
    pillars,
    playbooks,
    setPlaybooks,
    addXP,
    getMoodColor
  };
};
