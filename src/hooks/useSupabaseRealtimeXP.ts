/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '../lib/supabase';
import { InputLog, SpriteTier } from '../types';

interface XPState {
  xpLogs: InputLog[];
  totalXP: number;
  spriteTier: SpriteTier;
  loading: boolean;
  error: Error | null;
}

export const useSupabaseRealtimeXP = (userId: string | null) => {
  const [state, setState] = useState<XPState>({
    xpLogs: [],
    totalXP: 0,
    spriteTier: 0,
    loading: true,
    error: null,
  });

  const fetchXPData = useCallback(async () => {
    if (!userId) {
      setState({
        xpLogs: [],
        totalXP: 0,
        spriteTier: 0,
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      // Fetch current inputs
      const { data: xpLogs, error: logsError } = await supabaseClient
        .from('inputs_tracker')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (logsError) throw logsError;

      // Fetch user preferences for total XP and tier
      const { data: prefs, error: prefsError } = await supabaseClient
        .from('user_preferences')
        .select('total_xp, sprite_tier')
        .eq('user_id', userId)
        .single();

      if (prefsError && prefsError.code !== 'PGRST116') throw prefsError;

      setState({
        xpLogs: (xpLogs || []) as InputLog[],
        totalXP: prefs?.total_xp || 0,
        spriteTier: (prefs?.sprite_tier || 0) as SpriteTier,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch XP data'),
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchXPData();

    if (!userId) return;

    // Subscribe to new XP inputs
    const subscription = supabaseClient
      .channel(`xp-updates:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'inputs_tracker',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setState((prev) => ({
            ...prev,
            xpLogs: [payload.new as InputLog, ...prev.xpLogs],
          }));
        }
      )
      .subscribe();

    // Subscribe to preference updates (tier changes)
    const prefSubscription = supabaseClient
      .channel(`prefs-updates:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as any;
          setState((prev) => ({
            ...prev,
            totalXP: updated.total_xp || prev.totalXP,
            spriteTier: (updated.sprite_tier || prev.spriteTier) as SpriteTier,
          }));
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
      supabaseClient.removeChannel(prefSubscription);
    };
  }, [userId, fetchXPData]);

  return state;
};
