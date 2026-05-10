/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '../lib/supabase';
import { UserPreferences } from '../types';

interface PreferencesState {
  preferences: UserPreferences | null;
  loading: boolean;
  error: Error | null;
}

export const useUserPreferences = (userId: string | null) => {
  const [state, setState] = useState<PreferencesState>({
    preferences: null,
    loading: true,
    error: null,
  });

  const fetchPreferences = useCallback(async () => {
    if (!userId) return;

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabaseClient
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // If record doesn't exist, create default
      if (!data) {
        const { data: newPrefs, error: insertError } = await supabaseClient
          .from('user_preferences')
          .insert({
            user_id: userId,
            total_xp: 0,
            active_archetype: 'gardener',
            sprite_tier: 0,
            theme_preference: 'system',
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setState({
          preferences: newPrefs as UserPreferences,
          loading: false,
          error: null,
        });
        return;
      }

      setState({
        preferences: data as UserPreferences,
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch preferences'),
      }));
    }
  }, [userId]);

  const updatePreferences = useCallback(
    async (updates: Partial<UserPreferences>) => {
      if (!userId) return;

      try {
        const { error } = await supabaseClient
          .from('user_preferences')
          .update(updates)
          .eq('user_id', userId);

        if (error) throw error;

        setState((prev) => ({
          ...prev,
          preferences: prev.preferences
            ? { ...prev.preferences, ...updates }
            : null,
        }));
      } catch (err) {
        setState((prev) => ({
          ...prev,
          error: err instanceof Error ? err : new Error('Failed to update preferences'),
        }));
        throw err;
      }
    },
    [userId]
  );

  useEffect(() => {
    fetchPreferences();

    if (!userId) return;

    // Subscribe to preference updates
    const subscription = supabaseClient
      .channel(`user-prefs:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setState((prev) => ({
            ...prev,
            preferences: prev.preferences
              ? { ...prev.preferences, ...(payload.new as UserPreferences) }
              : (payload.new as UserPreferences),
          }));
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  }, [userId, fetchPreferences]);

  return {
    ...state,
    updatePreferences,
  };
};
