/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PillarSlug {
  ESSENTIALS = 'essentials',
  CAREER = 'career',
  LIFESTYLE = 'lifestyle',
  HEALTH = 'health',
  FULFILLMENT = 'fulfillment',
  RELATIONSHIPS = 'relationships',
}

export enum Archetype {
  ARCHITECT = 'architect',
  GAME_PLAYER = 'game_player',
  GARDENER = 'gardener',
}

export enum Aesthetic {
  HOBBIT = 'hobbit'
}

export enum InputType {
  VOICE = 'voice',
  PHOTO = 'photo',
  TEXT = 'text',
  MASTERY = 'mastery',
}

export enum SpriteTier {
  SPORE = 0,
  SPARK = 1,
  KIN = 2,
  ARCHITECT = 3,
}

export interface UserPreferences {
  user_id: string;
  total_xp: number;
  active_archetype: Archetype;
  sprite_tier: SpriteTier;
  last_interaction: string;
  theme_preference: 'light' | 'dark' | 'system';
  current_theme: 'light' | 'dark';
}

export interface Pillar {
  id: string;
  name: string;
  slug: PillarSlug;
  description: string;
  base_color: string;
  icon: string;
}

export interface Playbook {
  id: string;
  user_id: string;
  pillar_id: string;
  title: string;
  objective?: string;
  google_drive_id?: string;
  status: 'draft' | 'active' | 'completed';
  completion_score: number;
  last_updated: string;
  created_at: string;
}

export interface InputLog {
  id: string;
  user_id: string;
  pillar_id: string;
  input_type: InputType;
  xp_value: number;
  metadata?: any;
  created_at: string;
}
