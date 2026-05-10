/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';
import { supabaseClient } from '../lib/supabase';

interface MoodColorState {
  moodColor: string;
  loading: boolean;
  error: Error | null;
}

export const useMoodColor = (userId: string | null) => {
  const [state, setState] = useState<MoodColorState>({
    moodColor: '#FFFFFF',
    loading: true,
    error: null,
  });

  const fetchMoodColor = useCallback(async () => {
    if (!userId) {
      setState({
        moodColor: '#FFFFFF',
        loading: false,
        error: null,
      });
      return;
    }

    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabaseClient.rpc('get_user_mood_color', {
        target_user_id: userId,
      });

      if (error) throw error;

      setState({
        moodColor: data || '#FFFFFF',
        loading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err : new Error('Failed to fetch mood color'),
      }));
    }
  }, [userId]);

  useEffect(() => {
    fetchMoodColor();

    if (!userId) return;

    // Subscribe to preference updates (mood color changes)
    const subscription = supabaseClient
      .channel(`mood-updates:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_preferences',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Recalculate mood color on any preference change
          fetchMoodColor();
        }
      )
      .subscribe();

    // Also listen to inputs_tracker changes to recalculate mood
    const inputSubscription = supabaseClient
      .channel(`inputs-mood:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'inputs_tracker',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchMoodColor();
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
      supabaseClient.removeChannel(inputSubscription);
    };
  }, [userId, fetchMoodColor]);

  return state;
};
